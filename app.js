const express = require('express');
const mongoose = require('mongoose');
const Products = require('./models/productSchema.js');
const bodyParser = require('body-parser');
const { Url, PORT } = require('./configs/config.js');

const app = express();
app.use(bodyParser.json())



mongoose.connect(Url).then(() => {
    console.log("Connected to mongodb")


    //Add Products  
    app.post('/addProduct', (req, res) => {

        //validating requests
        if (req.body.price <= 0 || req.body.ratings <= 0) {
            res.json({ "message": "price and ratings not valid" })
        }
        const newProduct = new Products({
            name: req.body.name,
            price: req.body.price,
            ratings: req.body.ratings,
            brand: req.body.brand,

        })

        //Check if product already exists
        if (Products.findOne(newProduct.name) === req.body.name) {
            res.json({ "message": "Product already exists" })
        } else {
            //Create New Product
            Products.create(newProduct, (err, data) => {
                if (err) {
                    if (err.keyValue.name === req.body.name) {
                        res.json({ "message": "Product already exists" })
                    }
                    else {
                        res.json({ "Product creation error ": err });
                    }
                }
                else {
                    res.json({
                        message: "Product created successfully", data
                    })
                }
            })
        }
    })



    //Get All Products
    app.get('/getAllProducts', (req, res) => {
        Products.find((err, response) => {
            if (err) {
                response.json({ err })
            } else {
                if (response) {
                    res.json({ message: "Here are your products", response })
                }
            }
        })
    })



    //Update Products
    app.put('/updateProduct', (req, res) => {
        const options = {
            name: req.body.Name,
            price: req.body.Price,
            ratings: req.body.Ratings,
            brand: req.body.Brand,
            isDeleted: false
        }


        Products.findOneAndUpdate({ name: req.body.name }, {
            name: req.body.Name,
            price: req.body.Price,
            ratings: req.body.Ratings,
            brand: req.body.Brand,
        }, (err, response) => {
            if (err) {
                res.json({ message: err });
            }
            else {
                if (!response) {
                    res.json({ message: "No product found" })
                } else {
                    res.json({ response, message: "Product updated successfully" })
                }
            }
        })


    })

    //Delete All Products
    app.delete('/deleteAll', (req, res) => {
        Products.deleteMany((err, response) => {
            if (err) {
                res.json({ err });
            } else {
                res.json({ response })
            }
        })
    })

    //Delete Product
    app.delete('/deleteProduct', (req, res) => {
        Products.findOneAndUpdate({ name: req.body.name }, { isDeleted: true }, { new: true }, (err, response) => {
            if (err) {
                res.json({ message: err.message })
            } else {
                if (!response) {
                    res.json({ message: "No products found" })
                }
                res.json({ response, message: "Product deleted successfully" });
            }
        })
    })

    //Listening Port 
    app.listen(PORT, (err) => {
        if (err) {
            return console.log(err);
        } else {
            console.log(`Server is up and listening on port ${PORT}....`)
        }
    })

}).catch((err) => console.log('Could not connect to mongodb', err));

