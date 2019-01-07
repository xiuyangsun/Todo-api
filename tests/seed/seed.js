const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { Todo } = require('../../server/models/todo'); 
const { User } = require('../../server/models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
	_id: userOneId,
	email: 'testUser1@email.com',
	password: 'user1Password',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
	}]
},{
	_id: userTwoId,
	email: 'testUser2@email.com',
	password: 'user2Password'
}];

const populateUsers = (done) => {
	User.deleteMany({})
		.then(() => {
			const userOne = new User(users[0]).save();
			const userTwo = new User(users[1]).save();

			Promise.all([userOne, userTwo]);
		})
		.then(() => done())
		.catch(e => {
			console.log(e);
		});
};

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

const populateTodos = (done) => {
	Todo.deleteMany({})
		.then(() => {
			Todo.insertMany(todos);
		})
		.then(() => done());
};

module.exports = {
	users,
	populateUsers,
	todos,
	populateTodos
};