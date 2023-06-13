var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {db} = require('../mongodb/db.js');
const multer = require("multer");
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

router.post('/',upload.single('manga'),(req,res,next)=>{
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
    var name=req.body.name;
    var artist=req.body.artist;
    var author=req.body.author;
    var generes=req.query.genere;
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