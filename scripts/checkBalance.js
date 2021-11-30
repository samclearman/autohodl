const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const checkAddress = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199";

async function main() {
  const autohodlContract = await ethers.getContractAt("Autohodl", contractAddress);

  console.log(`Checking balance for ${checkAddress} (contract at ${contractAddress})`);
  console.log(await autohodlContract.balanceOf(checkAddress));

  console.log("done");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
