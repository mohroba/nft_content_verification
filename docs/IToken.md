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
