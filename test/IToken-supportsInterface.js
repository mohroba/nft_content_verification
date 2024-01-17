describe("supportsInterface", function () {
    let admin;
    const ERC721InterfaceId = "0x80ac58cd"; // ERC-721 interface ID
    const AccessControlInterfaceId = "0x7965db0b"; // AccessControl interface ID

    beforeEach(async function () {
        [admin] = await ethers.getSigners();
        const IToken = await ethers.getContractFactory("IToken");
        token = await IToken.deploy("MyToken", "MTK");
        await token.deployed();
        await token.initialize();
    });

    it("Should support ERC721 interface", async function () {
        expect(await token.supportsInterface(ERC721InterfaceId)).to.be.true;
    });

    it("Should support AccessControl interface", async function () {
        expect(await token.supportsInterface(AccessControlInterfaceId)).to.be.true;
    });

    it("Should return false for unsupported interfaces", async function () {
        const unsupportedInterfaceId = "0xffffffff"; // Example of an unsupported interface ID
        expect(await token.supportsInterface(unsupportedInterfaceId)).to.be.false;
    });
});
