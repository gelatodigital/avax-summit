export const NFT_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "function revealNft(uint256 tokenId, string memory tokenURI) external",
  "function tokenURI(uint256 tokenId) public view returns (string memory) ",
  "function tokenIds() public view returns(uint256)",
  "function tokenIdByUser(address) public view returns(uint256)",
  "function mint() external",
  "event MintEvent(uint256 _tokenId)",
  "event MetadataUpdate(uint256 _tokenId)",
];
