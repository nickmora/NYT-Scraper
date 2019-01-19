const express = require ("express");
const logger = require("morgan");
const mongoose =require("mongoose");
const path = require("path");
const exphbs = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars",
    exphbs({
        defaultLayout:"main"
    })
);
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/NYTScraper", {useNewUrlParser:true});

app.get("/", function(req, res){
    res.send("Hey, the server is working!");
})

app.get("/scrape", (req, res)=>{
    axios.get("https://www.nytimes.com")
    .then(resp=>{
        const $ = cheerio.load(resp.data);
        $("article.css-8atqhb").each((i, ele)=>{
            const result = {};
            
            result.title = $(ele).children().text();
            result.link = $(ele).find("a").attr("href");

            if(result.title&&result.link){
                db.Article.create(result)
                    .then(dbArtible=>{
                        console.log(dbArtible);
                    })
                    .catch(err=>{
                        console.log(err);
                    });
            };
        });
        res.send("Scrape Complete!")
    });
});

app.get("/articles", (req, res)=>{
    db.Article.find({})
        .then(allArticles=>{
            res.json(allArticles)
        })
        .catch(err=>{
            res.json(err);
        });
});

app.get("/articles/:id", (req,res)=>{
    db.Article.findOne({_id:req.params.id})
    .populate("notes")
    .then(specArticle=>{
        res.json(specArticle);
    })
    .catch(err=>{
        res.json(err);
    })
});

app.post("/articles/:id", (req, res)=>{
    db.Notes.create(req.body)
        .then(dbNote=>{
            return db.Article.findOneAndUpdate(
                {
                    _id:req.params.id
                },{
                    notes: dbNote.id
                },{
                    new:true
                }
            ).then(dbArtible=>{
                res.json(dbArtible)
            });
        })
        .catch(err=>{
            res.json(err);
        });
});

app.listen(PORT, ()=>{
    console.log(`Scraper is running on port ${PORT}!! Check it out, yo`);
});