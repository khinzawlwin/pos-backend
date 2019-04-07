'use strict';
module.exports = (sequelize, DataTypes) => {
  var CustomerDemand = sequelize.define('CustomerDemand', {
    demand: DataTypes.STRING,
    remark: DataTypes.STRING,
  },{
      tableName: 'customer_demands',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  CustomerDemand.associate = function(models) {
    models.CustomerDemand.hasMany(models.KitchenOrder, {
      onDelete: "CASCADE",
      foreignKey: 'cust_demand',
    });
  };

  return CustomerDemand;
};