var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {Publisher}=require('../models/schemas');
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
    var code=req.body.code;
    var verify=req.query.code;
    var email=req.query.email;
    var password=req.body.password;
    const hashpass = crypto.createHash('sha256').update(code).digest('hex');
    const passwordBuffer = Buffer.from(password, 'utf8');
    const changepassword = passwordBuffer.toString('hex');   
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
                                return res.redirect(`http://publisher.toonvortex.com?passreset=true`);
                                }
                            });
                            })
                        .catch((err) => {
                            console.error(err);
                        });
            }
            else{
                res.redirect(`http://publisher.toonvortex.com/forgot-password/verification?email=${email}&id=${hashpass}&verify=false`);
            }
        }
    })
})
module.exports = router;