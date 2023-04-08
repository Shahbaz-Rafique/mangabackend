var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {Mangas}=require('../models/schemas');

router.get('/',(req,res,next)=>{
    var id = req.query.id;
    Mangas.deleteOne({_id:id}).then((results) => {
        res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/manage-manga');
      }).catch((err) => {
          console.log(err);
      });
  })
  module.exports = router;