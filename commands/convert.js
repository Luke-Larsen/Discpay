const Discord = require("discord.js");
const fetch = require("node-fetch");
const pairs = require("../configs/pairs.json");
const color = '#0E0F55'
module.exports = {
  name: 'convert',
  aliases: [],
  description: 'Converts one currency into usd and eur',
  usage: '[Amount] [Cryptocurrency]',
  args: true,
  guildOnly: false,
  cooldown: 5,
  execute(message, args){
    async function convert(){
      let coin;
      console.log(args[0]);
      if(Number.isInteger(parseInt(args[0], 10))){
        coin = args[1];
        amount = args[0];
        coin = coin.toLowerCase();
      }else{
        if(typeof args[1] === 'undefined'){
          coin = args[0];
          amount = 1;
          coin = coin.toLowerCase();
        }else{
          coin = args[0];
          if(typeof args[1] === 'undefined'){
            amount = 1;
          }else{
            amount = args[1];
          }
          coin = coin.toLowerCase();
        }
      }
      try {
        if(typeof pairs[coin] === 'undefined'){
          return message.channel.send("We don't support that coin");
        }
        const cusd = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=' + pairs[coin].name + '&vs_currencies=usd').then(response => response.json());
        const ceur = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=' + pairs[coin].name + '&vs_currencies=eur').then(response => response.json());
        if(typeof cusd != 'undefined' && typeof ceur != 'undefined'){
          const usdprice = parseFloat(JSON.stringify(cusd[pairs[coin].name.toLowerCase()]['usd']))*amount
          const eurprice = parseFloat(JSON.stringify(ceur[pairs[coin].name.toLowerCase()]['eur']))*amount
          const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(amount+" "+pairs[coin].name+" is worth")
            .addFields(
                 { name: 'USD', value: '$'+usdprice.toFixed(3), inline: true },
                 { name: 'EUR', value: '€'+eurprice.toFixed(3), inline: true },
              );
            embed.setFooter("Market data provided by CoinGecko")
          message.channel.send(embed);
        }else{
          message.channel.send("A coin Gecko error occured")
        }
      } catch (error) {
        message.channel.send("An error occured: " + error);
      }
    }
    convert();
  }
}
