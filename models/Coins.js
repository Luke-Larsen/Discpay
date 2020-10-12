module.exports = (sequelize, DataTypes) => {
  return sequelize.define('coin', {
    coin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    altNames: {
      type: DataTypes.STRING,
      unique: false,
    },
    ticker: {
      type: DataTypes.STRING,
      unique: true,
    },
    baseFee: {
      type: DataTypes.STRING,
      unique: false,
    },
  	Fee: {
  		type: DataTypes.STRING,
  		unique: false,
  	},
  	emote: {
      type: DataTypes.STRING,
  		unique: true,
  	},
  });
}
