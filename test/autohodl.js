const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Autohodl contract", function () {
  const provider = ethers.provider;
  it("Should accept money", async function () {
    const [owner, hodler] = await ethers.getSigners();

    const autohodlFactory = await ethers.getContractFactory("Autohodl");
    const autohodlContract = await autohodlFactory.deploy();

    const hodlerAddr = await hodler.getAddress();
    const hodlValue = 1234;
    await autohodlContract.connect(hodler).hodl(hodlerAddr, { value: hodlValue });
    const contractBalance = await provider.getBalance(autohodlContract.address);
    expect(contractBalance.toNumber()).to.equal(hodlValue)
  });

  it("Should return money", async function () {
    const [owner, hodler] = await ethers.getSigners();

    const autohodlFactory = await ethers.getContractFactory("Autohodl");
    const autohodlContract = await autohodlFactory.deploy();

    const hodlerAddr = await hodler.getAddress();
    const hodlValue = 12345;

    const balancePre = await provider.getBalance(hodlerAddr);
    const r1 = await (await autohodlContract.connect(hodler).hodl(hodlerAddr, { value: hodlValue })).wait();
    const r2 = await (await autohodlContract.connect(hodler).withdraw(hodlerAddr)).wait();

    const balancePost = await provider.getBalance(hodlerAddr);
    expect(balancePre.sub(balancePost).sub(r1.gasUsed.mul(r1.effectiveGasPrice)).sub(r2.gasUsed.mul(r2.effectiveGasPrice)).toNumber()).to.equal(0);
  });

});
