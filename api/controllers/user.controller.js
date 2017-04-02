const User = require('../data/user.model');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require("mongoose");
const expressValidator = require('express-validator');

/* Function to register a new user into the users database
   Calling Route: /api/register/   */
    module.exports.registerUser= function(req, res)
    {
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var confirmPassword = req.body.confirmPassword;
        var birthDate = req.body.birthDate;

        //Validating entries
        req.checkBody('firstName', 'First Name is required.').notEmpty();
        req.checkBody('lastName', 'Last Name is required.').notEmpty();
        req.checkBody('email', 'Email is required.').notEmpty()
        req.checkBody('email','Email format is not correct.').isEmail();
        req.checkBody('username', 'Username is required.').notEmpty();
        req.checkBody('password', 'Password is required.').notEmpty();
        req.checkBody('confirmPassword', 'Passwords do not match.').equals(password);

        var errors = req.validationErrors();

        if (errors)
        {
            //TODO in front end
            //res.render('register', {errors: errors});
            res.json({errors: errors});
        }
        else
        {
            User.find({ $or:[ {'username': username} ,{'email': email}]}, function(err, user) 
            {
                //if there is an error, send an error message
                if (err) 
                {
                    //TODO Error handling
                    res.json('Signup error');
                    return done(err);
                }

                //if username or email already exist
                if (user.length!=0) 
                {
                    if(user[0].username == username)
                        return res.json('Username already exists, username: ' + username + '. Please enter another username.');          
                    else 
                        return res.json('Email already exists, email: ' + email + '. Please enter another email.');
                }
                //Username and email are unique, create the user and save it in the database.
                else
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
                        if(err) res.json('Sign up Error');
                        else res.json(newUser);
                    });
                }
            });
      }
    }

    //Middleware function for Passport module for authentication
    module.exports.passportAuthenticate = passport.authenticate('local');

/* Function to login a user
   Calling Route: /api/login/   */
    module.exports.login = function(req, res)
    {
        //Setting the Session Variable loggedin to the username in order to get the logged in user for later usage.
        req.session.loggedin = req.body.username;
        res.json('You are logged in as ' + req.session.loggedin);   
    }

/* Function to logout a user
   Calling Route: /api/logout/   */
    module.exports.logout = function(req,res)
    {
        req.logout();
        res.json('You have successfully logged out.');
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

/*Method to delete a user account by getting his username from the session used when he logged in,
 and then removing his entry from the db 
 Calling Route: /api/deleteAccount */
module.exports.deleteAccount = function(req, res)
{
    var query = {username : req.session.loggedin};
    User.remove(query, function(err){
        if (err)
            res.json(err);
        else res.json("Account was deleted successfully.");
    });
}
