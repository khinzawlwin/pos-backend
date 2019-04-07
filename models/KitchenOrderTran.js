'use strict';
module.exports = (sequelize, DataTypes) => {
  var KitchenOrderTran = sequelize.define('KitchenOrderTran', {
    table_id: DataTypes.INTEGER,
    sale_by: DataTypes.INTEGER,
    kitchen_id: DataTypes.INTEGER,
    sale_id: DataTypes.INTEGER,
    sale_item_id: DataTypes.INTEGER,
    order_item: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    kitchen_status: DataTypes.INTEGER,
    waiter_status: DataTypes.INTEGER,
    cust_demand: DataTypes.INTEGER,
    kitchen_update: DataTypes.DATE,
    remark: DataTypes.STRING,
  },{
      tableName: 'kitchen_order_transactions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  return KitchenOrderTran;
};