var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var { db } = require('../mongodb/db.js');
var { transporter } = require('../nodemailer/mailer');
var { User } = require('../models/schemas');
var {API}=require('../models/schemas');

router.get('/', (req, res, next) => {
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
    var email = req.query.email;
    let mailOptions = {
        from: 'Manga Support',
        to: email,
        subject: 'Congratulations! You account has been registered on Mangas World',
        html: `<p>Thank you for choosing to register with our platform! We are thrilled to have you join our community. Enjoy the best mangas reading on our platform. Thank you again for joining us, and we look forward to seeing you on our platform!</p><p>Best regards,</p><p>Manga World Team</p>`
    };
    User.findOne({ emails: email}).then((result) => {
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
                res.redirect(`http://toonvortex.com/error?type=verified`);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        else {
            res.redirect(`http://toonvortex.com/error?type=unverified`);
        }
    })
})
module.exports = router;