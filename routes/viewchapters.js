var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {Chapter}=require('../models/schemas');

router.get('/',(req,res,next)=>{
    var id=req.query.id;
    Chapter.find({mangaid:id}).then((results) => {
        res.send(results);
      }).catch((err) => {
          console.log(err);
      });
  })
  module.exports = router;