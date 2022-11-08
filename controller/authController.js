const asyncHandler = require('express-async-handler');
const { validationResult, body } = require('express-validator')
const bcrypt = require('bcrypt')

const { sendOtp, verifyOtp } = require('../utils/nodemailer')
const { generateToken } = require('../utils/jwt')
const db = require('../config/connection')
const { findByEmail, insertUser, findById } = require('../database/user');

module.exports = {
    signup: asyncHandler(async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400)
            return res.json({ errors: errors.array() })
        }

        const { email } = req.body;
        const { password, ...body } = req.body;

        const user = await findByEmail(email)

        if (user) {
            res.status(401)
            throw new Error('User already exists')
        }
        try {
            await sendOtp(email)
            res.status(200).json({
                status: 'Ok',
                message: 'OTP send successfully',
                user: body
            })
        } catch (err) {
            res.status(500)
            throw new Error('Cannot send OTP! try again')
        }


    }),

    verifyOtp: asyncHandler(async (req, res) => {
        try {
            const { otp, user } = req.body;
            if (!otp || !user) {
                res.status(401)
                throw new Error('provide credentials')
            }
            await db.get().collection('user').deleteMany({ email: "muhdajeer@gmail.com" })
            await verifyOtp(user.email, otp)
            user.name = `${user.firstName} ${user.lastName}`
            const { insertedId } = await insertUser(user);

            const { password, ...userDetails } = await findById(insertedId)

            let response = {
                token: (generateToken({ name: userDetails.name, email: userDetails.email, id: user._id })),
                user: userDetails
            }

            res.status(201).json(response)
        } catch (error) {
            res.status(455)
            throw new Error(error)
        }
        console.log('sdf');

    }),

    signin: asyncHandler(async (req, res) => {

        try {

            const { email, password } = req.body;
            console.log('sdfsd');

            const user = await db.get().collection('user').findOne({ email });
            console.log(user, 'jj');
            if (!user) {
                res.status(404)
                throw new Error('User not found')
            }
            console.log(password, user.password, 'fsdafsadfsd');
            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (!isPasswordCorrect) {
                res.status(401)
                throw new Error('Invalid Password')
            }


            const token = generateToken({ name: user.name, email: user.email, id: user._id })
            console.log(token, 'imtoken');
            res.status(200).json({ token, user })
        } catch (error) {
            res.status(500).json(error)
        }

    })
}