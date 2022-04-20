const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const driverSchema = new Schema({
    license: {type: String},
    items:[{type: Schema.Types.ObjectId, ref: 'Post'}],
    phone: {type: Number}

})

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;