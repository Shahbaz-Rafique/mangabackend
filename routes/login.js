var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {User}=require('../models/schemas');
var {Publisher}=require('../models/schemas');
var {Admin}=require('../models/schemas');
var {API}=require('../models/schemas');

router.post('/',(req,res,next)=>{
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
    var email=req.body.emails;
    var password=req.body.passwords;

    const hashpass = crypto.createHash('sha256').update(password).digest('hex');
    User.find({emails:email,password:hashpass,emailverify:"verified"}).then((results) => {
        if(results.length==1){
            if(results[0].status=="active"){
                res.redirect(`http://toonvortex.com/?email=${email}&login=true`);
            }
            else if(results[0].emailverifiy=="unverified"){
                res.redirect(`http://toonvortex.com/error?type=unverified`);
            }
            else if(results[0].status=="freeze"){
                res.redirect(`http://toonvortex.com/error?type=freeze`);   
            }
        }
        else if(results.length==0){
            Publisher.find({email:email,password:hashpass}).then((result)=>{
                if(result.length==1){
                    if(result[0].status=="active"){
                        res.redirect(`http://toonvortex.com/?email=${email}&login=true`);
                    }
                }
                else if(result.length==0){
                    Admin.find({email:email,password:hashpass}).then((result)=>{
                        if(result.length==1){
                            res.redirect(`http://toonvortex.com/?email=${email}&login=true`);
                        }
                        else{
                            res.redirect('http://toonvortex.com/error?type=wronglogin')
                        }
                    })
                }
            })
        }
      }).catch((err) => {
        console.log(err);
      });
  })
  module.exports = router;