const express = require('express')
const app = express()
const logger = require('morgan')
const dotenv = require('dotenv').config()
const cors = require('cors')
// const path = require('path')
// const fs = require('fs')

const { errorHandler } = require('./Middlewares/errorHandler')
const db = require('./config/connection')
const { connection } = require('./config/connection')

// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })



const userRouter = require('./router/user')
const jobsRouter = require('./router/jobs')
const adminRouter = require('./router/admin')

const PORT = process.env.PORT || 5000

//connecting database
connection()

app.disable('etag')
// app.use(logger('combined',{stream : accessLogStream}))
app.use(cors())
app.use(logger('dev'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1/user', userRouter)
app.use('/api/v1/jobs', jobsRouter)
app.use('/api/v1/admin',adminRouter)

//not found
app.use('*', (req, res) => {
    res.send('Not found')
})

// error handler middleware
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server listening on Port ${PORT}`))
