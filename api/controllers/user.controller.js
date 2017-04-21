const mongoose = require("mongoose");
const geoip = require('geoip-lite');
const randtoken = require('rand-token');
const emailSender = require('../config/emailSender');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const Business = mongoose.model('Business');
const TempUser = mongoose.model('TempUser');


/*
    Post Function, to register a new user into the temp users database and send the
    verification email.
    Takes:
        body{
            firstName
            lastName
            email
            username
            password
            confirmPassword
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling Route: '/api/user/register'
*/
module.exports.registerUser = function(req, res) {

    //Validating entries
    req.checkBody('firstName', 'First Name is required.').notEmpty();
    req.checkBody('lastName', 'Last Name is required.').notEmpty();
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Email format is not correct.').isEmail();
    req.checkBody('username', 'Username is required.').notEmpty();
    req.checkBody('password', 'Password is required.').notEmpty();
    req.checkBody('password', 'Password must contain letters and numbers.').isAlphanumeric();
    req.checkBody('password', 'Password must be at least 8 characters.').len(8);
    req.checkBody('confirmPassword', 'Passwords do not match.').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        for (i = 1; i < errors.length; i++) {
            errors[0].msg += "\n" + errors[i].msg;
        }
        res.status(500).json({
            error: errors[0],
            msg: null,
            data: null
        });
    } else {
        req.body.username = req.body.username.trim();
        req.body.email = req.body.email.trim();
        User.findOne({
            $or: [{
                'username': {
                    //equal username
                    $regex: '^' + req.body.username + '$',
                    //Ignore whitespace characters and case insensitive
                    $options: "ix"
                }
            }, {
                'email': {
                    //equal email
                    $regex: '^' + req.body.email + '$',
                    //Ignore whitespace characters and case insensitive
                    $options: "ix"
                }
            }]
        }, function (err, user) {
            //if there is an error, send an error message
            if (err) {
                return res.status(500).json({
                    error: err,
                    msg: null,
                    data: null
                });
            }

            //if username or email already exists in model
            if (user) {
                var msg = 'Email already exists, Email: ' + req.body.email + '. Please enter another email.';
                //check on username ignoring case
                var regexp = new RegExp('^' + req.body.username + '$', 'i')
                if (regexp.test(user.username))
                    msg = 'Username already exists, Username: ' + req.body.username + '. Please enter another username.';
                var newError = {
                    "msg": msg
                };
                res.status(500).json({
                    error: newError,
                    msg: msg,
                    data: null
                });
            } else {

                //check also in temp model of unverified users
                TempUser.findOne({
                    $or: [{
                        'username': {
                            //equal username
                            $regex: '^' + req.body.username + '$',
                            //Ignore whitespace characters and case insensitive
                            $options: "ix"
                        }
                    }, {
                        'email': {
                            //equal email
                            $regex: '^' + req.body.email + '$',
                            //Ignore whitespace characters and case insensitive
                            $options: "ix"
                        }
                    }]
                }, function(err, tempUser) {
                    if (err)
                        return res.status(500).json({
                            error: err,
                            msg: null,
                            data: null
                        });
                    else {
                        if (tempUser) {
                            var msg = 'Email already exists, Email: ' + req.body.email + '. Please enter another email.';
                            //check on username ignoring case
                            var regexp = new RegExp('^' + req.body.username + '$', 'i')
                            if (regexp.test(tempUser.username))
                                msg = 'Username already exists, Username: ' + req.body.username + '. Please enter another username.';

                            var newError = {
                                "msg": msg
                            };
                            res.status(500).json({
                                error: newError,
                                msg: msg,
                                data: null
                            });
                        } else {

                            //Username and email are unique, create the user and save it in the database.

                            //security check to protect against form injection of unwanted fields
                            delete req.body.admin;
                            delete req.body.reviews;
                            delete req.body.favorites;
                            delete req.body.bookings;
                            delete req.body.profilePicture;
                            delete req.body.createdAt;


                            //Pass the whole body and it will take whatever is not null
                            var newUser = new TempUser(req.body);
                            var token = randtoken.generate(48);
                            newUser.verificationToken = token;
                            newUser.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
                            TempUser.createUser(newUser, function(err, user) {
                                if (err) res.status(500).json({
                                    error: err,
                                    msg: null,
                                    data: null
                                });
                                else {
                                    if (user) {
                                        var html = "<p>Hello " + newUser.firstName + ", <br><br>Welcome to Black Hats, Please verify your account by clicking this <a href=\"http://localhost:8080/verify/" + token + "\">Link</a>.<br><br>If you are unable to do so, copy and paste the following link into your browser:<br><br>http://localhost:8080/verify/" + token + "</p>";
                                        var subject = 'Account Verification';
                                        emailSender.sendEmail(subject, req.body.email, "", html, function(err, info) {
                                            if (err)
                                                newUser.remove(function (err) {
                                                    var newError = {
                                                        "msg": 'Email address is not valid, registration failed.'
                                                    };
                                                    res.status(500).json({
                                                        error: null,
                                                        msg: 'Email address is not valid, registration failed.',
                                                        data: null
                                                    });
                                                });
                                            else
                                                res.status(200).json({
                                                    error: null,
                                                    msg: "An Email was sent successfully to " + req.body.email + ", check your inbox.",
                                                    data: null
                                                });
                                        });
                                    } else
                                        res.status(500).json({
                                            error: null,
                                            msg: "Registration failed.",
                                            data: null
                                        });
                                }
                            });
                        }
                    }
                });
            }
        });
    }
};



/*
    Delete function, to delete a user account by getting his username from the session
    used when he logged in,and then removing his entry from the db and logging out.
    Takes: nothing.
    Returns: Errors in case of failure.
    Redirects to: '/' (Home Page).
    Calling Route: '/api/user/deleteAccount'
*/
module.exports.deleteAccount = function(req, res) {

    User.findByIdAndRemove(req.user._id, function(err) {
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        else {
            req.logout();
            res.status(200).redirect('/');
        }
    });
};


/*
    Put function to Add business id to the favorites array in user model.
    Takes:
        params{
            businessId
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling route: '/api/user/addFavorite/:businessId'
*/
module.exports.addFavorite = function (req, res) {
    var businessId = req.params.businessId; //to get the id of the busniness i want to add to favorites
    var userId = req.user._id; //using passport, get the id of the signed in user
    Business.findById(businessId, function (err, doc) {
        //if an error to find the business,I return the error message
        if (err) {
            res.status(500).json({
                error: err,
                msg: "Error retrieving desired business",
                data: null
            });
        } else if (!doc) {
            //if no business with that businessId was found,I return an error message
            res.status(404).json({
                error: null,
                msg: "Business not found",
                data: null
            });
        }
        //if the business is found, add it to user's favorites
        else {
            User.update({
                    "_id": userId
                }, {
                    $addToSet: {
                        favorites: businessId
                    }
                }, //add the business id to the favorites array
                function (err, result) {
                    //couldn't add to array, return the error
                    if (err) {
                        res.status(500).json({
                            error: null,
                            msg: "adding business to favorites failed",
                            data: null
                        });
                    } else {
                        res.status(200).json({
                            error: null,
                            msg: "business added to favorites",
                            data: null
                        });
                    }
                });
        }
    });
};


/* delete function to delete business id from the favorites array in user model,
and return success message if business removed successfuly,
else returns error message.
Redirects to: Nothing
Calling route: '/api/user/deleteFavorite/:businessId'
*/
module.exports.deleteFavorite = function(req, res) {
    var businessId = req.params.businessId; //to get the id of the busniness i want to delete from favorites
    var userId = req.user._id; //using passport, get the id of the signed in user

    User.update({
        "_id": userId
    }, {
        $pull: {
            "favorites": businessId
        }
    }, function (err, data) {
        if (err) {
            res.status(500).json({
                error: err,
                msg: "deleting favorite failed",
                data: null
            });
        } else {
            //if business found in user favorites
            if (data.nModified > 0) {
                res.status(200).json({
                    error: null,
                    msg: "business deleted successfully from favorites",
                    data: null
                });
            } else {
                //if business not found in user favorites
                res.status(404).json({
                    error: null,
                    msg: "Business not found",
                    data: null
                });
            }


        }
    });
};


/*
    Get function, to Search the Business model for businesses with name or tag
    entered by the user, it gets all businesses with matching names
    and tags.
    Takes:
        query{
            result: "used for name or tag search value"
        }
    Returns: Array of matching businesses to the search query.
    Redirects to: Nothing.
    Calling route: '/api/search'
*/

module.exports.searchByNameOrTag = function (req, res, next) {

    var sort = {
        interactivity: "desc"
    };
    if (req.query && req.query.sort === "totalRatings") {
        sort = {
            totalRatings: "desc"
        };
    }
    //Check for query string Ex: "/api/search?result=omar"
    if (req.query && req.query.result) {
        var nameOrTag = req.query.result;

        //Find businesses from the database excluding password in returned document
        Business.find({
            $or: [{
                    name: {
                        //Starts with or is the nameOrTag
                        $regex: "^" + nameOrTag,
                        //Ignore whitespace characters and case insensitive
                        $options: "ix"
                    }

                },
                {
                    tags: {
                        $regex: "^" + nameOrTag,
                        $options: "ix"
                    }

                }
            ]

        }).sort(sort).select('-password').exec(function (err, businesses) {
            //If an error occured return it to the frontend
            if (err) {
                res.status(500).json({
                    error: err,
                    msg: null,
                    data: null
                });
            } else {
                //return an array of businesses or an empty array
                res.status(200).json({
                    error: null,
                    msg: null,
                    data: businesses
                });
            }
        });
    } else
    //if he didn't search by name or tag call searchByLocationAndCategory
        next();
};


/*
    Get function, Search the Business model for businesses with location or category
    or both entered by the user.
    Takes:
        query{
            location: "used for location search value",
            category: "used for category search value"
        }
    Returns: Array of matching businesses to the search query.
    Redirects to: nothing.
    Calling route: '/api/search'
*/

module.exports.searchByLocationAndCategory = function (req, res) {
    var location = "All";
    var category = "All";
    var sort = {
        interactivity: "desc"
    };
    if (req.query && req.query.sort === "totalRatings") {
        sort = {
            totalRatings: "desc"
        };
    }

    //Check for query string Ex: "/api/search?location=Cairo&category=Escape"

    if (req.query && req.query.category) {
        category = req.query.category;
    }

    if (req.query && req.query.location) {
        location = req.query.location;
    }

    var findQuery;

    //if location by geocordinates should be used
    if (location === "nearby") {
        var lat = 0;
        var lng = 0;

        //get ip address of the client that made the request
        var ip = req.ip;

        //reformat the provided ip to be in a proper pattern
        ip = ip.split(',')[0];
        ip = ip.split(':').slice(-1)[0];

        /*the ip when testing in localhost will always be 127.0.0.1 but on the
        deployed server it will work with real ips so to test put you real ip
        address instead of the existing ip in lookup, you can get it from whatismyip.com
        */

        //look up ip address location
        var geo = geoip.lookup(ip);

        //check if the ip provided valid and has a location
        if (geo) {
            lat = geo.ll[0];
            lng = geo.ll[1];
        }

        //if no category was chosen get by location nearby only
        if (category === "All") {
            findQuery = {
                "location.coordinates": {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [lng, lat]
                        },
                        //max distance in metres, so this is 50 km
                        $maxDistance: 50 * 1000
                    }
                }
            }
        }

        //if category was chosen get by location nearby and category
        else {
            findQuery = {
                "category": {
                    //is the category
                    $regex: category,
                    //Ignore whitespace characters and case insensitive
                    $options: "ix"
                },
                "location.coordinates": {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [lng, lat]
                        },
                        //max distance in metres, so this is 50 km
                        $maxDistance: 50 * 1000
                    }
                }
            }
        }
    }

    //if location was a regular city

    //if location and category were chosen
    else if (location !== "All" && category !== "All") {
        findQuery = {
            "category": {
                //is the category
                $regex: category,
                //Ignore whitespace characters and case insensitive
                $options: "ix"
            },
            "location.city": {
                //Starts with or is the city
                $regex: "^" + location,
                //Ignore whitespace characters and case insensitive
                $options: "ix"
            }
        };
    }

    //if nothing was chosen or only one was chosen
    else if (location === "All" || category === "All") {

        //if location was chosen
        if (location !== "All") {
            findQuery = {
                "location.city": {
                    //Starts with or is the city
                    $regex: "^" + location,
                    //Ignore whitespace characters and case insensitive
                    $options: "ix"
                }
            };
        }

        //if category was chosen
        else if (category !== "All") {
            findQuery = {
                "category": {
                    //is the category
                    $regex: category,
                    //Ignore whitespace characters and case insensitive
                    $options: "ix"
                }
            };
        }

        //if nothing was chosen return all
        else
            findQuery = {};
    }

    //execute the query

    Business.find(findQuery).sort(sort).select('-password').exec(function (err, businesses) {

        //if an error occurred, return the error
        if (err)
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });

        //return the found businesses or an empty array
        else {
            res.status(200).json({
                error: null,
                msg: null,
                data: businesses
            });
        }
    });
};


/*
    Put Function, to change the password of the user.
    Takes:
        body{
            oldPassword,
            password,
            confirmPassword
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling Route: '/api/user/changePassword'
*/
module.exports.changePassword = function(req, res) {
    var oldPassword = req.body.oldPassword;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;

    req.checkBody('oldPassword', 'Old Password is required.').notEmpty();
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
        User.findById(req.user._id, function(err, user) {
            if (err)
                res.status(500).json({
                    error: err,
                    msg: null,
                    data: null
                });
            else {
                if (user) {
                    //check that the old password is correct
                    User.comparePassword(oldPassword, user.password, function(err, isMatched) {
                        if (err)
                            res.status(500).json({
                                error: err,
                                msg: null,
                                data: null
                            });
                        else {
                            //hash and save the new password
                            if (isMatched) {
                                //check on username ignoring case
                                var regex = new RegExp('^' + oldPassword.trim() + '$');
                                if (regex.test(password.trim()))
                                    return res.status(500).json({
                                        error: null,
                                        msg: 'You can not change your password to the currently existing one.',
                                        data: null
                                    });

                                bcrypt.genSalt(10, function(err, salt) {
                                    bcrypt.hash(password, salt, function(err, hash) {
                                        user.password = hash;
                                        user.save(function(err) {
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
                                    });
                                });
                            } else
                                res.status(500).json({
                                    error: null,
                                    msg: 'Your old password is not correct.',
                                    data: null
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
    }
};


/*
    Get Function, to check the validity of the token in the verification request.
    Takes:
        params{
            token: verification token sent to the user
        }
    Returns: in case of Success, the token and the userId to verify,
            in case of failure, failure messages along with errors.
    Redirects to: Nothing.
    Calling Route: '/api/user/verifyAccount/:token'
*/
module.exports.checkVerificationToken = function(req, res) {
    TempUser.findOne({
        verificationToken: req.params.token,
        verificationTokenExpiry: {
            $gt: Date.now()
        }
    }, function(err, tempUser) {
        if (err) {
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        } else {
            if (tempUser)
                res.status(200).json({
                    error: null,
                    msg: "Token is valid.",
                    data: {
                        id: tempUser._id,
                        token: req.params.token
                    }
                });
            else
                res.status(200).json({
                    error: null,
                    msg: "Token is invalid or has expired.",
                    data: null
                });
        }
    });
};


/*
    Post Function, to verify a temp user and add it to users model.
    Takes:
        params{
            userId: the temp user id to verify
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling Route: '/api/user/verifyAccount/:userId'
*/
module.exports.confirmVerification = function(req, res) {
    TempUser.findById(req.params.userId, function(err, tempUser) {
        if (err) {
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        } else {
            if (tempUser) {
                //convert document to json object
                var obj = tempUser.toObject();
                //create new user with the object
                var newUser = new User(obj);
                newUser.save(function(err) {
                    if (err) {
                        res.status(500).json({
                            error: err,
                            msg: null,
                            data: null
                        });
                    } else {
                        //remove from temp model if saving is done
                        tempUser.remove();
                        res.status(200).json({
                            error: null,
                            msg: 'You have successfully verified your account.',
                            data: null
                        });
                    }
                });
            } else {
                res.status(404).json({
                    error: null,
                    msg: "User was not found in the unverified users collection.",
                    data: null
                });
            }
        }
    });
};


/*
    Post Function, to resend a verification email to the user.
    Takes:
        body{
            email
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling Route: '/api/user/resendVerification'
*/
module.exports.resendVerification = function(req, res) {

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
        req.body.email = req.body.email.trim();
        var email = req.body.email;

        TempUser.findOne({
            email: email
        }, function(err, tempUser) {
            if (err) {
                res.status(500).json({
                    error: err,
                    msg: null,
                    data: null
                });
            } else {
                if (tempUser) {
                    //generate a token and assign it to the temp user, expires in 24 hrs
                    var token = randtoken.generate(48);
                    tempUser.verificationToken = token;
                    tempUser.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
                    tempUser.save(function(err) {
                        if (err) {
                            res.status(500).json({
                                error: err,
                                msg: null,
                                data: null
                            });
                        } else {
                            //TO-DO replace the link with the angular route not server route.
                            var html = "<p>Hello " + tempUser.firstName + ", <br><br>Welcome to Black Hats, Please verify your account by clicking this <a href=\"http://localhost:8080/api/user/verifyAccount/" + token + "\">Link</a>.<br><br>If you are unable to do so, copy and paste the following link into your browser:<br><br>http://localhost:8080/api/user/verifyAccount/" + token + "</p>";
                            var subject = 'Account Verification';
                            emailSender.sendEmail(subject, email, "", html, function(err, info) {
                                if (err) res.status(500).json({
                                    error: err,
                                    msg: 'We could not send the verification email, resend it.',
                                    data: null
                                });
                                else
                                    res.status(200).json({
                                        error: null,
                                        msg: "An Email was sent successfully to " + email + ", check your inbox.",
                                        data: null
                                    });
                            });
                        }
                    });
                } else {
                    res.status(404).json({
                        error: null,
                        msg: "The email you provided was not used for registration to the website, or the account which is associated to it, has already been verified.",
                        data: null
                    });
                }
            }
        });
    }
};


/*
Get function that returns the logged in user or business if they exist
Returns: {
  success: indicated whether there's a log in session or no,
  user: User object of logged in user,
  business: Business object of logged in business
}
Redirects to: Nothing.
Calling Route: '/api/currentUser'
*/
module.exports.currentUser = function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.constructor.modelName === "User") {
            res.json({
                success: true,
                user: req.user,
                business: null
            });
        } else {
            res.json({
                success: true,
                user: null,
                business: req.user
            });
        }
    } else {
        res.json({
            success: false,
            user: null,
            business: null
        });
    }
}


module.exports.successLogin = function (req, res) {
    return res.json({
        success: true
    });
};


module.exports.failedLogin = function (req, res) {
    return res.json({
        success: false
    });
};
