const mongoose = require("mongoose");
const Business = mongoose.model("Business");

module.exports.searchByNameOrTag = function (req, res) {
    if (req.query && req.query.result) {
        var nameOrTag = req.query.result;
        Business.find({
                $or: [{
                        name: {
                            $regex: "^" + nameOrTag,
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
            function (err, businesses) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(businesses);
                }
            }
        );
    } else
        res.json([]);
};
