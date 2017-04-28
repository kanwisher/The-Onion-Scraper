const request = require("request");
const cheerio = require("cheerio");
const Article = require("../models/Article.js");
const URL = "http://www.theonion.com";
const section = "/section/science-technology/"

module.exports = function(app){


app.get("/", function(req, res){
    res.render(index.html);
})
   
app.get("/scrape",function(req, res){
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
        res.send("Scrape complete");
    });


    app.get("/getData", function(req, res){
        Article.find({}, function(err, result){
            res.send(result);
        });
    });

}