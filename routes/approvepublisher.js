var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {db} = require('../mongodb/db.js');
const multer = require("multer");
var {Publisher}=require('../models/schemas');
var {transporter}=require('../nodemailer/mailer');
var {API}=require('../models/schemas');

router.get('/',(req,res,next)=>{
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
    var ID=req.query.id;
    var status=req.query.status;
    Publisher.updateOne({_id:ID},{
        "status": status,
    }).exec()
            .then((doc)=>{
                Publisher.findOne({_id:ID}).then((results) => {
                    var msg="";
                    const decodedBuffer = Buffer.from(results.password, 'hex');
                    const decodedPassword = decodedBuffer.toString('utf8');
                    if(status=="active"){
                        msg='<p>Hy '+results.name+'</p><p>You have been accepted as a publisher of Mangas World. You publisher account credentials are</p><p>Username: '+results.email+'</p><p>Password: '+decodedPassword+'</p><p>Use this credential to login to your publisher portal.';
                    }
                    else if(status=="inactive"){
                        msg='<p>Hy '+results.name+'</p>We appreciate your interest in Magas World. But you have not accepted as a Mangas World Publisher. As we need more publisher we contact with you<p>';
                    }
                    let mailOptions = {
                        from: 'Manga Support',
                        to: results.email,
                        subject: 'You have accepted as a Publisher of Mangas World!',
                        html: msg,
                      };
                      transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log('Error occurred:', error.message);
                            return process.exit(1);
                        }
                        console.log('Message sent successfully!');
                        transporter.close();
                    });
                  }).catch((err) => {
                      console.log(err);
                  });
                res.redirect(`http://admin.toonvortex.com/publisher-approval?status=${status}`);
                })
            .catch((err) => {
                console.error(err);
            });
  });
  module.exports = router;