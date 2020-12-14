const mongoose = require('mongoose');


const { ObjectId } = mongoose.Schema;


const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxLength: 32
        },
        description: {
            type: String,
            trim: true,
            required: true,
            maxLength: 2000
        },
        price: {
            type: Number,
            trim: true,
            required: true,
            maxLength: 32
        },
        category: {
            type: ObjectId,
            stock: {
                ref: "Category",
                required: true
            },
            type: Number,
        },
        sold: {
            type: Number,
            default: 0
        },
        photo: {
            data: Buffer,
            contentType: String
        }

    }, { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema)

