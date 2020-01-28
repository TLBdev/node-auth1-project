const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
const dbConnection = require('../data/dbConfig')
const userRouter = require('../users/users-router')
const server = express()

const sessionConfig = {
    name: 'testConfig',
    secret: process.env.SESSION_SECRET || 'devSecret',
    cookie: {
        maxAge: 1000 * 60 * 60 * 10,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: true, //check GDPR compliance laws before deploying with this setting.
    store: new KnexSessionStore({
        knex: dbConnection,
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 60000,
    })
}

server.use(helmet())
server.use(session(sessionConfig))
server.use(express.json())

server.use('/api', userRouter)

server.get('/', (req, res) => {
    res.json({ api: 'running' })
})

module.exports = server