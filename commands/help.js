const discord = require("discord.js")
const color = '#0E0F55'
module.exports = {
  name: 'help',
  aliases: ['commands'],
  description: 'Shows help info',
  usage: '[command name] (optional)',
  args: false,
  guildOnly: false,
  cooldown: 5,
  execute(message, args,prefixpas){
    const prefix = prefixpas;
    const data = [];
    const { commands } = message.client;
    if (!args.length) {
      const embed = new(discord.MessageEmbed)
        embed.setColor(color)
        embed.setAuthor("DiscPay Help")
        embed.setDescription('Do prefix+help <command> to learn more about a command ($help help)')
        commands.map(command =>{
          if(!command.admin){
            embed.addFields(
              {name: command.name, value: command.description, inline:true},
            )
          }
        });
      try {
        message.channel.send(embed)
      } catch (error) {
        message.author.send(embed)
        message.channel.send("I've sent you a DM with my commands!")
        message.channel.send("**Error:** I was unable to send an embed in this channel. Some commands may not work properly. Please notify an admin to grant me the embed links permission.")
      }
    }
    let command
    let name
    if (!args[0]) {} else {
      name = args[0].toLowerCase();
      command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
      if (!command) {
      	return message.reply('that\'s not a valid command!');
      }
      data.push(`**Name:** ${command.name}`);
      if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
      if (command.description) data.push(`**Description:** ${command.description}`);
      if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
      data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
      message.channel.send(data, { split: true });
    }
  }
}
