// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import {TelepathyHandler} from "telepathy/amb/interfaces/TelepathyHandler.sol";

struct Message {
    uint32 sourceChain;
    address sender;
    string message;
}

contract CrossChainMailbox is TelepathyHandler {
    Message[] public messages;

    event MessageReceived(uint32 indexed sourceChain, address indexed sender, string message);

    constructor(address _telepathy) TelepathyHandler(_telepathy) {}

    function handleTelepathyImpl(uint32 _sourceChainId, address _senderAddress, bytes memory _data) internal override {
        messages.push(Message(_sourceChainId, _senderAddress, string(_data)));
        emit MessageReceived(_sourceChainId, _senderAddress, string(_data));
    }

    function messagesLength() external view returns (uint256) {
        return messages.length;
    }
}
