var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
const multer = require("multer");
var {Carousel}=require('../models/schemas');
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
var multipleupload = upload.fields([{ name: "image1" }, { name: "image2" },{ name: "image3" }]);

router.post('/', multipleupload, async (req, res, next) => {
  // API Usage
  const currentDate = new Date().toISOString().split('T')[0]
  API.findOne({})
  .exec()
  .then((api) => {
    if (api && api.dated == currentDate) {
      API.updateOne({}, { $inc: { last: 1, total: 1 } })
        .exec()
        .then((doc) => {
          console.log("added");
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      API.updateOne({}, { last: 0, $inc: { total: 1 }, dated: currentDate })
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

  var image1 = req.files.image1 ? req.files.image1[0].filename : null;
  var image2 = req.files.image2 ? req.files.image2[0].filename : null;
  var image3 = req.files.image3 ? req.files.image3[0].filename : null;

  try {
    let carousel = await Carousel.findOne({});

    if (!carousel) {
      // Create a new Carousel document if it doesn't exist
      carousel = new Carousel({
        Image1: image1,
        Image2: image2,
        Image3: image3,
      });
    } else {
      // Update the images if they are uploaded
      if (image1) carousel.Image1 = image1;
      if (image2) carousel.Image2 = image2;
      if (image3) carousel.Image3 = image3;
    }

    await carousel.save();

    console.log('Inserted');
    return res.redirect(
      'http://admin.toonvortex.com/add-carousel?add=true'
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error occurred');
  }
});



  module.exports = router;