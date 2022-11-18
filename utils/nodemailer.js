// const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const db = require('../config/connection')
const hbs = require('handlebars')
const path = require('path')
const fs = require('fs')
const otpModel = require('../model/otpModel')

module.exports = {
    sendOtp: async (email) => {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.APP_PASSWORD,
            },
        })
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`

        const hbsFile = fs.readFileSync(
            path.join(__dirname, '../Public/mail/Otp-verification.hbs'),
            'utf8'
        )
        const compiledHtml = hbs.compile(hbsFile)

        let mailOptions = {
            from: 'muhdddajeer@gmail.com',
            to: email,
            subject: 'CleverHires verification',
            html: compiledHtml({ email, otp }),
        }

        transport.sendMail(mailOptions).catch((err) => {
            throw err
        })

        await otpModel.create({ email, otp, createdAt: Date.now() })
        return
    },

    verifyOtp: async (email, otp) => {
        const otpRecord = await otpModel
            .find({ email })
            .sort({ createdAt: -1 })
            .limit(1)
            .lean()
        console.log({ otpRecord })
        if (!otpRecord) {
            throw Error('Request for an otp first!')
        }
        if (otp != otpRecord[0].otp) {
            throw new Error('Invalid OTP')
        }

        await otpModel.deleteMany({ email })
        return true
    },
}
