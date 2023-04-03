var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {transporter}=require('../nodemailer/mailer');

router.post('/',(req,res,next)=>{
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
            return res.redirect('http://localhost:3000/emailing?send=false');
        }
        else{
            console.log('Message sent successfully!');
            return res.redirect('http://localhost:3000/emailing?send=true');
            transporter.close();
            
        }
    });
  })
  module.exports = router;