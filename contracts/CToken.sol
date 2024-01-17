// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/**
 * @title CToken
 * @dev ERC1155 token with additional features such as content management, royalties, and curation.
 */
contract CToken is
    ERC1155,
    AccessControl,
    ERC1155Burnable,
    ERC1155Supply,
    ERC2981,
    ReentrancyGuard,
    Initializable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ROYALTY_MANAGER_ROLE =
        keccak256("ROYALTY_MANAGER_ROLE");
    bytes32 public constant CONTENT_MANAGER_ROLE =
        keccak256("CONTENT_MANAGER_ROLE");

    // Mapping for CToken to IToken (creator identity)
    mapping(uint256 => uint256) private ctokenToItoken;

    // Mapping for CToken to VToken (content verification)
    mapping(uint256 => uint256[]) private ctokenToVtokens;

    // Mapping to store content rights information for each token
    mapping(uint256 => string) private contentRights;
    mapping(uint256 => string) private curationNotes;

    // Mapping to store custom metadata for each token
    mapping(uint256 => string) private tokenURIs;

    constructor(string memory uri) ERC1155(uri) {}

    /**
     * @dev Initializes the contract with default roles and mints a default token.
     */
    function initialize() public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(ROYALTY_MANAGER_ROLE, msg.sender);
        _grantRole(CONTENT_MANAGER_ROLE, msg.sender);
    }

    /**
     * @dev Set the IToken ID for a CToken (creator identity).
     * @param ctokenId The ID of the CToken.
     * @param itokenId The ID of the associated IToken.
     */
    function setITokenForCToken(
        uint256 ctokenId,
        uint256 itokenId
    ) public onlyRole(MINTER_ROLE) {
        ctokenToItoken[ctokenId] = itokenId;
    }

    /**
     * @dev Get the IToken ID associated with a CToken.
     * @param ctokenId The ID of the CToken.
     * @return The ID of the associated IToken.
     */
    function getITokenForCToken(
        uint256 ctokenId
    ) public view returns (uint256) {
        return ctokenToItoken[ctokenId];
    }

    /**
     * @dev Attach a VToken to a CToken (content verification).
     * @param ctokenId The ID of the CToken.
     * @param vtokenId The ID of the attached VToken.
     */
    function attachVTokenToCToken(
        uint256 ctokenId,
        uint256 vtokenId
    ) public onlyRole(MINTER_ROLE) {
        ctokenToVtokens[ctokenId].push(vtokenId);
    }

    /**
     * @dev Get the list of VTokens associated with a CToken.
     * @param ctokenId The ID of the CToken.
     * @return An array of VToken IDs.
     */
    function getVTokensForCToken(
        uint256 ctokenId
    ) public view returns (uint256[] memory) {
        return ctokenToVtokens[ctokenId];
    }

    /**
     * @dev Function to set custom metadata URI for a token.
     * @param tokenId The ID of the token.
     * @param newTokenURI The new metadata URI.
     */
    function setTokenURI(
        uint256 tokenId,
        string memory newTokenURI
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(exists(tokenId), "CToken: URI set of nonexistent token");
        tokenURIs[tokenId] = newTokenURI;
    }

    /**
     * @dev Function to retrieve the metadata URI for a token.
     * @param tokenId The ID of the token.
     * @return The metadata URI.
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(exists(tokenId), "CToken: URI query for nonexistent token");
        return tokenURIs[tokenId];
    }

    /**
     * @dev Batch minting function.
     * @param to The recipient address.
     * @param ids An array of token IDs to mint.
     * @param amounts An array of token amounts to mint.
     * @param data Additional data.
     */
    function batchMint(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) nonReentrant {
        _mintBatch(to, ids, amounts, data);
        // Additional logic for setting URIs and royalties can be added here
    }

    /**
     * @dev Batch burning function.
     * @param account The owner of the tokens to burn.
     * @param ids An array of token IDs to burn.
     * @param amounts An array of token amounts to burn.
     */
    function batchBurn(
        address account,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public nonReentrant {
        require(
            account == msg.sender || isApprovedForAll(account, msg.sender),
            "CToken: caller is not owner nor approved"
        );
        _burnBatch(account, ids, amounts);
    }

    /**
     * @dev Function to update royalty information for a token.
     * @param tokenId The ID of the token.
     * @param recipient The address of the royalty recipient.
     * @param newRoyaltyAmount The new royalty amount.
     */
    function updateRoyaltyInfo(
        uint256 tokenId,
        address recipient,
        uint96 newRoyaltyAmount
    ) public onlyRole(ROYALTY_MANAGER_ROLE) {
        _setTokenRoyalty(tokenId, recipient, newRoyaltyAmount);
    }

    /**
     * @dev Function to set content rights for a token.
     * @param tokenId The ID of the token.
     * @param rights The content rights information.
     */
    function setContentRights(
        uint256 tokenId,
        string memory rights
    ) public onlyRole(CONTENT_MANAGER_ROLE) {
        require(exists(tokenId), "CToken: Set rights of nonexistent token");
        contentRights[tokenId] = rights;
    }

    /**
     * @dev Function to get content rights for a token.
     * @param tokenId The ID of the token.
     * @return The content rights information.
     */
    function getContentRights(
        uint256 tokenId
    ) public view returns (string memory) {
        require(exists(tokenId), "CToken: Get rights of nonexistent token");
        return contentRights[tokenId];
    }

    /**
     * @dev Function to update the metadata URI for a specific token.
     * @param tokenId The ID of the token.
     * @param newTokenURI The new metadata URI.
     */
    function updateTokenURI(
        uint256 tokenId,
        string memory newTokenURI
    ) public onlyRole(MINTER_ROLE) {
        require(exists(tokenId), "CToken: URI update of nonexistent token");
        tokenURIs[tokenId] = newTokenURI;
    }

    /**
     * @dev Function to transfer multiple tokens to multiple recipients in a single transaction.
     * @param recipients An array of recipient addresses.
     * @param ids An array of token IDs to transfer.
     * @param amounts An array of token amounts to transfer.
     */
    function batchTransfer(
        address[] memory recipients,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public nonReentrant {
        require(
            recipients.length == ids.length && ids.length == amounts.length,
            "CToken: Inconsistent array lengths"
        );
        for (uint256 i = 0; i < recipients.length; i++) {
            safeTransferFrom(msg.sender, recipients[i], ids[i], amounts[i], "");
        }
    }

    /**
     * @dev Custom function to facilitate content curation or moderation.
     * @param tokenId The ID of the token.
     * @param curationNote The curation note.
     */
    function curateContent(
        uint256 tokenId,
        string memory curationNote
    ) public onlyRole(CONTENT_MANAGER_ROLE) {
        require(exists(tokenId), "CToken: Curate nonexistent token");
        curationNotes[tokenId] = curationNote;
    }

    /**
     * @dev Function to get the curation note for a token.
     * @param tokenId The ID of the token.
     * @return The curation note.
     */
    function getCurationNoteForToken(
        uint256 tokenId
    ) public view returns (string memory) {
        require(exists(tokenId), "CToken: Query nonexistent token");
        return curationNotes[tokenId];
    }

    /**
     * @dev Function to facilitate secondary market sales or transfers.
     * @param buyer The address of the buyer.
     * @param tokenId The ID of the token.
     * @param amount The amount of tokens to transfer.
     * @param price The price of the tokens.
     */
    function executeSale(
        address buyer,
        uint256 tokenId,
        uint256 amount,
        uint256 price
    ) public payable nonReentrant {
        require(msg.value == price, "CToken: Incorrect price sent");
        require(
            balanceOf(msg.sender, tokenId) >= amount,
            "CToken: Insufficient token balance"
        );

        // Calculate and transfer royalty
        (address royaltyRecipient, uint256 royaltyAmount) = royaltyInfo(
            tokenId,
            price
        );
        if (royaltyAmount > 0) {
            payable(royaltyRecipient).transfer(royaltyAmount);
        }

        // Transfer the remaining amount to the seller
        payable(msg.sender).transfer(msg.value - royaltyAmount);

        // Transfer the token from the seller to the buyer
        safeTransferFrom(msg.sender, buyer, tokenId, amount, "");
    }

    /**
     * @dev Function to mint tokens with verification.
     * @param to The recipient address.
     * @param id The ID of the token to mint.
     * @param amount The amount of tokens to mint.
     * @param data Additional data.
     * @param itokenId The ID of the associated IToken.
     * @param royaltyAmount The royalty amount.
     */
    function mintWithVerification(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data,
        uint256 itokenId,
        uint96 royaltyAmount
    ) public onlyRole(MINTER_ROLE) nonReentrant {
        // require(itoken.isApprovedOrOwner(msg.sender, itokenId), "CToken: Unauthorized creator");
        _mint(to, id, amount, data);
        _setTokenRoyalty(id, to, royaltyAmount);
        // Link the CToken to the IToken (creator identity)
        ctokenToItoken[id] = itokenId;
    }

    // Struct to hold token data including parent and weight
    struct TokenData {
        uint256 parentTokenId; // ID of the parent token, 0 if none
        uint256 weight; // Weight of the token
    }

    // Mapping from token ID to its data
    mapping(uint256 => TokenData) private tokenData;

    /**
     * @dev Function to set the parent token for a CToken.
     * @param tokenId The ID of the CToken.
     * @param parentTokenId The ID of the parent token.
     */
    function setParentToken(
        uint256 tokenId,
        uint256 parentTokenId
    ) public onlyRole(CONTENT_MANAGER_ROLE) {
        require(exists(tokenId), "CToken: Nonexistent token");
        tokenData[tokenId].parentTokenId = parentTokenId;
    }

    /**
     * @dev Function to set the weight for a CToken.
     * @param tokenId The ID of the CToken.
     * @param weight The weight of the token.
     */
    function setTokenWeight(
        uint256 tokenId,
        uint256 weight
    ) public onlyRole(CONTENT_MANAGER_ROLE) {
        require(exists(tokenId), "CToken: Nonexistent token");
        tokenData[tokenId].weight = weight;
    }

    /**
     * @dev Function to get the parent token and weight of a CToken.
     * @param tokenId The ID of the CToken.
     * @return TokenData struct containing parent token ID and weight.
     */
    function getTokenData(
        uint256 tokenId
    ) public view returns (TokenData memory) {
        require(exists(tokenId), "CToken: Nonexistent token");
        return tokenData[tokenId];
    }

    /**
     * @dev Internal function to update token data.
     * @param from The sender's address.
     * @param to The recipient's address.
     * @param ids An array of token IDs.
     * @param values An array of token values.
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC1155, AccessControl, ERC2981)
        returns (bool)
    {
        super.supportsInterface(interfaceId);
    }
}
