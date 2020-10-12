const Discord = require("discord.js");
const fetch = require("node-fetch");
const pairs = require("../configs/pairs.json");
const color = '#0E0F55'
module.exports = {
  name: 'price',
  aliases: ['market','ticker'],
  description: 'Get the current market info about a coin',
  usage: '[Coin]',
  args: true,
  guildOnly: false,
  cooldown: 15,
  execute(message, args){
    async function convert(){
      let coin;
      const command = message.content.slice(1).split(/ +/);
      try {
        const coin = command[1].toLowerCase()
        const id = await fetch('https://api.coingecko.com/api/v3/coins/list').then(response => response.json());
        const find = id.find(obj => obj.symbol === coin)
        const cg = await fetch('https://api.coingecko.com/api/v3/coins/'+find.id).then(response => response.json());
          const embed = new Discord.MessageEmbed()
            .setTitle("Market data for "+find.name)
            .setURL(cg.links.homepage[0])
            .addFields(
                 { name: 'Market Cap', value: '$'+cg.market_data.market_cap.usd, inline: true },
                 {name: 'Market Cap Rank', value: '#'+cg.market_cap_rank, inline:true},
                 {name: '24Hr Volume', value: '$'+cg.market_data.total_volume.usd, inline:true},
              );
          if(cg.market_data.price_change_percentage_1h_in_currency.usd < 0) {
            embed.setColor('#FF0000')
            embed.addField('1H Change','📉'+cg.market_data.price_change_percentage_1h_in_currency.usd.toFixed(2)+'%',true)
        } else {
          embed.setColor('#4DBD33')
          embed.addField('1H Change','📈'+cg.market_data.price_change_percentage_1h_in_currency.usd.toFixed(2)+'%',true)
        }
        if(cg.market_data.price_change_percentage_24h < 0) {
          embed.addField('24H Change','📉'+cg.market_data.price_change_percentage_24h.toFixed(2)+'%', true)
      } else {
        embed.addField('24H Change','📈'+cg.market_data.price_change_percentage_24h.toFixed(2)+'%', true)
      }
      if(cg.market_data.price_change_percentage_7d < 0) {
        embed.addField('7D Change','📉'+cg.market_data.price_change_percentage_7d.toFixed(2)+'%', true)
    } else {
      embed.addField('7D Change','📈'+cg.market_data.price_change_percentage_7d.toFixed(2)+'%', true)
    }
        embed.setFooter("Market data provided by CoinGecko")
          message.channel.send(embed);
      } catch (error) {
        console.error(error)
        message.channel.send("That coin isn't listed on CoinGecko!")
      }
    }
    convert();
  }
}
