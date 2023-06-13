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
    var to=req.body.to;
    var subject=req.body.subject;
    var msg=req.body.message;
    let mailOptions = {
        from: 'Manga Support',
        to: to,
        subject: subject,
        text: msg,
      };
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error.message);
            return res.redirect('http://admin.toonvortex.com/emailing?send=false');
        }
        else{
            console.log('Message sent successfully!');
            return res.redirect('http://admin.toonvortex.com/emailing?send=true');
            transporter.close();
            
        }
    });
  })
  module.exports = router;