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
