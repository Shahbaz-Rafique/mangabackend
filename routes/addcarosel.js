var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
const multer = require("multer");
var {Carousel}=require('../models/schemas');

var storage=multer.diskStorage({
  destination:function(req,file,cb){
      cb(null,"./public/mangas/");
  },
  filename:function(req,file,cb){
      cb(null,Date.now()+file.originalname)
  }
})

var upload = multer({ storage });
var multipleupload = upload.fields([{ name: "image1" }, { name: "image2" },{ name: "image3" }]);

router.post('/',multipleupload,(req,res,next)=>{
    var image1=req.files.image1[0].filename;
    var image2=req.files.image2[0].filename;
    var image3=req.files.image3[0].filename;
    Carousel.updateMany({},{
      "Image1":image1,
      "Image2":image2,
      "Image3":image3,
  }).exec()
          .then((doc)=>{
            console.log('inserted');
            return res.redirect(`http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/add-carousel?add=true`);
              })
          .catch((err) => {
              console.error(err);
          });
  })

  module.exports = router;