/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY, alchemyId } = process.env;
module.exports = {
   solidity: "0.8.9",
   defaultNetwork: "ropsten",
   networks: {
      hardhat: {},
      ropsten: {
         url: API_URL,
         accounts: [`${PRIVATE_KEY}`]
      },
      mumbai: {
      // Infura
      url: `https://polygon-mumbai.g.alchemy.com/v2/${alchemyId}`,
     // url: "https://rpc-mumbai.matic.today", alternative 
      accounts: [`${PRIVATE_KEY}`]
    },
    polygon: {
       url: 'https://rpc-mainnet.maticvigil.com', // we can get rpc Polygon Mainnet from Alchemy also
      accounts: [`${PRIVATE_KEY}`]
    },
   },
}