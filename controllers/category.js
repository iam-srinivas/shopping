const Category = require('../models/category')

exports.getCategorybyId = (req, res, next, id) => {
    Category.findById(id).exec((error, category) => {
        if (error) {
            res.status(400).json({
                error: "Category Not Found"
            })
        }
        req.category = category
    })
    next();
}


exports.createCategory = (req, res) => {
    const category = new Category(req.body)
    category.save((error, category) => {
        if (error) {
            res.status(400).json({
                error: "unable to save Category"
            })
        }
        res.json({ category })
    })
}


exports.getCategory = (req, res) => {
    return res.json(req.category)
}

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name
    category.save((error, updatedCategory) => {
        if (error) {
            res.status(400).json({
                error: "failed to update Category"
            })
        }
        res.json(updatedCategory)
    })
}


exports.deleteCategory = (req, res) => {
    const category = req.category;
    category.remove((error, category) => {
        if (error) {
            res.status(400).json({
                error: "unable to delete category"
            })
        }
        res.json({
            message: `Category Deleted Successfully ${category.name}`
        })
    })
}

exports.getAllCategory = (req, res) => {
    Category.find().exec((error, categories) => {
        if (error) {
            return res.status(400).json({
                error: "Didnt find Categories"
            })
        }
        res.json(categories)
    })
}

