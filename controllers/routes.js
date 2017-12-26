const request = require("request");
const cheerio = require("cheerio");
const Article = require("../models/Article.js");
const Comment = require("../models/Comments.js");
const URL = "http://www.theonion.com";
const section = "/section/science-technology/"

module.exports = function(app){


app.get("/", function(req, res){
    res.render(index.html);
})

app.get("/clearall", function(req, res){
    Article.remove({}, function(err, data){ //remove all articles
        
        Comment.remove({},function(err, data){
            res.send("database wiped");
        })
     }); //remove all comments
});
   

app.get("/scrape",function(req, res){
        request(URL + section, function(error, response, html){
            if (error) throw error;
            $ = cheerio.load(html); 
            if(!$(".post-wrapper").length){
                res.send("The scraper logic is no longer valid, please update");
            } else {
                var newArticles = 0;                                
                $(".post-wrapper").each(function (i, element){
                    const result = {}
                    result.title = $(this).find("header").find("a").eq(0).text();
                    result.link = $(this).find("header").find("a").attr("href");
                    result.thumb = $(this).find("source").attr("data-srcset") || `https://picsum.photos/800/606/?random`;
                    
                    let newEntry = new Article(result);

                    Article.findOne({title: result.title}, function (err, found){
                        if (err) throw err;
                        
                        if(!found){
                            newArticles++;
                            Article.create(result, function (err){
                                if (err) throw err;
                                if(i === $('.post-wrapper').length - 1){ //if last (handle async)
                                    res.send(`Scrape complete, added ${newArticles} new articles`);
                                }
                                
                            });
                        } else {
                            if(i === $('.post-wrapper').length - 1){ //if last (handle async)
                                res.send(`Scrape complete, added ${newArticles} new articles`);
                            }
                        }
                    });

                    // Article.findOneAndUpdate(
                    //     {title : result.title}, //find a title match
                    //     newEntry, //if found update with this
                    //     { upsert: true }, // if not found, add it
                    //     function (err, doc) {
                    //         console.log(doc);
                    //     }
                    // );
                });
                
            }
        });
})

           


    app.get("/getData", function(req, res){
        Article.find({}, function(err, result){
            res.send(result);
        });
    });

    app.post("/newcomment", function(req, res){
        console.log("line 64",req.body);

        let articleId = req.body.id
        
        let comment = {
            "author": req.body.author,
            "body" : req.body.comment
        }
        let newComment = new Comment(comment);
        newComment.save(function(err, doc){
                if(err) {
                    console.log(err);
                }else{
                    console.log("line 74",doc);
                    console.log(articleId);
                   Article.findOneAndUpdate({_id: articleId}, { $push: {"comments": doc._id } }, { new: true }, function(err, doc){
                       if(err) {
                           res.send(err);
                       }
                       else {
                           console.log(doc);
                         res.redirect("/");
                       }
                   })
                 }
            });
      
     
    });

    app.get("/getcomments/:id", function(req, res){
        let articleId = req.params.id;
        console.log(articleId);
        Article.findOne({_id: req.params.id}).populate("comments").exec(function(err,result){
            if(err) return err;
            console.log(result);
            res.send(result);
        })
    })

}
