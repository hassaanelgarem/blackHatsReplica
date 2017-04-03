const mongoose = require("mongoose");
const Business = mongoose.model("Business");
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressValidator = require('express-validator');


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
  req.checkBody('email','Email format is not correct.').isEmail();
  req.checkBody('description', 'A breif description of your business is necessary to apply.').notEmpty();

  //Checking if email is already taken
  Business.find({'email' : email}, (err, business) => {
    if (err) return res.json('Signup error');
    if (business.length!=0) return res.json('Email already used. Please enter another email.');
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
        if(err) return res.json({success: false, msg:'An error occurred while encrypting', error: err});
        newBusiness.password = hash;

        //Adding business to the db after making sure all inputs are valid and the password is encrypted
        newBusiness.save(function(err) {
          if(err) return res.json({success : false, msg : 'Was not able to save your business, please try again'});
          res.json({success : true, msg : 'Your application is successfully submitted!'});
            })
        })
    })
};


//Middleware function for Passport module for authentication
module.exports.passportAuthenticate = passport.authenticate('local');

module.exports.test = function(req, res, next){
  res.send("Hello");
  next();
}
module.exports.test2 = function(req, res){
  res.send("Hello2");
}

//Post function to login a business
//Calling Route: /api/business/login/
module.exports.businessLogin = function(req, res) {
  console.log("Hi");

    //Setting the Session Variable loggedin to the email in order to get the logged in user for later usage.
      req.session.loggedin = req.body.email;
      res.json('You are logged in as ' + req.user.email);
    }


//Post function to logout a business
//Calling Route: /api/business/logout
module.exports.businessLogout = function(req,res) {
    req.logout();
    res.json('You have successfully logged out.');
}


//Passport handling the login
passport.use(new LocalStrategy(function(email, password, done) {
  console.log("Hi");
    // Finding the business by his email
    Business.getBusinessByEmail(email, function(err, business) {
        if(err) console.log(err);
        if(!business) return done(null, false, {message: 'Invalid Email.'});
        //Comparing to see if the 2 passwords match
        Business.comparePassword(password, business.password, function(err, isMatch) {
            if(err) console.log(err);
            if(isMatch) return done(null, business);
            else return done(null, false, {message: 'Invalid password.'});
        });
    });
}));


//Passport module serializes User ID
passport.serializeUser(function(business, done) {
  console.log("Hi");

    done(null, business.id);
});


//Passport module deserializes User ID
passport.deserializeUser(function(id, done) {
    console.log("Hi");
    Business.getBusinessById(id, function(err, business) {
        if(err) console.log(err);
        done(err, business);
    });
});


// Get function that returns all unverified businesses based on the value of the attribute verified
// Calling Route: /api/business/unVerifiedBusinesses
module.exports.unVerifiedBusinesses = function(req, res) {
    const query = Business.find({verified : false});
    query.exec(function(err, businesses) {
        if(err) res.json({success : false, msg : 'Can not retrieve unverified businesses'});
        res.json({success : true, msg : 'Got unverified businesses successfully', businesses : businesses});
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
            if (err) res.jason({success : false, msg : 'Was not able to verify business'});
            res.json({success : true, msg : 'Business verified!'});
        });
    });
};


// Post function that declines verification of a business
// Calling Route: /api/business/decline/:id
module.exports.declineBusiness = function(req, res) {
    // delete declined busiess
    Business.deleteOne( { id : req.params.id } );
};


// Post function that increments the interactivity attribute of a certain business by 1
// Calling Route: /api/business/interact/:id
module.exports.updateInteractivity = function(req, res) {
    Business.findById(req.params.id, function(err, business) {
        business.interactivity = business.interactivity + 1;
        business.save(function(err) {
            if(err) res.json({success : false, msg: 'Updating business interactivity failed'});
            res.json({success : true, msg : 'Business interactivity incremented'});
        })
    });
};


// Get function that returns the three most popular businesses based on their interactivity
// Calling Route: /api/business/mostPopular
module.exports.getMostPopular = function(req, res) {
    const query = Business.find().sort({interactivity: -1}).limit(3);
    query.exec(function(err, businesses) {
        if(err) res.json({success : false, msg : 'Failed to retrieve most popular businesses'});
        res.json({success : true, msg : 'Got most popular businesses successfully', businesses : businesses});
    });
};
