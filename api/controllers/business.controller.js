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


/*
    Post function that adds a photo to business photos.
    Takes:
        body: {
            myfile: the image to be uploaded
        }
    Returns: Success message and the imagePath or failure message along with the error if any
    Redirects to: Nothing.
    Calling route: '/api/business/addPhoto'
*/
module.exports.addPhoto = function (req, res) {
    //upload the image
    uploadPhotos(req, res, function (err) {
        //if an error occurred, return the error
        if (err) {
            return res.status(500).json({
                error: err,
                msg: "Error uploading photo.",
                data: null
            });
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

            string = string.toLowerCase();
            //check if it is not a valid image format
            if (!(string === "png" || string === "jpg" || string === "jpeg")) {
                //delete the uploaded file
                fs.unlink(req.file.path);

                //return the error message to frontend
                return res.status(500).json({
                    error: null,
                    msg: "File format is not supported.",
                    data: null
                });
            }

            //copy and rename the image to the following format and location
            var newPath = path.join(__dirname, "../", "../public/uploads/businessPhotos/" + req.file.filename + "." + string);
            fs.renameSync(req.file.path, newPath, function (err) {
                if (err) throw err;

                //delete the image with the old name
                fs.unlink(req.file.path);
            });

            //add the image file name to the photos array of the Business model
            Business.findByIdAndUpdate(req.user._id, {
                    $push: {
                        "photos": req.file.filename + "." + string
                    }
                },
                function (err, business) {
                    //couldn't add to array, return the error
                    if (err) {
                        res.status(500).json({
                            error: err,
                            msg: "Error retrieving business from database",
                            data: null
                        });
                    } else {
                        //if updating is ok
                        if (business) {
                            //return the file path to the frontend to show the image
                            res.status(201).json({
                                error: null,
                                msg: "Photo was added successfully.",
                                data: {
                                    imagePath: req.file.filename + "." + string
                                }
                            });
                        } else
                            res.status(404).json({
                                error: null,
                                msg: "Business not found.",
                                data: null
                            });
                    }
                });
        }
        //multer did not find a file selected to upload
        else {
            res.status(500).json({
                error: null,
                msg: "Please choose a valid file.",
                data: null
            });
        }
    });
};


/*
    Delete function that deletes a photo from business photos.
    Takes:
        params: {
            photoPath
        }
    Returns: Success or failure message along with the error if any
    Redirects to: Nothing.
    Calling route: '/api/business/deletePhoto/:photoPath'
*/
module.exports.deletePhoto = function (req, res) {
    var imagePath = req.params.photoPath;
    var businessId = req.user._id;
    Business.update({
        _id: businessId
    }, {
        $pull: {
            "photos": imagePath
        }
    }, function (err, result) {
        if (err) {
            res.status(500).json({
                error: err,
                msg: "Error retrieving business from database",
                data: null
            });
        } else {
            //if image found in business photos
            if (result.nModified > 0) {
                //add directory path to image name
                imagePath = path.join(__dirname, "../", "../public/uploads/businessPhotos/", req.params.photoPath);

                //delete the photo from filesystem
                fs.unlink(imagePath, function (err) {
                    //don't care if file doesn't exist
                });
                res.status(201).json({
                    error: null,
                    msg: "Photo was deleted successfully.",
                    data: null
                });
            } else
                res.status(404).json({
                    error: null,
                    msg: "Photo was not found.",
                    data: null
                });
        }
    });
};


/*
    Post function that adds the business's name, password, email & description to the db on applying
    Takes:
        Body: {
            name: "name of business",
            password: "password of business",
            confirmPassword: "confirming password of business",
            email: "email of business",
            description: "description about business"
        }
    Returns: Success or failure message along with the error if any
    Redirects to: Nothing.
    Calling Route: '/api/business/apply'
*/
module.exports.addBusiness = function (req, res) {

    //Validating inputs
    req.checkBody('name', 'Your business name is required.').notEmpty();
    req.checkBody('password', 'Password is required.').notEmpty();
    req.checkBody('password', 'Password must be at least 8 characters.').isAlphanumeric();
    req.checkBody('password', 'Password must be at least 8 characters.').len(8);
    req.checkBody('confirmPassword', 'Passwords do not match.').equals(req.body.password);
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Email format is not correct.').isEmail();
    req.checkBody('description', 'A brief description of your business is necessary to apply.').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.status(500).json({
            "error": errors,
            "msg": "Problem with submitted fields.",
            "data": null
        });
    } else {
        req.body.email = req.body.email.trim();
        const name = req.body.name;
        const password = req.body.password;
        const email = req.body.email;
        const description = req.body.description;

        //Checking if email is already taken
        Business.findOne({
            'email': email
        }, (err, business) => {
            if (err) return res.status(500).json({
                "error": err,
                "msg": "Error finding business.",
                "data": null
            });
            if (business) res.status(500).json({
                "error": null,
                "msg": "Email already used. Please enter another email.",
                "data": null
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
                        if (err) return res.status(500).json({
                            "error": err,
                            "msg": "An error occurred while encrypting.",
                            "data": null
                        });
                        newBusiness.password = hash;

                        //Adding business to the db after making sure all inputs are valid and the password is encrypted
                        newBusiness.save(function (err) {
                            if (err) return res.status(500).json({
                                "error": err,
                                "msg": "Was not able to save your business, please try again.",
                                "data": null
                            });
                            res.status(200).json({
                                "error": null,
                                "msg": "Your application is successfully submitted!",
                                "data": null
                            });
                        });
                    });
                });
            }
        });
    }
};


/*
    Put function that increments the interactivity attribute of a certain business by 1
    Takes: nothing.
    Returns: {
        error: "Error object if any",
        msg: "A success or failure message"
    }
    Redirects to: Nothing.
    Calling route: '/api/business/:businessId/interact'
*/
module.exports.updateInteractivity = function (req, res) {
    Business.findById(req.params.businessId, function (err, business) {
        if (err) {
            res.status(500).json({
                error: err,
                msg: "Error retrieving business from database",
                data: null
            });
        } else {
            if (!business) {
                res.status(404).json({
                    error: null,
                    msg: "Business not found",
                    data: null
                });

            } else {
                business.interactivity = business.interactivity + 1;
                business.save(function (err) {
                    if (err) {
                        res.status(500).json({
                            error: err,
                            msg: "Error retrieving business from database",
                            data: null
                        });
                    } else {
                        res.status(200).json({
                            error: null,
                            msg: "Business interactivity incremented",
                            data: null
                        });
                    }

                });
            }
        }

    });
};


/*
    Get function that returns the three most popular businesses based on their interactivity
    Takes: nothing.
    Returns: {
        error: "Error object if any",
        msg: "Succes or failure message",
        data: "array of three business objects"
    }
    Redirects to: Nothing.
    Calling route: '/api/business/mostPopular'
*/
module.exports.getMostPopular = function (req, res) {
    // query for sorting businesses based on interactivity and limits the result to 3
    const query = Business.find().sort({
        interactivity: -1
    }).limit(3);
    // execute the above query
    query.exec(function (err, businesses) {
        // If there is an error return it in response
        if (err) res.status(500).json({
            error: err,
            msg: 'Failed to retrieve most popular businesses',
            data: null
        });
        else
            // If no error return the list of businesses
            res.status(200).json({
                error: null,
                msg: 'Got most popular businesses successfully',
                data: businesses
            });
    });
};


/*
    Post function, to Upload Logo using multer
    and store the uploaded image path in the Business
    model in photos array, and return the
    filepath to the frontend to show the image.
    Takes:
        body{
            myfile: the image to be uploaded
        }
    Returns: Success along with image path or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling Route: '/api/business/addLogo'
*/
module.exports.uploadLogo = function (req, res) {
    //upload the image
    uploadBusinessLogo(req, res, function (err) {
        //if an error occurred, return the error
        if (err) {
            return res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
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
            string = string.toLowerCase();
            //check if it is not a valid image format
            if (!(string === "png" || string === "jpg" || string === "jpeg")) {
                //delete the uploaded file
                fs.unlink(req.file.path);

                //return the error message to frontend
                return res.status(500).json({
                    error: null,
                    msg: 'File format is not supported.',
                    data: null
                });
            }
            //copy and rename the image to the following format and location
            var newPath = path.join(__dirname, "../", "../public/uploads/businessLogos/" + req.file.filename + "." + string);
            fs.renameSync(req.file.path, newPath, function (err) {

                if (err) throw err;

                //delete the image with the old name
                fs.unlink(req.file.path);
            });

            //save the image file path to the Business model
            Business.findById(req.user._id, function (err, business) {
                //if an error occurred, return the error
                if (err)
                    res.status(500).json({
                        error: err,
                        msg: null,
                        data: null
                    });
                else {
                    //if found business
                    if (business) {
                        //if exists an old logo, save its old value incase updating logo fails
                        if (business.logo) {
                            var oldLogo = path.join(__dirname, "../", "../public/uploads/businessLogos/", business.logo);
                        }
                        business.logo = req.file.filename + "." + string;
                        business.save(function (err) {
                            //couldn't save, return the error
                            if (err) {
                                res.status(500).json({
                                    error: err,
                                    msg: null,
                                    data: null
                                });
                            } else {
                                //if he had a logo before
                                if (oldLogo) {
                                    //updated successfully, delete the old logo
                                    fs.unlink(oldLogo, function (err) {
                                        //don't care if file not found
                                    });
                                }
                                //return the file path to the frontend to show the image
                                res.status(200).json({
                                    error: null,
                                    msg: 'Logo was updated successfully.',
                                    data: business.logo
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
        }
        //multer did not find a file selected to upload
        else {
            res.status(500).json({
                error: null,
                msg: 'Please choose a valid file.',
                data: null
            });
        }
    });
};


/*
    Get function, that gets the current data of the business
    and pass business object to the frontend to display it.
    Takes:
        params{
            businessId
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling Route: '/api/business/:businessId/getInfo'
*/
module.exports.getCurrentInfo = function (req, res) {
    //select all fields except password
    Business.findById(req.params.businessId).select('-password').exec(function (err, business) {
        //if error occured
        if (err) {
            res.status(500).json({
                error: err,
                msg: null,
                data: null

            });
        } else {
            if (business){
            /*    let filteredBusiness = {
                  name: business.name,
                  email: business.email,
                  category
                }  */
                res.status(200).json({
                    error: null,
                    msg: null,
                    data: business
                });
              }

            else
                res.status(404).json({
                    error: null,
                    msg: 'Business not found.',
                    data: null
                });
        }
    });
};


/*
    Put Function, to save the edited business info in the database.
    Takes:
        body{
            name,
            description,
            tags,
            category,
            paymentRequired,
            phoneNumbers,
            workingDays
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling Route: '/api/business/editInfo'
*/
module.exports.saveNewInfo = function (req, res) {

    //security checks to disable editing sensitive info
    delete req.body.email;
    delete req.body._id;
    delete req.body.password;
    delete req.body.verified;
    delete req.body.createdAt;
    delete req.body.interactivity;
    delete req.body.totalRatings;
    delete req.body.reviews;
    delete req.body.activities;
    delete req.body.logo;
    //pass in the non null values in req.body to modify it only
    Business.findByIdAndUpdate(req.user._id, req.body, function (err, business) {
        if (err) {
            res.status(500).json({
                error: err,
                msg: null,
                data: null
            });
        } else {
            if (business) {
                res.status(201).json({
                    error: null,
                    msg: 'Business edited successfully.',
                    data: null
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
    Put Function, to change the password of the business.
    Takes:
        body{
            oldPassword,
            password,
            confirmPassword
        }
    Returns: Success or failure messages along with errors in case of failure.
    Redirects to: Nothing.
    Calling Route: '/api/business/changePassword'
*/
module.exports.changePassword = function (req, res) {
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
        Business.findById(req.user._id, function (err, business) {
            if (err)
                res.status(500).json({
                    error: err,
                    msg: null,
                    data: null
                });
            else {
                if (business) {
                    //check that the old password is correct
                    Business.comparePassword(oldPassword, business.password, function (err, isMatched) {
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

                                bcrypt.genSalt(10, function (err, salt) {
                                    bcrypt.hash(password, salt, function (err, hash) {
                                        business.password = hash;
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
                        msg: 'Business not found.',
                        data: null
                    });
            }
        });
    }
};
