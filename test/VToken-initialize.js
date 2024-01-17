const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VToken Contract", function () {
  let VToken, token, admin;

  beforeEach(async function () {
    [admin] = await ethers.getSigners();
    VToken = await ethers.getContractFactory("VToken");
    token = await VToken.deploy("TokenURI");
    await token.deployed();
  });

  describe("initialize", function () {
    it("Should initialize successfully", async function () {
      await token.initialize();

      expect(await token.hasRole(token.DEFAULT_ADMIN_ROLE(), admin.address)).to
        .be.true;
      expect(await token.hasRole(token.VERIFIER_ROLE(), admin.address)).to.be
        .true;
      expect(await token.hasRole(token.ADVANCED_VERIFIER_ROLE(), admin.address))
        .to.be.true;
    });
    it("Should prevent re-initialization", async function () {
      await token.initialize();

      await expect(token.initialize()).to.be.revertedWith(
        "Initializable: contract is already initialized"
      );
    });
  });
});
