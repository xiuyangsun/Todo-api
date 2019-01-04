const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server/server');
const { Todo } = require('../server/models/todo');

const todos = [
	{
		_id: new ObjectID(),
		text: 'First todo'
	}, {
		_id: new ObjectID(),
		text: 'Second todo'
	}, {
		_id: new ObjectID(),
		text: 'Third todo',
		completed: true,
		completedAt: 430
	}
];

beforeEach((done) => {
	Todo.deleteMany({})
		.then(() => {
			Todo.insertMany(todos);
		})
		.then(() => done());
});

describe('POST /todos', () => {
	it('should create a new to do', (done) => {
		const text = 'Have launch';

		request(app)
			.post('/todos')
			.send({ text })
			.expect(201)
			.expect(res => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo
					.find()
					.then(todos => {
						expect(todos.length).toBe(4);
						expect(todos[3].text).toBe(text);
						done();
					})
					.catch(e => done(e));
			});
	});

	it('should not create todo with invalid body data', (done) => {
		const text = '       ';

		request(app)
			.post('/todos')
			.send({ text })
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.errors.text.message).toBe('To do text is required');

				Todo
					.find()
					.then(todos => {
						expect(todos.length).toBe(3);
						done();
					})
					.catch(e => done(e));
			});
	});
});

describe('GET /todos', () => {
	it('should get back all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect(res => {
				expect(res.body.todos.length).toBe(3);
				expect(res.body.todos[0].completed).toBe(false);
			})
			.end(done);
	});
});

describe('GET /todo/:id', () => {
	it('should get back todo with existing id', (done) => {
		const id = todos[0]._id.toHexString();

		request(app)
			.get(`/todo/${id}`)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toEqual(todos[0].text);
			})
			.end(done);
	});

	it('should return ID not valid when id is not valid', (done) => {
		request(app)
			.get('/todo/123')
			.expect(404)
			.end(done);
	});

	it('should return 400 when ID not found in DB', (done) => {
		const id = new ObjectID().toHexString();
		request(app)
			.get('/todo/id')
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todo/:id', () => {
	it('should delete todo using valid id', (done) => {
		const id = todos[0]._id.toHexString();

		request(app)
			.delete(`/todo/${id}`)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toEqual(todos[0].text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(id)
					.then(todo => {
						expect(todo).toBeFalsy();
						done();
					})
					.catch(e => {
						done(e);
					});
			});
	});

	it('should return 404 when id is not valid', (done) => {
		const id = '123';

		request(app)
			.delete(`/todo/${id}`)
			.expect(404)
			.end(done);
	});

	it('should return 400 when ID not found in DB', (done) => {
		request(app)
			.get('/todo/123')
			.expect(404)
			.end(done);
	});
});

describe('PATCH /todo/:id', () => {
	it('should update incompoleted todo to completed and set completedAt to be none', (done) => {
		const id = todos[0]._id.toHexString();
		const body = {
			text: 'FF 91 go production',
			completed: true
		};

		request(app)
			.patch(`/todo/${id}`)
			.send(body)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe('FF 91 go production');
			})
			.end((err) => {
				if (err) {
					return done(err);
				}

				Todo.findById(id)
					.then(todo => {
						expect(todo.text).toBe('FF 91 go production');
						expect(todo.completed).toBe(true);
						expect(typeof(todo.completedAt)).toBe('number');
						done();
					})
					.catch(e => {
						done(e);
					});
			});
	});

	it('should update compoleted todo to incompleted', (done) => {
		const id = todos[0]._id.toHexString();
		const body = {
			text: 'FF 81 go production',
			completed: false
		};

		request(app)
			.patch(`/todo/${id}`)
			.send(body)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe('FF 81 go production');
			})
			.end((err) => {
				if (err) {
					return done(err);
				}

				Todo.findById(id)
					.then(todo => {
						expect(todo.text).toBe('FF 81 go production');
						expect(todo.completed).toBe(false);
						expect(todo.completedAt).toBeFalsy();
						done();
					})
					.catch(e => {
						done(e);
					});
			});
	});
});