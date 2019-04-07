var express = require('express');
var router = express.Router();
var models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const { check, validationResult } = require('express-validator/check');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

/* GET kitchen display. */
router.get('/kitchen-view', passport.authenticate('jwt', {session: false}), async function(req, res, next) {
    let user = req.user;
    
    let kitchenOrders = await models.KitchenOrder.findAll({
        where:{
            kitchen_status:0,
            kitchen_id: user.kitchen_id,
        },
        include: [
            models.CustomerDemand,
            models.Table,
            models.Order
        ]
    });
    res.json({kitchenOrders: kitchenOrders});
});

router.get('/waiter-view', async function(req, res, next) {
    let kitchenOrders = await models.KitchenOrder.findAll({
        where:{kitchen_status:1,waiter_status:0},
        include: [
            models.CustomerDemand,
            models.Table,
            models.Order
        ]
    });
    res.json({kitchenOrders: kitchenOrders});
});

router.get('/normal-view', async function(req, res, next) {
    let kitchenOrders = await models.KitchenOrder.findAll({
        where:{waiter_status:0},
        include: [
            models.CustomerDemand,
            models.Table,
            models.Order
        ]
    });
    res.json({kitchenOrders: kitchenOrders});
});

// update kitchen status 
router.get('/:id/kitchen-ready', async function(req, res, next) {
    let id = req.params.id;
    let d = new Date();
    
    let result = await models.KitchenOrder.update(
        {
            kitchen_status: 1,
            kitchen_update: d
        }, {where:{id:id}});
    console.log(result);
    res.json({message:"Update Success!", kitchenOrder:result});
});

// update waiter status 
router.get('/:id/waiter-confirm', async function(req, res, next) {
    let id = req.params.id;
    let result = await models.KitchenOrder.update(
        {
            waiter_status: 1
        }, {where:{id:id}});

    let kitOrder = await models.KitchenOrder.findById(id);
    if(kitOrder) {
        models.KitchenOrderTran.create({
            table_id: kitOrder.table_id,
            sale_by: kitOrder.sale_by,
            kitchen_id: kitOrder.kitchen_id,
            sale_id: kitOrder.sale_id,
            sale_item_id: kitOrder.sale_item_id,
            order_item: kitOrder.order_item,
            qty: kitOrder.qty,
            kitchen_status: kitOrder.kitchen_status,
            waiter_status: kitOrder.waiter_status,
            cust_demand: kitOrder.cust_demand,
            remark: kitOrder.remark,
            kitchen_update: kitOrder.kitchen_update,
            created_at: kitOrder.created_at,
            updated_at: kitOrder.updated_at
        });
    }

    models.KitchenOrder.destroy({where:{id:id}});

    res.json({message:"Update Success!", kitchenOrder:result});
});

/* GET home page. */
router.get('/', async function(req, res, next) {
    let kitchenOrders = await models.KitchenOrder.findAll();
    res.json({kitchenOrders: kitchenOrders});
});

router.post('/store', async function(req, res, next) {
    let formData = req.body;
    let result = await models.KitchenOrder.create(formData);

    const errors = validationResult(req);
    if (!errors.isEmpty) {
        res.json({message:"Something went wrong!"});
    }

    if(result) {
        res.json({message:"Success!", kitchenOrder:result})
    }else{
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/edit', async function(req, res, next) {
    let id = req.params.id;
    let kitchenOrder = await models.KitchenOrder.findById(id);

    res.json({kitchenOrder: kitchenOrder});
});

router.post('/:id/update', async function(req, res, next) {
    let id = req.params.id;
    let formData = req.body;
    let result = await models.KitchenOrder.update(formData, {where:{id:id}});

    if(result) {
        res.json({message:"Update Success!", kitchenOrder:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/delete', async function(req, res, next) {
    let id = req.params.id;
    let result = await models.KitchenOrder.destroy({where:{id:id}});

    if(result) {
        res.json({message:"Success Delete!", kitchenOrder:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

module.exports = router;
