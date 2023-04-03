var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {Publisher}=require('../models/schemas');

router.get('/',(req,res,next)=>{
    var id = req.query.id;
    Publisher.deleteOne({_id:id}).then((results) => {
        res.redirect('http://localhost:3000/view-publishers');
      }).catch((err) => {
          console.log(err);
      });
  })
  module.exports = router;