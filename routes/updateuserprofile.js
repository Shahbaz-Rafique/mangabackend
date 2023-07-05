var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {db} = require('../mongodb/db.js');
const multer = require("multer");
var {User}=require('../models/schemas');
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


router.post('/',upload.single("profile"),(req,res,next)=>{
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
    var fname=req.body.firstname;
    var lname=req.body.lastname;
    var email=req.body.email;
    var uname=req.body.uniquename;
    var password=req.body.password;
    const hashpass=crypto.createHash('sha256').update(password).digest('hex');
    if(req.file){
        const fileName = req.file.filename;
        if(password!=""){
            User.updateOne({_id:ID},{
                "image":fileName,
                "firstname": fname,
                "lastname": lname,
                "uniquename":uname,
                "emails":email,
                "password":hashpass,
            }).exec()
            .then((doc)=>{
                res.redirect('http://staff.toonvortex.com/profile');
                })
            .catch((err) => {
                console.error(err);
            });
        }
        else{
            User.updateOne({_id:ID},{
                "image":fileName,
                "firstname": fname,
                "lastname": lname,
                "uniquename":uname,
                "emails":email,
            }).exec()
            .then((doc)=>{
                res.redirect('http://staff.toonvortex.com/profile');
                })
            .catch((err) => {
                console.error(err);
            });
        }
    }
    else{
        if(password!=""){
            User.updateOne({_id:ID},{
                "firstname": fname,
                "lastname": lname,
                "uniquename":uname,
                "emails":email,
                "password":hashpass,
            }).exec()
            .then((doc)=>{
                res.redirect('http://staff.toonvortex.com/profile');
                })
            .catch((err) => {
                console.error(err);
            });
        }
        else{
            User.updateOne({_id:ID},{
                "firstname": fname,
                "lastname": lname,
                "uniquename":uname,
                "emails":email,
            }).exec()
            .then((doc)=>{
                res.redirect('http://staff.toonvortex.com/profile');
                })
            .catch((err) => {
                console.error(err);
            });
        }
    }
  });
  module.exports = router;