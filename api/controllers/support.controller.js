const mongoose = require("mongoose");
const SupportRequest = mongoose.model("SupportRequest");


module.exports.addRequest = function (req, res) {
    //Validating entries
    req.checkBody('title', 'Title is required.').notEmpty();
    req.checkBody('accountType', 'Account Type is required.').notEmpty();
    req.checkBody('registeredEmail', 'Registered Email is required.').notEmpty();
    req.checkBody('registeredEmail', 'Registered Email format is not correct.').isEmail();
    req.checkBody('contactEmail', 'Contact Email is required.').notEmpty();
    req.checkBody('contactEmail', 'Contact Email format is not correct.').isEmail();
    req.checkBody('description', 'Description is required.').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.status(500).json({
            error: errors,
            msg: null,
            data: null
        });
    } else {
        //remove white spaces
        req.body.registeredEmail = req.body.registeredEmail.trim();
        req.body.contactEmail = req.body.registeredEmail.trim();

        //protect creation date from injection
        delete req.body.createdAt;

        var newRequest = new SupportRequest(req.body);
        newRequest.save(function (err) {
            if (err)
                res.status(500).json({
                    error: errors,
                    msg: null,
                    data: null
                });
            else
                res.status(200).json({
                    error: null,
                    msg: 'Request was submitted successfully, you will be contacted soon by one of our tech support team members.',
                    data: null
                });
        });
    }
};
