var express = require('express');
var router = express.Router();
var models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var multer  = require('multer');
var thumbnailUpload = multer({ dest: 'public/uploads/' });
const { check, validationResult } = require('express-validator/check');
var moment = require('moment');

// GET for Stocks
router.get('/stocks', async function(req, res, next) {
    let activeStocks = await models.Product.findAll({
        where: {is_active:1},
        include:[
            models.Category
        ],
    });
    res.json({activeStocks: activeStocks});
});

// GET Top Product
router.get('/top-products', async function(req, res, next) {
    let where = {};
    where.status = 2;
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD 00:00 A');
    const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD 00:00 A');
    where.created_at = {[Op.between]: [startOfMonth, endOfMonth]};
    console.log("TestDate: "+ startOfMonth, endOfMonth);

    let topProducts = await models.OrderItem.findAll({
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
        group: ['product_id'],
        limit: 10,
    });

    res.json({topProducts: topProducts});
});

// Get Sales Total By Month
router.get('/sales-total', async function(req, res, next) {
    let where = {};
    where.status = 2;
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm A');
    where.created_at = {[Op.gte]: startOfMonth};

    let ordersTotal = await models.Order.findAll({
        where: where,
        attributes: [
            [models.sequelize.fn('date', models.sequelize.col('created_at')), 'date'],
            [models.sequelize.fn('sum', models.sequelize.col('total_amount')), 'totalAmount'],
        ],
        group: ['date'],
    });

    let thisMonthTotal = await models.Order.findAll({
        where: where,
        attributes: [
            [models.sequelize.fn('sum', models.sequelize.col('total_amount')), 'totalAmount'],
        ],
    });

    let currentOrder = await models.Order.findAll({
        where: {status: 0},
    });

    res.json({ordersTotal: ordersTotal, thisMonthTotal:thisMonthTotal, currentOrder:currentOrder});
});

/* GET users. */
router.get('/register-user', async function(req, res, next) {

  let users = await models.User.findAll({
      include:[
          models.Role,
          models.Kitchen
      ]
  });
  if(users){
    users.map(function(user, i){
        user.password = null;
        return users;
    });
    res.json({users: users});
  }
  
});

module.exports = router;
