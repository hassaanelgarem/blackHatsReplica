const nodemailer = require('nodemailer');


// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'blackhatsguc@gmail.com',
        pass: 'youmwarayoum'
    }
});


/*
  Function that takes text, subject and email and sends an email.
*/
module.exports.sendEmail = function (subject, businessEmail, text, done) {
    var mailOptions = {
        from: '"Black Hats Team" <blackhatsguc@gmail.com>', // sender address
        to: businessEmail, // list of receivers
        subject: subject, // Subject line
        text: text
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            done(error, null);
        } else
            done(null, info);
    });
};