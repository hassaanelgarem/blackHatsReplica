require('./api/data/dbconnection.js');
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const session = require('express-session');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const forloop = require('forloop');

//require passport.js for configuration
const passportConfig = require('./api/config/passport');
//pass passport to configure it
passportConfig.configurePassport(passport);

//Enable IP Address Getting
app.enable('trust proxy')
    //view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// ORDER OF THE MIDDLEWARE IS IMPORTANT

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 3600000 * 2
    }
}));
// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
//pass passportConfiguration to routes for login and return the routes
const routes = require("./api/routes")(passportConfig);
app.use("/api", routes);

//any request reaches this point means it failed to match any of the above routes
app.use(function(req, res, next) {
    //to always give back the angular application
    res.render('index');
});

module.exports = app;