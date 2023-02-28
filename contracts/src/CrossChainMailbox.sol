// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import {TelepathyHandler} from "telepathy/amb/interfaces/TelepathyHandler.sol";

contract CrossChainMailbox is TelepathyHandler {
    event MessageReceived(uint32 indexed sourceChain, address indexed sender, string message);

    string[] public messages;

    constructor(address _telepathy) TelepathyHandler(_telepathy) {}

    function handleTelepathyImpl(uint32 _sourceChainId, address _sender, bytes memory _message) internal override {
        messages.push(string(_message));
        emit MessageReceived(_sourceChainId, _sender, string(_message));
    }

    function messagesLength() external view returns (uint256) {
        return messages.length;
    }
}
