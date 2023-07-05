var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {db} = require('../mongodb/db.js');
var {transporter}=require('../nodemailer/mailer');
var { User } = require('../models/schemas');
var {API}=require('../models/schemas');


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
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    var email=req.body.email;
    var password=req.body.password;
    var uniquename=firstname+' '+lastname;
    var dateofbirth=req.body.dob;
    var code=generateRandomPassword();
    const currentDate = new Date().toISOString().split('T')[0]
    const dob = new Date(dateofbirth).toISOString().split('T')[0]
    let mailOptions = {
      from: 'Manga Support',
      to: email,
      subject: 'Verify your Email for Manga World',
      html: `<p>Hy ${firstname}!</p><p>We warmly welcome you in the Mangas world. Kindly verify your email to continue your journey in the Mangas world.</p><br/><center><a href="http://208.113.200.60:8080/verification?email=${email}"><button style="color:#FFA153;background-color:#0F0D3D;font-weight:bold;width:170px;height:34px">Verify Your Email</button></a></center>`
    };
    const hashpass = crypto.createHash('sha256').update(password).digest('hex');
    console.log(firstname);
    User.findOne({emails:email}).then((result) => {
      if(result){
        return res.redirect('http://toonvortex.com/error?type=emailalready');
      }
      else{
      var data = {
        "firstname": firstname,
        "lastname": lastname,
        "uniquename":uniquename,
        "emails": email,
        "password":hashpass,
        "image":"",
        "dob":dob,
        "emailverify":"notverified",
        "status":"active",
        "verificationcode":code,
        "registerDate":currentDate,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.redirect('http://toonvortex.com/error?type=emailfalse');
        }
        else{
          console.log('Message sent successfully!');
          transporter.close();
          db.collection('users').insertOne(data, (err, collection) => {
            if(err){
              console.log(err);
            }
            else{
              console.log('inserted');
              return res.redirect(`http://toonvortex.com/error?type=verifyemail`);
            }
          })
        }
    });
  }
  })
  })
  module.exports = router;