var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {Publisher}=require('../models/schemas');

router.post('/',(req,res,next)=>{
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
                    res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/moderator-password?changed=true');
                }
                else{
                    res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/publisher-credentials?changed=true');
                }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        else{
            if(role=="moderator"){
                res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/moderator-password?changed=false');
            }
            else{
                res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/publisher-credentials?changed=false');
            }
        }
    })
})
module.exports = router;