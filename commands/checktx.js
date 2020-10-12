const Discord = require("discord.js");
var coind = require('node-coind');
const rpc = require("../configs/rpc.json");
module.exports = {
  name: 'checktx',
  description: 'Gets new transactions and adds them to the wallet',
  args: true,
  sql:true,
  guildOnly: false,
  transaction: true,
  cooldown: 5,
  execute(message, args, User, Tx){
    const coin = args[0];
    const coinTicker = args[0];
    const depositAddr = '0';
    const addrDBName = coinTicker + 'Deposit';
    var client = new coind.Client({
      host: '127.0.0.1',
      port: rpc[coin].port,
      user: rpc[coin].username,
      pass: rpc[coin].password
    });
    // Use getreceivedbyaddress to get all tx related to the deposit address on someones account
    async function getUserData(){
      const addrcheck = await User.findAll({
        where: { id: message.author.id }
      });
      //console.log(addrcheck[0]['dataValues'][addrDBName]);
      if(addrcheck[0]['dataValues'][addrDBName] == 0){
        return message.reply("No wallet assocated with this account!");
      }
        client.cmd('listreceivedbyaddress',3,true,false, async function(err,tx) {
          if (err) return console.log(err);
          for (var key in tx){
            if(tx[key]['address'] == addrcheck[0]['dataValues'][addrDBName]){
              for (var txidkey in tx[key]['txids']){
                //console.log(txidkey);
                //console.log(tx[key]['txids'][txidkey])
                const txcheck = await Tx.findAll({
                  where: { tx : tx[key]['txids'][txidkey] }
                });
                if(txcheck == ''){
                  //console.log("New Transaction");
                  //Add in the sql for the tx and add to balance
                  client.cmd('gettransaction',tx[key]['txids'][txidkey], await function(err,trasactionData) {
                    //console.log(trasactionData['details'][0]['address']);
                    transactionAmount = parseFloat(trasactionData['amount']);
                    const newbal = transactionAmount + parseFloat(addrcheck[0]['dataValues'][coinTicker]);
                    //console.log(transactionAmount);
                    //console.log(parseFloat(addrcheck[0]['dataValues']['dogec']));
                    //console.log(newbal);
                    try{
                      User.update(
                        {
                          [coin] : parseFloat(newbal)
                        },
                        {
                          where: { id: message.author.id }
                        });
                    }catch(e){
                      message.reply("Error occured" + e);
                    }
                    const txstring = trasactionData['txid'].toString();
                    const txaddr = trasactionData['details'][0]['address'].toString();
                    //console.log(message.author.id)
                    //console.log(txaddr)
                    Tx.create(
                      {
                        id : message.author.id,
                        tx : txstring,
                        address : txaddr
                      }).then(function(transactionLogged){
                        //console.log("success");
                      }).catch(function(error){
                        console.log(error);
                      });
                      message.reply("New Transaction " + txstring + " added to your account");
                  });
                }
              }
            }
          }
          message.reply("Checked through transactions");
          //THIS IS TECHNICALY THE END OF THE COMMAND
          //But for tests sake and the sake of making everything work
          //we are putting in a check to add funds to an account
          //in the event that someone sends something
        });
      }
    getUserData();
    // Check if tx listed in a already added mysql database
    // If not add the funds assoc to tx
    // If it is do nothing.
  }
}
