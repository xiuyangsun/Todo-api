const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server/server');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');
const {
	todos,
	populateTodos,
	users,
	populateUsers
} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(err => {
				if (err) {
					return done(err);
				}

				done();
			});
	});

	it('should return 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect(res => {
				expect(res.body).toEqual({});
			})
			.end(err => {
				if (err) {
					return done(err);
				}

				done();
			});
	});
});

describe('POST /users', () => {
	it('should create user', (done) => {
		const email = 'asdadfasd@email.com';
		const password = 'asddsfasdf';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect(res => {
				expect(res.body.email).toBe(email);
				expect(res.body._id).toBeTruthy();
			})
			.end(err => {
				if (err) {
					done(err);
				}
				done();
			});
	});

	it('should return validation error if request invalid', (done) => {
		const email = 'asdfssdadfasd@email.com';
		const password = '123';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});

	it('should not create user if email exists', (done) => {
		const email = 'testUser2@email.com';
		const password = 'asddsfasdf';

		request(app)
			.get('/users/me')
			.send({email, password})
			.expect(401)
			.end(done);
	});
});

describe('POST /users/login', () => {
	it('should login user and return auth token', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[0].email,
				password:users[0].password
			})
			.expect(200)
			.expect(res => {
				expect(res.headers['x-auth']).toBeTruthy();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[0]._id)
					.then(user => {
						expect(user.tokens[1].token).toBe(res.headers['x-auth']);
						done();
					})
					.catch(e => {done(e);});
			});
	});

	it('should reject with invalid login', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[0].email,
				password:users[1].password
			})
			.expect(400)
			.expect(res => {
				expect(res.headers['x-auth']).toBeFalsy();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				done();
			});
	});
});

describe('DELETE /users/me/token', () => {
	it('should remove auth token on logout', (done) => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if (err) {
					done(err);
				}

				User.findById(users[0]._id)
					.then(user => {
						expect(user.tokens.length).toBe(0);
						done();
					})
					.catch(e => done(e));
			});
	});
});