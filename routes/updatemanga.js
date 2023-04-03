var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {db} = require('../mongodb/db.js');
const multer = require("multer");
var {Mangas}=require('../models/schemas');

var storage=multer.diskStorage({
  destination:function(req,file,cb){
      cb(null,"./public/uploads/");
  },
  filename:function(req,file,cb){
      cb(null,Date.now()+file.originalname)
  }
})

var upload = multer({ storage });


router.post('/',upload.single("manga"),(req,res,next)=>{
    var ID=req.query.id;
    var name=req.body.name;
    var author=req.body.author;
    var artist=req.body.artist;
    var generes=req.body.generes;
    var summary=req.body.summary;
    if(req.file){
        const fileName = req.file.filename;
        Mangas.updateOne({_id:ID},{
            "name": name,
            "author": author,
            "artist":artist,
            "generes":generes,
            "summary":summary,
            "mangaimage":fileName,
        }).exec()
                .then((doc)=>{
                    res.redirect('http://localhost:3000/manage-manga');
                    })
                .catch((err) => {
                    console.error(err);
                });
    }
    else{
        console.log('else');
        Mangas.updateOne({_id:ID},{
            "name": name,
            "author": author,
            "artist":artist,
            "generes":generes,
            "summary":summary,
        }).exec()
                .then((doc)=>{
                    res.redirect('http://localhost:3000/manage-manga');
                    })
                .catch((err) => {
                    console.error(err);
                });
    }
  });
  module.exports = router;