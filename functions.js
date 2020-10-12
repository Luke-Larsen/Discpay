var coind = require('node-coind');
const rpc = require("../configs/rpc.json");
const pairs = require("../configs/pairs.json");
const fs = require('fs');
module.exports = {
  balcheck: function(){
    console.log("checked bal");

    //checking fees
    for(i=0;i<Object.keys(pairs).length;i++) {
      console.log(i);
      let baseKey = Object.keys(pairs)[i];
      var client = new coind.Client({
        host: '127.0.0.1',
        port: rpc[baseKey].port,
        user: rpc[baseKey].username,
        pass: rpc[baseKey].password
      });
      if(baseKey== 'doge'){
        console.log(baseKey);
      }else{
        if(pairs[baseKey]['bitcoinCoreVersion'] < parseInt(15)){
          client.cmd('estimatefee',1, function(err,kbfee) {
            console.log(baseKey);
            if(err) return console.log(err);
            let bytefee = parseFloat(kbfee) * parseFloat(0.0300);
            //console.log(pairs[baseKey]['baseFee']);
            pairs[baseKey]['baseFee'] = parseFloat(bytefee).toFixed(8);
            //console.log(bytefee);
            //console.log(pairs[baseKey]['baseFee']);

            const data = JSON.stringify(pairs, null, 4);
            //console.log(data);
            console.log("writing to cache");
            fs.writeFile("../configs/pairs.json", data, function(err) {
                if (err) {
                  return console.log("error "+err)
                }else{
                  console.log("new fee written");
                  delete require.cache[require.resolve('../configs/pairs.json')];
                  console.log("reloaded Cache")
                }
              }
            );

          });
        }else{
          client.cmd('estimatesmartfee',48, function(err,kbfee) {
            console.log(baseKey);
            if(err) return console.log(err);
            let bytefee = parseFloat(kbfee['feerate']) * parseFloat(0.0300);
            //console.log(pairs[baseKey]['baseFee']);
            pairs[baseKey]['baseFee'] = parseFloat(bytefee).toFixed(8);
            //console.log(pairs[baseKey]['baseFee']);

            const data = JSON.stringify(pairs, null, 4);
            //console.log(data);
            console.log("writing to cache");
            fs.writeFile("../configs/pairs.json", data, function(err) {
                if (err) {
                  return console.log("error "+err)
                }else{
                  console.log("new fee written");
                  delete require.cache[require.resolve('../configs/pairs.json')];
                  console.log("reloaded Cache")
                }
              }
            );

          });
        }
      }
    }
  }
};
