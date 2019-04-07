'use strict';
module.exports = (sequelize, DataTypes) => {
  var Customer = sequelize.define('Customer', {
    name: DataTypes.STRING,
    total_purchase_amount: DataTypes.FLOAT,
    is_active: DataTypes.INTEGER,
    remark: DataTypes.STRING,
  },{
      tableName: 'customers',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  Customer.associate = function (models) {
    models.Customer.hasMany(models.Order, {
      onDelete: "CASCADE",
      foreignKey: 'customer_id',
    });
  };

  return Customer;
};