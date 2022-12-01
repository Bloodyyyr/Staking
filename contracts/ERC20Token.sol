pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/erc20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Token is ERC20, Ownable{
    constructor() public ERC20("REWARD", "RWD") {
        _mint(msg.sender, 21 * (10 **(9 + 18)));   
   }
}
