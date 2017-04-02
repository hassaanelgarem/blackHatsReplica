const mongoose = require("mongoose");
const Business = mongoose.model("Business");
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Post function that increments the interactivity attribute of a certain business by 1
// URI: api/business/interact/:id
module.exports.updateInteractivity = function (req, res) {
  Business.findById(req.params.id, function (err, business) {
    business.interactivity = business.interactivity + 1;
    business.save(function (err) {
      if (err) res.json({
        success: false,
        msg: 'Updating business interactivity failed'
      });
      res.json({
        success: true,
        msg: 'Business interactivity incremented'
      });
    })
  });
};


// Get function that returns the three most popular businesses based on their interactivity
// URI: api/business/mostPopular
module.exports.getMostPopular = function (req, res) {
  const query = Business.find().sort({
    interactivity: -1
  }).limit(3);
  query.exec(function (err, businesses) {
    if (err) res.json({
      success: false,
      msg: 'Failed to retrieve most popular businesses'
    });
    res.json({
      success: true,
      msg: 'Got most popular businesses successfully',
      businesses: businesses
    });
  });
};


/* Multer configuration to upload a single file from an
html input with name "myfile" to public/uploads/businessLogos folder*/
const uploadBusinessLogo = multer({
  dest: path.join(__dirname, '../', '../public/uploads/businessLogos')
}).single('myfile');


/* 
Put function to Upload Logo using multer 
and store the uploaded image path in the Business 
model in photos array, and return the 
filepath to the frontend to show the image.
Calling route: '/editBusiness/:businessId/addLogo'
*/
module.exports.uploadLogo = function (req, res) {
  //Check if logged in
  if (req.user) {
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
        Business.findById(req.params.businessId, function (err, business) {
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
                  //updated successfully, delete the old logo
                  fs.unlink(oldLogo, function (err) {
                    //don't care if file not found
                  });
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
  }
  //user is not logged in
  else {
    res.json({
      error: "login"
    });
  }
};
