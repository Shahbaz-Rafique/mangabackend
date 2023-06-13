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

router.post('/',upload.single('addimg'),(req,res,next)=>{
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
    var name=req.body.addname;
    var email=req.body.addemail;
    var img="";
    if(req.file){
        img=req.file.filename;
    }
    else{
        img="";
    }
    var comment=req.body.comment;
    var data = {
      "name":name,
      "email":email,
      "image":img,
      "comment":comment,
    };
    db.collection('members').insertOne(data, (err, collection) => {
      if(err){
        console.log(err);
      }
      else{
        console.log('inserted');
        return res.redirect('http://admin.toonvortex.com/emailing');
       }
    })
  })
  module.exports = router;