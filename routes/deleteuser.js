var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {User}=require('../models/schemas');

router.get('/',(req,res,next)=>{
    var id = req.query.id;
    User.deleteOne({_id:id}).then((results) => {
        res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/view-users');
      }).catch((err) => {
          console.log(err);
      });
  })
  module.exports = router;