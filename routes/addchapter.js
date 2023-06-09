var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {db} = require('../mongodb/db.js');
const multer = require("multer");
var {transporter}=require('../nodemailer/mailer');
var {API}=require('../models/schemas');

var storage=multer.diskStorage({
  destination:function(req,file,cb){
      cb(null,"./public/mangas/");
  },
  filename:function(req,file,cb){
      cb(null,Date.now()+file.originalname)
  }
})

var upload = multer({ storage });
var multipleupload = upload.fields([{ name: "chapterimage" }, { name: "chapterfile" }]);

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

    var id=req.query.id;
    var manga=req.body.name;
    var name=req.body.chaptername;
    var imagefile=req.files.chapterimage[0].filename;
    var chapterfile=req.files.chapterfile[0].filename;
    const currentDate = new Date();
    var data = {
      "mangaid":id,
      "manganame":manga,
      "chapterimage":imagefile,
      "chaptername":name,
      "chapterfile":chapterfile,
      "date":currentDate,
      "status":"inactive",
      "acceptcount":"0",
      "rejectcount":"0",
    };
    db.collection('chapters').insertOne(data, (err, collection) => {
      if(err){
        console.log(err);
      }
      else{
        console.log('inserted');
        let mailOptions1 = {
          from: 'Manga Support',
          to: "shahbazrafique101@gmail.com",
          subject: 'New Chapter was added',
          html: '<p>Hy admin! New chapter of '+manga+' has been added. Login to admin portal and approve or reject chapter.</p>',
        };
        transporter.sendMail(mailOptions1, (error, info) => {
          if (error) {
              console.log('Error occurred:', error.message);
              return process.exit(1);
          }
          console.log('Message sent successfully!');
          transporter.close();
      });
        return res.redirect(`http://publisher.toonvortex.com/manage-manga/add-chapters?id=${id}&manga=${manga}&add=true`);
       }
    })
  })
  module.exports = router;