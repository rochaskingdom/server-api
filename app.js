const mongoose = require('mongoose');
const Product = require('./product.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/http_client', { useNewUrlParser: true,
    useUnifiedTopology: true });

const myLogger = function (req, res, next) {
    console.log(req.body);
    next();
}
app.use(myLogger);

app.get('/products', (req, res) => {
    Product.find({}).lean()
    .exec((err, prods) => {
        if (err) {
            res.status(500).send(err);
        }
       res.status(200).send(prods);
    });
});

app.listen(3000);