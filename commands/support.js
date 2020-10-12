const discord = require("discord.js")
const { prefix } = require('../configs/config.json');
const color = '#0E0F55'
module.exports = {
  name: 'support',
  aliases: [],
  description: 'Join the DiscPay support server',
  usage: '',
  args: false,
  guildOnly: false,
  cooldown: 5,
  execute(message, args){
    message.channel.send("You can use this link to join our support server, where you can get assistance with DiscPay and talk to other DiscPay users.\nhttps://discord.gg/d7dc3R3 \nor visit the website \nhttps://discpay.net")
    }
  }
