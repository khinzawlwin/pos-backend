'use strict';
module.exports = (sequelize, DataTypes) => {
  var KitchenOrder = sequelize.define('KitchenOrder', {
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
      tableName: 'kitchen_orders',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  KitchenOrder.associate = function (models) {
    models.KitchenOrder.belongsTo(models.CustomerDemand, {
      onDelete: "CASCADE",
      foreignKey: 'cust_demand',
    });
    models.KitchenOrder.belongsTo(models.Table, {
      onDelete: "CASCADE",
      foreignKey: 'table_id',
    });
    models.KitchenOrder.belongsTo(models.Order, {
      onDelete: "CASCADE",
      foreignKey: 'sale_id',
    });
  };

  return KitchenOrder;
};