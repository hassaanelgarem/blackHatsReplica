require('./api/data/dbconnection.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const session = require('express-session');
const app = express();

//require passport.js for configuration
const passportConfig = require('./api/config/passport');
//pass passport to configure it
passportConfig.configurePassport(passport);

app.set('port', 8080);

//Enable IP Address Getting
app.enable('trust proxy')

app.use(cors());

// app.use(express.static(path.join(__dirname, '/public')));


// ORDER OF THE MIDDLEWARE IS CRITICAL

// Body Parser Middleware
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

// Express Session
app.use(session(
{
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(function (req, res, next)
{
  res.locals.user = req.user || null;
  next();
});

//pass passportConfiguration to routes for login and return the routes
const routes = require("./api/routes")(passportConfig);

app.use("/api", routes);

app.get('/', (req, res) => {
	res.json('Redirected to Home');
});

// Ignore all http requests on unknown routes
app.all('*', (req, res) => {
	res.json('TO-DO: Redirect on a page not found view');
});


// Start Server
app.listen(app.get('port'), () => {
	console.log('Server started on port ' + app.get('port'));
});
