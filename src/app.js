require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
const { checkOverload } = require('./helpers/check.connect');


console.log(process.env.NODE_ENV);
// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// init db
require('./dbs/init.mongodb');
checkOverload()

// init routes
app.use('/', require('./routes'));


// handling error




module.exports = app;