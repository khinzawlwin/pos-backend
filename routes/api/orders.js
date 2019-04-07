var express = require('express');
var router = express.Router();
var models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

var passport = require('passport');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var options = require('../../config/options');

// Get orders order
router.get('/order', async function(req, res, next) {
    let where = {status: 0};
    let orders = await models.Order.findAll({
        where: where,
        include: [
            models.Table
        ]
    });

    res.json({orders: orders});
});

// Get orders pending
router.get('/pending', passport.authenticate('jwt', {session: false}), async function(req, res, next) {
    let where = {status: 1};
    let orders = await models.Order.findAll({
        where: where,
        include: [
            models.Table
        ]
    });

    res.json({orders: orders});
});

router.get('/', async function(req, res, next) {
    let orders = await models.Order.findAll({
        include: [
            models.Table
        ]
    });

    res.json({orders: orders});
});

// Post orders
// router.post('/', passport.authenticate('jwt', {session: false}), async function(req, res, next){
router.post('/', async function(req, res, next){
    let formData = req.body;
    console.log(formData);
    
    let order = await models.Order.create(formData);

    formData.items.map(async (it)=> {
        let product = await models.Product.findOne({where:{id:it.product_id}});
        if(product) {
            let orderItem = await models.OrderItem.create({
                                order_id: order.id,
                                product_id: product.id,
                                unit_price: product.price,
                                qty: it.qty,
                                amount: it.qty * product.price,
                                status: order.status
                            });

            if(orderItem){
                if(it.demand == "") {
                    it.demand = null;
                }
                models.KitchenOrder.create({
                    table_id: order.table_id,
                    sale_by: order.sale_by,
                    kitchen_id: product.kitchen_id,
                    sale_id: order.id,
                    sale_item_id: orderItem.id,
                    order_item: product.name,
                    qty: it.qty,
                    cust_demand: it.demand,
                    remark: it.remark,
                });

                let whereStock = {};
                whereStock.id = product.id;
                whereStock.is_raw = 1;
                let stockUpdateQty = await models.Product.update({
                    qty_counter: Number(product.qty_counter) - Number(it.qty),
                    qty_opening_balance: Number(product.qty_warehouse) + (Number(product.qty_counter) - Number(it.qty))
                }, {where:whereStock});
            }
        }
    });

    models.Table.update({status: 1}, {where:{id:formData.table_id}});

    // let order = "Success Process";

    res.json({order: order});
});

router.get('/:id', async function(req, res, next) {
    let id = req.params.id;
    let where = {};
    let order = await models.Order.findOne({
        where: {id:id},
        include: [
            models.Table,
            models.Customer
        ]
    });

    where.status = {[Op.notIn]: [2]};
    where.order_id = order.id;
    let orderItems = await models.OrderItem.findAll({
        where: where,
        include: [
            models.Product
        ]
    });

    let kitchenOrders = await models.KitchenOrder.findAll({
        where: {sale_id: order.id},
        include: [
            models.CustomerDemand
        ]
    });

    let countItem = orderItems.length;

    res.json({order: order, items: orderItems, cust_demands: kitchenOrders, countItem: countItem});
});

router.post('/:id/update', async function(req, res, next) {
    let formData = req.body;
    let id = req.params.id;
    let order = '';
    let where = {};
    console.log(formData);
    if(formData.by_one) {
        
        let itemUpdate = formData.item_id.map(async (it)=> {
            models.OrderItem.update({
                status: formData.status
            }, {where:{id: it.orderItemId}});
        });

        order = await models.Order.update({
            remark: formData.by_one
        }, {where:{id:id}});

        if(itemUpdate) {
            where.status = {[Op.notIn]: [2]};
            where.order_id = id;
            let orderItems = await models.OrderItem.findAll({
                where: where,
                include: [
                    models.Product
                ]
            });
            
            if(orderItems.length == 0) {
                order = await models.Order.update({
                    status: 2
                }, {where:{id:id}});
                let table = await models.Table.update({status: 0}, {where:{id:formData.table_id}});
            }
        }
            
    }else {
        order = await models.Order.update(formData, {where:{id:id}});
        formData.items.map(async (it)=> {
            let product = await models.Product.findOne({where:{id:it.product_id}});
            let orderItem = await models.OrderItem.findOne({where:{id:it.orderItemId}});
            if(product && orderItem) {
                models.OrderItem.update({
                    qty: it.qty,
                    amount: it.qty * product.price,
                    status: formData.status
                }, {where:{id:it.orderItemId}});
    
                models.KitchenOrder.update({
                    qty: it.qty,
                    cust_demand: it.demand,
                    remark: it.remark
                }, {where:{sale_item_id:orderItem.id}});
                
            }else {
                let saleItem = await models.OrderItem.create({
                                    order_id: id,
                                    product_id: product.id,
                                    unit_price: product.price,
                                    qty: it.qty,
                                    amount: it.qty * product.price,
                                    status: formData.status
                                });
                if(saleItem) {
                    console.log("SaleItemId:"+saleItem);
                    models.KitchenOrder.create({
                        table_id: formData.table_id,
                        sale_by: formData.sale_by,
                        kitchen_id: product.kitchen_id,
                        sale_id: id,
                        sale_item_id: saleItem.id,
                        order_item: product.name,
                        qty: it.qty,
                        cust_demand: it.demand,
                        remark: it.remark
                    });
                }
            }
    
        })
        if(formData.status == 2) {
            models.Table.update({status: 0}, {where:{id:formData.table_id}});
        }
    }
    
    res.json({order: order});
});

router.get('/:id/removeitem', async function(req, res, next) {
    let id = req.params.id;
    let orderItem = await models.OrderItem.destroy({where:{id:id}});
    let kitchenOrder = await models.KitchenOrder.destroy({where:{sale_item_id:id}});

    if(orderItem) {
        res.json({message:"Success Delete!", orderItem:orderItem});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

module.exports = router;
