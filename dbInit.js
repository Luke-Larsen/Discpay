const Sequelize = require('sequelize');
const conf = require('./configs/config.json');
//mysql starter
const sequelize = new Sequelize(conf['database'], conf['user'], conf['password'], {
	host: conf['host'],
	dialect: 'mysql',
	logging: false,
});
sequelize.import('models/User.js');
sequelize.import('models/Guilds.js');
sequelize.import('models/Coins.js');
sequelize.import('models/Txids.js');
sequelize.import('models/Txwithdraw.js');
const force = process.argv.includes('--force') || process.argv.includes('-f');
sequelize.sync({ force }).then(async () => {
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);
