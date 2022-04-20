const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const personSchema = new Schema({
    firstname : {type: String},
    lastname: {type: String},
    email: {type: String},
    username: {type: String},
    password: {type: String},
    status: {
        type: String,
        enum : ['RIDER','DRIVER'],
    },
    items: [{type: Schema.Types.ObjectId, ref: 'Post'}],
    license : {type: String},
    exp_date: {type: Date},
    phone: {type: String}

});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;