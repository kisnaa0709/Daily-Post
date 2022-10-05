require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const _ = require("lodash")

const homeStartingContent = "Here you post millions of posts by just singing in to the DAILY NEWS app, and you can be creative as fuck.Here you post millions of posts by just singing in to the DAILY NEWS app, and you can be creative as fuck.Here you post millions of posts by just singing in to the DAILY NEWS app, and you can be creative as fuck.Here you post millions of posts by just singing in to the DAILY NEWS app, and you can be creative as fuck.Here you post millions of posts by just singing in to the DAILY NEWS app, and you can be creative as fuck.Here you post millions of posts by just singing in to the DAILY NEWS app, and you can be creative as fuck.Here you post millions of posts by just singing in to the DAILY NEWS app, and you can be creative as fuck.Here you post millions of posts by just singing in to the DAILY NEWS app, and you can be creative as fuck.Here you post millions of posts by just singing in to the DAILY NEWS app, and you can be creative as fuck.Here you post millions of posts by just singing in to the DAILY NEWS app, and you can be creative as fuck.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
let posts = [];

const app = express();

console.log(process.env.API_KEY);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
  name : String,
  email : String,
  password : String

});

userSchema.plugin(encrypt, { secret : process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home", {
    para: homeStartingContent,
    posts: posts
  });
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email : email}, function(err, foundUser){
    if(err){
      console.log("Error")
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render('compose')
        }else{
          res.send("Wrong Password");
        }
      }
    }
  })
});

app.post("/signup", function (req, res) {
  const newUser = new User({
    name : req.body.username,
    email : req.body.email,
    password : req.body.password
  })
  newUser.save(function(err){
    if(err){
      console.log("Error");
    }else{
      console.log("Successfully Sign Up");
    }
  })
  res.render("compose")
});

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.get("/about", function (req, res) {
  res.render("about", {para:  aboutContent});
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/contact", function (req, res) {
  res.render("contact", {para: contactContent });
});

app.get("/home", function (req, res) {
  res.redirect("/");
});

app.get("/post", function (req, res) {
  res.render("post");
});

app.post("/compose", function (req, res) {
  const post = {
    title : req.body.newTitle,
    body : req.body.newBody
  } 
  posts.push(post);
  res.redirect("/");
})

app.get("/posts/:postName", function (req, res) {
  const requestedTitle =  _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
    res.render("post", {title: post.title, body: post.body });
    res.redirect("/post");
    }
  })
  
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
