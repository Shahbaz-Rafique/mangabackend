var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {Admin}=require('../models/schemas');
var {Publisher}=require('../models/schemas');
var {transporter}=require('../nodemailer/mailer');
const os = require('os');
const dns = require('dns');
var {API}=require('../models/schemas');
const networkInterfaces = os.networkInterfaces();
let ipAddress;

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

    Admin.find({email:emails,password:hashpass}).then((results) => {
        if(results.length==0){
          Publisher.find({email:emails,password:passwordHex}).then((results) => {
            if(results.length==1 && results[0].Role=="Moderator"){
              res.redirect(`http://staff.toonvortex.com/moderator-home?email=${emails}&img=${results[0].profileimage}&id=${results[0]._id}&role=${results[0].Role}`);
            }
            else if(results.length==0){
                res.redirect('http://staff.toonvortex.com/?login=false')
            }
          }).catch((err) => {
            console.log(err);
          });
        }
      }).catch((err) => {
        console.log(err);
      });
  })

  module.exports = router;