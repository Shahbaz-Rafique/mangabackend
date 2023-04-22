var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');

router.get('/',(req,res,next)=>{
    var email=req.query.email;
    var id=req.query.id;
    var mangaid=req.query.mangaid;
    var data = {
      "email":email,
      "manga": id,
    };
    db.collection('favourites').insertOne(data, (err, collection) => {
      if(err){
        console.log(err);
      }
      else{
        return res.redirect(`http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/manga?id=${mangaid}&add=true`);
       }
    })
  })
  module.exports = router;