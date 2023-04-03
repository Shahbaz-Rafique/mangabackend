var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {Mangas}=require('../models/schemas');

router.get('/',(req,res,next)=>{
    Mangas.find({}).then((results) => {
        res.send(results);
      }).catch((err) => {
          console.log(err);
      });
  })
  module.exports = router;