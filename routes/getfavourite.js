var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {Favourite}=require('../models/schemas');

router.get('/',(req,res,next)=>{
    var email=req.query.email;
    Favourite.find({email:email}).then((results) => {
        res.send(results);
      }).catch((err) => {
          console.log(err);
      });
  })
  module.exports = router;