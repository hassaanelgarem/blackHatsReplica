const multer = require('multer');
const mongoose = require("mongoose");
const Activity = mongoose.model("Activity");
const fs = require('fs');
const path = require("path");


/* Multer configuration to upload a single file from an
html input with name "myfile" to public/uploads/activityPhotos folder*/
const uploadPhotos = multer({
    dest: path.join(__dirname, '../', '../public/uploads/activityPhotos')
}).single('myfile');


/*
Post function to upload photo using multer
and store the uploaded image path in the Activity
model in photos array, and return the
filepath to the frontend to show the image.
Calling route: '/api/activity/:activityId/addPhoto'
*/
module.exports.addPhoto = function(req, res) {
    //Check if business is logged in
    if (req.user) {
        //upload the image
        uploadPhotos(req, res, function(err) {
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
                var newPath = path.join(__dirname, "../", "../public/uploads/activityPhotos/img" + Date.now() + "." + string);
                fs.renameSync(req.file.path, newPath, function(err) {
                    if (err) throw err;

                    //delete the image with the old name
                    fs.unlink(req.file.path);
                });

                //get the name part only from the uploaded image
                var nameLength = ("img" + Date.now() + string).length + 1;
                newPath = newPath.substring(newPath.length - nameLength);

                //add the image file name to the photos array of the Business model
                Activity.update({
                        "_id": req.params.activityId
                    }, {
                        $push: {
                            "photos": newPath
                        }
                    },
                    function(err, result) {
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
                                    error: "Activity not found"
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
    }
    //user is not logged in
    else {
        res.json({
            error: "Please Login"
        });
    }
};


/*
delete function that deletes photo from activity's
photos array, and returns success message or error message.
Calling route: '/api/activity/activityId/deletePhoto/:photoPath'
*/
module.exports.deletePhoto = function(req, res) {
    var imagePath = req.params.photoPath;
    var activityId = req.params.activityId;
    Activity.update({
        "_id": activityId
    }, {
        $pull: {
            "photos": imagePath
        }
    }, function(err, data) {
        if (err) {
            res.json({
                success: false,
                msg: 'deleting photo failed'
            });
        } else {

            //add directory path to image name
            imagePath = path.join(__dirname, "../", "../public/uploads/activityPhotos/", req.params.photoPath);

            //delete the photo from filesystem
            fs.unlink(imagePath, function(err) {
                //don't care if file doesn't exist
            });
            res.json({
                success: true,
                msg: 'photo deleted successfully'
            });
        }
    });
};
