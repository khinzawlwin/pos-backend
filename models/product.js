'use strict';
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    kitchen_id: DataTypes.INTEGER,
    counting_unit: DataTypes.STRING,
    price: DataTypes.FLOAT,
    purchase_price: DataTypes.FLOAT,
    qty_opening_balance: DataTypes.INTEGER,
    qty_warehouse: DataTypes.INTEGER,
    qty_counter: DataTypes.INTEGER,
    code: DataTypes.STRING,
    is_active: DataTypes.INTEGER,
    is_raw: DataTypes.INTEGER,
    discount_percent: DataTypes.INTEGER,
    discount_amount: DataTypes.FLOAT,
    description: DataTypes.TEXT,
    created_by: DataTypes.INTEGER
  },{
      tableName: 'products',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  Product.associate = function (models) {
    models.Product.belongsTo(models.Category, {
      onDelete: "CASCADE",
      foreignKey: 'category_id',
    });
    models.Product.belongsTo(models.Kitchen, {
      onDelete: "CASCADE",
      foreignKey: 'kitchen_id',
    });

    models.Product.hasMany(models.OrderItem, {
      onDelete: "CASCADE",
      foreignKey: 'product_id',
    });
  };

  return Product;
};