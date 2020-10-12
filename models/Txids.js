module.exports = (sequelize, DataTypes) => {
  return sequelize.define('txids', {
    id: {
      type: DataTypes.STRING,
      defaultValue: 0,
      allowNull: false,
  		unique: false,
    },
    tx:{
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    address:{
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
}
