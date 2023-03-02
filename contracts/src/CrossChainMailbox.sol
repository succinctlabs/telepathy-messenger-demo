// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import {ITelepathyBroadcaster} from "telepathy/amb/interfaces/ITelepathy.sol";
import {TelepathyHandler} from "telepathy/amb/interfaces/TelepathyHandler.sol";

struct Message {
    uint32 sourceChain;
    address sender;
    string message;
}

contract CrossChainMailboxSender {
    error InsufficientFee(uint256 actual, uint256 expected);

    /// @notice The fee to pay for sending a message.
    /// @dev Only applies when sending from non-mainnet chains, used to discourage spam.
    uint256 public fee;

    /// @notice The TelepathyBroadcaster contract, which sends messages to other chains.
    ITelepathyBroadcaster public telepathyBroadcaster;

    /// @notice The receiver Mailbox contract, which handles Telepathy messages.
    CrossChainMailboxReceiver public receivingMailbox;

    constructor(uint256 _fee, address _TelepathyBroadcaster, address _receivingMailbox) {
        fee = _fee;
        telepathyBroadcaster = ITelepathyBroadcaster(_TelepathyBroadcaster);
        receivingMailbox = CrossChainMailboxReceiver(_receivingMailbox);
    }

    function sendMail(uint32 _recipientChainId, bytes calldata _message) external payable {
        if (block.chainid != 1 && msg.value < fee) {
            revert InsufficientFee(msg.value, fee);
        }
        bytes memory data = abi.encode(_message); // TODO add extra params to encode
        telepathyBroadcaster.sendViaStorage(_recipientChainId, address(receivingMailbox), data);
    }
}

contract CrossChainMailboxReceiver is TelepathyHandler {
    Message[] public messages;

    event MessageReceived(uint32 indexed sourceChain, address indexed sender, string message);

    constructor(address _telepathyReceiever) TelepathyHandler(_telepathyReceiever) {}

    function handleTelepathyImpl(uint32 _sourceChainId, address _senderAddress, bytes memory _data) internal override {
        messages.push(Message(_sourceChainId, _senderAddress, string(_data)));
        emit MessageReceived(_sourceChainId, _senderAddress, string(_data));
    }

    function messagesLength() external view returns (uint256) {
        return messages.length;
    }
}
