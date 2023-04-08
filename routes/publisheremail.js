var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {transporter}=require('../nodemailer/mailer');

router.post('/',(req,res,next)=>{
    var from=req.query.email;
    var to=req.body.to;
    var subject=req.body.subject;
    var msg=req.body.message;
    console.log(msg);
    let mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: msg,
      };
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error.message);
            return res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/publisher-email?send=false');
        }
        else{
            console.log('Message sent successfully!');
            return res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/publisher-email?send=true');
            transporter.close();
            
        }
    });
  })
  module.exports = router;