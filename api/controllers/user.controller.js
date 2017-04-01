const User = require('../data/user.model');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require("mongoose");

/* Function to register a new user into the users database
   URI: /api/register/   */
    module.exports.registerUser= function(req, res)
    {
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var confirmPassword = req.body.confirmPassword;
        var profilePicture = req.body.profilePicture;
        var birthDate = req.body.birthDate;

        //Validating entries
        req.checkBody('firstName', 'First Name is required.').notEmpty();
        req.checkBody('lastName', 'Last Name is required.').notEmpty();
        req.checkBody('email', 'Email is required.').notEmpty().isEmail();
        req.checkBody('username', 'Username is required.').notEmpty();
        req.checkBody('password', 'Password is required.').notEmpty();
        req.checkBody('confirmPassword', 'Passwords do not match.').equals(password);

        var errors = req.validationErrors();

        if (errors)
        {
            //TODO in front end
            res.render('register', {errors: errors});
        }
        else
        {
            User.find({'username': username,'email':email }, function(err, user) 
            {
                if (err) 
                {
                    //TODO Error handling
                    res.send('Signup error');
                    return done(err);
                }

                //if user found
                if (user.length!=0) 
                {
                    if(user[0].username)
                    {
                        res.send('Username already exists, username: ' + username + '. Please enter another username.');                         
                    }
                    else
                    {
                        res.send('Email already exists, email: ' + email + '. Please enter another email. ');      
                    }                                    
                      //check these 3 lines
                        var err = new Error();
                        err.status = 310;
                        return done(err);
                }
                else //we're good to go
                {
                    var newUser = new User
                    ({  firstName: firstName,
                        lastName: lastName,
                        email: email,
                        username: username,
                        password: password,
                        birthDate: birthDate
                      });

                    User.createUser(newUser, function(err, user)
                    {
                        if(err) throw err;
                        res.json(err);
                    });
                    //TODO
                    // req.flash('successMessage', 'You have been registered successfully!');
                    res.redirect('/api/login');
                }
            }
                 )
        }
    }

/* Function to login a user
   URI: /api/login/   */
    module.exports.login = function(req, res)
    {
        //update this on frontend stage
        passport.authenticate('local', {successRedirect:'/users/profile', failureRedirect:'/users/login',failureFlash: true}),
        function(req, res) 
        {
            req.session.loggedin = req.body.username;
            //redirect feen?
            // res.redirect('/api/profile');
        }
    }

/* Function to logout a user
   URI: /api/logout/   */
    module.exports.logout = function(req,res)
    {
        req.logout();
        res.redirect('/api');
    }

// Passport handling the login
passport.use(new LocalStrategy(
  function(username, password, done) 
  { // Finding the user by his username
   User.getUserByUsername(username, function(err, user)
   {
   	if(err) throw err;
   	if(!user)
	{
   		return done(null, false, {message: 'Invalid Username.'});
   	}
       //Comparing to see if the 2 passwords match
   	User.comparePassword(password, user.password, function(err, isMatch)
	{
   	if(err) throw err;
   		if(isMatch)
   			return done(null, user);
		   else 
   			return done(null, false, {message: 'Invalid password.'});
   	});
   });
  }));

//Passport module serializes User ID
passport.serializeUser(function(user, done) 
  {
 	 done(null, user.id);
  });

//Passport module deserializes User ID
passport.deserializeUser(function(id, done) 
{
  User.getUserById(id, function(err, user) 
  {
    done(err, user);
  });
});

module.exports = userCtrl;
