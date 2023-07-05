var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {User}=require('../models/schemas');
var {API}=require('../models/schemas');

router.post('/',(req,res,next)=>{
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
    var mangaid=req.query.id;
    var manga=req.query.manga;
    var email=req.query.email;
    var comment=req.body.comment;
    var name=req.query.name;
    var image=req.query.image;
    const currentDate = new Date();
    console.log(email);
    User.findOne({emails:email}).then((result)=>{
      console.log(result);
        var data = {
            "mangaid":mangaid,
            "email": email,
            "name":name,
            "image":image,
            "comment":comment,
            "date":currentDate,
          };
          db.collection('comments').insertOne(data, (err, collection) => {
            if(err){
              console.log(err);
            }
            else{
                console.log("inserted");
              return res.redirect(`http://toonvortex.com/manga/manga-viewer?id=${mangaid}&mangaid=${manga}&comment=true`);
             }
          })
    })
  })
  module.exports = router;