const mongoose = require('mongoose');

mongoose.promise = global.promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

module.exports = { mongoose };
