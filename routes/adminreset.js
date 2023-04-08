var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {Admin}=require('../models/schemas');
var {Publisher}=require('../models/schemas');
var {transporter}=require('../nodemailer/mailer');

router.post('/',(req,res,next)=>{
    var code=req.body.code;
    var verify=req.query.code;
    var email=req.query.email;
    var password=req.body.password;
    const hashpass = crypto.createHash('sha256').update(code).digest('hex');
    const changepassword = crypto.createHash('sha256').update(password).digest('hex');
    Admin.findOne({email:email}).then((result)=>{
        if(result){
            if(verify==hashpass){
                Admin.updateOne({email:email},{
                    "password":changepassword,
                }).exec()
                        .then((doc)=>{
                            let mailOptions = {
                                from: 'Manga Support',
                                to: email,
                                subject: 'Your Password has been reset',
                                html: `<p>Dear Admin! Your mangas account password has been reset. Now you can login with your new password.</p>`
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.log('Error occurred:', error.message);
                                }
                                else{
                                console.log('Message sent successfully!');
                                res.redirect(`http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com?passreset=true`);
                                transporter.close();
                                }
                            });
                            })
                        .catch((err) => {
                            console.error(err);
                        });
            }
        }
        else{
            Publisher.findOne({email:email}).then((result)=>{
                if(result){
                    console.log(result);
                    if(verify==hashpass){
                        Publisher.updateOne({email:email},{
                            "password":changepassword,
                        }).exec()
                                .then((doc)=>{
                                    let mailOptions = {
                                        from: 'Manga Support',
                                        to: email,
                                        subject: 'Your Password has been reset',
                                        html: `<p>Dear Publisher! Your mangas account password has been reset. Now you can login with your new password.</p>`
                                    };
                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            console.log('Error occurred:', error.message);
                                        }
                                        else{
                                        console.log('Message sent successfully!');
                                        return res.redirect(`http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com?passreset=true`);
                                        }
                                    });
                                    })
                                .catch((err) => {
                                    console.error(err);
                                });
                    }
                    else{
                        res.redirect(`http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/forgot-password/verification?email=${email}&id=${hashpass}&verify=false`);
                    }
                }
            })
        }
    })
})
module.exports = router;