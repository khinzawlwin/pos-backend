'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    photo: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    role: DataTypes.INTEGER,
    kitchen_id: DataTypes.INTEGER,
    address: DataTypes.STRING
  },{
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  User.associate = function (models) {
    models.User.belongsTo(models.Role, {
      onDelete: "CASCADE",
      foreignKey: 'role',
    });
    models.User.belongsTo(models.Kitchen, {
      onDelete: "CASCADE",
      foreignKey: 'kitchen_id',
    });

    models.User.hasMany(models.Product, {
      onDelete: "CASCADE",
      foreignKey: 'created_by',
    });
    models.User.hasMany(models.Purchase, {
      onDelete: "CASCADE",
      foreignKey: 'purchase_by',
    });

  };

  //roles
  User.ADMIN = 1;
  User.MANAGER = 2;
  User.CASHIER = 3;
  User.WAITER = 4;
  User.KITCHEN = 5;

  return User;
};