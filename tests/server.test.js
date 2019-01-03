const expect = require('expect');
const request = require('supertest');

const { app } = require('../server/server');
const { Todo } = require('../server/models/todo');

beforeEach((done) => {
	Todo.deleteMany({})
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
						expect(todos.length).toBe(1);
						expect(todos[0].text).toBe(text);
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
						expect(todos.length).toBe(0);
						done();
					})
					.catch(e => done(e));
			});
	});
});