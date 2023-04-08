var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {db} = require('../mongodb/db.js');
const multer = require("multer");

var storage=multer.diskStorage({
  destination:function(req,file,cb){
      cb(null,"./public/uploads/");
  },
  filename:function(req,file,cb){
      cb(null,Date.now()+file.originalname)
  }
})

var upload = multer({ storage });

router.post('/',upload.single('manga'),(req,res,next)=>{
    var name=req.body.name;
    var artist=req.body.artist;
    var author=req.body.author;
    var generes=req.body.generes;
    var summary=req.body.summary;
    const fileName = req.file.filename;
    const currentDate = new Date();
    var data = {
      "mangaimage":fileName,
      "name":name,
      "artist":artist,
      "author":author,
      "generes":generes,
      "summary":summary,
      "addDate":currentDate,
    };
    db.collection('mangas').insertOne(data, (err, collection) => {
      if(err){
        console.log(err);
      }
      else{
        console.log('inserted');
        return res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/add-manga?add=true');
       }
    })
  })
  module.exports = router;