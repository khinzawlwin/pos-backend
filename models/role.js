'use strict';
module.exports = (sequelize, DataTypes) => {
  var Role = sequelize.define('Role', {
    role: DataTypes.STRING
  },{
      tableName: 'roles',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

  Role.associate = function(models) {
    models.Role.hasMany(models.User, {
      onDelete: "CASCADE",
      foreignKey: 'role',
    });
  }; 

  return Role;
};