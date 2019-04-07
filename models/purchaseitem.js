'use strict';
module.exports = (sequelize, DataTypes) => {
  var PurchaseItem = sequelize.define('PurchaseItem', {
    purchase_id: DataTypes.INTEGER,
    stock_id: DataTypes.INTEGER,
    unit_price: DataTypes.FLOAT,
    qty: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
  },{
      tableName: 'purchase_items',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  PurchaseItem.associate = function(models) {
    models.PurchaseItem.belongsTo(models.Purchase, {
      onDelete: "CASCADE",
      foreignKey: 'purchase_id',
    });
    models.PurchaseItem.belongsTo(models.Product, {
      onDelete: "CASCADE",
      foreignKey: 'stock_id',
    });
  };

  return PurchaseItem;
};