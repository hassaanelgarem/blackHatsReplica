const mongoose = require("mongoose");
const User = mongoose.model("User");
const Business = mongoose.model("Business");
const geoip = require('geoip-lite');


/*Add business id to the favorites array in user model,
and return success message if business added successfuly,
else returns error message.
Calling route: 'api/user/:userId/addfavorite/:businessId'
*/
module.exports.addFavorite = function(req, res) {
    // if the user is logged in
    if (req.user) {
        var businessId = req.params.businessId; //to get the id of the busniness i want to add to favorites
        var userId = req.params.userId; //using passport, get the id of the signed in user
        User.update({
                "_id": userId
            }, {
                $addToSet: {
                    favorites: businessId
                }
            }, //add the business id to the favorites array
            function(err, result) {
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
    }
    // //if the user is not logged in:
    else {
        res.send("you should sign in first.")
        //res.redirect('/register');
    }
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
                        //max distance in metres, so this 50 km
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
                        //max distance in metres, so this 50 km
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
