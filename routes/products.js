var express = require('express');
var router = express.Router();
var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var multer  = require('multer');
var thumbnailUpload = multer({ dest: 'public/uploads/' });
const { check, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let products = await models.Product.findAll({
        include:[
            models.Category
        ]
    });
    res.render('products/list', {products: products});
});

router.post('/getData', async function(req, res, next) {
  let products = await models.Product.findAll({
    include:[
      models.Category
    ]
  });
  res.json({data: products});
});

/* GET create product form. */
router.get('/create', async function(req, res, next) {
  let categories = await models.Category.findAll();
    res.render('products/create', {categories: categories});
});

router.post('/store', async function(req, res, next) {
    console.log(req.file);
    let formData = req.body;
    let photo = req.file;
    if(photo) {
        formData.thumbnail = photo.filename;
    }
    
    // let result = await models.Product.create(formData);

    // const errors = validationResult(req);
    // if (!errors.isEmpty) {
    //     req.flash('errors', errors.array());
    //     res.redirect('/products/create');
    // }

    // if(result) {
    //     req.flash('infos', 'Successfylly submit your brand!');
    //     res.redirect('/products');
    // }
});

// router.get('/:id/edit', async function(req, res, next) {
//     let id = req.params.id;
//     let product = await models.Product.findById(id);

//     res.json({product: product});
// });

// router.post('/:id/update', async function(req, res, next) {
//     let id = req.params.id;
//     let formData = req.body;
//     let result = await models.Product.update(formData, {where:{id:id}});

//     if(result) {
//         res.json({message:"Update Success!", product:result});
//     }else {
//         res.json({message:"Something went wrong!"});
//     }
// });

// router.get('/:id/delete', async function(req, res, next) {
//     let id = req.params.id;
//     let result = await models.Product.destroy({where:{id:id}});

//     if(result) {
//         res.json({message:"Success Delete!", product:result});
//     }else {
//         res.json({message:"Something went wrong!"});
//     }
// });

module.exports = router;
