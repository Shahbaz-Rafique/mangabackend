var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {db} = require('../mongodb/db.js');
const multer = require("multer");
var {Publisher}=require('../models/schemas');
var {API}=require('../models/schemas');
var {transporter}=require('../nodemailer/mailer');

var storage=multer.diskStorage({
  destination:function(req,file,cb){
      cb(null,"./public/uploads/");
  },
  filename:function(req,file,cb){
      cb(null,Date.now()+file.originalname)
  }
})

var upload = multer({ storage });
var multipleupload = upload.fields([{ name: "profile" }, { name: "example" }]);

function generateRandomPassword() {
    const length = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
    return password;
  }

router.post('/',multipleupload,(req,res,next)=>{
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
    var status=req.query.status;
    var name=req.body.name;
    var email=req.body.email;
    var address="";
    var city="";
    var id="";
    if(status=="active"){
      address=req.body.address;
      city=req.body.city;
      id=req.body.id;
    }
    var contact=req.body.contact;
    var facebook=req.body.facebook;
    var twitter=req.body.twitter;
    var instagram=req.body.insta;
    var role=req.query.role;
    var imagefile="";
    if(req.query.img=="file"){
      imagefile=req.files.profile[0].filename;
    }
    else{
      imagefile=req.query.img;
    }
    var examplefile=req.files.example[0].filename;
    var password=generateRandomPassword();
    const currentDate = new Date().toISOString().split('T')[0]
    const passwordBuffer = Buffer.from(password, 'utf8');
    const passwordHex = passwordBuffer.toString('hex');
    var data = {
      "profileimage":imagefile,
      "name": name,
      "email": email,
      "address":address,
      "city":city,
      "contact":contact,
      "publisherid":id,
      "password":passwordHex,
      "facebook":facebook,
      "twitter":twitter,
      "instagram":instagram,
      "registeredDate":currentDate,
      "updatedDate":currentDate,
      "workexample":examplefile,
      "Role":role,
      "status":status,
    };
    let mailOptions = {
      from: 'Manga Support',
      to: email,
      subject: `Registered as a ${role}!`,
      html: '<p>Hy '+name+'</p><p>you have been registered as a '+ role +' of Mangas World. You credentials are following</p><p>Username: '+email+'</p><p>Password: '+password+'</p><p>Use this login credential to open your mangas world '+ role +' account.',
    };
    db.collection('publishers').insertOne(data, (err, collection) => {
      if(err){
        console.log(err);
      }
      else{
        console.log('inserted');
        console.log(password);
        if(status=="active"){
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred:', error.message);
                return process.exit(1);
            }
            console.log('Message sent successfully!');
            transporter.close();
        });
          return res.redirect('http://admin.toonvortex.com/manage-publishers?add=true');
        }
        else if(status=="inactive"){
          let mailOptions2 = {
            from: 'Manga Support',
            to: email,
            subject: 'Publisher Application has been submitted!',
            html: '<p>Hy '+name+'</p><p>Your application to become a Publisher has been submitted. You will be notified shortly from the admin of the Mangas World. We appreciate your interest in Mangas world</p>',
          };
          transporter.sendMail(mailOptions2, (error, info) => {
            if (error) {
                console.log('Error occurred:', error.message);
                return process.exit(1);
            }
            console.log('Message sent successfully!');
            transporter.close();
        });
        let mailOptions1 = {
          from: 'Manga Support',
          to: "cosmosthehost@gmail.com",
          subject: 'Publisher application has been recieved',
          html: '<p>Hy admin! Publisher application has been recieved.</p><p>Email: '+email+'</p><p>Login to your admin portal and accept or reject the Publisher.</p>',
        };
        transporter.sendMail(mailOptions1, (error, info) => {
          if (error) {
              console.log('Error occurred:', error.message);
              return process.exit(1);
          }
          console.log('Message sent successfully!');
          transporter.close();
      });
          return res.redirect('http://toonvortex.com/about-us');
        }
       }
    })
  })
  module.exports = router;