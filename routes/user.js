const express = require('express')
const router = express.Router()

const { isSignedIn, isAuthenticated } = require("../controllers/auth")
const { getUserById, getUser, updateUser } = require("../controllers/user")

router.param("userId", getUserById)

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)
// PUT is used to update 
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)


module.exports = router;