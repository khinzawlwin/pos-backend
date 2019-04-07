'use strict';
module.exports = (sequelize, DataTypes) => {
  var OrderItem = sequelize.define('OrderItem', {
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    unit_price: DataTypes.FLOAT,
    qty: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    status: DataTypes.INTEGER

  },{
      tableName: 'order_items',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  OrderItem.associate = function(models) {

    models.OrderItem.belongsTo(models.Order, {
      onDelete: "CASCADE",
      foreignKey: 'order_id',
    });

    models.OrderItem.belongsTo(models.Product, {
        onDelete: "CASCADE",
        foreignKey: 'product_id',
      });
  };

  return OrderItem;
};