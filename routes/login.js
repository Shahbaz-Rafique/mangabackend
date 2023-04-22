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
            if(results.status=="active"){
            res.redirect(`http://localhost:3000/login-home?email=${email}&login=true`);
            }
            else if(results.status=="freeze"){
                res.redirect(`http://localhost:3000/login-home?status=freeze`);   
            }
        }
        else if(results.length==0){
            res.redirect('http://localhost:3000/login?login=false')
        }
      }).catch((err) => {
        console.log(err);
      });
  })
  module.exports = router;