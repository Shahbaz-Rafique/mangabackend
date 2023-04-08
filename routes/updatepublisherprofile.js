var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {db} = require('../mongodb/db.js');
const multer = require("multer");
var {Publisher}=require('../models/schemas');

var storage=multer.diskStorage({
  destination:function(req,file,cb){
      cb(null,"./public/uploads/");
  },
  filename:function(req,file,cb){
      cb(null,Date.now()+file.originalname)
  }
})

var upload = multer({ storage });


router.post('/',upload.single("profile"),(req,res,next)=>{
    var ID=req.query.id;
    var name=req.body.name;
    var email=req.body.email;
    var address=req.body.address;
    var city=req.body.city;
    var contact=req.body.contact;
    var facebook=req.body.facebook;
    var twitter=req.body.twitter;
    var instagram=req.body.instagram;
    if(req.file){
        const fileName = req.file.filename;
        Publisher.updateOne({_id:ID},{
            "profileimage":fileName,
            "name": name,
            "email": email,
            "address":address,
            "city":city,
            "contact":contact,
            "facebook":facebook,
            "twitter":twitter,
            "instagram":instagram,
        }).exec()
                .then((doc)=>{
                    res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/publisher-profile');
                    })
                .catch((err) => {
                    console.error(err);
                });
    }
    else{
        Publisher.updateOne({_id:ID},{
            "name": name,
            "email": email,
            "address":address,
            "city":city,
            "contact":contact,
            "facebook":facebook,
            "twitter":twitter,
            "instagram":instagram,
        }).exec()
                .then((doc)=>{
                    res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/publisher-profile');
                    })
                .catch((err) => {
                    console.error(err);
                });
    }
  });
  module.exports = router;