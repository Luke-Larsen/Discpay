const Discord = require("discord.js");
var coind = require('node-coind');
const rpc = require("../configs/rpc.json");
const pairs = require("../configs/pairs.json");
module.exports = {
  name: 'deposit',
  description: 'Tests connection to wallets',
  usage: '[Coin Ticker]',
  args: true,
  sql:true,
  guildOnly: false,
  cooldown: 3,
  execute(message, args, User){
    if(typeof args[0] != 'undefined'){


      const coin = args[0].toLowerCase();;
      if(typeof pairs[coin] === 'undefined'){
        return message.reply("That coin either doesn't exist in our system or is malformed, try using only a ticker symbol like btc,ltc,doge,dogec.")
      }

      const addrDBName = coin + 'Deposit';
      var client = new coind.Client({
        host: '127.0.0.1',
        port: rpc[coin].port,
        user: rpc[coin].username,
        pass: rpc[coin].password
      });
      client.cmd('getnewaddress', async function(err,addr) {
        if (err) return console.log(err);
        const addrcheck = await User.findAll({
          where: { id: message.author.id }
        });
        if(addrcheck[0]['dataValues'][addrDBName] != '0'){
          message.reply("Your "+coin+" address is "+ '```' + addrcheck[0]['dataValues'][addrDBName] + '```' + " After depositing use the checktx command to add it to your balance. You will need 3 confirmations first")
        }else{
          if(typeof rpc[coin] != 'undefined'){
            try {
                await User.update(
                  {
                    [addrDBName] : addr
                  },
                  {
                    where: { id: message.author.id }
                  });
                }catch(e){
                  message.reply("Error occured" + e);
                }
              message.reply(coin+' Deposit Address: ' + "```" + addr + "```" + " After depositing use the checktx command to add it to your balance. You will need 3 confirmations first");
          }else{
            message.channel.send("We either do not support that coin, or the coin name has been incorrectly typed");
          }
        }
      });
    }else{
      message.reply('The coin ticker is incorrectly formatted or we do not support that coin yet.');
    }
  }
}
