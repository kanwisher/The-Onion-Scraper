const request = require("request");
const cheerio = require("cheerio");
const Article = require("./models/Article.js");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/OnionScraperDB", function(error){
  if (error){
    console.error(error);
  }else{
    console.log("Database connection successful!");
  }
});


const URL = "http://www.theonion.com";
const section = "/section/science-technology/"


request(URL + section, function(error, response, html){

  $ = cheerio.load(html);

 

  $("article.summary").each(function (i, element){
    const result = {}
    result.title = $(this).find(".headline").children("a").attr("title");
    result.link = URL + $(this).find(".headline").children("a").attr("href");
    result.thumb = $(this).find("img").attr("src");

    let newEntry = new Article(result);

    newEntry.save(function(err, doc){
      if(err) {
        console.log(err);
      } else {
        console.log(doc);
      }
  });

});

});