const Discord = require("discord.js");
const rpc = require("../configs/rpc.json");
const sequelize = require('sequelize');
var coind = require('node-coind');
module.exports = {
  name: 'rpctest',
  aliases: ['connect'],
  description: 'Tests connection to wallets',
  args: true,
  usage: '[Coin]',
  sql:true,
  guildOnly: false,
  admin: true,
  cooldown: 5,
  execute(message, args, User){
    const coin = args[0];
    var client = new coind.Client({
      host: '127.0.0.1',
      port: rpc[coin].port,
      user: rpc[coin].username,
      pass: rpc[coin].password
    });
    client.getBalance('*', 3, async function(err, balance) {
      if (err) return console.log(err);
      message.channel.send('Wallet Balance: ' + parseFloat(balance));
      //console.log(coin);

      const totalMysqlBalances = await User.sum([coin]);

      //console.log(totalMysqlBalances);
      message.channel.send('Mysql Balance: ' + totalMysqlBalances);
    });
  }
}
