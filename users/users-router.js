const router = require('express').Router();
const bcrypt = require('bcryptjs')
const Users = require('./users-model.js');
const restricted = require('./restrictedMW');

router.get('/users', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

router.post('/auth/register', (req, res) => {
    let user = req.body
    const hash = bcrypt.hashSync(user.password, 10)
    user.password = hash

    Users.add(user)
        .then(newUser => {
            res.status(201).json(newUser)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

router.post('/auth/login', (req, res) => {
    let { username, password } = req.body
    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.loggedIn = true

                res.status(200).json({
                    message: `Successfully logged in as: ${user.username}`
                })
            } else {
                res.status(401).json({ message: 'Username or Password invalid' })
            }
        })
        .catch(err => {
            res.status(500(err))
        })
})

router.get('/auth/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({
                    message: "there was a server-side error when attempting to remove this session."
                })
            } else {
                res.status(200).json({ message: "session successfully ended" })
            }
        })
    } else {
        res.status(204)
    }
})

module.exports = router;