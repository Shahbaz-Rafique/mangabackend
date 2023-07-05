var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {Admin}=require('../models/schemas');
var {Publisher}=require('../models/schemas');
var {transporter}=require('../nodemailer/mailer');
const os = require('os');
const dns = require('dns');
var {API}=require('../models/schemas');
const networkInterfaces = os.networkInterfaces();
let ipAddress;

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
    var emails=req.body.emails;
    var passwords=req.body.passwords;
    const hashpass = crypto.createHash('sha256').update(passwords).digest('hex');
    const passwordBuffer = Buffer.from(passwords, 'utf8');
    const passwordHex = passwordBuffer.toString('hex');
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
            res.redirect(`http://admin.toonvortex.com/admin-home?email=${emails}&id=${results[0]._id}&img=${results[0].image}&role=SuperAdmin&name=${results[0].name}`);
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
          res.redirect('http://admin.toonvortex.com/?login=false')
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