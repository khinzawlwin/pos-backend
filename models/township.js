'use strict';
module.exports = (sequelize, DataTypes) => {
  var Township = sequelize.define('Township', {
    township_en: DataTypes.STRING,
    township_mm: DataTypes.STRING,
    city_id: DataTypes.INTEGER,
  },{
      tableName: 'townships',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  return Township;
};