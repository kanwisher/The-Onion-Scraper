
const Article = require("./models/Article.js");
const Comments = require("./models/Comments.js");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 3000;
mongoose.Promise = Promise;

app.use(express.static("./public"));

require("./controllers/routes.js")(app);

mongoose.connect("mongodb://localhost/OnionScraperDB", function(error){
  if (error){
    console.error(error);
  }else{
    console.log("Database connection successful!");
    app.listen(PORT, function(){
      console.log("connected on port " + PORT)
    });
  }
});




