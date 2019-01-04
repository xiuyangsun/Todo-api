const { ObjectID } = require('mongodb');

const mongoose = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');

const id = '5c2f902bf6cbb911fb20eed3';

if (!ObjectID.isValid(id)) {
	console.log('ID not valid');
}

Todo.findOneAndDelete({
	_id: id
})
	.then(todo => {
		console.log('Todo', todo);
	});


Todo.findByIdAndDelete('5c2f902bf6cbb911fb20eed5')
	.then(todo => {
		console.log(todo);
	});