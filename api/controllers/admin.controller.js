const mongoose = require("mongoose");
const randtoken = require('rand-token');
const bcrypt = require('bcryptjs');
const Business = mongoose.model("Business");
const User = mongoose.model("User");
const TempUser = mongoose.model("TempUser");
const SupportRequest = mongoose.model("SupportRequest");
const emailSender = require('../config/emailSender');


/*
    Put Function, to verify a business and notifies him.
    Takes:
        params{
            businessId
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling Route: '/api/admin/business/verify/:businessId'
*/
module.exports.verifyBusiness = function (req, res) {

    //Getting the business by its id
    Business.findById(req.params.businessId, function (err, business) {
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        else {
            if (business) {
                //if business is already verified
                if (business.verified)
                    return res.status(500).json({
                        error: null,
                        msg: 'Business is already verified.',
                        data: null
                    });

                // else verifying the business
                business.verified = true;
                // updating the db
                business.save(function (err) {
                    if (err)
                        res.status(500).json({
                            error: null,
                            msg: 'Business verification failed.',
                            data: null
                        });
                    else {
                        var text = 'Hello ' + business.name + ',\n\nYour account has been verified.\n\nWelcome to Black Hats.';
                        var subject = 'Account Verified';
                        emailSender.sendEmail(subject, business.email, text, null, function (err, info) {
                            if (err)
                                res.status(500).json({
                                    error: err,
                                    msg: 'Business was verified successfully, however, he was not notified with verification.',
                                    data: null
                                });
                            else
                                res.status(201).json({
                                    error: null,
                                    msg: 'Business was verified and notified successfully.',
                                    data: null
                                });
                        });
                    }
                });
            } else
                res.status(404).json({
                    error: null,
                    msg: 'Business not found.',
                    data: null
                });
        }
    });
};


/*
    Delete function that deletes a business wether he was approved or not and notifies him.
    Takes:
        params{
            businessId
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling Route: '/api/admin/business/delete/:businessId'
*/
module.exports.deleteBusiness = function (req, res) {

    Business.findByIdAndRemove(req.params.businessId, function (err, business) {
        if (err) {
            res.status(500).json({
                error: err,
                msg: null,
                data: null
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
                emailSender.sendEmail(subject, business.email, text, null, function (err, info) {
                    if (err) {
                        res.status(500).json({
                            error: null,
                            msg: 'Business was deleted, however the business was not notified.',
                            data: null
                        });
                    } else {
                        res.status(200).json({
                            error: null,
                            msg: 'Business was deleted and notified.',
                            data: null
                        });
                    }
                });
            } else
                res.status(404).json({
                    error: null,
                    msg: 'Business not found.',
                    data: null
                });
        }
    });
};


/*
    Put function that makes a user an admin.
    Takes:
        params{
            userId
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling Route: '/api/admin/makeAdmin/:userId'
*/
module.exports.makeAdmin = function (req, res) {
    var userId = req.params.userId;

    User.findById(userId, function (err, user) {
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        else {
            if (user) {
                if (user.admin)
                    res.status(500).json({
                        error: null,
                        msg: 'User is already an admin.',
                        data: null
                    });
                else {
                    user.admin = true;
                    user.save(function (err) {
                        if (err)
                            res.status(500).json({
                                error: err,
                                msg: 'Admin adding failed.',
                                data: null
                            });
                        else
                            res.status(201).json({
                                error: null,
                                msg: 'Admin was added successfully',
                                data: null
                            });
                    });
                }
            } else
                res.status(404).json({
                    error: null,
                    msg: 'User not found.',
                    data: null
                });
        }
    });
};


/*
    Put function that deletes an admin.
    Takes:
        params{
            userId
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling Route: '/api/admin/removeAdmin/:userId'
*/
module.exports.removeAdmin = function (req, res) {
    var userId = req.params.userId;

    User.findById(userId, function (err, user) {
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        else {
            if (user) {
                if (!user.admin)
                    res.status(500).json({
                        error: null,
                        msg: 'User is not an admin.',
                        data: null
                    });
                else {
                    user.admin = false;
                    user.save(function (err) {
                        if (err)
                            res.status(500).json({
                                error: err,
                                msg: 'Removing admin failed.',
                                data: null
                            });
                        else
                            res.status(201).json({
                                error: null,
                                msg: 'Admin was removed successfully',
                                data: null
                            });
                    });
                }
            } else
                res.status(404).json({
                    error: null,
                    msg: 'User not found.',
                    data: null
                });
        }
    });
};


/*
    Delete function that deletes a user and notifies him of suspending the account.
    Takes:
        params{
            userId
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling Route: '/api/admin/user/delete/:userId'
*/
module.exports.deleteUser = function (req, res) {
    User.findById(req.params.userId, function (err, user) {
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        else {
            if (user) {
                var email = user.email;
                var username = user.firstName;
                user.remove(function (err) {
                    if (err)
                        res.status(500).json({
                            error: err,
                            msg: null,
                            data: null
                        });
                    else {
                        var text = 'Hello ' + username + ',\n\nUnfortunately, your account was suspended for not meeting our terms and conditions.\n\nThank you for considering Black Hats.';
                        var subject = 'Account Suspended';

                        emailSender.sendEmail(subject, email, text, null, function (err, info) {
                            if (err) {
                                res.status(500).json({
                                    error: null,
                                    msg: 'User was deleted, however the user was not notified.',
                                    data: null
                                });
                            } else {
                                res.status(200).json({
                                    error: null,
                                    msg: 'User was deleted and notified.',
                                    data: null
                                });
                            }
                        });
                    }
                });
            } else
                res.status(404).json({
                    error: null,
                    msg: 'User not found.',
                    data: null
                });
        }
    });
};


module.exports.deleteTempUser = function (req, res) {
    TempUser.findById(req.params.userId, function (err, user) {
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        else {
            if (user) {
                var email = user.email;
                var username = user.firstName;
                user.remove(function (err) {
                    if (err)
                        res.status(500).json({
                            error: err,
                            msg: null,
                            data: null
                        });
                    else {
                        var text = 'Hello ' + username + ',\n\nUnfortunately, your account was suspended for not meeting our terms and conditions.\n\nThank you for considering Black Hats.';
                        var subject = 'Account Suspended';

                        emailSender.sendEmail(subject, email, text, null, function (err, info) {
                            if (err) {
                                res.status(500).json({
                                    error: null,
                                    msg: 'User was deleted, however the user was not notified.',
                                    data: null
                                });
                            } else {
                                res.status(200).json({
                                    error: null,
                                    msg: 'User was deleted and notified.',
                                    data: null
                                });
                            }
                        });
                    }
                });
            } else
                res.status(404).json({
                    error: null,
                    msg: 'User not found.',
                    data: null
                });
        }
    });
};


/*
    Put function that resets the business password to a temp password so he
    can access his account and change it later after reviewing his request by
    the admin and notifies him.
    Takes:
        params{
            requestId
        }
    Returns: In case of Success, returns the generated password to admin and a
    success message, or in case of failure, a failure message along with errors.
    Redirects to: Nothing.
    Calling Route: '/api/admin/support/business/recoverAccount/:requestId'
*/
module.exports.recoverBusiness = function (req, res) {
    SupportRequest.findById(req.params.requestId, function (err, request) {
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        else {
            if (request) {
                Business.findOne({
                    email: request.registeredEmail
                }, function (err, business) {
                    if (err)
                        res.status(500).json({
                            error: err,
                            msg: null,
                            data: null
                        });
                    else {
                        if (business) {
                            var password = randtoken.generate(8);
                            bcrypt.genSalt(10, function (err, salt) {
                                bcrypt.hash(password, salt, function (err, hash) {
                                    business.password = hash;
                                    business.save(function (err) {
                                        if (err)
                                            res.status(500).json({
                                                error: err,
                                                msg: null,
                                                data: null
                                            });
                                        else {
                                            var text = 'Hello ' + business.name + ', \n\n The password to your account was reset to a temporary password to give you access to it, Please change the password once you login successfully to your account.\n\nTemporary Password: ' + password + '\n\n If you still have issues, feel free to submit another support request.\n\nRegards,\nBlack Hats Support Team';
                                            var subject = 'Support Request Feedback';
                                            emailSender.sendEmail(subject, request.contactEmail, text, null, function (err, info) {
                                                if (err)
                                                    res.status(500).json({
                                                        error: err,
                                                        msg: 'Business password was reset, however, the business was not notified of the new temp password.',
                                                        data: null
                                                    });
                                                else {
                                                    request.remove();
                                                    res.status(201).json({
                                                        error: null,
                                                        msg: 'Request was resolved and business was notified.',
                                                        data: null
                                                    });
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        } else {
                            res.status(404).json({
                                error: null,
                                msg: 'Business not found.',
                                data: null
                            });
                        }
                    }
                });
            } else
                res.status(404).json({
                    error: null,
                    msg: 'Request not found.',
                    data: null
                });
        }
    });
};


/*
    Put function that resolves a request , resets the user password to a temp password so he
    can access his account and change it later after reviewing his request by
    the admin and notifies him.
    Takes:
        params{
            requestId
        }
    Returns: In case of Success, returns the generated password to admin and a
    success message, or in case of failure, a failure message along with errors.
    Redirects to: Nothing.
    Calling Route: '/api/admin/support/user/recoverAccount/:requestId'
*/
module.exports.recoverUser = function (req, res) {
    SupportRequest.findById(req.params.requestId, function (err, request) {
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        else {
            if (request) {
                User.findOne({
                    email: request.registeredEmail
                }, function (err, user) {
                    if (err)
                        res.status(500).json({
                            error: err,
                            msg: null,
                            data: null
                        });
                    else {
                        if (user) {
                            var password = randtoken.generate(8);
                            bcrypt.genSalt(10, function (err, salt) {
                                bcrypt.hash(password, salt, function (err, hash) {
                                    user.password = hash;
                                    user.save(function (err) {
                                        if (err)
                                            res.status(500).json({
                                                error: err,
                                                msg: null,
                                                data: null
                                            });
                                        else {
                                            var text = 'Hello ' + user.firstName + ', \n\n The password to your account was reset to a temporary password to give you access to it, Please change the password once you login successfully to your account.\n\nTemporary Password: ' + password + '\n\n If you still have issues, feel free to submit another support request.\n\nRegards,\nBlack Hats Support Team';
                                            var subject = 'Support Request Feedback';
                                            emailSender.sendEmail(subject, request.contactEmail, text, null, function (err, info) {
                                                if (err)
                                                    res.status(500).json({
                                                        error: err,
                                                        msg: 'User password was reset, however, the user was not notified of the new temp password.',
                                                        data: null
                                                    });
                                                else {
                                                    request.remove();
                                                    res.status(201).json({
                                                        error: null,
                                                        msg: 'Request was resolved and user was notified.',
                                                        data: null
                                                    });
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        } else {
                            res.status(404).json({
                                error: null,
                                msg: 'User not found.',
                                data: null
                            });
                        }
                    }
                });
            } else
                res.status(404).json({
                    error: null,
                    msg: 'Request not found.',
                    data: null
                });
        }
    });
};


/*
    Delete function, that deletes a request without resolving it if the request didn't match conditions.
    Takes:
        params{
            requestId
        }
    Returns: Success, or a failure message along with errors.
    Redirects to: Nothing.
    Calling Route: '/api/admin/support/deleteRequest/:requestId'
*/
module.exports.deleteSupportRequest = function (req, res) {
    SupportRequest.findByIdAndRemove(req.params.requestId, function (err, request) {
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        else {
            if (request)
                res.status(200).json({
                    error: null,
                    msg: 'Request was deleted successfully.',
                    data: null
                });
            else
                res.status(404).json({
                    error: null,
                    msg: 'Request not found.',
                    data: null
                });
        }
    });
};


/*
    Get function that returns all unverified businesses based on the value of the attribute verified
    Takes: Nothing
    Returns: Success and a list of unverifiedBusinesses or failure message along with the error if any
    Redirects to: Nothing.
    Calling Route: '/api/admin/business/unVerifiedBusinesses'
*/
module.exports.unVerifiedBusinesses = function (req, res) {
    const query = Business.find({
        verified: false
    });
    query.select('-password').exec(function (err, businesses) {
        if (err) res.status(500).json({
            "error": err,
            "msg": "Can not retrieve unverified businesses.",
            "data": null
        });
        else
            res.status(200).json({
                "error": null,
                "msg": "Got unverified businesses successfully",
                "data": businesses
            });
    });
};


/*
    POST function that adds a new advertisement slot
    and saves it in the database.
    Takes:
        Body: {
            name: "the name of this adv slot according to it's position"
            price: "the booking price of the adv slot"
            length: "the length of the adv slot"
            width: "the width of the adv slot"
            advSchedule: "an array of adv bookings that will be displayed on this adv slot"
        }
    Returns: {
        error: "Error object if any",
        msg: "A success or failure message"
    }
    Redirects to: Nothing.
    Calling route: '/api/admin/advertisement/addAdvSlots'
*/
module.exports.addAdvSlots = function (req, res) {

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('price', 'Price is required').notEmpty();
    req.checkBody('length', 'Length is required').notEmpty();
    req.checkBody('width', 'Width is required').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        res.status(500).json({
            error: errors,
            msg: "Incomplete Input",
            data: null
        });
    } else {
        //  creates a new advertisement slot using values from the POST request
        const newAdvSlot = new AdvSlot({
            name: req.body.name,
            price: req.body.price,
            length: req.body.length,
            width: req.body.width,
            advSchedule: []
        });
        //  saves the new advertisement slot in the database
        newAdvSlot.save(function (err, newSlot) {
            //  If there is an error return it in response
            if (err) return res.status(500).json({
                error: err,
                msg: "Error Adding the Advertisement Slot",
                data: null
            });
            //  returns a success message
            res.status(200).json({
                error: null,
                msg: "Advertisement Slot Added Successfully",
                data: null
            });
        })
    }
}


module.exports.getUsers = function (req, res) {
    User.find({}).select('-password').exec(function (err, users) {
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        else {
            res.status(200).json({
                error: null,
                msg: null,
                data: users
            });
        }
    });
};


module.exports.getUnverifiedUsers = function (req, res) {
    TempUser.find({}).select('-password').exec(function (err, tempUsers) {
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        else {
            res.status(200).json({
                error: null,
                msg: null,
                data: tempUsers
            });
        }
    });
};


module.exports.getNonAdmins = function (req, res) {
    User.find({
        admin: false
    }).select('-password').exec(function (err, users) {
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        else
            res.status(200).json({
                error: null,
                msg: null,
                data: users
            });
    })
};


module.exports.getAdmins = function (req, res) {
    User.find({
        admin: true
    }).select('-password').exec(function (err, users) {
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        else
            res.status(200).json({
                error: null,
                msg: null,
                data: users
            });
    })
};


module.exports.getBusinesses = function(req, res) {
    Business.find({
        verified: true
    }).select('-password').exec(function (err, businesses) {
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        else
            res.status(200).json({
                error: null,
                msg: null,
                data: businesses
            });
    });
};


module.exports.getRequests = function(req, res){
    SupportRequest.find({}).exec(function(err, requests){
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        else
            res.status(200).json({
                error: null,
                msg: null,
                data: requests
            });
    });
};
