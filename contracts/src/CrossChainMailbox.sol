// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import {FeeCollector} from "contracts/src/utils/FeeCollector.sol";
import {ENSHelper} from "contracts/src/utils/ENSHelper.sol";
import {StringHelper} from "contracts/src/utils/StringHelper.sol";
import {ITelepathyBroadcaster} from "telepathy/amb/interfaces/ITelepathy.sol";
import {TelepathyHandler} from "telepathy/amb/interfaces/TelepathyHandler.sol";

/// @dev The FeeCollector is for discouraging spam on non-mainnet chains.
contract CrossChainMailer is FeeCollector, ENSHelper {
    /// @notice The TelepathyBroadcaster contract, which sends messages to other chains.
    ITelepathyBroadcaster public telepathyBroadcaster;

    constructor(uint256 _fee, address _TelepathyBroadcaster) FeeCollector(_fee) {
        telepathyBroadcaster = ITelepathyBroadcaster(_TelepathyBroadcaster);
    }

    /// @notice Sends a message to a target recipient mailbox.
    /// @param _recipientChainId The chain ID where the target CrossChainMailbox.
    /// @param _recipientMailbox The address of the target CrossChainMailbox.
    /// @param _message The message to send.
    function sendMail(uint32 _recipientChainId, address _recipientMailbox, bytes memory _message) external payable {
        if (msg.value < fee) {
            revert InsufficientFee(msg.value, fee);
        }
        string memory data = StringHelper.formatMessage(_message, msg.sender.balance, ENSHelper.getName(msg.sender));
        telepathyBroadcaster.sendViaStorage(_recipientChainId, _recipientMailbox, bytes(data));
    }
}

contract CrossChainMailbox is TelepathyHandler {
    string[] public messages;

    event MessageReceived(uint32 indexed sourceChain, address indexed sender, string message);

    constructor(address _telepathyReceiever) TelepathyHandler(_telepathyReceiever) {}

    function handleTelepathyImpl(uint32 _sourceChainId, address _sender, bytes memory _message) internal override {
        messages.push(string(_message));
        emit MessageReceived(_sourceChainId, _sender, string(_message));
    }

    function messagesLength() external view returns (uint256) {
        return messages.length;
    }
}
