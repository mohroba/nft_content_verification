// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/**
 * @title VToken
 * @dev ERC1155 token for content verification with role-based access control.
 */
contract VToken is ERC1155, AccessControl, ReentrancyGuard, Initializable {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant ADVANCED_VERIFIER_ROLE =
        keccak256("ADVANCED_VERIFIER_ROLE");

    event VTokenMinted(uint256 indexed vtokenId, VerificationData data);
    event VTokenWeightUpdated(uint256 indexed vtokenId, uint256 newWeight);
    event VTokenStatusUpdated(
        uint256 indexed vtokenId,
        VerificationStatus newStatus
    );
    event VTokenDetailsUpdated(uint256 indexed vtokenId, string newDetails);
    event ParentVTokenUpdated(
        uint256 indexed vtokenId,
        uint256 newParentVTokenId
    );

    struct VerificationData {
        uint256 ctokenId;
        uint256 itokenId; // IToken of the verification authority
        string verificationDetails;
        uint256 weight;
        uint256 parentVTokenId; // 0 if no parent
    }
    enum VerificationStatus {
        Pending,
        Verified,
        Revoked
    }

    mapping(uint256 => VerificationStatus) private vtokenStatuses;
    mapping(uint256 => VerificationData) public verifications;

    uint256 public nextVTokenId = 1;

    constructor(string memory uri) ERC1155(uri) {}

    /**
     * @dev Initializes the contract with default roles and mints a default token.
     */
    function initialize() public initializer {
        AccessControl.grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        AccessControl.grantRole(VERIFIER_ROLE, msg.sender);
        AccessControl.grantRole(ADVANCED_VERIFIER_ROLE, msg.sender);
    }

    /**
     * @dev Mint a new VToken with verification data.
     * @param _ctokenId The ID of the associated CToken.
     * @param _itokenId The ID of the associated IToken.
     * @param _details The verification details.
     * @param _weight The weight of the VToken.
     * @param _parentVTokenId The ID of the parent VToken (0 if none).
     * @return The ID of the minted VToken.
     */
    function mintVToken(
        uint256 _ctokenId,
        uint256 _itokenId,
        string memory _details,
        uint256 _weight,
        uint256 _parentVTokenId
    ) public onlyRole(VERIFIER_ROLE) nonReentrant returns (uint256) {
        uint256 newVTokenId = nextVTokenId++;
        verifications[newVTokenId] = VerificationData(
            _ctokenId,
            _itokenId,
            _details,
            _weight,
            _parentVTokenId
        );
        _mint(msg.sender, newVTokenId, 1, "");
        return newVTokenId;
    }

    /**
     * @dev Update the weight of a VToken.
     * @param _vtokenId The ID of the VToken.
     * @param _newWeight The new weight for the VToken.
     */
    function updateVTokenWeight(
        uint256 _vtokenId,
        uint256 _newWeight
    ) public onlyRole(VERIFIER_ROLE) {
        require(
            verifications[_vtokenId].itokenId != 0,
            "VToken does not exist"
        );
        verifications[_vtokenId].weight = _newWeight;
        emit VTokenWeightUpdated(_vtokenId, _newWeight);
    }

    /**
     * @dev Update the verification status of a VToken.
     * @param _vtokenId The ID of the VToken.
     * @param _newStatus The new verification status.
     */
    function updateVTokenStatus(
        uint256 _vtokenId,
        VerificationStatus _newStatus
    ) public onlyRole(VERIFIER_ROLE) {
        require(
            verifications[_vtokenId].itokenId != 0,
            "VToken does not exist"
        );
        vtokenStatuses[_vtokenId] = _newStatus;
        emit VTokenStatusUpdated(_vtokenId, _newStatus);
    }

    /**
     * @dev Update the parent VToken ID of a VToken.
     * @param _vtokenId The ID of the VToken.
     * @param _newParentVTokenId The new parent VToken ID.
     */
    function updateParentVToken(
        uint256 _vtokenId,
        uint256 _newParentVTokenId
    ) public onlyRole(VERIFIER_ROLE) {
        require(
            verifications[_vtokenId].itokenId != 0,
            "VToken does not exist"
        );
        verifications[_vtokenId].parentVTokenId = _newParentVTokenId;
        emit ParentVTokenUpdated(_vtokenId, _newParentVTokenId);
    }

    /**
     * @dev Get all child VTokens for a given parent VToken ID.
     * @param _parentVTokenId The ID of the parent VToken.
     * @return An array of child VToken IDs.
     */
    function getChildVTokens(
        uint256 _parentVTokenId
    ) public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextVTokenId; i++) {
            if (verifications[i].parentVTokenId == _parentVTokenId) {
                count++;
            }
        }

        uint256[] memory childVTokens = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < nextVTokenId; i++) {
            if (verifications[i].parentVTokenId == _parentVTokenId) {
                childVTokens[index++] = i;
            }
        }

        return childVTokens;
    }

    /**
     * @dev Get all VTokens associated with a specific CToken.
     * @param _ctokenId The ID of the associated CToken.
     * @return An array of VToken IDs.
     */
    function getAllVTokensForCToken(
        uint256 _ctokenId
    ) public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextVTokenId; i++) {
            if (verifications[i].ctokenId == _ctokenId) {
                count++;
            }
        }

        uint256[] memory relatedVTokens = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < nextVTokenId; i++) {
            if (verifications[i].ctokenId == _ctokenId) {
                relatedVTokens[index++] = i;
            }
        }

        return relatedVTokens;
    }

    /**
     * @dev Update the verification details of a VToken.
     * @param _vtokenId The ID of the VToken.
     * @param _newDetails The new verification details.
     */
    function updateVTokenDetails(
        uint256 _vtokenId,
        string memory _newDetails
    ) public onlyRole(VERIFIER_ROLE) {
        require(
            verifications[_vtokenId].itokenId != 0,
            "VToken does not exist"
        );
        verifications[_vtokenId].verificationDetails = _newDetails;
        emit VTokenDetailsUpdated(_vtokenId, _newDetails);
    }

    /**
     * @dev Retrieve verification information for a VToken.
     * @param _vtokenId The ID of the VToken.
     * @return VerificationData struct containing verification information.
     */
    function getVerificationInfo(
        uint256 _vtokenId
    ) external view returns (VerificationData memory) {
        return verifications[_vtokenId];
    }

    // Final Touches

    /**
     * @dev Supports the ERC1155, AccessControl, and ReentrancyGuard interfaces.
     * @param interfaceId The interface identifier.
     * @return A boolean indicating whether the contract supports the given interface.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(AccessControl, ERC1155) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _ownerOf(uint256 tokenId) internal view returns (bool) {
        return balanceOf(msg.sender, tokenId) != 0;
    }
}
