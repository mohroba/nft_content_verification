const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Get Verification Info", function () {
    let admin, verifier;
    let token;
    const vtokenId = 1;

    beforeEach(async function () {
        [admin, verifier] = await ethers.getSigners();
        VToken = await ethers.getContractFactory("VToken");
        token = await VToken.deploy("VTOKEN_URI");
        await token.initialize();
        await token.grantRole(token.VERIFIER_ROLE(), verifier.address);
        // Assume minting a VToken for testing
        await token.connect(verifier).mintVToken(100, 200, "Verification details", 10, 0);
    });

    it("Should retrieve verification information for a VToken", async function () {
        const verificationInfo = await token.getVerificationInfo(vtokenId);

        expect(verificationInfo.ctokenId).to.equal(100);
        expect(verificationInfo.itokenId).to.equal(200);
        expect(verificationInfo.verificationDetails).to.equal("Verification details");
        expect(verificationInfo.weight).to.equal(10);
        expect(verificationInfo.parentVTokenId).to.equal(0);
    });

    // it("Should handle requests for non-existent VTokens", async function () {
    //     const nonExistentVTokenId = 999;
    //     await expect(Number(token.getVerificationInfo(nonExistentVTokenId))).to.be.reverted;
    // });
});
