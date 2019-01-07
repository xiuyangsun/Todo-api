const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{value} is not a valid email'
		}
	},
	password: {
		type: String,
		minlength: 6,
		required: true
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.generateAuthToken = function () {
	let user = this;
	const access = 'auth';
	const token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();

	user.tokens = user.tokens.concat([{
		access,
		token
	}]);
	return user
		.save()
		.then(() => token)
		.catch(e => e);
};

UserSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.removeToken = function (token) {
	const user = this;
	return user.update({
		$pull: {
			tokens: {
				token
			}
		}
	});
};

UserSchema.statics.findByToken = function (token) {
	const User = this;
	let decoded;

	try{
		decoded = jwt.verify(token, 'abc123');
	} catch(e) {
		return Promise.reject();
	}

	return User.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

UserSchema.statics.findByCredentials = function (email, password) {
	const User = this;

	return User.findOne({ email })
		.then(user => {
			if (!user) {
				return Promise.reject('User not exist');
			}

			return new Promise((resolve, reject) => {
				bcrypt.compare(password, user.password, (err, res) => {
					if (res) {
						resolve(user);
					} else{
						reject('Password not match');
					}
				});
			});
		});
};

UserSchema.pre('save', function (next) {
	const user = this;
	try {
		if (user.isModified('password')) {
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(user.password, salt, (err, hash) =>{
					user.password = hash;
					next();
				});
			});
		} else {
			next();
		}
	} catch (e) {
		console.log(e);
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
