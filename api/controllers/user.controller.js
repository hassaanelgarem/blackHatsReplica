const mongoose = require("mongoose");
const geoip = require('geoip-lite');
const User = mongoose.model("User");
const Business = mongoose.model("Business");


/*  
    Post Function, to register a new user into the users database
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
    Calling Route: /api/user/register  
*/
module.exports.registerUser = function (req, res) {

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;

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
        res.status(500).json({
            error: errors,
            msg: null,
            data: null
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
                return res.status(500).json({
                    error: err,
                    msg: null,
                    data: null
                });
            }

            //if username or email already exists
            if (user) {
                if (user.username === req.body.username)
                    res.status(500).json({
                        error: null,
                        msg: 'Username already exists, Username: ' + username + '. Please enter another username.',
                        data: null
                    });
                else
                    res.status(500).json({
                        error: null,
                        msg: 'Email already exists, Email: ' + email + '. Please enter another email.',
                        data: null
                    });
            }
            //Username and email are unique, create the user and save it in the database.
            else {
                //Pass the whole body and it will take whatever is not null
                var newUser = new User(req.body);

                User.createUser(newUser, function (err, user) {
                    if (err) res.status(500).json({
                        error: err,
                        msg: null,
                        data: null
                    });
                    else {
                        if (user) {
                            
                            res.status(200).json({
                                error: null,
                                msg: 'Registration Successful.',
                                data: null
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
module.exports.deleteAccount = function (req, res) {

    User.findByIdAndRemove(req.user._id, function (err) {
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
    User.findByIdAndUpdate(userId, {
            $addToSet: {
                favorites: businessId
            }
        }, //add the business id to the favorites array
        function (err) {
            //couldn't add to array, return the error
            if (err) {
                res.status(500).json({
                    error: err,
                    msg: null,
                    data: null
                });
            } else {
                res.status(200).json({
                    error: null,
                    msg: 'Business was added to favorites successfully.',
                    data: null
                });
            }
        });
};


/*  
    Get function, to Search the Business model for businesses with name or tag
    entered by the user, it gets all businesses with matching names
    and tags.
    Takes: 
        query{
            result: "used for name or tag search value",
            offset: "get businesses starting from number",
            count: "how many businesses to get"
        }
    Returns: Array of matching businesses to the search query.
    Redirects to: Nothing.
    Calling route: '/api/search' 
*/
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
        }).select('-password').skip(offset).limit(count).exec(function (err, businesses) {
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
            category: "used for category search value",
            offset: "get businesses starting from number",
            count: "how many businesses to get"
        }
    Returns: Array of matching businesses to the search query.
    Redirects to: nothing.
    Calling route: '/api/search'
*/
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

        //if nothing was chosen return empty array
        else
            return res.status(200).json([]);
    }

    //execute the query
    Business.find(findQuery).select('-password').skip(offset).limit(count).exec(function (err, businesses) {

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
