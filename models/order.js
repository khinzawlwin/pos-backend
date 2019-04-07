'use strict';
module.exports = (sequelize, DataTypes) => {
  var Order = sequelize.define('Order', {
    table_id: DataTypes.INTEGER,
    customer_id: DataTypes.INTEGER,
    voucher_no: DataTypes.STRING,
    subtotal: DataTypes.INTEGER,
    discount_percent: DataTypes.INTEGER,
    discount_amount: DataTypes.FLOAT,
    tax: DataTypes.INTEGER,
    total_amount: DataTypes.FLOAT,
    paid_amount: DataTypes.FLOAT,
    change_amount: DataTypes.FLOAT,
    balance_amount: DataTypes.FLOAT,
    sale_by: DataTypes.INTEGER,
    counter_no: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    remark: DataTypes.STRING,
  },{
      tableName: 'orders',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  Order.associate = function(models) {
    models.Order.hasMany(models.OrderItem, {
      onDelete: "CASCADE",
      foreignKey: 'order_id',
    });
    models.Order.hasMany(models.KitchenOrder, {
      onDelete: "CASCADE",
      foreignKey: 'sale_id',
    });

    models.Order.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: 'sale_by',
    });
    models.Order.belongsTo(models.Table, {
      onDelete: "CASCADE",
      foreignKey: 'table_id',
    });
    models.Order.belongsTo(models.Customer, {
      onDelete: "CASCADE",
      foreignKey: 'customer_id',
    });
  };

  //status
  Order.ORDER = 0;
  Order.PENDING = 1;
  Order.CONFIRM = 2;

  return Order;
};