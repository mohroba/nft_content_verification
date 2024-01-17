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