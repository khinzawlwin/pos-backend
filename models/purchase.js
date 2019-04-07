'use strict';
module.exports = (sequelize, DataTypes) => {
  var Purchase = sequelize.define('Purchase', {
    purchase_no: DataTypes.STRING,
    supplier_id: DataTypes.INTEGER,
    grand_total: DataTypes.FLOAT,
    purchase_by: DataTypes.INTEGER,
    status: DataTypes.STRING,
  },{
      tableName: 'purchases',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  Purchase.associate = function(models) {
    models.Purchase.belongsTo(models.Supplier, {
      onDelete: "CASCADE",
      foreignKey: 'supplier_id',
    });
    models.Purchase.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: 'purchase_by',
    });
  }; 

  return Purchase;
};