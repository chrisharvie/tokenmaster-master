const ethers = require("ethers");
const { expect } = require("chai");

const NAME = "Artick";
const SYMBOL = "AT";

const OCCASION_NAME = "Chris' first event";
const OCCASION_COST = ethers.utils.parseUnits("1", "ether");
const OCCASION_MAX_TICKETS = "100";
const OCCASION_DATE = "Sep 11";
const OCCASION_TIME = "10:00AM";
const OCCASION_LOCATION = "Manchester, UK";

describe("Artick", () => {
  let Artick;
  let deployer, buyer;

  beforeEach(async () => {
    //set accounts
    [deployer, buyer] = await ethers.getSigners();
    const Artick = await ethers.getContractFactory("Artick");
    artick = await Artick.deploy(NAME, SYMBOL);

    //save all of this to a transaction, artick is the deployed contract from above, use connect function to specify the account that is creating the transaction and calling the list function. Specify the signer(in this case owner)
    const transaction = await artick
      .connect(deployer)
      .list(
        OCCASION_NAME,
        OCCASION_COST,
        OCCASION_MAX_TICKETS,
        OCCASION_DATE,
        OCCASION_TIME,
        OCCASION_LOCATION
      );
    //wait for this to be included into a block before testing for it, then you can run the tests further down
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("sets the name", async () => {
      let name = await artick.name();
      expect(name).to.equal(NAME);
    });
    it("sets the symbol", async () => {
      let symbol = await artick.symbol();
      expect(symbol).to.equal(SYMBOL);
    });
    it("sets the owner", async () => {
      expect(await artick.owner()).to.equal(deployer.address);
    });
  });
  describe("Occasions", () => {
    //checking if the total occasions are increased
    it("updates occasions count", async () => {
      const totalOccasions = await artick.totalOccasions();
      expect(totalOccasions).to.be.equal(1);
    });
    it("Returns occasions attributes", async () => {
      const occasion = await artick.getOccasion(1);
      expect(occasion.id).to.be.equal(1);
      expect(occasion.name).to.be.equal(OCCASION_NAME);
      expect(occasion.cost).to.be.equal(OCCASION_COST);
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS);
      expect(occasion.date).to.be.equal(OCCASION_DATE);
      expect(occasion.time).to.be.equal(OCCASION_TIME);
      expect(occasion.location).to.be.equal(OCCASION_LOCATION);
    });
  });
  describe("Minting", () => {
    //creative variables and data to be referenced in the test to verify the functions work
    const ID = 1;
    const SEAT = 50;
    const AMOUNT = ethers.utils.parseUnits("1", "ether");

    beforeEach(async () => {
      //deployed artick contract here connects to the buyer and calls the mint function int he smart contract and pass in the values in the variables above. the cost is in the metadata
      const transaction = await artick
        .connect(buyer)
        .mint(ID, SEAT, { value: AMOUNT });
      await transaction.wait();
    });
    it("Updates ticket count", async () => {
      const occasion = await artick.getOccasion(1);
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS - 1);
    });
    it("Updates buying status", async () => {
      const status = await artick.hasBought(ID, buyer.address);
      expect(status).to.be.equal(true);
    });
    it("Updates seat status", async () => {
      const owner = await artick.seatTaken(ID, SEAT);
      expect(owner).to.equal(buyer.address);
    });

    it("Updates overall seating status", async () => {
      const seats = await artick.getSeatsTaken(ID);
      expect(seats.length).to.equal(1);
      expect(seats[0]).to.equal(SEAT);
    });

    it("Updates the contract balance", async () => {
      const balance = await ethers.provider.getBalance(artick.address);
      expect(balance).to.be.equal(AMOUNT);
    });
  });
  describe("Withdrawing", () => {
    const ID = 1;
    const SEAT = 50;
    const AMOUNT = ethers.utils.parseUnits("1", "ether");
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let transaction = await artick
        .connect(buyer)
        .mint(ID, SEAT, { value: AMOUNT });
      await transaction.wait();

      transaction = await artick.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("Updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Updates the contract balance", async () => {
      const balance = await ethers.provider.getBalance(artick.address);
      expect(balance).to.equal(0);
    });
  });
});
