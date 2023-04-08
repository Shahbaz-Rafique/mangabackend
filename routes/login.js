var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {User}=require('../models/schemas');

router.post('/',(req,res,next)=>{
    var email=req.body.emails;
    var password=req.body.passwords;
    console.log(req.body.emails);
    const hashpass = crypto.createHash('sha256').update(password).digest('hex');
    User.find({emails:email,password:hashpass,emailverify:"verified"}).then((results) => {
        if(results.length==1){
            res.redirect(`http://toonvortes.com.s3-website-us-east-1.amazonaws.com/login-home?email=${email}&login=true`);
        }
        else if(results.length==0){
            res.redirect('http://toonvortes.com.s3-website-us-east-1.amazonaws.com/login?login=false')
        }
      }).catch((err) => {
        console.log(err);
      });
  })
  module.exports = router;