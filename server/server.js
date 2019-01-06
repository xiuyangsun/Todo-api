require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	const todo = new Todo({
		text: req.body.text
	});

	todo.save()
		.then(todo => {
			res
				.status(201)
				.send(todo);
		}, e => {
			res
				.status(400)
				.send(e);
		});
});

app.get('/todos', (req, res) => {
	Todo
		.find()
		.then(todos => {
			res.send({ todos });
		}, e => {
			res
				.status(400)
				.send(e);
		});
});

app.get('/todo/:id', (req, res) => {
	const id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res
			.status(404)
			.send('ID not valid');
	}

	Todo
		.findById(id)
		.then(todo => {
			if (!todo) {
				res
					.status(404)
					.send({});
			}
			res.send({ todo });
		}, e => {
			res
				.status(400)
				.send(e);
		});
});

app.delete('/todo/:id', (req, res) => {
	const id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send('ID not valid');
	}

	Todo
		.findByIdAndDelete(id)
		.then(todo => {
			if (!todo) {
				res.status(404).send({});
			}
			res
				.send({ todo });
		}, e => {
			res.status(400).send(e);
		});
});

app.patch('/todo/:id', (req, res) => {
	const id = req.params.id;
	const body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send('ID not valid');
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findOneAndUpdate({_id: id}, {$set: body}, { new: true })
		.then(todo => {
			res.send({ todo });
		})
		.catch(e => {
			res.status(400).send(e);
		});
});

app.post('/users', (req, res) => {
	const body = _.pick(req.body, ['email', 'password']);
	const user = new User(body);

	user.save()
		.then(() => {
			return user.generateAuthToken();
		})
		.then(token => {
			res
				.header('x-auth', token)
				.send(user);
		})
		.catch(e => {
			res
				.status(400)
				.send(e);
		});
});

app.get('/users/me', authenticate, (req,res) => {
	res.send(req.user);
});

app.listen(process.env.PORT, () => {
	console.log('Start listening to port 3000');
});

module.exports = { app };