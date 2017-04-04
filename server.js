require('./api/data/dbconnection.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressValidator = require('express-validator');
const session = require('express-session');
const routes = require("./api/routes");
const app = express();

app.set('port', 8080);

//Enable IP Address Getting
app.enable('trust proxy')

app.use(cors());

// app.use(express.static(path.join(__dirname, '/public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

app.use("/api", routes);

// Index Route
app.get('/', (req, res) => {
	res.send('Invalid EndPoint');
});


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
app.use('/api',routes);

// Start Server
app.listen(app.get('port'), () => {
	console.log('Server started on port ' + app.get('port'));
});
