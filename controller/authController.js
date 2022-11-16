const asyncHandler = require("express-async-handler");
const { validationResult, body } = require("express-validator");
const bcrypt = require("bcrypt");

const { sendOtp, verifyOtp } = require("../utils/nodemailer");
const { generateToken } = require("../utils/jwt");
const db = require("../config/connection");
const { findByEmail, insertUser, findById } = require("../database/user");
const userModel = require("../model/userModel");

module.exports = {
  signup: asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.json({ errors: errors.array() });
    }

    const { email } = req.body;
    const { password, ...body } = req.body;

    const user = await findByEmail(email);

    if (user) {
      res.status(401);
      throw new Error("User already exists");
    }
    try {
      await sendOtp(email);
      res.status(200).json({
        status: "Ok",
        message: "OTP send successfully",
        user: body,
      });
    } catch (err) {
      res.status(500);
      throw new Error("Cannot send OTP! try again");
    }
  }),

  verifyOtp: asyncHandler(async (req, res) => {
    try {
      const { otp, user } = req.body;
      if (!otp || !user) {
        res.status(401);
        throw new Error("provide credentials");
      }
      await verifyOtp(user.email, otp);

      user.name = `${user.firstName} ${user.lastName}`;
      user.password = await bcrypt.hash(user.password,10);
      // const { insertedId } = await insertUser(user);
      const userDetails = await userModel.create(user);

      // const { password, ...userDetails } = await findById(insertedId);

      let response = {
        token: generateToken({
          name: userDetails.name,
          email: userDetails.email,
          id: userDetails._id,
        }),
        user: userDetails,
      };

      res.status(201).json(response);
    } catch (error) {
      console.log(error);
      res.status(455);
      throw new Error(error);
    };
  }),

  signin: asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userModel.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log(password, user.password, "fsdafsadfsd");
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = generateToken({
        name: user.name,
        email: user.email,
        id: user._id,
      });
      console.log(token, "imtoken");
      res.status(200).json({ token, user });
    } catch (error) {
      console.log(error, "d");
      res.status(500).json(error);
    }
  }),
};
