var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var {Admin}=require('../models/schemas');

router.post('/',(req,res,next)=>{
    var id=req.query.id;
    const hashpass = crypto.createHash('sha256').update(req.body.cpwd).digest('hex');
    const hashnewpwd = crypto.createHash('sha256').update(req.body.cnpwd).digest('hex');
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
})
module.exports = router;