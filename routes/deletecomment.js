var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {Comment}=require('../models/schemas');

router.get('/',(req,res,next)=>{
    var id = req.query.id;
    Comment.deleteOne({_id:id}).then((results) => {
        res.redirect('http://localhost:3000/manage-comments');
      }).catch((err) => {
          console.log(err);
      });
  })
  module.exports = router;