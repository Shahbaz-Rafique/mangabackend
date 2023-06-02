var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {Favourite}=require('../models/schemas');

router.get('/',(req,res,next)=>{
    var id = req.query.id;
    Favourite.deleteOne({_id:id}).then((results) => {
        res.redirect('http://toonvortex.com/favourite-list');
      }).catch((err) => {
          console.log(err);
      });
  })
  module.exports = router;