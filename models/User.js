module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    id: {
      type: DataTypes.STRING,
      defaultValue: 0,
  		primaryKey: true,
      allowNull: false,
  		unique: true,
    },
    user: {
      type: DataTypes.STRING,
    },
    userlevel:{
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
  	username: {
  		type: DataTypes.STRING,
  	},
  	btc: {
  		type: DataTypes.DECIMAL(16, 8),
  		defaultValue: 0.00000000,
  		allowNull: false,
  	},
    eth: {
      type: DataTypes.DECIMAL(16, 8),
      defaultValue: 0.00000000,
      allowNull: false,
    },
    doge: {
      type: DataTypes.DECIMAL(16, 8),
      defaultValue: 0.00000000,
      allowNull: false,
    },
    dogec: {
      type: DataTypes.DECIMAL(16, 8),
      defaultValue: 0.00000000,
      allowNull: false,
    },
    ltc: {
      type: DataTypes.DECIMAL(16, 8),
      defaultValue: 0.00000000,
      allowNull: false,
    },
    btcDeposit: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    dogeDeposit: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    ltcDeposit: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    dogecDeposit: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    btcWithdraw: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    dogeWithdraw: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    ltcWithdraw: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    dogecWithdraw: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
  });
}
