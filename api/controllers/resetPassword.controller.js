const mongoose = require("mongoose");
const randtoken = require('rand-token');
const emailSender = require('../config/emailSender');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const Business = mongoose.model('Business');


//Helper function for forgotPassword
var forgotPasswordHelper = function (doc, callback) {
    //generate the token and assign it, expires in 24 hours
    var token = randtoken.generate(48);
    doc.resetPasswordToken = token;
    doc.resetPasswordTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
    doc.save(function (err) {
        if (err) {
            callback(err, false);
        } else {
            //send the email
            //TO-Do replace the link in email to the frontend route not server route
            var subject = "Password Reset";
            var html = "<p>A reset password request has been made, please reset the password to your account by clicking this <a href=\"http://localhost:8080/api/resetPassword/" + token + "\">Link</a>.<br>If you are unable to do so, copy and paste the following link into your browser:<br><br>http://localhost:8080/api/resetPassword/" + token + "<br><br>If you did not do the request then ignore this email and your password will remain unchanged.</p>";
            emailSender.sendEmail(subject, doc.email, "", html, function (err, info) {
                if (err) {
                    callback(null, false);
                } else {
                    callback(null, true);
                }
            });
        }
    });
};


/*  
    Post Function, to send an email to the account with a link to reset his password.
    Takes:
        body{  
            email 
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.    
    Calling Route: '/api/forgotPassword'
*/
module.exports.forgotPassword = function (req, res) {
    var email = req.body.email;
    //validate email
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Enter a valid Email.').isEmail();

    var errors = req.validationErrors();

    if (errors) {
        res.status(500).json({
            error: errors,
            msg: null,
            data: null
        });
    } else {
        //check if it is a user that made the request
        User.findOne({
            email: email
        }, function (err, user) {
            if (err) {
                res.status(500).json({
                    error: err,
                    msg: null,
                    data: null
                });
            } else {
                if (user) {
                    //assign a token to the user and send the email.
                    forgotPasswordHelper(user, function (err, emailSent) {
                        if (err) {
                            res.status(500).json({
                                error: err,
                                msg: null,
                                data: null
                            });
                        } else {
                            if (emailSent) {
                                res.status(200).json({
                                    error: null,
                                    msg: "An Email was sent successfully to " + email + ", check your inbox!",
                                    data: null
                                });
                            } else {
                                res.status(500).json({
                                    error: null,
                                    msg: 'Password reset was not successful, please try again.',
                                    data: null
                                });
                            }
                        }
                    });
                } else {
                    //check if it is a business that made the request
                    Business.findOne({
                        email: email,
                    }, function (err, business) {
                        if (err) {
                            res.status(500).json({
                                error: err,
                                msg: null,
                                data: null
                            });
                        } else {
                            if (business) {
                                //assign a token to the business and send the email.
                                forgotPasswordHelper(business, function (err, emailSent) {
                                    if (err) {
                                        res.status(500).json({
                                            error: err,
                                            msg: null,
                                            data: null
                                        });
                                    } else {
                                        if (emailSent) {
                                            res.status(200).json({
                                                error: null,
                                                msg: "An Email was sent successfully to " + email + ", check your inbox!",
                                                data: null
                                            });
                                        } else {
                                            res.status(500).json({
                                                error: null,
                                                msg: 'Password reset was not successful, please try again.',
                                                data: null
                                            });
                                        }
                                    }
                                });
                            } else {
                                res.status(404).json({
                                    error: null,
                                    msg: "Email is not associated with any existing account, please note that you cannot reset the password of an unverified account.",
                                    data: null
                                });
                            }
                        }
                    });
                }
            }
        });
    }
};


/*  
    Get Function, to check the validity of the token in the password reset request.
    Takes:
        params{  
            token: verification token sent to the user 
        }
    Returns: in case of Success, the token and the id to reset his password, 
            in case of failure, failure messages along with errors.
    Redirects to: Nothing.    
    Calling Route: '/api/resetPassword/:token'
*/
module.exports.checkResetPasswordToken = function (req, res) {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordTokenExpiry: {
            $gt: Date.now()
        }
    }, function (err, user) {
        if (err) {
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        } else {
            if (user)
                res.status(200).json({
                    error: null,
                    msg: "Welcome " + user.firstName + ", You may now change you password.",
                    data: {
                        id: user._id,
                        token: req.params.token
                    }
                });
            else {
                Business.findOne({
                    resetPasswordToken: req.params.token,
                    resetPasswordTokenExpiry: {
                        $gt: Date.now()
                    }
                }, function (err, business) {
                    if (err) {
                        res.status(500).json({
                            error: err,
                            msg: null,
                            data: null
                        });
                    } else {
                        if (business)
                            res.status(200).json({
                                error: null,
                                msg: "Welcome " + business.name + ", You may now change you password.",
                                data: {
                                    id: business._id,
                                    token: req.params.token
                                }
                            });
                        else {
                            res.status(404).json({
                                error: null,
                                msg: "Your password reset request is invalid or has expired, please make a new request to reset your password.",
                                data: null
                            });
                        }
                    }
                });
            }
        }
    });
};


/*  
    Put Function, to reset the password of the account.
    Takes:
        body{  
            password,
            confirmPassword 
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.    
    Calling Route: '/api/resetPassword/:id'
*/
module.exports.resetPassword = function (req, res) {

    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;

    //validate password
    req.checkBody('password', 'Password is required.').notEmpty();
    req.checkBody('password', 'Password must be at least 8 characters.').isAlphanumeric();
    req.checkBody('password', 'Password must be at least 8 characters.').len(8);
    req.checkBody('confirmPassword', 'Passwords do not match.').equals(password);

    var errors = req.validationErrors();

    if (errors) {
        res.status(500).json({
            error: errors,
            msg: null,
            data: null
        });
    } else {
        //hash the password
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                //if it was a user set it for him
                User.findById(req.params.id, function (err, user) {
                    if (err) {
                        res.status(500).json({
                            error: err,
                            msg: null,
                            data: null
                        });
                    } else {
                        if (user) {
                            user.password = hash;
                            user.resetPasswordToken = null;
                            user.resetPasswordTokenExpiry = null;
                            user.save(function (err) {
                                if (err) {
                                    res.status(500).json({
                                        error: err,
                                        msg: null,
                                        data: null
                                    });
                                } else {
                                    res.status(201).json({
                                        error: null,
                                        msg: 'Password was changed successfully.',
                                        data: null
                                    });
                                }
                            });
                        } else {
                            //if it was a business set it for him
                            Business.findById(req.params.id, function (err, business) {
                                if (err) {
                                    res.status(500).json({
                                        error: err,
                                        msg: null,
                                        data: null
                                    });
                                } else {
                                    if (business) {
                                        business.password = hash;
                                        business.resetPasswordToken = null;
                                        business.resetPasswordTokenExpiry = null;
                                        business.save(function (err) {
                                            if (err) {
                                                res.status(500).json({
                                                    error: err,
                                                    msg: null,
                                                    data: null
                                                });
                                            } else {
                                                res.status(201).json({
                                                    error: null,
                                                    msg: 'Password was changed successfully.',
                                                    data: null
                                                });
                                            }
                                        });
                                    } else
                                        res.status(404).json({
                                            error: null,
                                            msg: 'Could not find a user or business with this id.',
                                            data: null
                                        });
                                }
                            });
                        }
                    }
                });
            });
        });
    }
};
