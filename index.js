const express = require('express');
const app = express();
const logger = require('morgan');
const dotenv = require('dotenv').config();
const cors = require('cors');

const {errorHandler} = require('./Middlewares/errorHandler')
const db = require('./config/connection');
const { connect : connectDB ,get} = require('./config/connection');

const userRouter = require('./router/user')


const PORT = process.env.PORT || 5000;


//connecting database
connectDB()


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended : false }));


app.use('/api/v1/user',userRouter);

// error handler middleware
app.use(errorHandler)

app.listen( PORT , () => console.log(`Server listening on Port ${PORT}`));

