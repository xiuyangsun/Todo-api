const { ObjectID } = require('mongodb');

const mongoose = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');

const id = '5c2eaf1a0a4c5f0a74e86be7';

if (!ObjectID.isValid(id)) {
	console.log('ID not valid');
}

Todo.find({
	_id: id
}).then((todos) => {
	console.log('Todos', todos);
});

Todo.findOne({
	_id: id
})
	.then(todo => {
		console.log('Todo', todo);
	});

Todo.findById(id)
	.then(todo => {
		if (!todo) {
			console.log('No todo found!');
		}
		console.log('Todo', todo);
	})
	.catch(e => console.log(e));