// const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const db = require('../config/connection')
const hbs = require('handlebars')
const path = require('path')
const fs = require('fs')


module.exports = {
    sendOtp: async (email) => {

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.APP_PASSWORD
            }
        })
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`

        const hbsFile = fs.readFileSync(path.join(__dirname, '../Public/mail/Otp-verification.hbs'), 'utf8')
        const compiledHtml = hbs.compile(hbsFile)

        let mailOptions = {
            from: "muhdddajeer@gmail.com",
            to: email,
            subject: 'CleverHires verification',
            html: compiledHtml({ email, otp })
        };

        transport.sendMail(mailOptions)
            .catch((err) => {
                throw err
            })

        await db.get().collection('otp').insertOne({
            email,
            otp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 9000
        })

    },

    verifyOtp: async (email, otp) => {

        const [otpRecord] = await db.get().collection('otp').find({ email }).sort({ createdAt: -1 }).limit(1).toArray()
        console.log(otpRecord);
        if (!otpRecord) {
            throw Error('Request for an otp first!')
        }
        if (otp != otpRecord.otp) {
            throw new Error('Invalid OTP')
        }
        db.get().collection('otp').deleteMany({ email });
        return true;
    }
}