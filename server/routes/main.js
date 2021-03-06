const router = require('express').Router();
const async = require('async');
const checkJWT = require('../Middleware/check-jwt');
const stripe = require('stripe')(process.env.stripe_key);


const Category = require('../Models/category');
const Product = require('../Models/product');
const Order = require('../Models/order');


router.get('/products', (req, res, next)=> {
    const perPage = 10;
    const page = req.query.page;
    async.parallel([
        function(callback) {
            Product.count({}, (err, count)=> {
                var totalProducts = count;
                callback(err, totalProducts);
            });
        },
        function(callback) {
            Product.find({})
            .skip(perPage * page)
            .limit(perPage)
            .populate('category')
            .populate('owner')
            .exec((err, products) => {
                if(err) return next(err);
                callback(err, products);
            });
        }
    ], function(err, results) {
        var totalProducts = results[0];
        var products = results[1];
        res.json({
            success: true,
            message: 'categories',
            products: products,
            totalProducts: totalProducts,
            pages: Math.ceil(totalProducts / perPage)
        });
    });
});

router.route('/categories')
    .get((req, res, next) => {
        Category.find({}, (err, categories) => {
            res.json({
                success: true,
                message: "success",
                categories: categories
            });
        });
    })
    .post(checkJWT,(req, res, next) => {
        let category = new Category();
        category.name = req.body.category;
        category.save();
        res.json({
            success: true,
            message: 'successful'
        });
    });

router.get('/categories/:id', (req, res, next)=> {
    const perPage = 10;
    const page = req.query.page;
    async.parallel([
        function(callback) {
            Product.count({category: req.params.id}, (err, count)=> {
                var totalProducts = count;
                callback(err, totalProducts);
            });
        },
        function(callback) {
            Product.find({category: req.params.id})
            .skip(perPage * page)
            .limit(perPage)
            .populate('category')
            .populate('owner')
            .exec((err, products) => {
                if(err) return next(err);
                callback(err, products);
            });
        },
        function(callback) {
            Category.findOne({_id: req.params.id}, (err, category)=> {
                callback(err, category)
            });
        }
    ], function(err, results) {
        var totalProducts = results[0];
        var products = results[1];
        var category = results[2];
        res.json({
            success: true,
            message: 'categories',
            products: products,
            categoryName: category.name,
            totalProducts: totalProducts,
            pages: Math.ceil(totalProducts / perPage)
        });
    });
});

router.get('/orders', checkJWT, (req, res, next) => {
    Order.find({
        owner: req.decoded.user._id
    })
    .populate('User')
    .populate('products.product')
    .exec((err, order) => {
        if(err) {
            res.json({
                success: false,
                message: 'Order not found'
            });
        } else if (order) {
            res.json({
                success: true,
                order: order
            });
        }
    });
});

router.get('/products/:id', (req, res, next)=> {
    Product.findById({_id: req.params.id})
    .populate('owner')
    .populate('category')
    .exec((err, product)=>{
        if(err) {
            res.json({
                success: false,
                message: 'product not found'
            });
        } else if (product) {
            res.json({
                success: true,
                product: product
            });
        }
    });
});

router.post('/payment', checkJWT, (req, res, next) => {
    const stripeToken = req.body.stripeToken;
    const currentCharge = Math.round(req.body.totalPrice * 100);

    stripe.customers.create({
        source: stripeToken.id
    })
    .then(function(customer) {
        return stripe.charges.create({
            amount: currentCharge,
            currency: 'usd',
            customer: customer.id
        });
    })
    .then(function(charge) {
        const products = req.body.products;
        let order = new Order();
        order.owner = req.decoded.user._id;
        order.totalPrice = currentCharge;
        products.map(product => {
            order.products.push({
                product: product.product,
                quantity: product.quantity
            });
        });
        order.save();
        res.json({
            success: true,
            message: "Successfully made payment"  
        });
    });
});

module.exports = router;