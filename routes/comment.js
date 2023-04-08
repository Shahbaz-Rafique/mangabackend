var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {User}=require('../models/schemas');

router.post('/',(req,res,next)=>{
    var mangaid=req.query.id;
    var email=req.query.email;
    var comment=req.body.comment;
    const currentDate = new Date();
    User.findOne({emails:email}).then((result)=>{
        var data = {
            "mangaid":mangaid,
            "email": email,
            "name":result.firstname+' '+result.lastname,
            "comment":comment,
            "date":currentDate,
          };
          db.collection('comments').insertOne(data, (err, collection) => {
            if(err){
              console.log(err);
            }
            else{
                console.log("inserted");
              return res.redirect(`http://toonvortes.com.s3-website-us-east-1.amazonaws.com/manga?id=${mangaid}&comment=true`);
             }
          })
    })
  })
  module.exports = router;