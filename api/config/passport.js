const LocalStrategy = require('passport-local').Strategy;
const mongoose = require("mongoose");
const Business = mongoose.model("Business");
const User = mongoose.model("User");
const passport = null;


var configurePassport = function(passport) {
    // Passport handling the login
    passport.use('local-user', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function(username, password, done) { // Finding the user by his username
        User.getUserByUsername(username, function(err, user) {
            if (err) return done(err);
            if (!user) {
                return done(null, false, {
                    msg: 'Invalid Username.'
                });
            }
            //Comparing to see if the 2 passwords match
            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) return done(err);
                if (isMatch)
                    return done(null, user);
                else
                    return done(null, false, {
                        msg: 'Invalid password.'
                    });
            });
        });
    }));


    passport.use('local-business', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, function(email, password, done) {
        // Finding the business by his email
        Business.getBusinessByEmail(email, function(err, business) {
            if (err) return done(err);
            if (!business) return done(null, false, {
                msg: 'Invalid email.'
            });
            if (!business.verified)
                return done(null, false, {
                    msg: "Not verified yet"
                });
            //Comparing to see if the 2 passwords match
            Business.comparePassword(password, business.password, function(err, isMatch) {
                if (err) return done(err);
                if (isMatch) return done(null, business);
                done(null, false, {
                    message: 'Invalid password.'
                });
            });
        });
    }));


    //Passport module serializes document ID
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });


    //Passport module deserializes document ID
    passport.deserializeUser(function(id, done) {
        User.getUserById(id, function(err, user) {
            if (err)
                done(err);
            else if (user) {
                done(err, user);
            } else {
                Business.getBusinessById(id, function(err, business) {
                    if (err)
                        done(err);
                    else
                        done(err, business);
                });
            }
        });
    });
    this.passport = passport;
};


var isUserLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.constructor.modelName === "User")
            return next();
    }

    res.status(401).json({
        error: null,
        msg: 'User login is required.',
        data: null
    });
};


var isAdminLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.username === 'admin')
            return next();
    }
    res.status(401).json({
        error: null,
        msg: 'Admin login is required.',
        data: null
    });
};


var isBusinessLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.constructor.modelName === "Business")
            return next();
    }
    res.status(401).json({
        error: null,
        msg: 'Business login is required.',
        data: null
    });
};


var isNotLoggedIn = function(req, res, next) {
    if (!req.isAuthenticated())
        return next();
    res.status(401).json({
        error: null,
        msg: 'A login session already exists.',
        data: null
    });
};


var logout = function(req, res) {
    req.logout();
    res.status(200).json({
        error: null,
        msg: 'You were successfully logged out of your account.',
        data: null
    });
};


module.exports = {
    configurePassport: configurePassport,
    passport: passport,
    isUserLoggedIn: isUserLoggedIn,
    isBusinessLoggedIn: isBusinessLoggedIn,
    isAdminLoggedIn: isAdminLoggedIn,
    isNotLoggedIn: isNotLoggedIn,
    logout: logout
};
