const mongoose = require('mongoose');

const User = mongoose.model('User', {
	Email: {
		type: String,
		required: {
			required: true,
			massage: 'Email is required'
		},
		trim: true,
		minlength: 1
	}
});

module.exports = { User };
