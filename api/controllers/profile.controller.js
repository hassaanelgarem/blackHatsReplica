const mongoose = require('mongoose');
const User = mongoose.model('User');
const Review = mongoose.model('Review');
const path = require('path');
const fs = require('fs');
const multer = require('multer');


/* Multer configuration to upload a single file from an
html input with name "myfile" to public/uploads/profilePictures folder*/
const uploadProfilePic = multer({
    dest: path.join(__dirname, '../', '../public/uploads/profilePictures')
}).single('myfile');


/*
    Get function that gets all info of a user
    it gets User info from the User model with _id
    equal to the params.userID and return it
    Takes: 
        params{
            userId
        }
    Returns: {
        error: "Error object if any",
        msg: "A message",
        data : the retrieved object from the database
    }
    Redirects to: Nothing.
    Calling route: '/api/user/profile/:userId'
*/
module.exports.getOneUser = function (req, res) {
    var userId = req.params.userId;

    // finds user with the userId from the User model
    User
        .findById(userId)
        .select("-password")
        .exec(function (err, doc) {
            //if an error to find the user,I return the error message
            if (err) {
                res.status(500).json({
                    error: err,
                    msg: "there is a problem retrieving the data from the database",
                    data: null
                });
                //if no user with that userId was found,I return an error message
            } else if (!doc) {
                res.status(404).json({
                    error: null,
                    msg: "Can not find a user with the specified id " + userId,
                    data: null
                });
            }
            //when the user is found successfully,I return the user
            else {
                res.status(200).json({
                    error: null,
                    msg: "User is found successfully",
                    data: doc
                });
            }
        });
};


/*
    Put function that updates a user
    it updates the user's info in the User model
    with _id equal to the params.userID
    Takes:
        Body: {
            firstName:"user's first name",
            lastName:"user's last name,
            birthDate:"user's birth date in the mm-dd-yyyy format"
        }
    Returns: {
        error: "Error object if any",
        msg: "A message",
        data : retrieve the updated object from the database
    }
    Redirects to: Nothing.
    Calling route: '/api/user/profile/editInfo'
*/
module.exports.updateOneUser = function (req, res) {
    var userId = req.user._id;

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var birthDate = req.body.birthDate;

    //Validating entries
    req.checkBody('firstName', 'First Name is required.').notEmpty();
    req.checkBody('lastName', 'Last Name is required.').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.status(500).json({
            errors: errors,
            msg: "Fields shouldn't be empty",
            data: null
        });
    } else {
        // finds user with the userId from the User model
        User.
        findById(userId)
            //exclude the arrays from the query as i won't update them
            .select("-favorites -reviews -bookings -password -username -email")
            .exec(function (err, doc) {
                //if an error to find the user,I return the error message
                if (err) {
                    res.status(500).json({
                        error: err,
                        msg: "There was a problem retrieving the data from the database.",
                        data: null
                    });
                } else if (!doc) {
                    //if no user with that userId was found,I return an error message
                    res.status(404).json({
                        error: err,
                        msg: "Can not find a user with the specified id " + userId,
                        data: null
                    });
                }
                //if the user is found start updating his info
                else {
                    doc.firstName = firstName || doc.firstName;
                    doc.lastName = lastName || doc.lastName;
                    doc.birthDate = birthDate || doc.birthDate; //should be in the format mm-dd-yyyy or mm/dd/yyyy

                    //save the user instance to the database
                    doc.save(function (err) {
                        //if an error saving the user instance
                        if (err) {
                            res.status(500).json({
                                error: err,
                                msg: "There was a problem updating the user info.",
                                data: null
                            });
                        } else {
                            //the user instance was updated successfully
                            res.status(200).json({
                                error: null,
                                msg: "User info was updated successfully.",
                                data: null
                            }); //successful and no content
                        }
                    });
                }
            });
    }
};


/*  
    Post function that sets the profile picture of the user.
    Takes:
        body: {
            myfile: the image to be uploaded
        }
    Returns: Success message and the imagePath or failure message along with the error if any
    Redirects to: Nothing.
    Calling route: '/api/user/profile/uploadProfilePicture'
*/
module.exports.uploadProfilePicture = function (req, res) {
    //upload the image
    uploadProfilePic(req, res, function (err) {
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
            var newPath = path.join(__dirname, "../", "../public/uploads/profilePictures/" + req.file.filename + "." + string);
            fs.renameSync(req.file.path, newPath, function (err) {
                if (err) throw err;

                //delete the image with the old name
                fs.unlink(req.file.path, function (err) {
                    //don't care if file not found
                });
            });

            //save the image file path to the User model
            User.findById(req.user._id, function (err, user) {
                if (err)
                    res.status(500).json({
                        error: err,
                        msg: "Error retrieving user from database.",
                        data: null
                    });
                else {
                    if (user) {
                        if (user.profilePicture) {
                            var oldPP = path.join(__dirname, "../", "../public/uploads/profilePictures/", user.profilePicture);
                        }
                        user.profilePicture = req.file.filename + "." + string;
                        user.save(function (err) {
                            //couldn't save, return the error
                            if (err) {
                                res.status(500).json({
                                    error: err,
                                    msg: "Updating your profile picture failed.",
                                    data: null
                                });
                            } else {
                                if (oldPP) {
                                    //updated successfully, delete the old pp
                                    fs.unlink(oldPP, function (err) {
                                        //don't care if file not found
                                    });
                                }
                                //return the file path to the frontend to show the image
                                res.status(201).json({
                                    error: null,
                                    msg: "Profile picture was updated successfully.",
                                    data: {
                                        imagePath: req.file.filename + "." + string
                                    }
                                });
                            }
                        });
                    } else
                        res.status(404).json({
                            error: null,
                            msg: "User not found.",
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
