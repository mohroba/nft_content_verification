const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Mint VToken", function () {
    let admin, verifier,non_verifier;
    const ctokenId = 1;
    const itokenId = 100;
    const details = 0;
    const weight = 10;
    const parentVTokenId = 0;
    let token;

    beforeEach(async function () {
        [admin, verifier,non_verifier] = await ethers.getSigners();
        VToken = await ethers.getContractFactory("VToken");
        token = await VToken.deploy("VTOKEN_URI");
        await token.initialize();
        await token.grantRole(token.VERIFIER_ROLE(), verifier.address);
    });

    // it("Should allow VERIFIER_ROLE to mint a VToken", async function () {
    //     const vtokenId = await Number(token.connect(verifier).mintVToken(ctokenId, itokenId, details, weight, parentVTokenId));

    //     expect(await token.balanceOf(verifier.address, vtokenId)).to.deep.equal(0);
    //     const verificationInfo = await token.getVerificationInfo(vtokenId);
    //     expect(verificationInfo.ctokenId).to.deep.equal(ctokenId);
    //     expect(verificationInfo.itokenId).to.deep.equal(itokenId);
    //     expect(verificationInfo.verificationDetails).to.equal(details);
    // });

    it("Should prevent non-VERIFIER_ROLE from minting a VToken", async function () {
        await expect(
            token.connect(non_verifier).mintVToken(ctokenId, itokenId, details, weight, parentVTokenId)
        ).to.be.reverted;
    });
});
