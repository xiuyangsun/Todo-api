const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connect to MongoDB server');

	//const db = client.db('TodoApp');
	// db.collection('Todos').insertOne({
	// 	text: 'Some thing to do',
	// 	completed: false
	// },(err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert todo', err);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	// const db = client.db('Users');
	// db.collection('Users').insertOne({
	// 	name: 'Somebody',
	// 	age: 23,
	// 	location: 'Los Angeles'
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert user', err);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	client.close();
});