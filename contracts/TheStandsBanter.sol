// contracts/TheStandsBanter.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TheStandsBanter is ERC721, Ownable {
    uint256 public nextTokenId;
    uint256 public constant MAX_FREE_MINTS_PER_WALLET = 3;

    mapping(address => uint256) public freeMintsUsed;

    struct Banter {
        string content;
        string ticker1;
        string ticker2; // Can be empty
        uint256 timestamp;
        string mediaUri; // IPFS link for image/GIF
    }

    mapping(uint256 => Banter) public banters;

    event BanterMinted(uint256 tokenId, address owner, string ticker1, string ticker2);

    constructor() ERC721("TheStandsBanter", "BANTER") Ownable(msg.sender) {}

    function mintBanter(
        string calldata content,
        string calldata ticker1,
        string calldata ticker2,
        string calldata mediaUri
    ) external {
        require(bytes(content).length > 0 && bytes(ticker1).length > 0, "Content and at least one ticker required");

        // Free mint logic
        if (freeMintsUsed[msg.sender] < MAX_FREE_MINTS_PER_WALLET) {
            freeMintsUsed[msg.sender]++;
        } else {
            // TODO: Add small CHZ fee payment later
            // For now we keep it free
        }

        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);

        banters[tokenId] = Banter({
            content: content,
            ticker1: ticker1,
            ticker2: ticker2,
            timestamp: block.timestamp,
            mediaUri: mediaUri
        });

        emit BanterMinted(tokenId, msg.sender, ticker1, ticker2);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return banters[tokenId].mediaUri; // Can be enhanced later
    }
}