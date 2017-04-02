const mongoose = require("mongoose");
const Business = mongoose.model("Business");


/*Search he Business model for businesses with name or tag
entered by the user, it gets all businesses with matching names
and tags and returns them to the frontend
Calling route: "/api/search" */
module.exports.searchByNameOrTag = function(req, res) {
    //Check for query string Ex: "/api/search?result=omar"
    if (req.query && req.query.result) {
        var nameOrTag = req.query.result;

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
            },
            function(err, businesses) {
                //If an error occured return it to the frontend
                if (err) {
                    res.json(err);
                } else {
                    //return an array of businesses or an empty array
                    res.json(businesses);
                }
            }
        );
    } else
        //return an empty array
        res.json([]);
};
