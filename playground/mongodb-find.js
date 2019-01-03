const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connect to MongoDB server');

	const db = client.db('TodoApp');

	db.collection('Todos').find({
		_id: new ObjectID('5c2d4ce4f0b33ad29d5f2635')
	}).toArray()
		.then(docs => {
			console.log(JSON.stringify(docs, undefined, 2));
		}, err => {
			console.log('Unable to fetch todos', err);
		});

	//client.close();
});