const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'cosmosthehost@gmail.com',
        pass: 'fhkcxlhpgignetpt'
    }
});
module.exports={transporter}