const User = require("../models/user")
const { validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


exports.SignUp = (req, res) => {
    const errors = validationResult(req)
    console.log("Error From Validator Signup", errors)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.errors.map((error) => error.msg)
        })
    }
    const user = new User(req.body)
    user.save((error, user) => {
        if (error) {
            console.log(error)
            return res.status(400).json({
                error: "Not Able to Signup the user"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            _id: user._id
        })
    })
}

exports.SignIn = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req)
    console.log("Error From Validator Signin", errors)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.errors.map((error) => error.msg)
        })
    }
    User.findOne({ email }, (error, user) => {
        if (error || !user) {
            console.log(error)
            return res.status(400).json({
                error: "Email doesn't exist"
            })

        }
        if (!user.authenticate(password)) {
            return res.status(422).json({
                error: "Email and Password Doesn't Match"
            })
        }
        // CREATE TOKEN
        const token = jwt.sign({ _id: user._id }, process.env.SECRET)
        // sign method uses default algorithm ['HS256']
        // PUT TOKEN IN COOKIE
        res.cookie("token", token, { expire: new Date() + 9999 })
        // RESPONSE TO FRONTEND
        const { _id, name, email, role } = user;
        res.json({
            token,
            user: {
                _id, name, email, role
            }
        })

    })
}

exports.SignOut = (req, res) => {
    res.clearCookie("token")
    res.json({
        message: "User SignOut Successfully",
        status: "OK"
    })

}


// Protected Routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth", //auth name used as object 
    algorithms: ['HS256']


})


// Custom middlewares
exports.isAuthenticated = (req, res, next) => {

    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if (!checker) {
        return res.status(403).json({
            error: "Access Denied"
        })
    }
    next();
}
exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "You Don't have permission to perform this action"
        })
    }
    next();
}