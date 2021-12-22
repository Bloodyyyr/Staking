pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

    /// @author Bloodyr
    /// @title Staking eth
    contract StakingEth is Ownable {
      
      AggregatorV3Interface internal priceMyToken;
      IERC20 internal myToken;
      
      ///@notice used to differentiate users
      struct Staker {
        bool isStaker;
        bool rewardCalculed;
        uint balance;
        uint myReward;
        uint blockStake;
      }

      event ethDeposit(address depositAddress, uint amountStake);
      event ethWithdraw(address withdrawAddress, uint amountdestake);
      event rewardCalculed();
      event rewardWithdraw(address from, uint amount);

      mapping(address => Staker)public stakers;
      
      int internal timeInterest = 30 ;      
      
      constructor(address addressToken)  payable {
        
        myToken = IERC20(addressToken);
        priceMyToken = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
        
      }

      ///@notice Reception of eth
      ///dev Check that the reward has already been awarded, Modify user structure, allow sending eth
      receive() external payable {
        require(stakers[msg.sender].isStaker == false, "Vous ne devais pas avoir deja stacker des eth pour pour stacker");
        stakers[msg.sender].blockStake = block.timestamp;
        stakers[msg.sender].isStaker = true;
        stakers[msg.sender].balance += msg.value;
        stakers[msg.sender].rewardCalculed = false;

        emit ethDeposit(msg.sender, msg.value);
      }
      
      ///@notice Withdraw Eth
      ///@dev Require that the user structure be true, set an amount in relation to the balance,
      ///@dev reassign the balance of the balance to 0,
      ///@dev Return the eth to its owner, calculate the reward, send the reward, unify the user structure
      function whithdraw(address payable _to) public {

        require(stakers[msg.sender].isStaker == true, "Vous devais avoir Staker des Eth pour pouvoir whithdraw");
        require(stakers[msg.sender].rewardCalculed == true);
        
        uint _amount = stakers[msg.sender].balance;
        
        
        _to.transfer(_amount);
        
        stakers[msg.sender].balance = 0;

        stakers[msg.sender].rewardCalculed = false;
        stakers[msg.sender].isStaker = false;

        emit ethWithdraw(_to, _amount);
    
      }

      ///@notice return the value of my token
      ///@dev use the oracle chainlink to retrieve the value at time T of the eth
      ///@dev and set the value of my token with a ratio of / 1000
      ///@return Price of my token 
      function getLatestMyTokenPrice() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceMyToken.latestRoundData();

        int tokenPrice = price / 1000;

        return tokenPrice;
    }

      ///@notice return the value of my token
      ///@dev use the oracle chainlink to retrieve the value at time T of the eth
      function getLatestEthPrice() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceMyToken.latestRoundData();

        return price;
      }

      ///@notice Calculate the amount of the reward
      ///@dev Calculate the amount of the reward compared to the eth, converted into my token
      function calculedReward() public {

        require(stakers[msg.sender].isStaker == true); 

        uint time = block.timestamp - stakers[msg.sender].blockStake;
        uint numberOfReward = time / uint(timeInterest);
        int balance = int(stakers[msg.sender].balance);
        int interest = balance / 3000;
        int reward = interest * int(numberOfReward);
        int rewardMyToken = reward * 1000;

        stakers[msg.sender].myReward = uint(rewardMyToken);
        stakers[msg.sender].rewardCalculed = true;

        emit rewardCalculed();
      }

      ///@return Return the accumulated reward word
      function viewReward() public view returns(uint){

        return stakers[msg.sender].myReward;

      }

      function claimReward() public {

        require(stakers[msg.sender].myReward != 0, "Vous n'avez pas de recompense pour ca Stake des token");
        require(stakers[msg.sender].isStaker == true);
        require(stakers[msg.sender].rewardCalculed == true);
        uint reward = stakers[msg.sender].myReward;

        myToken.transfer(msg.sender, reward); 

        emit rewardWithdraw(msg.sender, reward);

        stakers[msg.sender].myReward = 0;
        stakers[msg.sender].blockStake = block.timestamp;
      }

      function getBalanceStack(address appelant) external view returns(uint256){

         return stakers[appelant].balance;
        
      }

    }