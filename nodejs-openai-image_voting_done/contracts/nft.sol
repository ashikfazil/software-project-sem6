// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract vote {
    struct ArticleVotes {
        uint vote1;
        uint vote2;
        uint vote3;
        uint vote4;
        uint vote5;
        uint vote6;
    }
    
    mapping(uint => ArticleVotes) public articleVotes;
    mapping(address => bool) public hasVoted;

    MyToken public nftContract;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        MyToken nft =  new MyToken(msg.sender);
        nftContract = MyToken(address(nft));
        owner = msg.sender;
    }

    function vote_for_article(uint article, uint voteIndex) external {
        require(article >= 1 && article <= 6, "Invalid article");
        require(voteIndex >= 1 && voteIndex <= 6, "Invalid vote index");
        require(!hasVoted[msg.sender], "You have already voted");

        // Increase the vote count for the selected article and vote index
        if (voteIndex == 1) articleVotes[article].vote1++;
        else if (voteIndex == 2) articleVotes[article].vote2++;
        else if (voteIndex == 3) articleVotes[article].vote3++;
        else if (voteIndex == 4) articleVotes[article].vote4++;
        else if (voteIndex == 5) articleVotes[article].vote5++;
        else if (voteIndex == 6) articleVotes[article].vote6++;
        // Mark the sender as voted
        hasVoted[msg.sender] = true;
    }

    function determineWinner() external onlyOwner returns (uint winningArticle) {
        uint maxVotes = 0;
        for (uint i = 1; i <= 6; i++) {
            uint totalVotes = articleVotes[i].vote1 + articleVotes[i].vote2 + articleVotes[i].vote3 +
                              articleVotes[i].vote4 + articleVotes[i].vote5 + articleVotes[i].vote6;
            if (totalVotes > maxVotes) {
                maxVotes = totalVotes;
                winningArticle = i;
            }
        }
        // Award NFT to the winning article
        // This line should be modified to match the awarding mechanism in MyToken contract
        // nftContract.safeMint(address(owner), tokenId, uri);
    }
}


contract MyToken is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    constructor(address initialOwner)
        ERC721("MyToken", "MTK")
        Ownable(initialOwner)
    {}

    function safeMint(address to, uint256 tokenId, string memory uri)
        public
        onlyOwner
    {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
    // The following functions are overrides required by Solidity.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

