const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connect to MongoDB server');

	const db = client.db('TodoApp');

	db.collection('Todos').deleteMany({ text: 'shot a gun' })
		.then(docs => {
			console.log(docs);
		}, err => {
			console.log('Unable to delete todos', err);
		});

	db.collection('Todos').deleteOne({ text: 'Eat Launch' })
		.then(docs => {
			console.log(docs);
		}, err => {
			console.log('Unable to delete todos', err);
		});

	//client.close();
});