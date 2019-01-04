const expect = require('expect');
const request = require('supertest');

const { app } = require('../server/server');
const { Todo } = require('../server/models/todo');

const todos = [
	{
		text: 'First todo'
	}, {
		text: 'Second todo'
	}, {
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