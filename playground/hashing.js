const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = 'abc234~';
bcrypt.genSalt(10,(err, salt) => {
	bcrypt.hash(password, salt, (err,hash) => {
		console.log(hash);
	});
});

const hashedPassword = '$2a$10$yL2cQjDl.Tvdj/MK1qml/e2ukQG6TjD/uiOfMbUX7iGYhrhtFRdOC';

bcrypt.compare(password, hashedPassword, (err,res) => {
	console.log(res);
});
// const data = {
// 	id: 3
// };
// const token = jwt.sign(data, 'secret');
// const decoded = jwt.verify(token, 'secret');

// console.log(token);
// console.log(decoded);

// const message = 'I am user number 3';
// const hash  = SHA256(message).toString();

// console.log('Message: ', message);
// console.log('Hash: ', hash);

// const data = {
// 	id: 3
// };

// const token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'secret').toString()
// };

// const resultHash = SHA256(JSON.stringify(data) + 'secret').toString();

// if (resultHash === token.hash) {
// 	console.log('Data is not changed');
// } else {
// 	console.log('Data is changed, do not trust');
// }

