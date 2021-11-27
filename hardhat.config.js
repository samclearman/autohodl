require("@nomiclabs/hardhat-waffle");

const keys = require("./keys");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: keys.ropstenAlchemyHttp,
      accounts: [`0x${keys.ropstenAccountPrivate}`]
    }
  }
};
