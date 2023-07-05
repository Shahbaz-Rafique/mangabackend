var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {Publisher}=require('../models/schemas');
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

    var emails=req.body.emails;
    var passwords=req.body.passwords;
    const hashpass = crypto.createHash('sha256').update(passwords).digest('hex');
    const passwordBuffer = Buffer.from(passwords, 'utf8');
    const passwordHex = passwordBuffer.toString('hex');
    Publisher.find({email:emails,password:passwordHex}).then((results) => {
        if(results.length==1 && results[0].Role=="Publisher"){
            res.redirect(`http://publisher.toonvortex.com/publisher-home?email=${emails}&img=${results[0].profileimage}&id=${results[0]._id}&role=${results[0].Role}`);
        }
        else{
            res.redirect('http://publisher.toonvortex.com/?login=false')
        }
      }).catch((err) => {
        console.log(err);
      });
    
  }) 

  module.exports = router;