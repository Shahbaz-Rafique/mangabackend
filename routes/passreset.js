var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {transporter}=require('../nodemailer/mailer');

router.post('/',(req,res,next)=>{
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
            return res.redirect(`http://usertoonvortex.com.s3-website-us-east-1.amazonaws.com/forgot-password?email=${to}&sent=false`);
        }
        else{
            console.log('Message sent successfully!');
            return res.redirect(`http://usertoonvortex.com.s3-website-us-east-1.amazonaws.com/forgot-password/emailing?email=${to}&sent=true`);
            transporter.close();
            
        }
    });
  })
  module.exports = router;