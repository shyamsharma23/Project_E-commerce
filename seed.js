const Person = require('./models/person');
const Driver = require('./models/driver');
const Post = require('./models/post');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/car_share');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database connected");
});

Post.insertMany({})
