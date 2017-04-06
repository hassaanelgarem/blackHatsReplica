const mongoose = require("mongoose");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const geoip = require('geoip-lite');
const User = mongoose.model("User");
const Business = mongoose.model("Business");

// Passport handling the login
passport.use('local-user', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, function (username, password, done) { // Finding the user by his username
    User.getUserByUsername(username, function (err, user) {
        if (err) return done(err);
        if (!user) {
            return done(null, false, {
                message: 'Invalid Username.'
            });
        }
        //Comparing to see if the 2 passwords match
        User.comparePassword(password, user.password, function (err, isMatch) {
            if (err) return done(err);
            if (isMatch)
                return done(null, user);
            else
                return done(null, false, {
                    message: 'Invalid password.'
                });
        });
    });
}));


//Passport module serializes User ID
passport.serializeUser(function (user, done) {
    done(null, user.id);
});


//Passport module deserializes User ID
passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});


//Middleware function for Passport module for authentication and login
module.exports.passportAuthenticate = passport.authenticate('local-user', {
    successRedirect: '/',
    failureRedirect: '/api/login',
    failureFlash: false
});


/* Post Function, to register a new user into the users database
   Calling Route: /api/user/register  */
module.exports.registerUser = function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var birthDate = req.body.birthDate;

    //Validating entries
    req.checkBody('firstName', 'First Name is required.').notEmpty();
    req.checkBody('lastName', 'Last Name is required.').notEmpty();
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Email format is not correct.').isEmail();
    req.checkBody('username', 'Username is required.').notEmpty();
    req.checkBody('password', 'Password is required.').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match.').equals(password);

    var errors = req.validationErrors();

    if (errors) {
        res.json({
            errors: errors
        });
    } else {
        User.findOne({
            $or: [{
                'username': username
            }, {
                'email': email
            }]
        }, function (err, user) {
            //if there is an error, send an error message
            if (err) {
                //TODO Error handling
                return res.json('Signup error');
            }

            //if username or email already exist
            if (user) {
                if (user.username === username)
                    res.json('Username already exists, username: ' + username + '. Please enter another username.');
                else
                    res.json('Email already exists, email: ' + email + '. Please enter another email.');
            }
            //Username and email are unique, create the user and save it in the database.
            else {
                var newUser = new User({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    username: username,
                    password: password,
                    birthDate: birthDate
                });

                User.createUser(newUser, function (err, user) {
                    if (err) res.json({
                        error: 'Sign up Error'
                    });
                    else {
                        if (user)
                            res.json(user);
                        else
                            res.json({
                                error: "Registration failed"
                            });
                    }
                });
            }
        });
    }
};


/* Get Function, to logout a user
   Calling Route: /api/user/logout   */
module.exports.logout = function (req, res) {
    req.logout();
    res.json('You have successfully logged out.');
}


/*Delete function, to delete a user account by getting his username from the session used when he logged in,
 and then removing his entry from the db
 Calling Route: /api/user/deleteAccount */
module.exports.deleteAccount = function (req, res) {
    var query = {
        _id: req.user._id
    };
    User.remove(query, function (err) {
        if (err)
            res.json(err);
        else {
            req.logout();
            res.redirect('/');
        }
    });
};


/* Put function to Add business id to the favorites array in user model,
and return success message if business added successfuly,
else returns error message.
Calling route: 'api/user/addfavorite/:businessId'
*/
module.exports.addFavorite = function (req, res) {
    var businessId = req.params.businessId; //to get the id of the busniness i want to add to favorites
    var userId = req.user._id; //using passport, get the id of the signed in user
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
                res.json({
                    success: false,
                    msg: 'adding business to favorites failed'
                });
            } else {
                res.json({
                    success: true,
                    msg: 'business added to favorites'
                });
            }
        });
};


/*Get function, Search the Business model for businesses with name or tag
entered by the user, it gets all businesses with matching names
and tags and returns them to the frontend
Calling route: "/api/search" */
module.exports.searchByNameOrTag = function (req, res, next) {
    var offset = 0;
    var count = 10;

    //Check for query string Ex: "/api/search?result=omar"
    if (req.query && req.query.result) {
        var nameOrTag = req.query.result;


        if (req.query.offset) {
            offset = parseInt(req.query.offset, 10);
        }

        if (req.query.count) {
            count = parseInt(req.query.count, 10);
        }

        //Find businesses from the database
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
        }).skip(offset).limit(count).exec(function (err, businesses) {
            //If an error occured return it to the frontend
            if (err) {
                res.json(err);
            } else {
                //return an array of businesses or an empty array
                res.json(businesses);
            }
        });
    } else
        //if he didn't search by name or tag call searchByLocationAndCategory
        next();
};


/*Get function, Search the Business model for businesses with location or category or both entered by the user and returns them to the frontend
Calling route: "/api/search" */
module.exports.searchByLocationAndCategory = function (req, res) {
    var offset = 0;
    var count = 10;
    var location = "All";
    var category = "All";

    //Check for query string Ex: "/api/search?location=Cairo&category=Escape&offset=2&count=10"
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }

    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }

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
                "category": category,
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
            "category": category,
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
                "category": category
            };
        }

        //if nothing was chosen get all
        else
            findQuery = {};
    }

    //execute the query
    Business.find(findQuery).skip(offset).limit(count).exec(function (err, businesses) {

        //if an error occurred, return the error
        if (err)
            res.json(err);

        //return the found businesses or an empty array
        else {
            res.json(businesses);
        }
    });
};