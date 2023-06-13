var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {Mangas}=require('../models/schemas');
var {Publisher}=require('../models/schemas');
var {User}=require('../models/schemas');
var {Chapter}=require('../models/schemas');
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
    try {
        async function myFunction() {
        const mangas = await Mangas.countDocuments();
        const Apublisher = await Publisher.countDocuments({status:"active"});
        const Rpublisher = await Publisher.countDocuments({status:{ $in: ['inactive', 'reject'] }});
        const user = await User.countDocuments({});
        const Achapter = await Chapter.countDocuments({status:"active"});
        const Rchapter = await Chapter.countDocuments({status:{ $in: ['inactive', 'reject'] }});
        res.status(200).json({ mangas,Apublisher,user,Rpublisher,Achapter,Rchapter });
          }   
          myFunction();
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
      }
  })
  module.exports = router;