var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
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
    var email=req.query.email;
    var id=req.query.id;
    var mangaid=req.query.mangaid;
    var data = {
      "email":email,
      "manga": id,
    };
    db.collection('favourites').insertOne(data, (err, collection) => {
      if(err){
        console.log(err);
      }
      else{
        return res.redirect(`http://toonvortex.com/favourite-list`);
       }
    })
  })
  module.exports = router;