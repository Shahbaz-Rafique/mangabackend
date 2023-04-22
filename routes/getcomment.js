var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {Comment}=require('../models/schemas');

router.get('/',(req,res,next)=>{
    Comment.find({}).then((results) => {
        res.send(results);
      }).catch((err) => {
          console.log(err);
      });
  })
  module.exports = router;