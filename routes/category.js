const express = require('express')
const router = express.Router()

const { getCategorybyId, createCategory, getCategory, getAllCategory, updateCategory, deleteCategory } = require('../controllers/category')
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth')
const { getUserById } = require('../controllers/user')


// PARAMS
router.param("userId", getUserById)
router.param("categoryId", getCategorybyId)
// ROUTES
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory)
router.get("/category/:categoryId", getCategory)
// UPDATE ROUTE
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory)
// DELETE ROUTE
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteCategory)
router.get("/categories", getAllCategory)

module.exports = router;