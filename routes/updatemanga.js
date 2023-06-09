var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {db} = require('../mongodb/db.js');
const multer = require("multer");
var {Mangas}=require('../models/schemas');
var {API}=require('../models/schemas');

var storage=multer.diskStorage({
  destination:function(req,file,cb){
      cb(null,"./public/uploads/");
  },
  filename:function(req,file,cb){
      cb(null,Date.now()+file.originalname)
  }
})

var upload = multer({ storage });


router.post('/',upload.single("manga"),(req,res,next)=>{
    const currentDates = new Date().toISOString().split('T')[0]
  API.findOne({})
  .exec()
  .then((api) => {
    if (api && api.dated == currentDates) {
      API.updateOne({}, { $inc: { last: 1, total: 1 } })
        .exec()
        .then((doc) => {
          console.log("added");
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      API.updateOne({}, { last: 0, $inc: { total: 1 }, dated: currentDates })
        .exec()
        .then((doc) => {
          console.log("added");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  })
  .catch((err) => {
    console.error(err);
  });
    var ID=req.query.id;
    var name=req.body.name;
    var author=req.body.author;
    var artist=req.body.artist;
    var generes=req.query.genere;
    var summary=req.query.summary;
    console.log(generes);
    if(req.file){
        const fileName = req.file.filename;
        Mangas.updateOne({_id:ID},{
            "name": name,
            "author": author,
            "artist":artist,
            "generes":generes,
            "summary":summary,
            "mangaimage":fileName,
        }).exec()
                .then((doc)=>{
                    res.redirect('http://publisher.toonvortex.com/manage-manga');
                    })
                .catch((err) => {
                    console.error(err);
                });
    }
    else{
        Mangas.updateOne({_id:ID},{
            "name": name,
            "author": author,
            "artist":artist,
            "generes":generes,
            "summary":summary,
        }).exec()
                .then((doc)=>{
                    res.redirect('http://publisher.toonvortex.com/manage-manga');
                    })
                .catch((err) => {
                    console.error(err);
                });
    }
  });
  module.exports = router;