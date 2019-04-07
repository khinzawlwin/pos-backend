'use strict';
module.exports = (sequelize, DataTypes) => {
  var KitchenUser = sequelize.define('KitchenUser', {
    user_id: DataTypes.INTEGER,
    kitchen_id: DataTypes.INTEGER,
    
  },{
      tableName: 'kitchen_users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  KitchenUser.associate = function (models) {
    models.KitchenUser.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: 'user_id',
    });
    models.KitchenUser.belongsTo(models.Kitchen, {
      onDelete: "CASCADE",
      foreignKey: 'kitchen_id',
    });

  };

  return KitchenUser;
};