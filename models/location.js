'use strict';
module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define('Listing', {
    name: DataTypes.STRING,
    tag: DataTypes.STRING,
  },
    {
      classMethods: {
        associate: function(models){
          Location.hasMany(models.Item, { foreignKey: 'item_id'});
        }
      }
    });
  return Location;
};
