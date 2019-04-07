var express = require('express');
var router = express.Router();
var models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

var passport = require('passport');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var options = require('../../config/options');
var moment = require('moment');

// Get Sales Total
router.get('/sales-total', async function(req, res, next) {
    // let where = {status: 2};
    let params = req.query;
    console.log(params);
    let where = {};
    where.status = 2;
    if(params.start_date && (params.start_date !== params.end_date)) {
        console.log("false");
        where.created_at = {[Op.between]: [moment(params.start_date).format(), moment(params.end_date).format()]};
    }else {
        console.log("true");
        let today = new Date();
        where.created_at = {[Op.gte]: moment(today).format("YYYY-MM-DD")};
    }

    let ordersTotal = await models.Order.findAll({
        where: where,
        attributes: [
            [models.sequelize.fn('sum', models.sequelize.col('subtotal')), 'subtotal'],
            [models.sequelize.fn('sum', models.sequelize.col('discount_amount')), 'discount'],
            [models.sequelize.fn('sum', models.sequelize.col('tax')), 'tax'],
            [models.sequelize.fn('sum', models.sequelize.col('total_amount')), 'totalAmount'],
            [models.sequelize.fn('sum', models.sequelize.col('paid_amount')), 'paidAmount'],
            [models.sequelize.fn('sum', models.sequelize.col('change_amount')), 'changeAmount'],
            [models.sequelize.fn('sum', models.sequelize.col('balance_amount')), 'balanceAmount'],
        ]
    });

    res.json({ordersTotal: ordersTotal});
});

// Get Sales Report
router.get('/sales-report', async function(req, res, next) {
    // let where = {status: 2};
    let params = req.query;
    let where = {};
    where.status = 2;
    if(params.start_date && (params.start_date !== params.end_date)) {
        where.created_at = {[Op.between]: [moment(params.start_date).format(), moment(params.end_date).format()]};
    }else {
        let today = new Date();
        where.created_at = {[Op.gte]: moment(today).format("YYYY-MM-DD")};
    }

    let orders = await models.Order.findAll({
        where: where,
        order: [
            ['id', 'DESC'],
        ],
    });

    res.json({orders: orders});
});

// Get Sales Detail
router.get('/sales-detail', async function(req, res, next) {
    // let where = {status: 2};
    let params = req.query;
    let where = {};
    where.status = 2;
    if(params.start_date && (params.start_date !== params.end_date)) {
        where.created_at = {[Op.between]: [moment(params.start_date).format(), moment(params.end_date).format()]};
    }else {
        let today = new Date();
        where.created_at = {[Op.gte]: moment(today).format("YYYY-MM-DD")};
    }

    let orders = await models.Order.findAll({
        where: where,
        order: [
            ['id', 'DESC'],
        ],
    });
    let orderItems = await models.OrderItem.findAll({
        where: where,
        include: [
            models.Product
        ]
    });

    res.json({orders: orders, orderItems: orderItems});
});

// Get Sales qty
router.get('/sales-qty', async function(req, res, next) {
    // let where = {status: 2};
    let params = req.query;
    console.log('report date: '+ params.start_date, params.end_date);
    let where = {};
    where.status = 2;
    if(params.start_date && (params.start_date !== params.end_date)) {
        where.created_at = {[Op.between]: [moment(params.start_date).format(), moment(params.end_date).format()]};
    }else {
        let today = new Date();
        where.created_at = {[Op.gte]: moment(today).format("YYYY-MM-DD")};
    }

    let saleQty = await models.OrderItem.findAll({
        where: where,
        include:[
            models.Product,
        ],
        attributes: [
            [models.sequelize.fn('sum', models.sequelize.col('qty')), 'qty'],
        ],
        order: [
            [models.sequelize.fn('max', models.sequelize.col('qty')), 'DESC'],
            [models.Product, 'id', 'ASC'],
        ],
        group: [
            'product_id',
        ]
    });

    res.json({saleQty: saleQty});
});

// Get Sales All Qty
router.get('/product-qty', async function(req, res, next) {
    // let where = {status: 2};
    let params = req.query;
    let where = {};
    where.status = 2;
    if(params.start_date && (params.start_date !== params.end_date)) {
        where.created_at = {[Op.between]: [moment(params.start_date).format(), moment(params.end_date).format()]};
    }else {
        let today = new Date();
        where.created_at = {[Op.gte]: moment(today).format("YYYY-MM-DD")};
    }

    let products = await models.Product.findAll({
        where: {is_active: 1},
    });

    let saleQty = await models.OrderItem.findAll({
        where: where,
        attributes: [
            'product_id',
            [models.sequelize.fn('sum', models.sequelize.col('qty')), 'qty'],
        ],
        group: ['product_id']
    });

    res.json({products: products, saleQty: saleQty});
});

// Get Stock Qty
router.get('/stock-qty', async function(req, res, next) {
    let stocks = await models.Product.findAll({
        where:{is_raw:1}
    });

    res.json({stocks:stocks});
});

module.exports = router;
