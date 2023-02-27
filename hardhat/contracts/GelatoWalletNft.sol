// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;


import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GelatoWalletNft is ERC721 {
     using Counters for Counters.Counter;
    Counters.Counter public tokenId;

    address public senderWallet;

    constructor()
        ERC721("GGW", "Gelato Gasless Wallet")
    {
       
    }

    function mint( ) external returns (uint256) {
        tokenId.increment();
        senderWallet = msg.sender;
        uint256 newItemId = tokenId.current();
        _mint(msg.sender, newItemId);
    

        return newItemId;
    }
}