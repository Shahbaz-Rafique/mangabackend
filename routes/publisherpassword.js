var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {Publisher}=require('../models/schemas');
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
    var id=req.query.id;
    var role=req.query.role;
    const passwordBuffer = Buffer.from(req.body.cpwd, 'utf8');
    const passwordHex = passwordBuffer.toString('hex');
    const passwordBuffers = Buffer.from(req.body.cnpwd, 'utf8');
    const passwordHexs = passwordBuffers.toString('hex');
    Publisher.findOne({_id:id,password:passwordHex}).then((result)=>{
        if(result){
            Publisher.updateOne({_id:id},{"password":passwordHexs}).exec()
            .then((doc)=>{
                if(role=="moderator"){
                    res.redirect('http://publisher.toonvortex.com/moderator-password?changed=true');
                }
                else{
                    res.redirect('http://publisher.toonvortex.com/publisher-credentials?changed=true');
                }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        else{
            if(role=="moderator"){
                res.redirect('http://publisher.toonvortex.com/moderator-password?changed=false');
            }
            else{
                res.redirect('http://publisher.toonvortex.com/publisher-credentials?changed=false');
            }
        }
    })
})
module.exports = router;