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
    var codeverify=Math.floor(100000 + Math.random() * 900000);
    Admin.findOne({email:email}).then((result)=>{
        if(result){
            console.log(result);
            const hashpass = crypto.createHash('sha256').update(codeverify.toString()).digest('hex');
            let mailOptions = {
                from: 'Manga Support',
                to: email,
                subject: 'Verify your email to Reset your Password',
                html: `<p>To reset you manga's world password the verification code that you can use is ${codeverify}.</p>`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error occurred:', error.message);
                }
                else{
                console.log('Message sent successfully!');
                res.redirect(`http://admin.toonvortex.com/forgot-password/verification?email=${email}&id=${hashpass}`);
                transporter.close();
                }
            });
        }
        else{
            Publisher.findOne({email:email}).then((result)=>{
                if(result){
                    console.log(result);
                    const hashpass = crypto.createHash('sha256').update(codeverify.toString()).digest('hex');
                    let mailOptions = {
                        from: 'Manga Support',
                        to: email,
                        subject: 'Verify your email to Reset your Password',
                        html: `<p>To reset you manga's world password the verification code that you can use is ${codeverify}.</p>`
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log('Error occurred:', error.message);
                        }
                        else{
                        console.log('Message sent successfully!');
                        res.redirect(`http://admin.toonvortex.com/forgot-password/verification?email=${email}&id=${hashpass}`);
                        transporter.close();
                        }
                    });
                }
                else{
                    res.redirect('http://admin.toonvortex.com/forgot-password?email=false');
                }
            })
        }
    })
})
module.exports = router;