var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {transporter}=require('../nodemailer/mailer');
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
    var to=req.body.email;
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    let mailOptions = {
        from: 'Manga Support',
        to: to,
        subject: "Password Reset",
        text: "Hy! kindly verify your email by entering the follwing verification code. Verification code is "+randomNumber,
      };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error.message);
            return res.redirect(`http://toonvortex.com/forgot-password?email=${to}&sent=false`);
        }
        else{
            console.log('Message sent successfully!');
            return res.redirect(`http://toonvortex.com/forgot-password/emailing?email=${to}&sent=true`);
            transporter.close();
            
        }
    });
  })
  module.exports = router;