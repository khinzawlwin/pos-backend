var express = require('express');
var router = express.Router();
var models = require('../../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const { check, validationResult } = require('express-validator/check');
var auth = require('connect-ensure-login').ensureLoggedIn;

/* GET home page. */
router.get('/', async function(req, res, next) {
    let kitchenOrders = await models.KitchenOrderTran.findAll();
    res.json({kitchenOrders: kitchenOrders});
});

router.post('/store', async function(req, res, next) {
    let formData = req.body;
    let result = await models.KitchenOrderTran.create(formData);

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
    let kitchenOrder = await models.KitchenOrderTran.findById(id);

    res.json({kitchenOrder: kitchenOrder});
});

router.post('/:id/update', async function(req, res, next) {
    let id = req.params.id;
    let formData = req.body;
    let result = await models.KitchenOrderTran.update(formData, {where:{id:id}});

    if(result) {
        res.json({message:"Update Success!", kitchenOrder:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

router.get('/:id/delete', async function(req, res, next) {
    let id = req.params.id;
    let result = await models.KitchenOrderTran.destroy({where:{id:id}});

    if(result) {
        res.json({message:"Success Delete!", kitchenOrder:result});
    }else {
        res.json({message:"Something went wrong!"});
    }
});

module.exports = router;
