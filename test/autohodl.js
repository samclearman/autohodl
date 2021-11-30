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
    const hodlTime = 3;

    await autohodlContract.connect(hodler).hodl(hodlerAddr, hodlTime, { value: hodlValue });
    const contractBalance = await provider.getBalance(autohodlContract.address);
    expect(contractBalance.toNumber()).to.equal(hodlValue)
    expect(await autohodlContract.balanceOf(hodlerAddr)).to.equal(hodlValue);
  });

  it("Shouldn't return money immediately", async function () {
    const [owner, hodler] = await ethers.getSigners();

    const autohodlFactory = await ethers.getContractFactory("Autohodl");
    const autohodlContract = await autohodlFactory.deploy();

    const hodlerAddr = await hodler.getAddress();
    const hodlValue = 12345;
    const hodlTime = 3;

    const balancePre = await provider.getBalance(hodlerAddr);
    const r1 = await (await autohodlContract.connect(hodler).hodl(hodlerAddr, hodlTime, { value: hodlValue })).wait();
    const r2 = await (await autohodlContract.connect(hodler).withdraw(hodlerAddr)).wait();

    const balancePost = await provider.getBalance(hodlerAddr);
    expect(balancePre.sub(balancePost).sub(r1.gasUsed.mul(r1.effectiveGasPrice)).sub(r2.gasUsed.mul(r2.effectiveGasPrice)).toNumber()).to.equal(hodlValue);
  });

  it("Should return money eventually", async function () {
    const [owner, hodler] = await ethers.getSigners();

    const autohodlFactory = await ethers.getContractFactory("Autohodl");
    const autohodlContract = await autohodlFactory.deploy();

    const hodlerAddr = await hodler.getAddress();
    const hodlValue = 12345;
    const hodlTime = 3;

    const balancePre = await provider.getBalance(hodlerAddr);
    const r1 = await (await autohodlContract.connect(hodler).hodl(hodlerAddr, hodlTime, { value: hodlValue })).wait();
    await new Promise(resolve => setTimeout(resolve, (hodlTime + 1) * 1000));
    const r2 = await (await autohodlContract.connect(hodler).withdraw(hodlerAddr)).wait();

    const balancePost = await provider.getBalance(hodlerAddr);
    expect(balancePre.sub(balancePost).sub(r1.gasUsed.mul(r1.effectiveGasPrice)).sub(r2.gasUsed.mul(r2.effectiveGasPrice)).toNumber()).to.equal(0);
  });

  it("Should only extend lock times", async function () {
    const [owner, hodler] = await ethers.getSigners();

    const autohodlFactory = await ethers.getContractFactory("Autohodl");
    const autohodlContract = await autohodlFactory.deploy();

    const hodlerAddr = await hodler.getAddress();
    const hodlValue = 1234;
    const hodlTime = 100;

    await autohodlContract.connect(hodler).hodl(hodlerAddr, hodlTime, { value: hodlValue });
    const lockedUntil = await autohodlContract.lockedUntilOf(hodlerAddr);
    expect(lockedUntil * 1000).to.be.gt(Date.now())

    await autohodlContract.connect(hodler).hodl(hodlerAddr, 1, { value: hodlValue });
    expect(await autohodlContract.lockedUntilOf(hodlerAddr)).to.equal(lockedUntil);
  });
});
