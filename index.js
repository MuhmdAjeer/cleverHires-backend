const express = require("express");
const app = express();
const logger = require("morgan");
const dotenv = require("dotenv").config();
const cors = require("cors");
const otp = require("./utils/nodemailer");

const { errorHandler } = require("./Middlewares/errorHandler");
const db = require("./config/connection");
const { connect: connectDB, get ,connection} = require("./config/connection");

const userRouter = require("./router/user");
const jobsRouter = require("./router/jobs");

const PORT = process.env.PORT || 5000;

//connecting database
connectDB();
connection();

app.disable("etag");
app.use(cors());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobsRouter);

// error handler middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on Port ${PORT}`));
