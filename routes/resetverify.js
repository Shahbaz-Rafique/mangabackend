var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {User}=require('../models/schemas');
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
    var email=req.query.email;
    var password=req.body.password;
    const hashpass = crypto.createHash('sha256').update(password).digest('hex');
    User.findOne({emails:email}).then((result)=>{
        if(result){
        User.updateOne({emails:email},{
            "password":hashpass,
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
                res.redirect(`http://toonvortex.com/error?type=passreset`);
                transporter.close();
                }
            });
            })
        .catch((err) => {
            console.error(err);
        });
        }
    })
})
module.exports = router;