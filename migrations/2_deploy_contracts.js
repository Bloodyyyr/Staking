var ERC20Token = artifacts.require("./ERC20Token.sol");
var StakingEth = artifacts.require("./StakingEth.sol");


module.exports = function(deployer, network, accounts) {

  deployer.then(async () => {
      await deployer.deploy(ERC20Token);
      await deployer.deploy(StakingEth, ERC20Token.address); 
      
  });
  
};
