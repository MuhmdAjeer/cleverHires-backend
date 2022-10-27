const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator')
const TWILIO_ACCOUNT_ID = process.env.TWILIO_ACCOUNT_ID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(TWILIO_ACCOUNT_ID);
const bcrypt = require('bcrypt')

const { generateToken } = require('../utils/jwt')
const db = require('../config/connection')


module.exports = {
    signup: asyncHandler(async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400)
            return res.json({ errors: errors.array() })
        }

        const { email, password, phone } = req.body;
        const user = await db.get().collection('user').findOne({ email })

        if (user) {
            res.status(401)
            throw new Error('User already exists')
        }

        client.verify
            .services(process.env.TWILIO_SERVICE_ID)
            .verifications.create({
                to: `+91${phone}`,
                channel: 'sms'
            })
            .then(({ status }) => {
                res.status(200).json({ status, user: req.body })
            })
            .catch(err => {
                res.status(500)
                throw new Error(err)
            })

    }),

    verifyOtp: asyncHandler(async (req, res) => {
        const { otp, user } = req.body;
        console.log(req.body);
        if (!otp || !user) {
            res.status(401)
            throw new Error('provide credentials')
        }

        let otpStatus = null;
        client.verify
            .services(process.env.TWILIO_SERVICE_ID)
            .verificationChecks.create({
                to: `+91${user.phone}`,
                code: otp
            })
            .then(({ status }) => otpStatus = status)
            .catch((err) => {
                res.status(500)
                throw new Error(err)
            })

        if (otpStatus != 'approved') {
            res.status(400)
            throw new Error('Wrong OTP')
        }

    })
}