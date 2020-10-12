const Discord = require("discord.js");
const pairs = require("../configs/pairs.json");
const color = '#0E0F55'
module.exports = {
  name: 'pay',
  aliases: ['send'],
  description: 'Pays to another user',
  usage: '[Coin Symbol] [Amount] [User]',
  args: false,
  sql:true,
  guildOnly: false,
  cooldown: 5,
  execute(message, args, User, client){
    //args[0] = coin ticker ie btc
    //args[1] = amount ie 5
    //args[2] = users to send to ie @pyrin

    //Checks for correct inputs
    if(typeof args[0] != 'undefined' && typeof args[1] != 'undefined' &&typeof args[2] != 'undefined'){
      var amount = parseFloat(args[1]).toFixed(8);
      var coin = args[2].toLowerCase();
      var usermention = args[0];

      //Getting proper userid from usermention
      if (usermention.startsWith('<@') && usermention.endsWith('>')) {
        usermention = usermention.slice(2, -1);
        if (usermention.startsWith('!')) {
          usermention = usermention.slice(1);
        }
      }
      //checking usermention
      if(typeof amount === 'undefined'){
        return message.reply("I'm sorry but it seems the amount you entered is not a number");
      }
      if(typeof pairs[coin] === 'undefined'){
        return message.reply("That coin either doesn't exist in our system or is malformed, try using only a ticker symbol like btc,ltc,doge,dogec.")
      }
      //check for specific things
      if(amount <= 0){
        return message.reply("Sorry but you can't send 0 or less of anything");
      }
    }else{
      return message.reply("Please use the command as such: [prefix]pay [@user] [Amount] [CoinTicker]")
    }


  async function pay(){
   let userSendTo;
   const balanceToUpdate = await User.findAll(
     {
       where: { id: usermention }
     });
   if(typeof balanceToUpdate[0] != 'undefined'){
   }else{
     return message.reply("No user by that mention, Please try again");
   }
   userSendTo = client.users.cache.get(usermention);
   const balance = await User.findAll(
   {
     where: { id: message.author.id}
   });
   if(parseFloat(balance[0]['dataValues'][coin]) >= parseFloat(amount)){
     const newBalance = parseFloat(balance[0]['dataValues'][coin]) - parseFloat(amount);
     const updatedWallet = parseFloat(balanceToUpdate[0]['dataValues'][coin])+parseFloat(amount);
     try {
       User.update(
         {
          [coin] : updatedWallet,
          },
          {
            where: {id:userSendTo['id']}
          })
     }catch(e){
       message.reply("Error occured" + e);
     }
     try {
       User.update(
          {
            [coin] : newBalance,
          },
          {
            where: {id:message.author.id}
          }
      )
     }catch(e){
       message.reply("Error occured1" + e)
     }
     message.reply(amount + " " + coin + " Sent to " + userSendTo['username']);
     }else{
       message.reply("You do not have that much of said coin");
     }
    }
    pay();
  }
}
