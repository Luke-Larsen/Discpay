module.exports = (sequelize, DataTypes) => {
  return sequelize.define('guilds', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
  		primaryKey: true
    },
    guild: {
      type: DataTypes.STRING,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
  	prefix: {
  		type: DataTypes.STRING,
  		unique: false,
  	},
  	defaultcoin: {
      type: DataTypes.STRING,
  		unique: false,
  	},
  });
}
