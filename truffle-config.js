/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

 const HDWalletProvider = require('@truffle/hdwallet-provider');
//
 const fs = require('fs');
 const mnemonic = fs.readFileSync("./code.secret").toString().trim();

module.exports = {

  networks: {
    
    development: {
       host: "127.0.0.1",     
       port: 7777,            
       network_id: "1337",       
       },
    
     kovan: {
     provider: () => new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/9b7bdcddae15450a8be30caaaa138bf8`),
     network_id: 42,       
      gas: 5500000,       
     }

  },

  // Configure your compilers
  compilers: {
    solc: {
       version: "0.8.0",         
       settings: {         
        optimizer: {
          enabled: false,
          runs: 200
        },
       }
    }
  },
  
}