const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const feePercent = 0.1;

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners();

  // Deploy contract
  const Artick = await ethers.getContractFactory("Artick");
  const artick = await Artick.deploy(1);
  await artick.deployed();

  console.log(`Deployed Artick Contract at: ${artick.address}\n`);

  // List 6 events
  const occasions = [
    {
      id: 1,
      name: "Articks first event",
      cost: tokens(1 + feePercent),
      tickets: 100,
      maxtickets: 100,
      date: "Sep 11",
      time: "10:00AM EST",
      location: "Manchester, UK",
      description: "I did it!",
      image:
        "https://indigo-tropical-bird-111.mypinata.cloud/ipfs/QmTgxcb2V97CjyyoY3E69dBB2h6ekZJKNcGUS3nAT9RJT9/2.png",
    },
    {
      id: 2,
      name: "ETH Manchester",
      cost: tokens(1 + feePercent),
      tickets: 130,
      maxtickets: 130,
      date: "Jun 2",
      time: "1:00PM JST",
      location: "Tokyo, Japan",
      description: "I did it!",
      image:
        "https://gateway.pinata.cloud/ipfs/QmVySXL5jcqpvCvmuGSbkKpuss5L87iT1Kezuiu2GbpoBf",
    },
    {
      id: 3,
      name: "Man city champions league final",
      cost: tokens(0.25 + feePercent),
      tickets: 200,
      maxtickets: 200,
      date: "Jun 9",
      time: "10:00AM TRT",
      location: "Turkey, Istanbul",
      description: "I did it!",
      image:
        "https://gateway.pinata.cloud/ipfs/QmVySXL5jcqpvCvmuGSbkKpuss5L87iT1Kezuiu2GbpoBf",
    },
    {
      id: 4,
      name: "Dallas Mavericks vs. San Antonio Spurs",
      cost: tokens(5 + feePercent),
      tickets: 0,
      maxtickets: 0,
      date: "Jun 11",
      time: "2:30PM CST",
      location: "American Airlines Center - Dallas, TX",
      description: "I did it!",
      image:
        "https://gateway.pinata.cloud/ipfs/QmVySXL5jcqpvCvmuGSbkKpuss5L87iT1Kezuiu2GbpoBf",
    },
    {
      id: 5,
      name: "ETH Global Toronto",
      cost: tokens(1.5 + feePercent),
      tickets: 125,
      maxtickets: 125,
      date: "Jun 23",
      time: "11:00AM EST",
      location: "Toronto, Canada",
      description: "I did it!",
      image:
        "https://gateway.pinata.cloud/ipfs/QmVySXL5jcqpvCvmuGSbkKpuss5L87iT1Kezuiu2GbpoBf",
    },
    {
      id: 6,
      name: "Articks last event",
      cost: tokens(1 + feePercent),
      tickets: 100,
      maxtickets: 100,
      date: "Sep 11",
      time: "10:00AM EST",
      location: "Manchester, UK",
      description: "I did it!",
      image:
        "https://indigo-tropical-bird-111.mypinata.cloud/ipfs/QmTgxcb2V97CjyyoY3E69dBB2h6ekZJKNcGUS3nAT9RJT9/2.png",
    },
  ];

  console.log(occasions.description);
  //looping through the occasions above and creating them
  for (var i = 0; i < 5; i++) {
    const transaction = await artick
      .connect(deployer)
      .listOccasion(
        occasions[i].id,
        occasions[i].name,
        occasions[i].cost,
        occasions[i].tickets,
        occasions[i].maxtickets,
        occasions[i].date,
        occasions[i].time,
        occasions[i].location,
        occasions[i].description,
        occasions[i].image
      );

    await transaction.wait();

    console.log(`Listed Event ${i + 1}: ${occasions[i].name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
