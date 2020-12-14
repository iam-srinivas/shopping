var express = require('express')
var router = express.Router()
const { body } = require('express-validator');
const { SignOut, SignUp, SignIn } = require('../controllers/auth')


router.post("/signup", [
    body("name").isLength({ min: 3 }).withMessage("Name must be atleast 3 Characters"),
    body("email").isEmail().withMessage("Email is Not Valid"),
    body("password").isLength({ min: 3 }).withMessage("Passowrd must be atleast 3 Characters"),
], SignUp);

router.post("/signin", [
    body("email").isEmail().withMessage("Email is Not Valid"),
    body("password").isLength({ min: 3 }).withMessage("Passowrd field is required"),
], SignIn);


router.get("/signout", SignOut);
module.exports = router;