const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Get Child VTokens", function () {
    let token;
    let admin, verifier;
    const parentVTokenId = 1;
    const childVTokenId1 = 2;
    const childVTokenId2 = 3;

    beforeEach(async function () {
        [admin, verifier] = await ethers.getSigners();
        VToken = await ethers.getContractFactory("VToken");
        token = await VToken.deploy("VTOKEN_URI");
        await token.initialize();
        await token.grantRole(token.VERIFIER_ROLE(), verifier.address);
        // Assume minting VTokens for testing, including parent and children
        await token.connect(verifier).mintVToken(100, 200, "Parent details", 10, 0);
        await token.connect(verifier).mintVToken(100, 200, "Child 1 details", 15, parentVTokenId);
        await token.connect(verifier).mintVToken(100, 200, "Child 2 details", 20, parentVTokenId);
    });

    it("Should return all child VTokens for a given parent VToken ID", async function () {
        const childVTokens = await token.getChildVTokens(parentVTokenId);

        expect(childVTokens).to.deep.equal([childVTokenId1, childVTokenId2]);
    });

    it("Should handle parent VToken IDs with no children", async function () {
        const childVTokens = await token.getChildVTokens(childVTokenId1); // Assuming this ID has no children

        expect(childVTokens).to.deep.equal([]);
    });
});
