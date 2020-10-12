const Discord = require("discord.js");
const Sequelize = require('sequelize');
const conf = require('./configs/config.json');
const admin = require('./configs/admin.json');
const functions = require('./functions.js');
const client = new Discord.Client();
const fs = require('fs');
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const guildFeatures = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
const fetch = require("node-fetch");
const color = '#0E0F55'
let balance;
let prefix;
let guild;
const faucet = new Set();
const sequelize = new Sequelize(conf['database'], conf['user'], conf['password'], {
	host: conf['host'],
	dialect: 'mysql',
	logging: false,
});

const User = sequelize.import('models/User');
const Guilds = sequelize.import('models/Guilds');
const Coins = sequelize.import('models/Coins');
const Tx = sequelize.import('models/Txids');
const Txwithdraw = sequelize.import('models/Txwithdraw');

function isNewUser (id) {
    return User.count({ where: { id: id } })
      .then(count => {
        if (count != 0) {
          return false;
        }
        return true;
    });
}

client.on("guildCreate", async(guild) => {
	console.log("ran");
		try {
			const guilds = await Guilds.create({
				id:guild.id,
				guild:guild.id,
				name:guild.name,
				prefix: '$',
				defaultcoin: 'btc'
			});
			guildJoined();
		}
		catch (e) {
			if (e.name === 'SequelizeUniqueConstraintError') {
				console.log('Guild already exists');
			}else{
				console.log('Something went wrong Guild' + e);
			}
		}
    console.log(`Joined new guild: ${guild.name}`);
		async function guildJoined(){
			guildFeatures[guild.id] = await Guilds.findAll( {where: { id: guild.id }} );
			prefix = guildFeatures[guild.id][0]['dataValues']['prefix'];
		}
});

client.on("guildDelete", async(guild) => {
		try {
			const guilds = await Guilds.destroy({
				where: {id: guild.id }
			});
		}
		catch (e) {
			console.log("Error getting rid of mysql guild: " +e);
		}
    console.log("Left a guild: " + guild.name);
})

client.on("message", async message => {
	if(message.guild === null){ //DM
		prefix = '$';
	}else if(typeof guildFeatures[message.guild.id] === 'undefined' && typeof message.guild.id != 'undefined'){ //Guild/Server
		guildFeatures[message.guild.id] = await Guilds.findAll( {where: { id: message.guild.id }} );
		prefix = guildFeatures[message.guild.id][0]['dataValues']['prefix'];
	}
  if(!message.content.startsWith(prefix) || message.author.bot) return;
	isNewUser(message.author.id).then(isUnique => {
    if (isUnique) {
			console.log("newUser");
			try {
				const user = User.create({
					id: message.author.id,
					user: message.author.id,
					username:message.author.username,
					btc:0.000001,
					eth:0,
					ltc:0,
					doge:0,
				});
				message.reply("Hello there, "+message.author.username+"! I've detected that you are a new user at DiscPay, and have setup an account for you. Run $bal to see your balances! (I gave you some bitcoins as a gift!)");
			}
			catch (e) {
				if (e.name === 'SequelizeUniqueConstraintError') {
					message.reply('User already exists');
				}else{
					message.reply('Something went wrong User' + e);
				}
				console.log(e);
			}
		}
	});

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)||client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return message.reply('Unknown command');
	if (command.guildOnly && message.guild === null) {
		return message.reply('I can\'t execute that command inside DMs!');
	}
	if (command.args && !args.length) {
				let reply = `You didn't provide any arguments, ${message.author}!`;
				if (command.usage) {
					reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
				}
				return message.channel.send(reply);
	}
	//Cooldown
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	//Commands
	try {
		if(command.admin){
			if(message.author.id === admin[message.author.username]['Id']){
			}else{
				return message.reply('there was an error trying to execute that command!');
			}
		}
		if(command.name === 'help'){
			command.execute(message, args, prefix);
		}else if(command.name === 'pay'){
			command.execute(message, args, User, client);
		}else if(command.name === 'checktx'){
			command.execute(message, args, User, Tx);
		}else if(command.name === 'withdraw'){
			command.execute(message, args, User, Txwithdraw);
		}else if(command.sql){
			command.execute(message, args, User);
		}else{
			command.execute(message, args);
    }
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.on("ready", () => {
	functions.balcheck();
	var interval = setInterval(function () { functions.balcheck(); }, 1800000);
  client.user.setActivity("with your crypto");
  console.log('DiscPay~Beta Started')
});

client.login(conf['token'])
