const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Update VToken Details", function () {
    let token;
    let admin, verifier,non_verifier;
    const vtokenId = 1;
    const newDetails = "Updated verification details";

    beforeEach(async function () {
        [admin, verifier,non_verifier] = await ethers.getSigners();
        VToken = await ethers.getContractFactory("VToken");
        token = await VToken.deploy("VTOKEN_URI");
        await token.initialize();
        await token.grantRole(token.VERIFIER_ROLE(), verifier.address);
        // Assume minting a VToken for testing
        await token.connect(verifier).mintVToken(100, 200, "Initial details", 10, 0);
    });

    it("Should allow VERIFIER_ROLE to update verification details of a VToken", async function () {
        await token.connect(verifier).updateVTokenDetails(vtokenId, newDetails);

        const verificationInfo = await token.getVerificationInfo(vtokenId);
        expect(verificationInfo.verificationDetails).to.equal(newDetails);
    });

    it("Should prevent non-VERIFIER_ROLE from updating verification details", async function () {
        await expect(
            token.connect(non_verifier).updateVTokenDetails(vtokenId, newDetails)
        ).to.be.reverted;
    });

    it("Should handle non-existent VTokens", async function () {
        const nonExistentVTokenId = 999;
        await expect(
            token.connect(verifier).updateVTokenDetails(nonExistentVTokenId, newDetails)
        ).to.be.reverted;
    });
});
