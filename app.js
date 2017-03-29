const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');

//Connect to database
mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
	console.log('Connected to database ' + config.database);
});

mongoose.connection.on('error', (err) => {
	console.log('Database error: ' + err);
});

const app = express();

const port = 3000;

app.use(cors());

// Body Parser Middleware
app.use(bodyParser.json());

// Index Route
app.get('/', (req, res) =>{
	res.send('Invalid EndPoint');
});

// Start Server
app.listen(port, () => {
	console.log('Server started on port ' + port);
});
