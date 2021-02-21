const mongoose = require('mongoose')
const Product = require('./product');
const Faker = require('faker');

mongoose.connect('mongodb://localhost:27017/http_client', {
    useNewUrlParsere: true,
    useUnifiedTopology: true
});

async function generatedProducts() {
    for (let i = 0; i < 10; i++) {
        let p = new Product({
            name: Faker.commerce.productName(),
            department: Faker.commerce.department(),
            price: Faker.commerce.price()
        });
        try {
            await p.save();
        } catch (err) {
            throw new Error('Error generating products');
        }
    }
}

generatedProducts().then(() => {
    mongoose.disconnect();
    console.log('OK');
})
