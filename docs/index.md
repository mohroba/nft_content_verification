# Solidity API

## CToken

_ERC1155 token with additional features such as content management, royalties, and curation._

### MINTER_ROLE

```solidity
bytes32 MINTER_ROLE
```

### ROYALTY_MANAGER_ROLE

```solidity
bytes32 ROYALTY_MANAGER_ROLE
```

### CONTENT_MANAGER_ROLE

```solidity
bytes32 CONTENT_MANAGER_ROLE
```

### constructor

```solidity
constructor(string uri) public
```

### initialize

```solidity
function initialize() public
```

_Initializes the contract with default roles and mints a default token._

### setITokenForCToken

```solidity
function setITokenForCToken(uint256 ctokenId, uint256 itokenId) public
```

_Set the IToken ID for a CToken (creator identity)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| ctokenId | uint256 | The ID of the CToken. |
| itokenId | uint256 | The ID of the associated IToken. |

### getITokenForCToken

```solidity
function getITokenForCToken(uint256 ctokenId) public view returns (uint256)
```

_Get the IToken ID associated with a CToken._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| ctokenId | uint256 | The ID of the CToken. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The ID of the associated IToken. |

### attachVTokenToCToken

```solidity
function attachVTokenToCToken(uint256 ctokenId, uint256 vtokenId) public
```

_Attach a VToken to a CToken (content verification)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| ctokenId | uint256 | The ID of the CToken. |
| vtokenId | uint256 | The ID of the attached VToken. |

### getVTokensForCToken

```solidity
function getVTokensForCToken(uint256 ctokenId) public view returns (uint256[])
```

_Get the list of VTokens associated with a CToken._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| ctokenId | uint256 | The ID of the CToken. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256[] | An array of VToken IDs. |

### setTokenURI

```solidity
function setTokenURI(uint256 tokenId, string newTokenURI) public
```

_Function to set custom metadata URI for a token._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |
| newTokenURI | string | The new metadata URI. |

### uri

```solidity
function uri(uint256 tokenId) public view returns (string)
```

_Function to retrieve the metadata URI for a token._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | The metadata URI. |

### batchMint

```solidity
function batchMint(address to, uint256[] ids, uint256[] amounts, bytes data) public
```

_Batch minting function._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The recipient address. |
| ids | uint256[] | An array of token IDs to mint. |
| amounts | uint256[] | An array of token amounts to mint. |
| data | bytes | Additional data. |

### batchBurn

```solidity
function batchBurn(address account, uint256[] ids, uint256[] amounts) public
```

_Batch burning function._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The owner of the tokens to burn. |
| ids | uint256[] | An array of token IDs to burn. |
| amounts | uint256[] | An array of token amounts to burn. |

### updateRoyaltyInfo

```solidity
function updateRoyaltyInfo(uint256 tokenId, address recipient, uint96 newRoyaltyAmount) public
```

_Function to update royalty information for a token._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |
| recipient | address | The address of the royalty recipient. |
| newRoyaltyAmount | uint96 | The new royalty amount. |

### setContentRights

```solidity
function setContentRights(uint256 tokenId, string rights) public
```

_Function to set content rights for a token._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |
| rights | string | The content rights information. |

### getContentRights

```solidity
function getContentRights(uint256 tokenId) public view returns (string)
```

_Function to get content rights for a token._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | The content rights information. |

### updateTokenURI

```solidity
function updateTokenURI(uint256 tokenId, string newTokenURI) public
```

_Function to update the metadata URI for a specific token._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |
| newTokenURI | string | The new metadata URI. |

### batchTransfer

```solidity
function batchTransfer(address[] recipients, uint256[] ids, uint256[] amounts) public
```

_Function to transfer multiple tokens to multiple recipients in a single transaction._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipients | address[] | An array of recipient addresses. |
| ids | uint256[] | An array of token IDs to transfer. |
| amounts | uint256[] | An array of token amounts to transfer. |

### curateContent

```solidity
function curateContent(uint256 tokenId, string curationNote) public
```

_Custom function to facilitate content curation or moderation._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |
| curationNote | string | The curation note. |

### getCurationNoteForToken

```solidity
function getCurationNoteForToken(uint256 tokenId) public view returns (string)
```

_Function to get the curation note for a token._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | The curation note. |

### executeSale

```solidity
function executeSale(address buyer, uint256 tokenId, uint256 amount, uint256 price) public payable
```

_Function to facilitate secondary market sales or transfers._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| buyer | address | The address of the buyer. |
| tokenId | uint256 | The ID of the token. |
| amount | uint256 | The amount of tokens to transfer. |
| price | uint256 | The price of the tokens. |

### mintWithVerification

```solidity
function mintWithVerification(address to, uint256 id, uint256 amount, bytes data, uint256 itokenId, uint96 royaltyAmount) public
```

_Function to mint tokens with verification._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The recipient address. |
| id | uint256 | The ID of the token to mint. |
| amount | uint256 | The amount of tokens to mint. |
| data | bytes | Additional data. |
| itokenId | uint256 | The ID of the associated IToken. |
| royaltyAmount | uint96 | The royalty amount. |

### TokenData

```solidity
struct TokenData {
  uint256 parentTokenId;
  uint256 weight;
}
```

### setParentToken

```solidity
function setParentToken(uint256 tokenId, uint256 parentTokenId) public
```

_Function to set the parent token for a CToken._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the CToken. |
| parentTokenId | uint256 | The ID of the parent token. |

### setTokenWeight

```solidity
function setTokenWeight(uint256 tokenId, uint256 weight) public
```

_Function to set the weight for a CToken._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the CToken. |
| weight | uint256 | The weight of the token. |

### getTokenData

```solidity
function getTokenData(uint256 tokenId) public view returns (struct CToken.TokenData)
```

_Function to get the parent token and weight of a CToken._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the CToken. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct CToken.TokenData | TokenData struct containing parent token ID and weight. |

### _update

```solidity
function _update(address from, address to, uint256[] ids, uint256[] values) internal virtual
```

_Internal function to update token data._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The sender's address. |
| to | address | The recipient's address. |
| ids | uint256[] | An array of token IDs. |
| values | uint256[] | An array of token values. |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

## IToken

_ERC721 token with identity features, access control, and reentrancy protection._

### Key

```solidity
struct Key {
  uint256 purpose;
  uint256 keyType;
  bytes32 key;
}
```

### Claim

```solidity
struct Claim {
  uint256 claimType;
  uint256 scheme;
  address issuer;
  bytes signature;
  bytes data;
  string uri;
}
```

### NFT

```solidity
struct NFT {
  uint256 tokenId;
  string uri;
  string didDocumentUri;
  uint256 weight;
  uint256 lastUpdated;
  uint256 decayRate;
}
```

### IDENTITY_ADMIN_ROLE

```solidity
bytes32 IDENTITY_ADMIN_ROLE
```

### CLAIM_ISSUER_ROLE

```solidity
bytes32 CLAIM_ISSUER_ROLE
```

### KeyAdded

```solidity
event KeyAdded(bytes32 key, uint256 purpose, uint256 keyType)
```

### ClaimAdded

```solidity
event ClaimAdded(bytes32 claimId, uint256 claimType, address issuer)
```

### ClaimRemoved

```solidity
event ClaimRemoved(bytes32 claimId, uint256 claimType)
```

### DIDDocumentURISet

```solidity
event DIDDocumentURISet(uint256 tokenId, string didDocumentUri)
```

### DIDDocumentURIUpdated

```solidity
event DIDDocumentURIUpdated(uint256 tokenId, string newDidDocumentUri)
```

### onlyIdentityAdmin

```solidity
modifier onlyIdentityAdmin()
```

### onlyClaimIssuer

```solidity
modifier onlyClaimIssuer()
```

### _exists

```solidity
function _exists(uint256 tokenId) internal view returns (bool)
```

### constructor

```solidity
constructor(string name_, string symbol_) public
```

_Constructor for IToken._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| name_ | string | The name of the ERC721 token. |
| symbol_ | string | The symbol of the ERC721 token. |

### initialize

```solidity
function initialize() public
```

_Initializes the contract with default roles and mints a default token._

### mintNFT

```solidity
function mintNFT(address to, uint256 tokenId, string uri, string didDocumentUri, uint256 initialWeight, uint256 initialDecayRate) public
```

_Mints a new NFT with specified attributes._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address to mint the NFT to. |
| tokenId | uint256 | The unique identifier for the new NFT. |
| uri | string | The URI for the NFT metadata. |
| didDocumentUri | string | The URI for the DID document stored off-chain. |
| initialWeight | uint256 | The initial weight of the NFT. |
| initialDecayRate | uint256 | The initial decay rate of the NFT. |

### burnNFT

```solidity
function burnNFT(uint256 tokenId) public
```

_Burns an existing NFT, removing associated data._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token to burn. |

### getNFT

```solidity
function getNFT(uint256 tokenId) public view returns (struct IToken.NFT)
```

_Retrieves the details of a specific NFT, adjusting weight based on decay._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token to retrieve. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IToken.NFT | A struct containing NFT details. |

### updateNFTWeight

```solidity
function updateNFTWeight(uint256 tokenId, uint256 newWeight) public
```

_Updates the weight of an NFT._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token to update. |
| newWeight | uint256 | The new weight of the NFT. |

### updateDecayRate

```solidity
function updateDecayRate(uint256 tokenId, uint256 newDecayRate) public
```

_Updates the decay rate of an NFT._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token to update. |
| newDecayRate | uint256 | The new decay rate of the NFT. |

### getCurrentWeight

```solidity
function getCurrentWeight(uint256 tokenId) public view returns (uint256)
```

_Calculates and returns the current weight of an NFT, considering decay._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The current weight of the NFT. |

### addKey

```solidity
function addKey(uint256 tokenId, uint256 purpose, uint256 keyType, bytes32 key) public
```

_Adds a key to an NFT._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |
| purpose | uint256 | The purpose of the key. |
| keyType | uint256 | The type of the key. |
| key | bytes32 | The key data. |

### removeKey

```solidity
function removeKey(uint256 tokenId, bytes32 keyId) public
```

_Removes a key from an NFT._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |
| keyId | bytes32 | The ID of the key to remove. |

### findIndexOfKey

```solidity
function findIndexOfKey(uint256 tokenId, bytes32 keyId) internal view returns (uint256)
```

### addClaim

```solidity
function addClaim(uint256 tokenId, uint256 claimType, uint256 scheme, address issuer, bytes signature, bytes data, string uri) public
```

_Adds a claim to an NFT._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |
| claimType | uint256 | The type of the claim. |
| scheme | uint256 | The scheme of the claim. |
| issuer | address | The address of the claim issuer. |
| signature | bytes | The claim signature. |
| data | bytes | The claim data. |
| uri | string | The claim URI. |

### removeClaim

```solidity
function removeClaim(uint256 tokenId, bytes32 claimId) public
```

_Removes a claim from an NFT._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |
| claimId | bytes32 | The ID of the claim to remove. |

### findIndexOfClaim

```solidity
function findIndexOfClaim(uint256 tokenId, bytes32 claimId) internal view returns (uint256)
```

### setDIDDocumentURI

```solidity
function setDIDDocumentURI(uint256 tokenId, string didDocumentUri) public
```

_Sets the DID document URI for an NFT._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |
| didDocumentUri | string | The new DID document URI. |

### getDIDDocumentURI

```solidity
function getDIDDocumentURI(uint256 tokenId) public view returns (string)
```

_Retrieves the DID document URI for an NFT._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | The DID document URI. |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_Finalizes the support for different interfaces._

### isApprovedOrOwner

```solidity
function isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool)
```

_Checks if the spender is approved or the owner of the token._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The address to check. |
| tokenId | uint256 | The ID of the token. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean indicating whether the spender is approved or the owner. |

## VToken

_ERC1155 token for content verification with role-based access control._

### VERIFIER_ROLE

```solidity
bytes32 VERIFIER_ROLE
```

### ADVANCED_VERIFIER_ROLE

```solidity
bytes32 ADVANCED_VERIFIER_ROLE
```

### VTokenMinted

```solidity
event VTokenMinted(uint256 vtokenId, struct VToken.VerificationData data)
```

### VTokenWeightUpdated

```solidity
event VTokenWeightUpdated(uint256 vtokenId, uint256 newWeight)
```

### VTokenStatusUpdated

```solidity
event VTokenStatusUpdated(uint256 vtokenId, enum VToken.VerificationStatus newStatus)
```

### VTokenDetailsUpdated

```solidity
event VTokenDetailsUpdated(uint256 vtokenId, string newDetails)
```

### ParentVTokenUpdated

```solidity
event ParentVTokenUpdated(uint256 vtokenId, uint256 newParentVTokenId)
```

### VerificationData

```solidity
struct VerificationData {
  uint256 ctokenId;
  uint256 itokenId;
  string verificationDetails;
  uint256 weight;
  uint256 parentVTokenId;
}
```

### VerificationStatus

```solidity
enum VerificationStatus {
  Pending,
  Verified,
  Revoked
}
```

### verifications

```solidity
mapping(uint256 => struct VToken.VerificationData) verifications
```

### nextVTokenId

```solidity
uint256 nextVTokenId
```

### constructor

```solidity
constructor(string uri) public
```

### initialize

```solidity
function initialize() public
```

_Initializes the contract with default roles and mints a default token._

### mintVToken

```solidity
function mintVToken(uint256 _ctokenId, uint256 _itokenId, string _details, uint256 _weight, uint256 _parentVTokenId) public returns (uint256)
```

_Mint a new VToken with verification data._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _ctokenId | uint256 | The ID of the associated CToken. |
| _itokenId | uint256 | The ID of the associated IToken. |
| _details | string | The verification details. |
| _weight | uint256 | The weight of the VToken. |
| _parentVTokenId | uint256 | The ID of the parent VToken (0 if none). |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The ID of the minted VToken. |

### updateVTokenWeight

```solidity
function updateVTokenWeight(uint256 _vtokenId, uint256 _newWeight) public
```

_Update the weight of a VToken._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _vtokenId | uint256 | The ID of the VToken. |
| _newWeight | uint256 | The new weight for the VToken. |

### updateVTokenStatus

```solidity
function updateVTokenStatus(uint256 _vtokenId, enum VToken.VerificationStatus _newStatus) public
```

_Update the verification status of a VToken._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _vtokenId | uint256 | The ID of the VToken. |
| _newStatus | enum VToken.VerificationStatus | The new verification status. |

### updateParentVToken

```solidity
function updateParentVToken(uint256 _vtokenId, uint256 _newParentVTokenId) public
```

_Update the parent VToken ID of a VToken._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _vtokenId | uint256 | The ID of the VToken. |
| _newParentVTokenId | uint256 | The new parent VToken ID. |

### getChildVTokens

```solidity
function getChildVTokens(uint256 _parentVTokenId) public view returns (uint256[])
```

_Get all child VTokens for a given parent VToken ID._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _parentVTokenId | uint256 | The ID of the parent VToken. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256[] | An array of child VToken IDs. |

### getAllVTokensForCToken

```solidity
function getAllVTokensForCToken(uint256 _ctokenId) public view returns (uint256[])
```

_Get all VTokens associated with a specific CToken._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _ctokenId | uint256 | The ID of the associated CToken. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256[] | An array of VToken IDs. |

### updateVTokenDetails

```solidity
function updateVTokenDetails(uint256 _vtokenId, string _newDetails) public
```

_Update the verification details of a VToken._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _vtokenId | uint256 | The ID of the VToken. |
| _newDetails | string | The new verification details. |

### getVerificationInfo

```solidity
function getVerificationInfo(uint256 _vtokenId) external view returns (struct VToken.VerificationData)
```

_Retrieve verification information for a VToken._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _vtokenId | uint256 | The ID of the VToken. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VToken.VerificationData | VerificationData struct containing verification information. |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_Supports the ERC1155, AccessControl, and ReentrancyGuard interfaces._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| interfaceId | bytes4 | The interface identifier. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean indicating whether the contract supports the given interface. |

### _ownerOf

```solidity
function _ownerOf(uint256 tokenId) internal view returns (bool)
```

