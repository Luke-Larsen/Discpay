var coind = require('node-coind');
const rpc = require("../configs/rpc.json");
const pairs = require("../configs/pairs.json");
module.exports = {
  name: 'withdraw',
  description: 'Withdraw to a wallet',
  args: true,
  usage: '[Amount] [Coin] [walletaddress]',
  sql:true,
  guildOnly: false,
  transaction: true,
  cooldown: 5,
  execute(message, args, User, Tx){
    //args0 amount
    //args1 coin
    //args2 walletAddress


    //Checks for correct inputs
    if(typeof args[0] != 'undefined' && typeof args[1] != 'undefined' &&typeof args[2] != 'undefined'){
      var amount = parseFloat(args[0]).toFixed(8);
      var coin = args[1].toLowerCase();
      var walletAddress = args[2];
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
      return message.reply("Please use the command as such: [prefix]withdraw [Amount] [CoinTicker] [Withdraw Address]")
    }


    //Withdraw section
    async function withdraw(){
      const withdrawAddr = coin + 'Withdraw';
      const withdrawCheck = await User.findAll({
        where: { id: message.author.id }
      });
      //check if user has said amount of money
      if(parseFloat(withdrawCheck[0]['dataValues'][coin]) >= (parseFloat(amount) + (parseFloat(amount) * parseFloat(pairs[coin]['fee'])) + parseFloat(pairs[coin]['baseFee'])).toFixed(8)){
        //Varify
        let replyMessage = message.reply('I will send '+ amount +' '+ coin + ' to ' + walletAddress +' with a fee of '+ (parseFloat(amount) * parseFloat(pairs[coin]['fee']) + parseFloat(pairs[coin]['baseFee'])).toFixed(8) + ' ' + coin +'. **Make sure the wallet is corret once this is sent we have no way to undo it!** Is this correct? [Reply with "YES"] if so. Will expire in 20 seconds...');
        message.channel.awaitMessages(m => m.author.id == message.author.id,{max: 1, time: 20000}).then(collected => {
          if (collected.first().content.toLowerCase() == 'yes' || collected.first().content.toLowerCase() =='y') {
            message.reply('Confirmed!');
            var client = new coind.Client({
              host: '127.0.0.1',
              port: rpc[coin].port,
              user: rpc[coin].username,
              pass: rpc[coin].password
            });
            //send money
            if(pairs[coin].bitcoinCoreVersion < 16){
              console.log("sent via 16- method");
              try{
                client.cmd('sendtoaddress',walletAddress,parseFloat(amount),'','', function(err, txid) {
                  const newbal = parseFloat(withdrawCheck[0]['dataValues'][coin]) - (parseFloat(amount) + (parseFloat(amount) * pairs[coin]['fee']) + parseFloat(pairs[coin]['baseFee']));
                  try {
                    User.update(
                       {
                         [coin] : newbal,
                       },
                       {
                         where: {id:message.author.id}
                       }
                   )
                  }catch(e){
                    message.reply("Error occured0" + e);
                  }
                  if(typeof txid != 'undefined'){


                    //Log Transaction
                    try {
                      Tx.create({
                        id:message.author.id,
                        tx:txid,
                        address:walletAddress,
                      });
                    }
                    catch (e) {
                      console.log('Error logging transaction' + e);
                    }

                    message.reply("Transaction Id: ```" + txid + '```');
                  }else{
                    message.reply("Transaction Sent");
                  }
                });
              }catch(e){
                message.reply("Error when sending coin" + e);
              }
            }else{
              console.log("sent via 16+ method");
              try{
                client.cmd('sendtoaddress',walletAddress,parseFloat(amount),'','',false,false,6,"CONSERVATIVE", function(err, txid) {
                  const newbal = parseFloat(withdrawCheck[0]['dataValues'][coin]) - (parseFloat(amount) + (parseFloat(amount) * parseFloat(pairs[coin]['fee'])) + parseFloat(pairs[coin]['baseFee']));
                  try {
                    User.update(
                       {
                         [coin] : newbal,
                       },
                       {
                         where: {id:message.author.id}
                       }
                   )
                  }catch(e){
                    message.reply("Error occured0" + e);
                  }
                  console.log(txid);
                  if(typeof txid != 'undefined' && typeof txid != 'null'){

                    //log transaction
                    try {
                      Tx.create({
                        id:message.author.id,
                        tx:txid,
                        address:walletAddress,
                      });
                    }
                    catch (e) {
                      console.log('Error logging transaction' + e);
                    }

                    message.reply("Transaction Id: ```" + txid + '```');
                  }else{
                    message.reply("Transaction Sent");
                  }
                });
              }catch(e){
                message.reply("Error when sending coin" + e);
              }
            }
          }else{
            message.reply("withdraw canceled");
          }
        }).catch((e)=>{
          message.reply('No answer after 20 secounds, withdraw canceled'+e);
        });
      }else{
        message.reply("You do not have enough funds");
      }
    }
    withdraw();
  }
}
