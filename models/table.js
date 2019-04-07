'use strict';
module.exports = (sequelize, DataTypes) => {
  var Table = sequelize.define('Table', {
    name: DataTypes.STRING,
    status: DataTypes.INTEGER,
  },{
      tableName: 'tables',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  Table.associate = function (models) {
    models.Table.hasMany(models.Order, {
      onDelete: "CASCADE",
      foreignKey: 'table_id',
    });
    models.Table.hasMany(models.KitchenOrder, {
      onDelete: "CASCADE",
      foreignKey: 'table_id',
    });
  };

  return Table;
};