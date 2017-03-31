require('./api/data/dbconnection.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const routes = require("./api/routes");
const app = express();

app.set('port', 8080);
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

// Start Server
app.listen(app.get('port'), () => {
	console.log('Server started on port ' + app.get('port'));
});
