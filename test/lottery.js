const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

const zeroAddress = '0x0000000000000000000000000000000000000000'
describe("Lottery", function () {
  it("Lottery", async function () {
    const Lottery = await ethers.getContractFactory("Lottery");
    const [owner] = await ethers.getSigners();
    const ticketPrice = 1000000000000000
    const totalTicket = 10
    const lotteryContract = await Lottery.deploy(totalTicket, ticketPrice);

    await lotteryContract.deployed();

    const players = await lotteryContract.getPlayers()
    expect(players.length).to.equal(1);
    expect(players[0]).to.equal(owner.address);
    const totalTicketRes = await lotteryContract.getTotalTicket()
    expect(totalTicketRes).to.equal(BigNumber.from(totalTicket));
    const ticketPriceRes = await lotteryContract.getTicketPrice()
    expect(ticketPriceRes).to.equal(BigNumber.from(ticketPrice));

    const lastWinner = await lotteryContract.getRecentWinners(0)
    expect(lastWinner.length).to.equal(0);
    const recentWinners = await lotteryContract.getRecentWinners(5)
    expect(recentWinners).to.deep.equal([zeroAddress, zeroAddress, zeroAddress, zeroAddress, zeroAddress]);
  });

  it("Lottery enter with wrong ticket price", async function () {
    const Lottery = await ethers.getContractFactory("Lottery");
    const [owner] = await ethers.getSigners();
    const ticketPrice = 1000000000000000
    const totalTicket = 10
    const lotteryContract = await Lottery.deploy(totalTicket, ticketPrice);

    await lotteryContract.deployed();

    const players = await lotteryContract.getPlayers()
    expect(players.length).to.equal(1);
    expect(players[0]).to.equal(owner.address);
    const totalTicketRes = await lotteryContract.getTotalTicket()
    expect(totalTicketRes).to.equal(BigNumber.from(totalTicket));
    const ticketPriceRes = await lotteryContract.getTicketPrice()
    expect(ticketPriceRes).to.equal(BigNumber.from(ticketPrice));

    const lastWinner = await lotteryContract.getRecentWinners(0)
    expect(lastWinner.length).to.equal(0);
    const recentWinners = await lotteryContract.getRecentWinners(5)
    expect(recentWinners).to.deep.equal([zeroAddress, zeroAddress, zeroAddress, zeroAddress, zeroAddress]);
    await expect(lotteryContract.connect(owner).enter({value: ethers.utils.parseEther("0.002") })).to.be.revertedWith("Must be entered with ticket price");
  });

  it("Lottery start the game while running the current round", async function () {
    const Lottery = await ethers.getContractFactory("Lottery");
    const [owner] = await ethers.getSigners();
    const ticketPrice = 1000000000000000
    const totalTicket = 10
    const lotteryContract = await Lottery.deploy(totalTicket, ticketPrice);

    await lotteryContract.deployed();

    const players = await lotteryContract.getPlayers()
    expect(players.length).to.equal(1);
    expect(players[0]).to.equal(owner.address);
    const totalTicketRes = await lotteryContract.getTotalTicket()
    expect(totalTicketRes).to.equal(BigNumber.from(totalTicket));
    const ticketPriceRes = await lotteryContract.getTicketPrice()
    expect(ticketPriceRes).to.equal(BigNumber.from(ticketPrice));

    const lastWinner = await lotteryContract.getRecentWinners(0)
    expect(lastWinner.length).to.equal(0);
    const recentWinners = await lotteryContract.getRecentWinners(5)
    expect(recentWinners).to.deep.equal([zeroAddress, zeroAddress, zeroAddress, zeroAddress, zeroAddress]);

    await expect(lotteryContract.connect(owner).start(10, ticketPrice)).to.be.revertedWith("Require to finish current game");

  });

  it("Lottery pick winners and start again from owner", async function () {
    const Lottery = await ethers.getContractFactory("Lottery");
    const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
    const ticketPrice = 1000000000000000
    const totalTicket = 5
    const lotteryContract = await Lottery.deploy(totalTicket, ticketPrice);

    await lotteryContract.deployed();

    let players = await lotteryContract.getPlayers()
    expect(players.length).to.equal(1);
    expect(players[0]).to.equal(owner.address);
    let totalTicketRes = await lotteryContract.getTotalTicket()
    expect(totalTicketRes).to.equal(BigNumber.from(totalTicket));
    let ticketPriceRes = await lotteryContract.getTicketPrice()
    expect(ticketPriceRes).to.equal(BigNumber.from(ticketPrice));

    await lotteryContract.connect(addr1).enter({value: ethers.utils.parseEther("0.001") })
    players = await lotteryContract.getPlayers()
    expect(players.length).to.equal(2);
    expect(players).to.deep.equal([owner.address, addr1.address]);

    await lotteryContract.connect(addr2).enter({value: ethers.utils.parseEther("0.001") })
    players = await lotteryContract.getPlayers()
    expect(players.length).to.equal(3);
    expect(players).to.deep.equal([owner.address, addr1.address, addr2.address]);

    await lotteryContract.connect(addr3).enter({value: ethers.utils.parseEther("0.001") })
    players = await lotteryContract.getPlayers()
    expect(players.length).to.equal(4);
    expect(players).to.deep.equal([owner.address, addr1.address, addr2.address, addr3.address]);
    let winners = await lotteryContract.getWinners()
    expect(winners.length).to.equal(0);


    await lotteryContract.connect(addr4).enter({value: ethers.utils.parseEther("0.001") })

    players = await lotteryContract.getPlayers()
    expect(players.length).to.equal(0);

    winners = await lotteryContract.getWinners()
    expect(winners.length).to.equal(1);
    expect([owner.address, addr1.address, addr2.address, addr3.address, addr4.address].includes(winners[0])).to.equal(true);

    // Start the lottery contract with owner
    await lotteryContract.connect(owner).start(10, ticketPrice);
    totalTicketRes = await lotteryContract.getTotalTicket()
    expect(totalTicketRes).to.equal(BigNumber.from(10));
    ticketPriceRes = await lotteryContract.getTicketPrice()
    expect(ticketPriceRes).to.equal(BigNumber.from(ticketPrice));
    players = await lotteryContract.getPlayers()
    expect(players.length).to.equal(1);
    expect(players[0]).to.equal(owner.address);
    const lastWinner = await lotteryContract.getRecentWinners(0)
    expect(lastWinner.length).to.equal(0);
    const recentWinners = await lotteryContract.getRecentWinners(5)
    expect(recentWinners).to.deep.equal([winners[0], zeroAddress, zeroAddress, zeroAddress, zeroAddress]);
  });

  it("Lottery pick winners and start again from another one not owner", async function () {
    const Lottery = await ethers.getContractFactory("Lottery");
    const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
    const ticketPrice = 1000000000000000
    const totalTicket = 5
    const lotteryContract = await Lottery.deploy(totalTicket, ticketPrice);

    await lotteryContract.deployed();

    let players = await lotteryContract.getPlayers()
    expect(players.length).to.equal(1);
    expect(players[0]).to.equal(owner.address);
    let totalTicketRes = await lotteryContract.getTotalTicket()
    expect(totalTicketRes).to.equal(BigNumber.from(totalTicket));
    let ticketPriceRes = await lotteryContract.getTicketPrice()
    expect(ticketPriceRes).to.equal(BigNumber.from(ticketPrice));

    await lotteryContract.connect(addr1).enter({value: ethers.utils.parseEther("0.001") })
    players = await lotteryContract.getPlayers()
    expect(players.length).to.equal(2);
    expect(players).to.deep.equal([owner.address, addr1.address]);

    await lotteryContract.connect(addr2).enter({value: ethers.utils.parseEther("0.001") })
    players = await lotteryContract.getPlayers()
    expect(players.length).to.equal(3);
    expect(players).to.deep.equal([owner.address, addr1.address, addr2.address]);

    await lotteryContract.connect(addr3).enter({value: ethers.utils.parseEther("0.001") })
    players = await lotteryContract.getPlayers()
    expect(players.length).to.equal(4);
    expect(players).to.deep.equal([owner.address, addr1.address, addr2.address, addr3.address]);
    let winners = await lotteryContract.getWinners()
    expect(winners.length).to.equal(0);


    await lotteryContract.connect(addr4).enter({value: ethers.utils.parseEther("0.001") })

    players = await lotteryContract.getPlayers()
    expect(players.length).to.equal(0);

    winners = await lotteryContract.getWinners()
    expect(winners.length).to.equal(1);
    expect([owner.address, addr1.address, addr2.address, addr3.address, addr4.address].includes(winners[0])).to.equal(true);
    
    await expect(lotteryContract.connect(addr1).start(10, ticketPrice)).to.be.revertedWith("Must be contract owner");
  });
});
