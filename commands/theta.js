const Discord = require("discord.js");
module.exports = {
  name: 'theta',
  aliases: ['streamer'],
  description: 'Shows Streamer data',
  usage: '[live / username]',
  args: true,
  sql:false,
  guildOnly: false,
  cooldown: 5,
  execute(message, args){
    const https = require('https');
    if(args[0] == 'live'){
      console.log('Ran live');
      const https = require('https');
      const options = {
        hostname: 'api.theta.tv',
        port: 443,
        path: '/v1/theta/channel/list?number=5&=',
        method: 'GET',
        headers:{
          'CLIENT_ID' : '',
        }
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () =>{
          let json = JSON.parse(data);
          if(json['status'] == 'SUCCESS'){
            const embed = new Discord.MessageEmbed()
              embed.setTitle('Theta.tv top 5 live streams')
              embed.setURL('https://www.theta.tv')
            for(i = 0; i< 5; i++){
              let first = json['body'][i]['name']
              let second = 'https://www.theta.tv/'+json['body'][i]['alias']
              embed.addFields({name: first,value: second})
            }
            message.channel.send(embed);
          }else{
            message.reply("Error communicating with Theta");
          }
        })
      });
      req.on('error', (e) => {
        console.error(e);
      });
      req.end();
    }else{
      const https = require('https');
      const options = {
        hostname: 'api.theta.tv',
        port: 443,
        path: '/v1/user?username='+args[0],
        method: 'GET',
        headers:{
          'CLIENT_ID' : '',
        }
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () =>{
          let json = JSON.parse(data);
          if(json['status'] == "SUCCESS"){
            const exampleEmbed = new Discord.MessageEmbed()
            exampleEmbed.addField(json['body']['username'],'https://theta.tv/'+json['body']['username'])
            exampleEmbed.setThumbnail(json['body']['avatar_url'])
            message.channel.send(exampleEmbed);
          }else{
            message.reply("That user doesn't seem to exist");
          }
        })
      });
      req.on('error', (e) => {
        console.error(e);
      });
      req.end();
    }

  }
}
