
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to your personal daily journal. Feel free to blog whatever is on your mind!";
const aboutContent = "This blog website was made for you to write down all your thoughts and have them stored for you. We use MongoDB to keep your posts stored for you (don't worry your data is yours alone).";
const contactContent = "For any inquires of our other websites and products please direct your contacts to the developers team.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({}, function(err, foundPosts){

      res.render("home", {homeStartingContent: homeStartingContent, posts: foundPosts});

  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/posts/:postId", function(req, res){
  Post.findOne({_id: req.params.postId}, function(err, foundPost){
    res.render("post", {post: foundPost});
  });
});


app.post("/compose", function(req, res){
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody
    });

    post.save(function(err){
      if(!err){
        res.redirect("/");
      }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
