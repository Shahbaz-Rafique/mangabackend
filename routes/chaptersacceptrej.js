var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {db} = require('../mongodb/db.js');
var {Chapter}=require('../models/schemas');

router.get('/',(req,res,next)=>{
    var ID=req.query.id;
    var Status=req.query.status;
    Chapter.updateOne({_id:ID},{
        "status": Status,
    }).exec()
    .then((doc)=>{
        res.redirect(`http://localhost:3000/manga-approval?approval=${Status}`);
        })
    .catch((err) => {
        console.error(err);
    });
  });
  module.exports = router;