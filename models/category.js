const mongoose = require('mongoose');


var categorySchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLenght: 32,
        unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema)