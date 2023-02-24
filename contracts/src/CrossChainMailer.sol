// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import {ITelepathyBroadcaster} from "telepathy/amb/interfaces/ITelepathy.sol";

struct SentMessage {
    uint32 targetChain;
    address sender;
    string message;
}

contract CrossChainMailer {
    SentMessage[] public sentMessages;
    address public telepathy;

    event MessageSent(address indexed mailbox, uint32 indexed targetChain, address indexed sender, string message);

    constructor(address _telepathy) {
        telepathy = _telepathy;
    }

    function sendMessage(address _mailbox, uint32 _targetChain, string calldata _message) external {
        sentMessages.push(SentMessage(_targetChain, msg.sender, _message));
        emit MessageSent(_mailbox, _targetChain, msg.sender, _message);
        ITelepathyBroadcaster(telepathy).send(_targetChain, _mailbox, abi.encode(msg.sender, _message));
    }

    function sentMessagesLength() external view returns (uint256) {
        return sentMessages.length;
    }
}
