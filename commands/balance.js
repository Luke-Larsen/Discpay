const Discord = require("discord.js");
const pairs = require("../configs/pairs.json");
const color = '#0E0F55'
module.exports = {
  name: 'balance',
  aliases: ['bal', 'money','wallet'],
  description: 'Shows your balance',
  usage: '[Coin Symbol]',
  args: false,
  sql:true,
  guildOnly: false,
  cooldown: 5,
  execute(message, args, User){
   if(typeof args[0] != 'undefined'){
    let coin;
    coin = args[0]
    coin = coin.toLowerCase();
    async function getBal(){
      const balance = await User.findAll( {where: { id: message.author.id }} );
      if(typeof balance[0][coin] != 'undefined'){
        const embed = new Discord.MessageEmbed()
          .setColor(color)
          .setTitle(message.author.username+"'s "+pairs[coin].name+" Balance")
          .addField(pairs[coin].emote+" "+pairs[coin].name, balance[0][coin]);
        return message.channel.send(embed);
    }else{
        return message.channel.send("We do not currently support that coin.");
      }
    }
    getBal().then(hasperm => {
    }).catch(e => {
        if (e.name === 'DiscordAPIError'){
        return message.channel.send("**"+e.toString()+"** \nI can not run this command without the embed links permission please let an adminitrator know that they should enable it");
      }else{
        return message.channel.send("Im not sure what went wrong please contact a DiscPay admin" + e);
        console.log(e)
      }
    });
    }else{
      //No args given
      async function getBals(){
        const balance = await User.findAll(
          {
            attributes: ['btc','ltc','doge','dogec'],
            where: { id: message.author.id }
          }
        );
        if(typeof balance[0] != 'undefined'){
          const embed = new Discord.MessageEmbed()
          let total = 0;
          for (var key in balance[0]['dataValues']) {
            if(balance[0]['dataValues'][key] >= 0) {
              total += (balance[0]['dataValues'][key] * parseFloat(pairs[key]["price"]))
            }
            //if(balance[0]['dataValues'][key] > 0) {
              embed.addField(pairs[key].emote+" "+pairs[key].name, balance[0]['dataValues'][key])
            //}
          }
          embed.addField('Total USD Value balance', '**$'+total.toFixed(2)+'**')
          return message.channel.send(embed);
        }
      }
      getBals().then(hasperm => {
      }).catch(e => {
          if (e.name === 'DiscordAPIError'){
          return message.channel.send("**"+e.toString()+"** \nI can not run this command without the embed links permission please let an adminitrator know that they should enable it");
        }else{
          return message.channel.send("Im not sure what went wrong please contact a DiscPay admin");
          console.log(e)
        }
      });
    }
  }
}
