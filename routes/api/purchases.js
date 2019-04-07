var express = require('express');
var router = express.Router();
var models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const { check, validationResult } = require('express-validator/check');

/* GET purchase page. */
router.get('/', async function(req, res, next) {
    let purchases = await models.Purchase.findAll({
        include:[
            models.Supplier,
            models.User,
        ]
    });
    res.json({purchases: purchases});
});

/* GET Purchase Detail */
router.get('/:id/detail', async function(req, res, next) {
    let id = req.params.id;
    let purchase = await models.Purchase.findOne({
        where: {id:id},
        include: [
            models.Supplier,
            models.User,
        ]
    });

    let purchaseItem = await models.PurchaseItem.findAll({
        where: {purchase_id: purchase.id},
        include: [
            models.Product
        ],
    });

    res.json({purchase:purchase, purchaseItem:purchaseItem});
});

router.post('/store', async function(req, res, next) {
    let formData = req.body;
    let purchase = await models.Purchase.create(formData);

    formData.items.map(async (it)=> {
        let stock = await models.Product.findOne({where:{id:it.product_id}});
        if(stock) {
            let purchaseItem = await models.PurchaseItem.create({
                                purchase_id: purchase.id,
                                stock_id: stock.id,
                                unit_price: stock.purchase_price,
                                qty: it.qty,
                                amount: it.qty * stock.purchase_price,
                            });

            if(purchaseItem) {
                let stockUpdateQty = await models.Product.update({
                    qty_warehouse: Number(stock.qty_warehouse) + Number(it.qty),
                    qty_opening_balance: (Number(stock.qty_warehouse) + Number(it.qty)) + Number(stock.qty_counter),
                }, {where:{id:stock.id}});
            }
        }
    });

    if(purchase) {
        res.json({message:"Success!", purchase:purchase})
    }else{
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/edit', async function(req, res, next) {
    let id = req.params.id;
    let purchase = await models.Purchase.findById(id);

    res.json({purchase: purchase});
});

router.post('/:id/update', async function(req, res, next) {
    let id = req.params.id;
    let formData = req.body;
    let result = await models.Purchase.update(formData, {where:{id:id}});

    if(result) {
        res.json({message:"Update Success!", purchase:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/delete', async function(req, res, next) {
    let id = req.params.id;
    let result = await models.Purchase.destroy({where:{id:id}});

    if(result) {
        res.json({message:"Success Delete!", purchase:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

module.exports = router;
