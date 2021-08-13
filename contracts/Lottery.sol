//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Lottery {
    address internal _manager;
    address[] internal _players;
    uint256 internal _totalTicket;
    uint256 internal _ticketPrice;
    uint256 internal _round;
    address[] internal _winners;
    event WinTheLottery(address indexed winner, uint256 value);
    constructor(uint256 totalTicket, uint256 ticketPrice) {
        _manager = msg.sender;
        start(totalTicket, ticketPrice);
    }

    function enter() public payable {
        if (!(msg.sender == _manager && _players.length == 0)) {
            require(msg.value == _ticketPrice, "Must be entered with ticket price");
        }
        _players.push(msg.sender);
        if (_players.length == _totalTicket) {
            uint256 index = random() % _players.length;
            emit WinTheLottery(_players[index], address(this).balance);
            payable(_players[index]).transfer(address(this).balance);
            _winners.push(_players[index]);
            _players = new address[](0);
        }
    }

    function random() internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        _players
                    )
                )
            );
    }

    function start(uint256 totalTicket, uint256 ticketPrice) public restricted {
        _totalTicket = totalTicket;
        _ticketPrice = ticketPrice;
        enter();
    }

    modifier restricted() {
        require(msg.sender == _manager, "Must be contract owner");
        require(_players.length == 0, "Require to finish current game");
        _;
    }

    function getPlayers() external view returns (address[] memory) {
        return _players;
    }

    function getWinners() external view returns (address[] memory) {
        return _winners;
    }

    function getRecentWinners(uint256 lastItems)
        external
        view
        returns (address[] memory)
    {
        address[] memory listWinners = new address[](lastItems);
        for (uint256 i = 0; i < lastItems; i++) {
            if (_winners.length > i) {
                listWinners[i] = _winners[_winners.length - i - 1];
            }
        }
        return listWinners;
    }

    function getTotalTicket() external view returns (uint256) {
        return _totalTicket;
    }

    function getTicketPrice() external view returns (uint256) {
        return _ticketPrice;
    }
}
