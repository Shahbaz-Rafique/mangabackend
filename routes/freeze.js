var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {db} = require('../mongodb/db.js');
var {User}=require('../models/schemas');
var {API}=require('../models/schemas');

router.get('/',(req,res,next)=>{
    const currentDates = new Date().toISOString().split('T')[0]
  API.findOne({})
  .exec()
  .then((api) => {
    if (api && api.dated == currentDates) {
      API.updateOne({}, { $inc: { last: 1, total: 1 } })
        .exec()
        .then((doc) => {
          console.log("added");
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      API.updateOne({}, { last: 0, $inc: { total: 1 }, dated: currentDates })
        .exec()
        .then((doc) => {
          console.log("added");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  })
  .catch((err) => {
    console.error(err);
  });
    var ID=req.query.id;
    var status=req.query.status;
    User.updateOne({_id:ID},{
        "status": status,
    }).exec()
            .then((doc)=>{
                res.redirect('http://staff.toonvortex.com/view-users');
                })
            .catch((err) => {
                console.error(err);
            });
  });
  module.exports = router;