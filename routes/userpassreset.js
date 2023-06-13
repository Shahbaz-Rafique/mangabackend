var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {User}=require('../models/schemas');
var {Admin} = require('../models/schemas');
var {Publisher} = require('../models/schemas');
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
    var email=req.body.emails;
    User.findOne({emails:email}).then((result)=>{
        if(result){
            let mailOptions = {
                from: 'Manga Support',
                to: email,
                subject: 'Verify your email to Reset your Password',
                html: `<p>Verify your email to reset your account password.</p><br/><center><a href="http://toonvortex.com/?email=${email}&reset=start"><button style="color:#FFA153;background-color:#0F0D3D;font-weight:bold;width:170px;height:34px">Verify Your Email</button></a></center>`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.redirect('http://toonvortex.com/error?type=resetemailfalse');
                }
                else{
                console.log('Message sent successfully!');
                res.redirect(`http://toonvortex.com/error?type=resetsent`);
                transporter.close();
                }
            });
        }
        else{
            res.redirect('http://toonvortex.com/error?type=resetemailexist');
        }
    })
})
module.exports = router;