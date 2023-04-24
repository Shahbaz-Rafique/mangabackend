var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {User}=require('../models/schemas');
var {transporter}=require('../nodemailer/mailer');

router.post('/',(req,res,next)=>{
    var code=req.body.code;
    var verify=req.query.code;
    var email=req.query.email;
    var password=req.body.password;
    const hashpass = crypto.createHash('sha256').update(code).digest('hex');
    const changepassword = crypto.createHash('sha256').update(password).digest('hex');
    User.findOne({emails:email}).then((result)=>{
        if(result){
            if(verify==hashpass){
                User.updateOne({emails:email},{
                    "password":changepassword,
                }).exec()
                        .then((doc)=>{
                            let mailOptions = {
                                from: 'Manga Support',
                                to: email,
                                subject: 'Your Password has been reset',
                                html: `<p>Dear User! Your mangas account password has been reset. Now you can login with your new password.</p>`
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.log('Error occurred:', error.message);
                                }
                                else{
                                console.log('Message sent successfully!');
                                res.redirect(`http://usertoonvortex.com.s3-website-us-east-1.amazonaws.com/login?passreset=true`);
                                transporter.close();
                                }
                            });
                            })
                        .catch((err) => {
                            console.error(err);
                        });
            }
            else{
                res.redirect(`http://usertoonvortex.com.s3-website-us-east-1.amazonaws.com/forgot-password/verification?email=${email}&id=${hashpass}&verify=false`);
            }
        }
    })
})
module.exports = router;