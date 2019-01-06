const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

const data = {
	id: 3
};
const token = jwt.sign(data, 'secret');
const decoded = jwt.verify(token, 'secret');

console.log(token);
console.log(decoded);

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

