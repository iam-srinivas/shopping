const express = require('express')
const router = express.Router();
const { check } = require('express-validator');


const { getProductByid, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProduct } = require('../controllers/product')
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth')
const { getUserById } = require('../controllers/user')


// PARAMS
router.param("userId", getUserById)
router.param("productId", getProductByid)


// ROUTES
// CREATE
router.post("/product/create/:userId", [
    check("name").notEmpty().withMessage("Name must be atleast 3 Characters").bail(),
    check("description").notEmpty().withMessage("Description is required").bail(),
    check("price").isNumeric().withMessage("Price is required").bail(),
    check("category").notEmpty().withMessage("Category is required").bail(),
    check("stock").isNumeric().withMessage("Stock is required").bail(),
], isSignedIn, isAuthenticated, isAdmin, createProduct)
module.exports = router;

// READ
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", photo)
router.get("/products", getAllProduct)
// DELETE
router.delete("/product/:userId/:productId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)

// UPDATE
router.put("/product/:userId/:productId", isSignedIn, isAuthenticated, isAdmin, updateProduct)

// .bail() stops validation if previous ones are failed



