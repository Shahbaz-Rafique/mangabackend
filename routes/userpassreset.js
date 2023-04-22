var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {User}=require('../models/schemas');
var {Admin} = require('../models/schemas');
var {Publisher} = require('../models/schemas');
var {transporter}=require('../nodemailer/mailer');

router.post('/',(req,res,next)=>{
    var email=req.body.emails;
    var codeverify=Math.floor(100000 + Math.random() * 900000);
    User.findOne({emails:email}).then((result)=>{
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
                res.redirect(`http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/forgot-password/verification?email=${email}&id=${hashpass}`);
                transporter.close();
                }
            });
        }
        else{
            res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/forgot-password?email=false');
        }
    })
})
module.exports = router;