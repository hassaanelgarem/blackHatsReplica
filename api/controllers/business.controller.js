const fs = require('fs');
const path = require("path");
const multer = require('multer');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Business = mongoose.model("Business");


/* Multer configuration to upload a single file from an
html input with name "myfile" to public/uploads/businessPhotos folder*/
const uploadPhotos = multer({
    dest: path.join(__dirname, '../', '../public/uploads/businessPhotos')
}).single('myfile');


/* Multer configuration to upload a single file from an
html input with name "myfile" to public/uploads/businessLogos folder*/
const uploadBusinessLogo = multer({
    dest: path.join(__dirname, '../', '../public/uploads/businessLogos')
}).single('myfile');


/*Put function, to save the choosen tags by the business in the database .
  Calling route: '/api/business/addTags' */
module.exports.addTags = function (req, res) {
    Business.findOne({
        _id: req.user._id
    }, function (err, business) {
        //if error occured
        if (err) {
            res.json(err);
        } else {
            // if business found
            if (business) {
                req.checkBody('tags', 'Tags is required.').notEmpty();
                var errors = req.validationErrors();

                if (errors) {
                    res.json({
                        success: false,
                        msg: "Problem with submitted fields",
                        errors: errors
                    });
                } else {
                    var array = req.body.tags.split(",");
                    for (var i = 0; i < array.length; i++) {
                        business.tags.push(array[i]);
                    }

                    /*save the choosen tags in the database
                    and return the updated object to frontend.
                    */
                    business.save(function (err) {
                        if (err) {
                            res.json(err);
                        } else {
                            res.json(business);
                        }
                    });
                }
            }
            //business not found
            else
                res.json({
                    error: "Business not found!"
                });
        }
    });
}


/*Put function, to save the choosen Category by the business in the database .
  business can choose only 1 Category
  Calling route: '/api/business/addCategory' */
module.exports.addCategory = function (req, res) {
    Business.findOne({
        _id: req.user._id
    }, function (err, business) {
        //if error occured
        if (err) {
            res.json(err);
        } else {
            // if business found
            if (business) {
                req.checkBody('category', 'Category is required.').notEmpty();
                var errors = req.validationErrors();

                if (errors) {
                    res.json({
                        success: false,
                        msg: "Problem with submitted fields",
                        errors: errors
                    });
                } else {
                    business.category = req.body.category;

                    business.save(function (err) {
                        if (err) {
                            res.json(err);
                        } else {
                            res.json(business);
                        }
                    });
                }
            }

            //business not found
            else
                res.json({
                    error: "Business not found!"
                });
        }
    });
};


/*
Post function, to Upload photo using multer
and store the uploaded image path in the Business
model in photos array, and return the
filepath to the frontend to show the image.
Calling route: '/business/addPhoto'
*/
module.exports.addPhoto = function (req, res) {
    //upload the image
    uploadPhotos(req, res, function (err) {
        //if an error occurred, return the error
        if (err) {
            return res.json(err);
        }
        /*if multer found a file selected
        and image was uploaded successfully,
        multer will save the image in req.file*/
        if (req.file) {
            //get the image format
            var string = req.file.originalname.substring(req.file.originalname.length - 3, req.file.originalname.length);

            //if it was jpeg add a "j" to the returned "peg"
            if (string === "peg")
                string = "j" + string;

            //check if it is not a valid image format
            if (!(string === "png" || string === "jpg" || string === "jpeg")) {
                //delete the uploaded file
                fs.unlink(req.file.path);

                //return the error message to frontend
                return res.json({
                    error: "File format is not supported!"
                });
            }
            //copy and rename the image to the following format and location
            var newPath = path.join(__dirname, "../", "../public/uploads/businessPhotos/img" + Date.now() + "." + string);
            fs.renameSync(req.file.path, newPath, function (err) {
                if (err) throw err;

                //delete the image with the old name
                fs.unlink(req.file.path);
            });

            //get the name part only from the uploaded image
            var nameLength = ("img" + Date.now() + string).length + 1;
            newPath = newPath.substring(newPath.length - nameLength);

            //add the image file name to the photos array of the Business model
            Business.update({
                    "_id": req.user._id
                }, {
                    $push: {
                        "photos": newPath
                    }
                },
                function (err, result) {
                    //couldn't add to array, return the error
                    if (err) {
                        res.json(err);
                    } else {
                        //if updating is ok
                        if (result) {
                            //return the file path to the frontend to show the image
                            res.json(newPath);
                        } else
                            res.json({
                                error: "No business found"
                            });
                    }
                });
        }
        //multer did not find a file selected to upload
        else {
            res.json({
                error: "Choose a valid file"
            });
        }
    });
};


/*
delete function that deletes photo from business'
photos array, and returns success message or error message.
Calling route: '/business/deletePhoto/:photoPath'
*/
module.exports.deletePhoto = function (req, res) {
    var imagePath = req.params.photoPath;
    var businessId = req.user._id;
    Business.update({
        "_id": businessId
    }, {
        $pull: {
            "photos": imagePath
        }
    }, function (err, data) {
        if (err) {
            res.json({
                success: false,
                msg: 'deleting photo failed'
            });
        } else {
            //if image found in business photos
            if (data.nModified > 0) {
                //add directory path to image name
                imagePath = path.join(__dirname, "../", "../public/uploads/businessPhotos/", req.params.photoPath);

                //delete the photo from filesystem
                fs.unlink(imagePath, function (err) {
                    //don't care if file doesn't exist
                });
                res.json({
                    success: true,
                    msg: 'photo deleted successfully'
                });
            } else
                res.json({
                    success: false,
                    msg: 'photo not found'
                });
        }
    });
};


/* Post function that adds the business's name, password, email & description to the db on applying
Calling Route: /api/business/apply */
module.exports.addBusiness = function (req, res) {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const description = req.body.description;

    //Validating inputs
    req.checkBody('name', 'Your business name is required.').notEmpty();
    req.checkBody('password', 'password is required.').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match.').equals(password);
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Email format is not correct.').isEmail();
    req.checkBody('description', 'A brief description of your business is necessary to apply.').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.json({
            success: false,
            msg: "Problem with submitted fields",
            errors: errors
        });
    } else {

        //Checking if email is already taken
        Business.findOne({
            'email': email
        }, (err, business) => {
            if (err) return res.json(err);
            if (business) res.json({
                error: 'Email already used. Please enter another email.'
            });
            else {

                let newBusiness = new Business({
                    name: name,
                    password: password,
                    email: email,
                    description: description
                });

                //Encrypting password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newBusiness.password, salt, (err, hash) => {
                        if (err) return res.json({
                            success: false,
                            msg: 'An error occurred while encrypting',
                            error: err
                        });
                        newBusiness.password = hash;

                        //Adding business to the db after making sure all inputs are valid and the password is encrypted
                        newBusiness.save(function (err) {
                            if (err) return res.json({
                                success: false,
                                msg: 'Was not able to save your business, please try again'
                            });
                            res.json({
                                success: true,
                                msg: 'Your application is successfully submitted!'
                            });
                        });
                    });
                });
            }
        });
    }
};


/* Get function that returns all unverified businesses based on the value of the attribute verified
Calling Route: /api/business/unVerifiedBusinesses */
module.exports.unVerifiedBusinesses = function (req, res) {
    const query = Business.find({
        verified: false
    });
    query.exec(function (err, businesses) {
        if (err) res.json({
            success: false,
            msg: 'Can not retrieve unverified businesses'
        });
        else
            res.json({
                success: true,
                msg: 'Got unverified businesses successfully',
                businesses: businesses
            });
    });
};


/*
Put function that increments the interactivity attribute of a certain business by 1
Calling route: /api/business/:businessId/interact
*/
module.exports.updateInteractivity = function (req, res) {
    Business.findById(req.params.businessId, function (err, business) {
        business.interactivity = business.interactivity + 1;
        business.save(function (err) {
            if (err) res.json({
                success: false,
                msg: 'Updating business interactivity failed'
            });
            else
                res.json({
                    success: true,
                    msg: 'Business interactivity incremented'
                });
        });
    });
};


/*
Get function that returns the three most popular businesses based on their interactivity
Calling route: /api/business/mostPopular
*/
module.exports.getMostPopular = function (req, res) {
    // query for sorting businesses based on interactivity and limits the result to 3
    const query = Business.find().sort({
        interactivity: -1
    }).limit(3);
    // execute the above query
    query.exec(function (err, businesses) {
        // If there is an error return it in response
        if (err) res.json({
            success: false,
            msg: 'Failed to retrieve most popular businesses'
        });
        else
            // If no error return the list of businesses
            res.json({
                success: true,
                msg: 'Got most popular businesses successfully',
                businesses: businesses
            });
    });
};


/*
Post function to Upload Logo using multer
and store the uploaded image path in the Business
model in photos array, and return the
filepath to the frontend to show the image.
Calling route: '/api/business/addLogo'
*/
module.exports.uploadLogo = function (req, res) {
    //upload the image
    uploadBusinessLogo(req, res, function (err) {
        //if an error occurred, return the error
        if (err) {
            return res.json(err);
        }
        /*if multer found a file selected
        and image was uploaded successfully,
        multer will save the image in req.file*/
        if (req.file) {
            //get the image format
            var string = req.file.originalname.substring(req.file.originalname.length - 3, req.file.originalname.length);

            //if it was jpeg add a "j" to the returned "peg"
            if (string === "peg")
                string = "j" + string;

            //check if it is not a valid image format
            if (!(string === "png" || string === "jpg" || string === "jpeg")) {
                //delete the uploaded file
                fs.unlink(req.file.path);

                //return the error message to frontend
                return res.json({
                    error: "File format is not supported!"
                });
            }
            //copy and rename the image to the following format and location
            var newPath = path.join(__dirname, "../", "../public/uploads/businessLogos/img" + Date.now() + "." + string);
            fs.renameSync(req.file.path, newPath, function (err) {
                if (err) throw err;

                //delete the image with the old name
                fs.unlink(req.file.path);
            });

            //get the name part only from the uploaded image
            var nameLength = ("img" + Date.now() + string).length + 1;
            newPath = newPath.substring(newPath.length - nameLength);

            //save the image file path to the Business model
            Business.findById(req.user._id, function (err, business) {
                //if an error occurred, return the error
                if (err)
                    res.json(err);
                else {
                    //if found business
                    if (business) {
                        //if exists an old logo, save its old value incase updating logo fails
                        if (business.logo) {
                            var oldLogo = path.join(__dirname, "../", "../public/uploads/businessLogos/", business.logo);
                        }
                        business.logo = newPath;
                        business.save(function (err) {
                            //couldn't save, return the error
                            if (err) {
                                res.json(err);
                            } else {
                                //if he had a logo before
                                if (oldLogo) {
                                    //updated successfully, delete the old logo
                                    fs.unlink(oldLogo, function (err) {
                                        //don't care if file not found
                                    });
                                }
                                //return the file path to the frontend to show the image
                                res.json(newPath);
                            }
                        });
                    } else
                        res.json({
                            error: "No business found"
                        });
                }
            });
        }
        //multer did not find a file selected to upload
        else {
            res.json({
                error: "Choose a valid file"
            });
        }
    });
};


/* Get function that gets the current data of the business
and pass business object to the frontend to display it.
Calling route: '/api/business/:businessId/getInfo' */
module.exports.getCurrentInfo = function (req, res) {
    //check if logged in
    Business.findOne({
        _id: req.params.businessId
    }, function (err, business) {
        //if error occured
        if (err) {
            res.json(err);
        } else {
            // if business found
            if (business)
                res.json(business);

            //business not found
            else
                res.json({
                    error: "Business not found!"
                });
        }
    });
};


/* Put function to save the edited business info in the database
and returns updated object to frontend.
Calling route: '/api/business/editInfo'  */
module.exports.saveNewInfo = function (req, res) {

    Business.findOne({
        _id: req.user._id
    }, function (err, business) {
        //if an error occurred, return the error
        if (err) {
            res.json(err);
        } else {
            // if business found in database its basic info will be saved
            if (business) {
                //Validating inputs
                req.checkBody('name', 'Your business name is required.').notEmpty();
                req.checkBody('phoneNumbers', 'Phone Number is required.');
                req.checkBody('email', 'Email is required.').notEmpty();
                req.checkBody('email', 'Email format is not correct.').isEmail();
                req.checkBody('description', 'A brief description of your business is necessary to apply.').notEmpty();

                var errors = req.validationErrors();
                if (errors) {
                    res.json({
                        success: false,
                        msg: "Problem with submitted fields",
                        errors: errors
                    });
                } else {
                    // Required fields
                    business.name = req.body.name;
                    business.email = req.body.email;
                    business.phoneNumbers = req.body.phoneNumbers;
                    business.description = req.body.description;

                    // Not Required fields
                    if (req.body.workingDays) {
                        //Split workDays by "," to return an array of strings
                        business.workingDays = req.body.workingDays.split(",");
                    }
                    if (req.body.from && req.body.to) {
                        business.workingHours = {
                            from: req.body.from,
                            to: req.body.to
                        };
                    }

                    var coordinates = [];
                    if (req.body.coordinates) {
                        coordinates = req.body.coordinates.split(",");
                        coordinates[0] = parseFloat(coordinates[0]);
                        coordinates[1] = parseFloat(coordinates[1]);
                    }
                    business.location = {
                        address: req.body.address,
                        coordinates: coordinates
                    };
                    if (req.body.paymentRequired) {
                        business.paymentRequired = parseInt(req.body.paymentRequired);
                    }
                    if (req.body.deposit) {
                        business.deposit = parseFloat(req.body.deposit);
                    }

                    business.save(function (err) {
                        if (err) {
                            res.json(err);
                        } else {
                            res.json(business);
                        }
                    });
                }
            }
            //if business not found return this message to frontend
            else {
                res.json({
                    error: "Business not found!"
                });
            }
        }
    });
};