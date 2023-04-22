var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {Admin}=require('../models/schemas');
var {Publisher}=require('../models/schemas');

router.post('/',(req,res,next)=>{
    var id=req.query.id;
    const hashpass = crypto.createHash('sha256').update(req.body.cpwd).digest('hex');
    const hashnewpwd = crypto.createHash('sha256').update(req.body.cnpwd).digest('hex');
    var role=req.query.role;
    if(role=="SuperAdmin"){
    Admin.findOne({_id:id,password:hashpass}).then((result)=>{
        if(result){
            Admin.updateOne({_id:id},{"password":hashnewpwd}).exec()
            .then((doc)=>{
                res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/credentials?changed=true');
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        else{
            res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/credentials?changed=false');
        }
    })
    }
    else if(role=="Admin"){
        const passwordBuffer = Buffer.from(req.body.cpwd, 'utf8');
        const passwordHex = passwordBuffer.toString('hex');
        const passwordBuffer1 = Buffer.from(req.body.cnpwd, 'utf8');
        const passwordHex1 = passwordBuffer1.toString('hex');
    Publisher.findOne({_id:id,password:passwordHex}).then((result)=>{
        if(result){
            Publisher.updateOne({_id:id},{"password":passwordHex1}).exec()
            .then((doc)=>{
                res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/credentials?changed=true');
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        else{
            res.redirect('http://admin.toonvortex.com.s3-website-us-east-1.amazonaws.com/credentials?changed=false');
        }
    })
    }
    
});
module.exports = router;