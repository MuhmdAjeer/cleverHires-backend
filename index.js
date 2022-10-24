const express = require('express');
const app = express();
const logger = require('morgan');
const dotenv = require('dotenv').config();
const cors = require('cors');

const {errorHandler} = require('./Middlewares/errorHandler')

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended : false }));


// error handler middleware
app.use(errorHandler)

app.listen( PORT , () => console.log(`Server listening on Port ${PORT}`));

