var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {db} = require('../mongodb/db.js');
var {transporter}=require('../nodemailer/mailer');
var { User } = require('../models/schemas');


function generateRandomPassword() {
  const length = 6;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }
  return password;
}

router.post('/',(req,res,next)=>{
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    var email=req.body.email;
    var password=req.body.password;
    var code=generateRandomPassword();
    let mailOptions = {
      from: 'Manga Support',
      to: email,
      subject: 'Verify your Email for Manga World',
      html: `<p>Hy ${firstname}!</p><p>Your verification code is ${code}. Verify your email by entering this code.`
    };
    const hashpass = crypto.createHash('sha256').update(password).digest('hex');
    console.log(firstname);
    User.findOne({emails:email}).then((result) => {
      if(result){
        return res.redirect('http://usertoonvortex.com.s3-website-us-east-1.amazonaws.com/register?email=already');
      }
      else{
    var data = {
      "firstname": firstname,
      "lastname": lastname,
      "emails": email,
      "password":hashpass,
      "emailverify":"notverified",
      "status":"active",
      "verificationcode":code,
    };
    db.collection('users').insertOne(data, (err, collection) => {
      if(err){
        console.log(err);
      }
      else{
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return res.redirect('http://usertoonvortex.com.s3-website-us-east-1.amazonaws.com/register?email=false');
          }
          else{
          console.log('Message sent successfully!');
          transporter.close();
          console.log('inserted');
          return res.redirect(`http://usertoonvortex.com.s3-website-us-east-1.amazonaws.com/register/email-verification?email=${email}`);
          }
      });
      }
    })
  }
  })
  })
  module.exports = router;