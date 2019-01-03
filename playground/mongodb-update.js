const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connect to MongoDB server');

	// const db = client.db('TodoApp');

	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID('5c2d58d9f0b33ad29d5f2936')
	// }, {
	// 	$set: {
	// 		text: 'Be rich',
	// 		completed: false
	// 	}}, {
	// 	returnOriginal: false
	// }
	// )
	// 	.then(doc => {
	// 		console.log(doc);
	// 	}, err => {
	// 		console.log('Unable to fetch todos', err);
	// 	});

	const db = client.db('Users');

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5c2d4ad596b15f04ee10f7ac')
	}, {
		$set: {
			name: 'Updated name'
		},
		$inc: {
			age: 1
		}}, {
		returnOriginal: false
	}
	)
		.then(doc => {
			console.log(doc);
		}, err => {
			console.log('Unable to fetch todos', err);
		});

	//client.close();
});