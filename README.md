# MetaSchool-NFT
## A Solidity smart contract for MetaSchool-NFT. 

Below is our NFT smart contract code, which we based on the OpenZeppelin library’s ERC-721 implementation.

**MetaSchoolNFT.sol**
```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MetaNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("MetaSchoolNFT", "MSNFT") {}

    function mintNFT(address recipient, string memory tokenURI)
        public onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}

```

At the top of our smart contract, we import three OpenZeppelin smart contract classes:

- @openzeppelin/contracts/token/ERC721/ERC721.sol contains the implementation of the ERC-721 standard, which our NFT smart contract will inherit. 

- @openzeppelin/contracts/utils/Counters.sol provides counters that can only be incremented or decremented by one. Our smart contract uses a counter to keep track of the total number of NFTs minted and set the unique ID on our new NFT. 

- @openzeppelin/contracts/access/Ownable.sol sets up access control on our smart contract, so only the owner of the smart contract (you / Admin) can mint NFTs. 

function mintNFT(address recipient, string memory uri) allows us to mint an NFT! tice this function takes in two variables:

**Deployment Script (deploy.js)**
```
async function main() {
    const MSNFT = await ethers.getContractFactory("MetaNFT")
  
    // Start deployment, returning a promise that resolves to a contract object
    const msNFT = await MSNFT.deploy()
    await msNFT.deployed()
    console.log("Contract deployed to address:", msNFT.address)
  }
  main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```

**Hardhat.config.js scriopt to deploy to polygon**

```
/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY, alchemyId } = process.env; // secret variables stored in .env
module.exports = {
   solidity: "0.8.9",
   defaultNetwork: "mumbai",
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
```

**Minting Script for Metaschool NFT(mint-nft.js)**
```
require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MetaSchoolNFT.sol/MetaNFT.json")
const contractAddress = process.env.CONTRACT_ADDRESS;
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce
  
    //the transaction
    const tx = {
      from: PUBLIC_KEY,
      to: contractAddress,
      nonce: nonce,
      gas: 500000,
      data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    }
  
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    signPromise
      .then((signedTx) => {
        web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
          function (err, hash) {
            if (!err) {
              console.log(
                "The hash of your transaction is: ",
                hash,
                "\nCheck Alchemy's Mempool to view the status of your transaction!"
              )
            } else {
              console.log(
                "Something went wrong when submitting your transaction:",
                err
              )
            }
          }
        )
      })
      .catch((err) => {
        console.log("Promise failed:", err)
      })
  }
  
  mintNFT(
    "https://miro.medium.com/max/1120/1*k_EY7dcLYB5Z5k8zhMcv6g.png"
  )
```

##Note
NFT images can also be store in IPFS services like Pinata or NFT.storage example of pinata is below
Pinata: https://gateway.pinata.cloud/ipfs/QmbjasGHWhDyizG1YJYZAjiLp2gPtVs8ktGiqYnfbj5Di4
Metaschool CID: QmbjasGHWhDyizG1YJYZAjiLp2gPtVs8ktGiqYnfbj5Di4


**.env (secret variable not to be made public)**
```
API_URL=""
PRIVATE_KEY=""
alchemyId=""
PUBLIC_KEY=""
CONTRACT_ADDRESS=""
```

This work was done and sent to my github repo
https://github.com/holyaustin/MetaSchool-NFT

git clone https://github.com/holyaustin/MetaSchool-NFT.git

cd MetaSchool-NFT

npm install

npx hardhat compile

npx hardhat --network mumbai run scripts/deploy.js (for Mumbai testnet)
or 
npx hardhat --network polygon run scripts/deploy.js (for polygon Mainnet)

node scripts/mint-nft.js
