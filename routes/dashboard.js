var express = require('express');
var router = express.Router();
var {db} = require('../mongodb/db.js');
var {Mangas}=require('../models/schemas');
var {Publisher}=require('../models/schemas');
var {User}=require('../models/schemas');
var {Chapter}=require('../models/schemas');

router.get('/',(req,res,next)=>{
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