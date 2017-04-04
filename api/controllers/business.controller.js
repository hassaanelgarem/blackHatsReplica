const multer = require('multer');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressValidator = require('express-validator');
const fs = require('fs');
const path = require("path");
const nodemailer = require('nodemailer');
const User = mongoose.model("User");
const Business = mongoose.model("Business");


/* Multer configuration to upload a single file from an
html input with name "myfile" to public/uploads/businessPhotos folder*/
const uploadPhotos = multer({
    dest: path.join(__dirname, '../', '../public/uploads/businessPhotos')
}).single('myfile');


// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'blackhatsguc@gmail.com',
        pass: 'youmwarayoum'
    }
});


/*3.3:
Upload photo using multer
and store the uploaded image path in the Business
model in photos array, and return the
filepath to the frontend to show the image.
Calling route: '/business/:businessId/addPhoto'
*/
module.exports.addPhoto = function(req, res) {
    //Check if business logged in
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
                var newPath = path.join(__dirname, "../", "../public/uploads/businessPhotos/img" + Date.now() + "." + string);
                fs.renameSync(req.file.path, newPath, function(err) {
                    if (err) throw err;

                    //delete the image with the old name
                    fs.unlink(req.file.path);
                });

                //get the name part only from the uploaded image
                var nameLength = ("img" + Date.now() + string).length + 1;
                newPath = newPath.substring(newPath.length - nameLength);

                //add the image file name to the photos array of the Business model
                Business.update({
                        "_id": req.params.businessId
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


/*
delete function that deletes photo from business'
photos array, and returns success message or error message.
Calling route: '/business/:businessId/deletePhoto/:photoPath'
*/
module.exports.deletePhoto = function(req, res) {
    var imagePath = req.params.photoPath;
    var businessId = req.params.businessId;
    Business.update({
        "_id": businessId
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
            imagePath = path.join(__dirname, "../", "../public/uploads/businessPhotos/", req.params.photoPath);

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


// Post function that adds the business's name, password, email & description to the db on applying
// Calling Route: /api/business/apply
module.exports.addBusiness = function(req, res) {
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

    //Checking if email is already taken
    Business.find({
        'email': email
    }, (err, business) => {
        if (err) return res.json('Signup error');
        if (business.length != 0) return res.json('Email already used. Please enter another email.');
    })
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
            newBusiness.save(function(err) {
                if (err) return res.json({
                    success: false,
                    msg: 'Was not able to save your business, please try again'
                });
                res.json({
                    success: true,
                    msg: 'Your application is successfully submitted!'
                });
            })
        })
    })
};


//Middleware function for Passport module for authentication
module.exports.passportAuthenticate = passport.authenticate('local');


//Post function to login a business
//Calling Route: /api/business/login/
module.exports.businessLogin = function(req, res) {
    //Setting the Session Variable loggedin to the email in order to get the logged in user for later usage.
    req.session.loggedin = req.body.username;
    res.json('You are logged in as ' + req.user.email);
}


//Post function to logout a business
//Calling Route: /api/business/logout
module.exports.businessLogout = function(req, res) {
    req.logout();
    res.json('You have successfully logged out.');
}


//Passport handling the login
passport.use(new LocalStrategy(function(username, password, done) {
    // Finding the business by his email
    Business.getBusinessByEmail(username, function(err, business) {
        if (err) res.json({
            success: false,
            msg: 'Can not get business by email'
        });
        if (!business) return done(null, false, {
            message: 'Invalid email.'
        });
        //Comparing to see if the 2 passwords match
        Business.comparePassword(password, business.password, function(err, isMatch) {
            if (err) res.json({
                success: false,
                msg: 'Error in comparing passwords'
            });
            if (isMatch) return done(null, business);
            else return done(null, false, {
                message: 'Invalid password.'
            });
        });
    });
}));


//Passport module serializes User ID
passport.serializeUser(function(business, done) {
    done(null, business.id);
});


//Passport module deserializes User ID
passport.deserializeUser(function(id, done) {
    Business.getBusinessById(id, function(err, business) {
        if (err) res.json({
            success: false,
            msg: 'Can not deserialize user'
        });
        done(err, business);
    });
});


// Get function that returns all unverified businesses based on the value of the attribute verified
// Calling Route: /api/business/unVerifiedBusinesses
module.exports.unVerifiedBusinesses = function(req, res) {
    const query = Business.find({
        verified: false
    });
    query.exec(function(err, businesses) {
        if (err) res.json({
            success: false,
            msg: 'Can not retrieve unverified businesses'
        });
        res.json({
            success: true,
            msg: 'Got unverified businesses successfully',
            businesses: businesses
        });
    });
};


// Post function that verifies the business
// Calling Route: /api/business/verify/:id
module.exports.verifyBusiness = function(req, res) {
    //Getting the business by its id
    Business.findById(req.params.id, function(err, business) {
        // verifying the business
        business.verified = true;
        // updating the db
        business.save(function(err) {
            if (err) res.json({
                success: false,
                msg: 'Was not able to verify business'
            });
            sendEmail(true, business.name, business.email, function(err, info){
                if(err) res.json({success: false, error: err, msg: 'Bussines was not notified of verification'});
                res.json({success: true, msg: 'Business verified and notified'});
            });
        });
    });
};


// Post function that declines verification of a business
// Calling Route: /api/business/decline/:id
module.exports.declineBusiness = function(req, res) {
    // delete declined busiess
    Business.findById(req.params.id, function(err, business) {
      console.log(business);
      Business.deleteOne({_id: req.params.id}, function(err, doc){
        if(err) {
          res.json({success: false, msg: "Error deleting business"});
        }
        else{
          console.log(business);
          sendEmail(false, business.name, business.email, function(err, info){
              if(err) {
                res.json({success: false, error: err, msg: 'Business was not notified of rejection'});
              }
              else{
                res.json({success: true, msg: 'Business rejected and notified'});
              }

          });
        }

      });
    });
};



/*
Post function that increments the interactivity attribute of a certain business by 1
Calling route: api/business/interact/:id
*/
module.exports.updateInteractivity = function(req, res) {
    Business.findById(req.params.id, function(err, business) {
        business.interactivity = business.interactivity + 1;
        business.save(function(err) {
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


/*
Get function that returns the three most popular businesses based on their interactivity
Calling route: api/business/mostPopular
*/
module.exports.getMostPopular = function(req, res) {
    // query for sorting businesses based on interactivity and limits the result to 3
    const query = Business.find().sort({
        interactivity: -1
    }).limit(3);
    // execute the above query
    query.exec(function(err, businesses) {
        // If there is an error return it in response
        if (err) res.json({
            success: false,
            msg: 'Failed to retrieve most popular businesses'
        });
        // If no error return the list of businesses
        res.json({
            success: true,
            msg: 'Got most popular businesses successfully',
            businesses: businesses
        });
    });
};


/*
  Helper function that takes Business Name and email and sends them
  an email notifying them they were verified or rejected
*/
function sendEmail(verify, businessName, businessEmail, done) {
    var mailOptions = {};
    if(verify) {
       mailOptions = {
          from: '"Black Hats Team" <blackhatsguc@gmail.com>', // sender address
          to: businessEmail, // list of receivers
          subject: 'Account Verified', // Subject line
          text: 'Hello ' + businessName + '!\n\nYour acount has been verified.\n\nWelcome to Black Hats' // plain text body
      };
    }
    else {
      mailOptions = {
          from: '"Black Hats Team" <blackhatsguc@gmail.com>', // sender address
          to: businessEmail, // list of receivers
          subject: 'Account Rejected', // Subject line
          text: 'Hello ' + businessName + '\n\nUnfortunately, your application was rejected.\n\nThank you for considering Black Hats' // plain text body
      };
    }


    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            done(error, null);
        }
        done(null, info);
    });
}
