var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var { db } = require('../mongodb/db.js');
var { transporter } = require('../nodemailer/mailer');
var { User } = require('../models/schemas');

router.post('/', (req, res, next) => {
    var password = req.body.password;
    var email = req.query.email;
    let mailOptions = {
        from: 'Manga Support',
        to: email,
        subject: 'Congratulations! You account has been registered on Mangas World',
        html: `<p>Thank you for choosing to register with our platform! We are thrilled to have you join our community. Enjoy the best mangas reading on our platform. Thank you again for joining us, and we look forward to seeing you on our platform!</p><p>Best regards,</p><p>Manga World Team</p>`
    };
    User.findOne({ emails: email,verificationcode:password }).then((result) => {
        if (result) {
            User.updateOne({emails:email},{"emailverify":"verified"}).exec()
            .then((doc)=>{
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Error occurred:', error.message);
                    }
                    console.log('Message sent successfully!');
                    transporter.close();
                });
                res.redirect(`http://localhost:3000/login-home?email=${email}`);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        else {
            res.redirect(`http://localhost:3000/register/email-verification?verify=false&email=${email}`);
        }
    })
})
module.exports = router;