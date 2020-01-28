module.exports = (req, res, next) => {
    if (req.session && req.session.loggedIn) {
        next()
    } else {
        res.status(401).json({ warning: "unauthorized access attempt detected" })
    }
}