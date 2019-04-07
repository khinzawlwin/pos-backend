'use strict';
module.exports = (sequelize, DataTypes) => {
  var Kitchen = sequelize.define('Kitchen', {
    kitchen_name: DataTypes.STRING,
    remark: DataTypes.STRING,
  },{
      tableName: 'kitchens',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  Kitchen.associate = function(models) {
    models.Kitchen.hasMany(models.Product, {
      onDelete: "CASCADE",
      foreignKey: 'kitchen_id',
    });
    models.Kitchen.hasMany(models.User, {
      onDelete: "CASCADE",
      foreignKey: 'kitchen_id',
    });
  }; 

  return Kitchen;
};