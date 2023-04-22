var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {Carousel}=require('../models/schemas');

router.get('/',(req,res,next)=>{
    Carousel.find({}).then((results) => {
        res.send(results);
      }).catch((err) => {
          console.log(err);
      });
  })
  module.exports = router;