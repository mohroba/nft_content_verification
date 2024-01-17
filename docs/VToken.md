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

