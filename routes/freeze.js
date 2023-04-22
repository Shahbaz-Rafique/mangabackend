var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {db} = require('../mongodb/db.js');
var {User}=require('../models/schemas');

router.get('/',(req,res,next)=>{
    var ID=req.query.id;
    var status=req.query.status;
    User.updateOne({_id:ID},{
        "status": status,
    }).exec()
            .then((doc)=>{
                res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/view-users');
                })
            .catch((err) => {
                console.error(err);
            });
  });
  module.exports = router;