const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Person = require('./models/person');
const bcrypt = require('bcrypt');
// const Driver = require('./models/driver');
const session = require('express-session')
const methodOverride = require('method-override')


const res = require('express/lib/response');
const Post = require('./models/post');
const { redirect } = require('express/lib/response');



const app = express();
mongoose.connect('mongodb://localhost:27017/car_share');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database connected");
});
app.use(methodOverride('_method'));

app.use(session({secret: 'notagoodsecret'}));

app.use(express.urlencoded({extended: true}))
// app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use('/css/', express.static(__dirname + '/public/stylesheets/'));



const requireLogin = (req,res,next) =>{
    if (!req.session.user_id){
      return res.redirect('/login')
    }
    next();
}


app.get('/home', (req, res)=>{
    res.render('signup')
})

app.get('/login', (req, res)=>{
    res.render('login');
})

app.post('/login', async(req, res)=>{
    const object = req.body;
    const user = await Person.findOne({username: object.username})
    console.log(user)
    bcrypt.compare(object.password, user.password, (err, validPassword)=>{
        if (validPassword){
          req.session.user_id = user._id; // assigning the session a value which is unique to user
          res.redirect(`/home/${user._id}`);
        } else{
          res.redirect('/login')
        }
      });

})

app.post('/home', async (req, res)=>{
    const object = req.body;
    console.log(object)
    const hash = await bcrypt.hash(object.password, 12)
    const user = new Person({firstname: object.firstname, lastname: object.lastname, email: object.email, username:object.username,
    password: hash, status: object.status, license: object.license, exp_date: object.exp, phone: object.phone })
    // const info = await Person.find({username: object.username}).populate('info');
    await user.save();
    req.session.user_id = user._id;

    const id = user._id;
    res.redirect(`/home/${id}`);
    
})


app.get('/home/:id', requireLogin, async (req, res)=>{
    const id = req.params.id;
    const user = await Person.findById(id).populate('items');
    const items = await Post.find({}).populate('user');
    console.log(items)
    // const info = user.items;
    res.render('posts',{user, items})


})

app.post('/home/search/:id', async (req, res)=>{
    const data = await Post.find({}).populate('user');
    // console.log(data)
    const query = req.body;
    const id = req.params.id;
    console.log(query);
    const filteredUsers = data.filter(user =>{
        isValid = true;
        isValid = isValid &&(user.pickup == query.pickup || user.destination == query.destination);
        return isValid;
    });
    res.render('searchResults', {filteredUsers, id});
});



app.get('/home/:id/posts', requireLogin, (req, res)=>{
    const id = req.params.id;
    // const ID = req.params.ID;
    res.render('addPost', {id});
})

app.post('/home/:id/posts', async(req, res)=>{
    const object = req.body;
    const id = req.params.id;
    const user = await Person.findById(id);
    const post = new Post({destination: object.destination, pickup: object.pickup, price: object.price, date: object.date});
    post.user = user._id;
    user.items.push(post);
    await user.save();
    await post.save();
    console.log(post);
    res.redirect(`/home/${id}`);

})


app.get('/home/:id/showposts', requireLogin, async (req, res)=>{
    const id = req.params.id;
    const user = await Person.findById(id).populate('items');
    res.render('showposts', {user}) 
})

app.delete('/home/:id/:ID', async (req, res)=>{
    const id = req.params.id;
    const ID = req.params.ID;
    await Post.findByIdAndDelete(ID);
    res.redirect(`/home/${id}/showposts`);


})

app.get('/logout',(req,res)=>{
    req.session.user_id = null;
    res.redirect('/login');
  })

app.listen('3000')