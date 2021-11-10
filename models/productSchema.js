const mongoose = require('mongoose');
const { Schema, model } = mongoose
const productSchema = new Schema({
    name: { type: String, unique: true, },
    price: { type: Number, },
    ratings: { type: Number, },
    brand: { type: String },
    isDeleted: { type: Boolean, default: false }
})

const Products = model("Products", productSchema)
module.exports = Products