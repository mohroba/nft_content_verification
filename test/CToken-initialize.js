const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CToken Contract", function () {
    let CToken, token, admin;

    beforeEach(async function () {
        [admin] = await ethers.getSigners();
        CToken = await ethers.getContractFactory("CToken");
        token = await CToken.deploy("TokenURI");
    });
    describe("initialize", function () {
        it("Should initialize successfully", async function () {
            await token.initialize();
    
            expect(await token.hasRole(token.DEFAULT_ADMIN_ROLE(), admin.address)).to.be.true;
            expect(await token.hasRole(token.MINTER_ROLE(), admin.address)).to.be.true;
            expect(await token.hasRole(token.ROYALTY_MANAGER_ROLE(), admin.address)).to.be.true;
            expect(await token.hasRole(token.CONTENT_MANAGER_ROLE(), admin.address)).to.be.true;
        });
    
        it("Should prevent re-initialization", async function () {
            await token.initialize();
    
            await expect(token.initialize()).to.be.reverted;
        });        
    });       
});     