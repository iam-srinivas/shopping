var express = require('express')
var router = express.Router()
const { body } = require('express-validator');
const { SignOut, SignUp, SignIn, isSignedIn } = require('../controllers/auth')


router.post("/signup", [
    body("name").isLength({ min: 3 }).withMessage("Name must be atleast 3 Characters"),
    body("email").isEmail().withMessage("Email is Not Valid"),
    body("password").isLength({ min: 3 }).withMessage("Password must be atleast 3 Characters"),
], SignUp);

router.post("/signin", [
    body("email").isEmail().withMessage("Email is Not Valid"),
    body("password").isLength({ min: 3 }).withMessage("Passowrd field is required"),
], SignIn);


router.get("/signout", SignOut);


// Protected Route for testing
router.get("/testroute", isSignedIn, (req, res) => {
    res.json(req.auth)
});
module.exports = router;