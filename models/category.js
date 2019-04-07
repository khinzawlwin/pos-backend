'use strict';
module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define('Category', {
    title: DataTypes.STRING,
    icon: DataTypes.STRING,
    remark: DataTypes.STRING,
  },{
      tableName: 'categories',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  Category.associate = function(models) {
    models.Category.hasMany(models.Product, {
      onDelete: "CASCADE",
      foreignKey: 'category_id',
    });
  }; 

  return Category;
};