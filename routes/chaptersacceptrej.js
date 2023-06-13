var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {db} = require('../mongodb/db.js');
var {Chapter}=require('../models/schemas');
var {Chapterapproval}=require('../models/schemas');
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
    var Status=req.query.status;
    var adminid=req.query.adminid;
    console.log(adminid);
    Chapterapproval.findOne({adminid:adminid,chapterid:ID}).then((result)=>{
        console.log(result);
        if(result!=null){
            res.redirect(`http://admin.toonvortex.com/manga-approval?approval=already`);
        }
        else{
            Chapter.findOne({_id:ID}).then((result)=>{
                console.log(result);
                if(parseInt(result.acceptcount)>=2 && parseInt(result.rejectcount)<parseInt(result.acceptcount)){
                    Chapter.updateOne({_id:ID},{
                        "status": "active",
                    }).exec()
                    .then((doc)=>{
                        var datas={
                            "adminid":adminid,
                            "chapterid":ID,
                        };
                        db.collection('chapterapprovals').insertOne(datas, (err, collection) => {
                            if(err){
                              console.log(err);
                            }
                            else{
                                console.log("inserted");
                                res.redirect(`http://admin.toonvortex.com/manga-approval?approval=${Status}`);
                             }
                          })
                        })
                    .catch((err) => {
                        console.error(err);
                    });
                }
                else if(parseInt(result.rejectcount)>=2 && parseInt(result.rejectcount)>parseInt(result.acceptcount)){
                    Chapter.updateOne({_id:ID},{
                        "status": "inactive",
                    }).exec()
                    .then((doc)=>{
                        var datas={
                            "adminid":adminid,
                            "chapterid":ID,
                        };
                        db.collection('chapterapprovals').insertOne(datas, (err, collection) => {
                            if(err){
                              console.log(err);
                            }
                            else{
                                console.log("inserted");
                                res.redirect(`http://admin.toonvortex.com/manga-approval?approval=${Status}`);
                             }
                          })
                        })
                    .catch((err) => {
                        console.error(err);
                    });
                }
                else{
                    if(Status=="active"){
                    Chapter.updateOne({_id:ID},{
                        "acceptcount": parseInt(result.acceptcount)+1,
                    }).exec()
                    .then((doc)=>{
                        var datas={
                            "adminid":adminid,
                            "chapterid":ID,
                        };
                        db.collection('chapterapprovals').insertOne(datas, (err, collection) => {
                            if(err){
                              console.log(err);
                            }
                            else{
                                console.log("inserted");
                                res.redirect(`http://admin.toonvortex.com/manga-approval?approval=${Status}`);
                             }
                          })
                        })
                    .catch((err) => {
                        console.error(err);
                    });
                    }
                    else{
                        Chapter.updateOne({_id:ID},{
                            "rejectcount": parseInt(result.rejectcount)+1,
                        }).exec()
                        .then((doc)=>{
                            var datas={
                                "adminid":adminid,
                                "chapterid":ID,
                            };
                            db.collection('chapterapprovals').insertOne(datas, (err, collection) => {
                                if(err){
                                  console.log(err);
                                }
                                else{
                                    console.log("inserted");
                                    res.redirect(`http://admin.toonvortex.com/manga-approval?approval=${Status}`);
                                 }
                              })
                            })
                        .catch((err) => {
                            console.error(err);
                        });
                    }
                }
            });
        }
    })
  });
  module.exports = router;