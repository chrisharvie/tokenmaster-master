require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: 31337, // Should match the chainId of your Hardhat network
    },
  },

  solidity: "0.8.17",

  paths: {
    artifacts: ".artifacts",
    sources: "./contracts",
    cache: "./cache",
    tests: "./test",
  },
};
