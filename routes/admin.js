var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {Admin}=require('../models/schemas');
var {Publisher}=require('../models/schemas');
var {transporter}=require('../nodemailer/mailer');
const os = require('os');
const dns = require('dns');
const networkInterfaces = os.networkInterfaces();
let ipAddress;

router.post('/',(req,res,next)=>{
    var emails=req.body.emails;
    var passwords=req.body.passwords;
    console.log(emails,passwords);
    const hashpass = crypto.createHash('sha256').update(passwords).digest('hex');
    IPAddress();

    let mailOptions = {
      from: 'Manga Support',
      to: 'Cosmosthehost@gmail.com',
      subject: 'Login noted to admin portal of manga website',
      text: 'Hy Admin! A login was noticed to your admin portal from IP Address '+ipAddress+' and Device Name '+os.hostname()+' If its not you then Kindly changed your password of Admin Portal'
    };

    Admin.find({email:emails,password:hashpass}).then((results) => {
        if(results.length==1){
            if(results[0].role=="superAdmin"){
            res.redirect(`http://admin.literarylandmark.com/admin-home?email=${emails}&id=${results[0]._id}&img=${results[0].image}`);
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  console.log('Error occurred:', error.message);
                  return process.exit(1);
              }
              console.log('Message sent successfully!');
              transporter.close();
          });
            }
        }
        else if(results.length==0){
          Publisher.find({email:emails,password:hashpass}).then((results) => {
            if(results.length==1){
                res.redirect(`http://admin.literarylandmark.com/publisher-home?email=${emails}&img=${results[0].profileimage}&id=${results[0]._id}`);
            }
            else if(results.length==0){
                res.redirect('http://admin.literarylandmark.com/?login=false')
            }
          }).catch((err) => {
            console.log(err);
          });
        }
      }).catch((err) => {
        console.log(err);
      });
  })

  function IPAddress(){
    Object.keys(networkInterfaces).forEach(interfaceName => {
      const networkInterface = networkInterfaces[interfaceName];
      networkInterface.forEach(interfaceDetails => {
        if (interfaceDetails.family === 'IPv4' && !interfaceDetails.internal) {
          ipAddress = interfaceDetails.address;
        }
      });
    });
    
    dns.lookup(os.hostname(), (error, address) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(`Device name: ${os.hostname()}`);
      console.log(`IP address: ${ipAddress}`);
    });
  }

  module.exports = router;