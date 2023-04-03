const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'cosmosthehost@gmail.comm',
        pass: 'fhkcxlhpgignetpt'
    }
});
module.exports={transporter}