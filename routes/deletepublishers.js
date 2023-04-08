var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {Publisher}=require('../models/schemas');

router.get('/',(req,res,next)=>{
    var id = req.query.id;
    Publisher.deleteOne({_id:id}).then((results) => {
        res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/view-publishers');
      }).catch((err) => {
          console.log(err);
      });
  })
  module.exports = router;