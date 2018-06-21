const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const unique = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const schema = new Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        set: pwd => bcrypt.hashSync(pwd, 15)
    },
    level: {
        type: String,
        default: 'guest',
        required: true,
        enum: ['guest', 'admin']
    }
});

schema.plugin(unique);

module.exports = mongoose.model('User', schema);
