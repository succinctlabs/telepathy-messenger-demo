// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import {TelepathyHandler} from "telepathy/amb/interfaces/TelepathyHandler.sol";

struct ReceivedMessage {
    uint32 sourceChain;
    address sender;
    string message;
}

contract CrossChainMailbox is TelepathyHandler {
    error NotFromMailer(address sender);

    ReceivedMessage[] public receivedMessages;
    address public mailer;

    event MessageReceived(uint32 indexed sourceChain, address indexed sender, string message);

    constructor(address _telepathy, address _mailer) TelepathyHandler(_telepathy) {
        mailer = _mailer;
    }

    function handleTelepathyImpl(uint32 _sourceChainId, address mailerAddress, bytes memory _data) internal override {
        if (mailerAddress != mailer) {
            revert NotFromMailer(mailerAddress);
        }
        (address sender, string memory message) = abi.decode(_data, (address, string));
        receivedMessages.push(ReceivedMessage(_sourceChainId, sender, message));
        emit MessageReceived(_sourceChainId, sender, message);
    }

    function receivedMessagesLength() external view returns (uint256) {
        return receivedMessages.length;
    }
}
