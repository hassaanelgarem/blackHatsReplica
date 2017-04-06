const mongoose = require("mongoose");
const Business = mongoose.model("Business");
const emailSender = require('../config/emailSender');


/* Put function that verifies the business
Calling Route: /api/admin/verify/:businessId */
module.exports.verifyBusiness = function (req, res) {
    //Getting the business by its id
    Business.findById(req.params.businessId, function (err, business) {
        if (err)
            res.json(err);
        else {
            if (business) {
                //if business is already verified
                if (business.verified)
                    return res.json({
                        error: "Business is already verified."
                    });

                // else verifying the business
                business.verified = true;
                // updating the db
                business.save(function (err) {
                    if (err) res.json({
                        success: false,
                        msg: 'Was not able to verify business'
                    });
                    else {
                        var text = 'Hello ' + business.name + ',\n\nYour account has been verified.\n\nWelcome to Black Hats.';
                        var subject = 'Account Verified';
                        emailSender.sendEmail(subject, business.email, text, function (err, info) {
                            if (err) res.json({
                                success: false,
                                error: err,
                                msg: 'Business was not notified of verification.'
                            });
                            else
                                res.json({
                                    success: true,
                                    msg: 'Business is verified and notified.'
                                });
                        });
                    }
                });
            } else
                res.json({
                    error: "Business not found."
                })
        }
    });
};


/* Delete function that deletes a business wether he was approved or not
Calling Route: /api/admin/delete/:businessId */
module.exports.deleteBusiness = function (req, res) {
    // delete declined busiess
    Business.findByIdAndRemove(req.params.businessId, function (err, business) {
        if (err) {
            res.json({
                success: false,
                msg: "Error deleting business",
                err
            });
        } else {
            if (business) {
                if (business.verified) {
                    var text = 'Hello ' + business.name + ',\n\nUnfortunately, your application was suspended for not meeting our terms and conditions.\n\nThank you for considering Black Hats.';
                    var subject = 'Account Suspended';
                } else {
                    var text = 'Hello ' + business.name + ',\n\nUnfortunately, your application was rejected.\n\nThank you for considering Black Hats.';
                    var subject = 'Account Rejected';
                }
                emailSender.sendEmail(subject, business.email, text, function (err, info) {
                    if (err) {
                        res.json({
                            success: false,
                            error: err,
                            msg: 'Business was not notified of rejection'
                        });
                    } else {
                        res.json({
                            success: true,
                            msg: 'Business deleted and notified'
                        });
                    }
                });
            } else
                res.json({
                    error: "Business not found."
                });
        }
    });
};
