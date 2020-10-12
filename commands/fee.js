const Discord = require("discord.js");
const pairs = require("../configs/pairs.json");
module.exports = {
  name: 'fee',
  aliases: [],
  description: 'Shows our fee structure',
  usage: '[cointicker]',
  args: false,
  guildOnly: false,
  cooldown: 5,
  execute(message, args){
    const feeEmbed = new Discord.MessageEmbed()
    feeEmbed.setTitle("Fee Structure")
    feeEmbed.setDescription('We use fees to keep the lights on and make all transactions go smoothly. The following is the structure for fees based on the coins. The base fee happens on every transaction the progressive fee is a percent of the total transaction.');
    for(i=0;i<Object.keys(pairs).length;i++) {
      let baseKey = Object.keys(pairs)[i]
      let percentage = (pairs[baseKey]['fee'] * 100)
      feeEmbed.addField(pairs[baseKey].emote+" "+pairs[baseKey].name,"Base Fee: " + pairs[baseKey]['baseFee'] + " "+baseKey+ "\nPogressive Fee: "+  percentage + "%");
    }
    message.channel.send(feeEmbed);
  }
}
