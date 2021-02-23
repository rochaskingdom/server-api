const mongoose = require('mongoose');
const Product = require('./product.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/http_client', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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

app.get('/productserr', (req, res) => {
    setTimeout(() => {
        res.status(500).send({
            msg: 'Error message from the server'
        });
    }, 2000);
});

app.get('/productsdelay', (req, res) => {
    setTimeout(() => {
        Product.find({}).lean()
            .exec((err, prods) => {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send(prods);
            });
    }, 2000);
});

app.get('/products_ids', (req, res) => {
    Product.find({}).lean()
        .exec((err, prods) => {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).send(prods.map(p => p._id));
        });
});

app.get('/products/name/:id', (req, res) => {
    const id = req.params.id;
    Product.findById(id, (err, prod) => {
        if (err) {
            res.status(500).send(err);
        } else if (!prod) {
            res.status(404).send({});
        } else {
            res.status(200).send(prod.name);
        }
    });
});

app.post('/products', (req, res) => {
    p = new Product({
        name: req.body.name,
        price: req.body.price,
        department: req.body.price
    });
    p.save((err, prod) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(prod);
        }
    });
})

app.delete('/products/:id', (req, res) => {
    Product.deleteOne({_id: req.params.id},
        (err) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(204).send({});
            }
        }
    )
});

app.listen(3000);
