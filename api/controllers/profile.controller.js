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


/*Get function, to Get User info from the User model with _id
equal to the paraams.userID and return it
Calling route: '/api/profile/:userId'
*/
module.exports.getOneUser = function (req, res) {
  var userId = req.params.userId;

  // finds user with the userId from the User model
  User.findById(userId).exec(function (err, doc) {
    //if an error to find the user,I return the error message
    if (err) {
      res.status(500).json(err);
      //if no user with that userId was found,I return an error message
    } else if (!doc) {
      res.status(404).json({
        message: "userId not found " + userId
      });
    }
    //when the user is found successfully,I return the user
    else {
      res.status(200).json(doc);
    }
  });
};


/*Put function, to Update the User info from the User model with _id
equal to the paraams.userID
Calling route: '/api/profile/:userId'
*/
module.exports.updateOneUser = function (req, res) {
  var userId = req.params.userId;

  //if user logged in
  if (req.user) {
    // finds user with the userId from the User model
    User.
    findById(userId)
      //exclude the arrays from the query as i won't update them
      .select("-favorites -reviews -bookings")
      .exec(function (err, doc) {
        //if an error to find the user,I return the error message
        if (err) {
          res.status(500).json(err);
        } else if (!doc) {
          //if no user with that userId was found,I return an error message
          res.status(404).json({
            "message": "userId not found " + userId
          });
        }
        //if the user is found start updating his info
        else {
          doc.firstName = req.body.firstName;
          doc.lastName = req.body.lastName;
          doc.email = req.body.email;
          doc.username = req.body.username;
          doc.password = req.body.password;
          doc.birthDate = req.body.birthDate; //should be in the format mm-dd-yyyy or mm/dd/yyyy
          //save the user instance to the database
          doc.save(function (err, userUpdated) {
            //if an error saving the user instance
            if (err) {
              res.status(500).json(err);
            } else {
              //the user instance was updated successfully
              res.status(200).json({
                success: true,
                msg: "user updated sucessfully",
                user: userUpdated
              }); //successful and no content
            }
          });
        }
      });
  } else {
    res.json({
      success: false,
      msg: "you should login first"
    });
  }
};


/*Put function, to Upload User profile picture using multer
and store the uploaded image path in the User
model in profilePicture field, and return the
filepath to the frontend to show the image.
Calling route: '/api/profile/:userId/uploadProfilePicture'
*/
module.exports.uploadProfilePicture = function (req, res) {
  //Check if logged in
  // if (req.user) {
  //upload the image

  uploadProfilePic(req, res, function (err) {
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
      var newPath = path.join(__dirname, "../", "../public/uploads/profilePictures/img" + Date.now() + "." + string);
      fs.renameSync(req.file.path, newPath, function (err) {
        if (err) throw err;

        //delete the image with the old name
        fs.unlink(req.file.path, function (err) {
          //don't care if file not found
        });
      });

      //get the name part only from the uploaded image
      var nameLength = ("img" + Date.now() + string).length + 1;
      newPath = newPath.substring(newPath.length - nameLength);

      //save the image file path to the User model
      User.findById(req.params.userId, function (err, user) {
        if (user.profilePicture) {
          var oldPP = path.join(__dirname, "../", "../public/uploads/profilePictures/", user.profilePicture);
        }
        user.profilePicture = newPath;
        user.save(function (err) {
          //couldn't save, return the error
          if (err) {
            res.json(err);
          } else {
            if (oldPP) {
              //updated successfully, delete the old pp
              fs.unlink(oldPP, function (err) {
                //don't care if file not found
              });
            }
            //return the file path to the frontend to show the image
            res.json({
              sucess: true,
              msg: "uploaded successfully",
              path: newPath
            });
          }
        });
      });
    }
    //multer did not find a file selected to upload
    else {
      res.json({
        error: "Choose a valid file"
      });
    }
  });
  // }
  // //user is not logged in
  // else {
  //   res.json({
  //     error: "login"
  //   });
  // }
};