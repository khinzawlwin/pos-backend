'use strict';
module.exports = (sequelize, DataTypes) => {
  var City = sequelize.define('City', {
    city_name: DataTypes.STRING,
  },{
      tableName: 'cities',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  return City;
};