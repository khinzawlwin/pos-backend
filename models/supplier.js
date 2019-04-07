'use strict';
module.exports = (sequelize, DataTypes) => {
  var Supplier = sequelize.define('Supplier', {
    supplier_name: DataTypes.STRING,
    company_name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
  },{
      tableName: 'suppliers',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  Supplier.associate = function(models) {
    models.Supplier.hasMany(models.Purchase, {
      onDelete: "CASCADE",
      foreignKey: 'supplier_id',
    });
  }; 

  return Supplier;
};