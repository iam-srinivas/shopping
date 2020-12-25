const Product = require('../models/product')
const formidable = require('formidable')
const { validationResult } = require('express-validator');

const _ = require("lodash")
const fs = require('fs')
exports.getProductByid = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((error, product) => {
            if (error || !product) {
                return res.status(400).json({
                    error: "Product Not Found"
                })
            }
            req.product = product
            next();
        })
}


exports.createProduct = (req, res) => {
    // const errors = validationResult(req)
    // console.log("Error From Validator Create Product", errors)
    // if (!errors.isEmpty()) {
    //     return res.status(422).json({
    //         error: errors.errors.map((error) => error.msg)
    //     })
    // }
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (error, fields, file) => {
        if (error) {
            res.status(400).json({
                error: "problem with image"
            })
        }
        // FIELD DESTRUCTURE
        const { name, description, price, category, stock } = fields
        // restrictions
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: "Please include all fields"
            })
        }

        let product = new Product(fields)

        // handle file
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "file size is too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }


        // SAVE TO DB
        product.save((error, product) => {
            if (error) {
                return res.status(400).json({
                    error: "Unable to save Product"
                })
            }
            product.photo = undefined
            res.json({ product })
        })
    })

}


exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}


exports.deleteProduct = (req, res) => {
    const product = req.product
    product.remove((error, product) => {
        if (error) {
            res.status(400).json({
                error: "unable to delete category"
            })
        }
        res.json({
            message: `Category Deleted Successfully ${product.name}`
        })
    })
}
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (error, fields, file) => {
        if (error) {
            res.status(400).json({
                error: "problem with image"
            })
        }

        // UPDATING THE OBJECT
        let product = req.product
        product = _.extend(product, fields)
        console.log(fields)
        console.log(product)

        // handle file
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "file size is too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }


        // SAVE TO DB
        product.save((error, product) => {
            if (error) {
                return res.status(400).json({
                    error: "Unable to Update Product"
                })
            }

            product.photo = undefined
            // product.image_uri = "/product/photo/" + product._id
            res.json({ product })
        })
    })
}


// SEND IMAGE ITSELF

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

// Product Listing

exports.getAllProduct = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    Product
        .find()
        .select("-photo")
        .sort([[sortBy, "asc"]])
        .limit(limit)
        .exec((error, products) => {
            if (error) {
                return res.status(400).json({
                    error: "Error in fetching Product"
                })
            }
            res.json(products)
        })
}

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                // If you were using the MongoDB driver directly, you'd need to do
                // `update: { $set: { title: ... } }` but mongoose adds $set for
                // you.
                // Might be some error
                update: { $inc: { stock: -prod.count, sold: +prod.count } }
            }
        }
    })
    Product.bulkWrite(myOperations, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: "Error in Bulk Updating  Product"
            })
        }
        next()
    })
}