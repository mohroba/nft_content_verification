// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/**
 * @title IToken
 * @dev ERC721 token with identity features, access control, and reentrancy protection.
 */
contract IToken is ERC721, AccessControl, ReentrancyGuard, Initializable {
    // Structs
    struct Key {
        uint256 purpose;
        uint256 keyType;
        bytes32 key;
    }

    struct Claim {
        uint256 claimType;
        uint256 scheme;
        address issuer;
        bytes signature;
        bytes data;
        string uri;
    }

    struct NFT {
        uint256 tokenId;
        string uri; // URI for the NFT metadata
        string didDocumentUri; // URI for the DID document stored off-chain
        uint256 weight;
        uint256 lastUpdated;
        uint256 decayRate;
    }

    // Mappings
    mapping(uint256 => NFT) private nftsWithWeights;
    mapping(bytes32 => Key) private keys;
    mapping(bytes32 => Claim) private claims;
    mapping(uint256 => bytes32[]) private keysByPurpose;
    mapping(uint256 => bytes32[]) private claimsByType;
    mapping(uint256 => bytes32[]) private nftToKeyIds;
    mapping(uint256 => bytes32[]) private nftToClaimIds;

    // Roles
    bytes32 public constant IDENTITY_ADMIN_ROLE =
        keccak256("IDENTITY_ADMIN_ROLE");
    bytes32 public constant CLAIM_ISSUER_ROLE = keccak256("CLAIM_ISSUER_ROLE");

    // Events
    event KeyAdded(
        bytes32 indexed key,
        uint256 indexed purpose,
        uint256 indexed keyType
    );
    event ClaimAdded(
        bytes32 indexed claimId,
        uint256 indexed claimType,
        address indexed issuer
    );
    event ClaimRemoved(bytes32 indexed claimId, uint256 indexed claimType);
    event DIDDocumentURISet(uint256 indexed tokenId, string didDocumentUri);
    event DIDDocumentURIUpdated(
        uint256 indexed tokenId,
        string newDidDocumentUri
    );    

    // Internal helper functions
    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId==0 || nftsWithWeights[tokenId].tokenId!=0;
    }

    /**
     * @dev Constructor for IToken.
     * @param name_ The name of the ERC721 token.
     * @param symbol_ The symbol of the ERC721 token.
     */
    constructor(
        string memory name_,
        string memory symbol_
    ) ERC721(name_, symbol_) {
        // Constructor code can be expanded as needed
    }

    /**
     * @dev Initializes the contract with default roles and mints a default token.
     */
    function initialize() public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(IDENTITY_ADMIN_ROLE, msg.sender);
        _grantRole(CLAIM_ISSUER_ROLE, msg.sender);

        // Mint a default token for initialization purposes
        _mint(msg.sender, 0);
        nftsWithWeights[0] = NFT(0, "", "", 0, block.timestamp, 0);
        nftToKeyIds[0] = new bytes32[](0);
        nftToClaimIds[0] = new bytes32[](0);
    }

    /**
     * @dev Mints a new NFT with specified attributes.
     * @param to The address to mint the NFT to.
     * @param tokenId The unique identifier for the new NFT.
     * @param uri The URI for the NFT metadata.
     * @param didDocumentUri The URI for the DID document stored off-chain.
     * @param initialWeight The initial weight of the NFT.
     * @param initialDecayRate The initial decay rate of the NFT.
     */
    function mintNFT(
        address to,
        uint256 tokenId,
        string memory uri,
        string memory didDocumentUri,
        uint256 initialWeight,
        uint256 initialDecayRate
    ) public onlyRole(IDENTITY_ADMIN_ROLE) {
        require(!_exists(tokenId), "Token already minted");
        _safeMint(to, tokenId);
        nftsWithWeights[tokenId] = NFT(
            tokenId,
            uri,
            didDocumentUri,
            initialWeight,
            block.timestamp,
            initialDecayRate
        );
    }

    /**
     * @dev Burns an existing NFT, removing associated data.
     * @param tokenId The ID of the token to burn.
     */
    function burnNFT(uint256 tokenId) public {
        require(
            _exists(tokenId),
            "Token Not Found"
        );
        require(
            isApprovedOrOwner(msg.sender, tokenId),
            "Caller is not owner nor approved"
        );
        _burn(tokenId);
        delete nftsWithWeights[tokenId];
        delete nftToKeyIds[tokenId];
        delete nftToClaimIds[tokenId];
    }

    /**
     * @dev Retrieves the details of a specific NFT, adjusting weight based on decay.
     * @param tokenId The ID of the token to retrieve.
     * @return A struct containing NFT details.
     */
    function getNFT(uint256 tokenId) public view returns (NFT memory) {
        require(_exists(tokenId), "Token does not exist");
        NFT memory nft = nftsWithWeights[tokenId];
        nft.weight = getCurrentWeight(tokenId); // Adjust weight based on decay
        return nft;
    }

    /**
     * @dev Updates the weight of an NFT.
     * @param tokenId The ID of the token to update.
     * @param newWeight The new weight of the NFT.
     */
    function updateNFTWeight(
        uint256 tokenId,
        uint256 newWeight
    ) public onlyRole(IDENTITY_ADMIN_ROLE) {
        require(_exists(tokenId), "Token does not exist");
        NFT storage nft = nftsWithWeights[tokenId];
        nft.weight = newWeight;
        nft.lastUpdated = block.timestamp;
    }

    /**
     * @dev Updates the decay rate of an NFT.
     * @param tokenId The ID of the token to update.
     * @param newDecayRate The new decay rate of the NFT.
     */
    function updateDecayRate(
        uint256 tokenId,
        uint256 newDecayRate
    ) public onlyRole(IDENTITY_ADMIN_ROLE) {
        require(_exists(tokenId), "Token does not exist");
        NFT storage nft = nftsWithWeights[tokenId];
        nft.decayRate = newDecayRate;
    }

    /**
     * @dev Calculates and returns the current weight of an NFT, considering decay.
     * @param tokenId The ID of the token.
     * @return The current weight of the NFT.
     */
    function getCurrentWeight(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        NFT memory nft = nftsWithWeights[tokenId];

        // Calculate the number of days since the last update
        uint256 timeElapsed = block.timestamp - nft.lastUpdated;
        uint256 daysElapsed = timeElapsed / 86400; // 86400 seconds in a day

        // Calculate the decayed weight
        uint256 decayedWeight = daysElapsed * nft.decayRate;

        // Ensure the weight does not go below zero
        if (nft.weight > decayedWeight) {
            return nft.weight - decayedWeight;
        } else {
            return 0;
        }
    }

    /**
     * @dev Adds a key to an NFT.
     * @param tokenId The ID of the token.
     * @param purpose The purpose of the key.
     * @param keyType The type of the key.
     * @param key The key data.
     */
    function addKey(
        uint256 tokenId,
        uint256 purpose,
        uint256 keyType,
        bytes32 key
    ) public onlyRole(IDENTITY_ADMIN_ROLE) {
        require(_exists(tokenId), "NFT does not exist");
        bytes32 keyId = keccak256(abi.encodePacked(key, purpose, keyType));
        keys[keyId] = Key(purpose, keyType, key);
        nftToKeyIds[tokenId].push(keyId);
        emit KeyAdded(keyId, purpose, keyType);
    }

    /**
     * @dev Removes a key from an NFT.
     * @param tokenId The ID of the token.
     * @param keyId The ID of the key to remove.
     */
    function removeKey(
        uint256 tokenId,
        bytes32 keyId
    ) public onlyRole(IDENTITY_ADMIN_ROLE) {
        require(_exists(tokenId), "NFT does not exist");
        require(keys[keyId].key != bytes32(0), "Key does not exist");
        delete keys[keyId];

        // Remove keyId from nftToKeyIds array
        uint256 index = findIndexOfKey(tokenId, keyId);
        require(index < nftToKeyIds[tokenId].length, "Key not found");
        nftToKeyIds[tokenId][index] = nftToKeyIds[tokenId][
            nftToKeyIds[tokenId].length - 1
        ];
        nftToKeyIds[tokenId].pop();
    }

    /**
     * @dev Gets a key from an NFT.
     * @param keyId The ID of the key to remove.
     */
    function getKey(bytes32 keyId) public view returns (Key memory) {
        require(keys[keyId].key != bytes32(0), "Key does not exist");
        return keys[keyId];
    }

    function findIndexOfKey(
        uint256 tokenId,
        bytes32 keyId
    ) internal view returns (uint256) {
        for (uint256 i = 0; i < nftToKeyIds[tokenId].length; i++) {
            if (nftToKeyIds[tokenId][i] == keyId) {
                return i;
            }
        }
        revert("Key not found");
    }

    /**
     * @dev Adds a claim to an NFT.
     * @param tokenId The ID of the token.
     * @param claimType The type of the claim.
     * @param scheme The scheme of the claim.
     * @param issuer The address of the claim issuer.
     * @param signature The claim signature.
     * @param data The claim data.
     * @param uri The claim URI.
     */
    function addClaim(
        uint256 tokenId,
        uint256 claimType,
        uint256 scheme,
        address issuer,
        bytes memory signature,
        bytes memory data,
        string memory uri
    ) public onlyRole(CLAIM_ISSUER_ROLE) {
        require(_exists(tokenId), "NFT does not exist");
        bytes32 claimId = keccak256(abi.encodePacked(issuer, claimType));
        claims[claimId] = Claim(
            claimType,
            scheme,
            issuer,
            signature,
            data,
            uri
        );
        nftToClaimIds[tokenId].push(claimId);
        emit ClaimAdded(claimId, claimType, issuer);
    }

    /**
     * @dev Removes a claim from an NFT.
     * @param tokenId The ID of the token.
     * @param claimId The ID of the claim to remove.
     */
    function removeClaim(
        uint256 tokenId,
        bytes32 claimId
    ) public onlyRole(CLAIM_ISSUER_ROLE) {
        require(_exists(tokenId), "NFT does not exist");
        require(claims[claimId].issuer != address(0), "Claim does not exist");
        delete claims[claimId];

        // Remove claimId from nftToClaimIds array
        uint256 index = findIndexOfClaim(tokenId, claimId);
        require(index < nftToClaimIds[tokenId].length, "Claim not found");
        nftToClaimIds[tokenId][index] = nftToClaimIds[tokenId][
            nftToClaimIds[tokenId].length - 1
        ];
        nftToClaimIds[tokenId].pop();
    }


    /**
     * @dev Gets a claim from an NFT.
     * @param claimId The ID of the claim to remove.
     */
    function getClaim(bytes32 claimId) public view returns (Claim memory) {
        require(claims[claimId].issuer != address(0), "Claim does not exist");
        return claims[claimId];
    }

    function findIndexOfClaim(
        uint256 tokenId,
        bytes32 claimId
    ) internal view returns (uint256) {
        for (uint256 i = 0; i < nftToClaimIds[tokenId].length; i++) {
            if (nftToClaimIds[tokenId][i] == claimId) {
                return i;
            }
        }
        revert("Claim not found");
    }

    /**
     * @dev Sets the DID document URI for an NFT.
     * @param tokenId The ID of the token.
     * @param didDocumentUri The new DID document URI.
     */
    function setDIDDocumentURI(
        uint256 tokenId,
        string memory didDocumentUri
    ) public onlyRole(IDENTITY_ADMIN_ROLE) {
        require(_exists(tokenId), "Token does not exist");
        NFT storage nft = nftsWithWeights[tokenId];
        nft.didDocumentUri = didDocumentUri;
    }

    /**
     * @dev Retrieves the DID document URI for an NFT.
     * @param tokenId The ID of the token.
     * @return The DID document URI.
     */
    function getDIDDocumentURI(
        uint256 tokenId
    ) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return nftsWithWeights[tokenId].didDocumentUri;
    }

    // Final Touches

    /**
     * @dev Finalizes the support for different interfaces.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(AccessControl, ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Checks if the spender is approved or the owner of the token.
     * @param spender The address to check.
     * @param tokenId The ID of the token.
     * @return A boolean indicating whether the spender is approved or the owner.
     */
    function isApprovedOrOwner(
        address spender,
        uint256 tokenId
    ) public view returns (bool) {
        address owner = _ownerOf(tokenId);
        return (spender == owner ||
            getApproved(tokenId) == spender ||
            isApprovedForAll(owner, spender));
    }
}
