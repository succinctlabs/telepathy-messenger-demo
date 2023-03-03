// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import {ENSHelper} from "contracts/src/utils/ENSHelper.sol";
import {ITelepathyBroadcaster} from "telepathy/amb/interfaces/ITelepathy.sol";
import {TelepathyHandler} from "telepathy/amb/interfaces/TelepathyHandler.sol";
import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

struct Message {
    uint32 sourceChain;
    address sender;
    string message;
}

contract CrossChainMailboxSender is Ownable, ENSHelper {
    error InsufficientFee(uint256 actual, uint256 expected);

    /// @notice The fee to pay for sending a message.
    /// @dev The intention is only set to non-zero when deployed non-mainnet chains, used to discourage spam.
    uint256 public fee;

    /// @notice The TelepathyBroadcaster contract, which sends messages to other chains.
    ITelepathyBroadcaster public telepathyBroadcaster;

    constructor(uint256 _fee, address _TelepathyBroadcaster) {
        fee = _fee;
        telepathyBroadcaster = ITelepathyBroadcaster(_TelepathyBroadcaster);
    }

    /// @notice Sends a message to a target recipient mailbox.
    /// @param _recipientChainId The chain ID where the target CrossChainMailboxReceiver.
    /// @param _recipientMailbox The address of the target CrossChainMailboxReceiver.
    /// @param _message The message to send.
    function sendMail(uint32 _recipientChainId, address _recipientMailbox, bytes memory _message) external payable {
        if (msg.value < fee) {
            revert InsufficientFee(msg.value, fee);
        }
        // Add the balance of the sender and their ENS name (if they have one) to the message.
        string memory data = string.concat(
            string.concat(string(_message), Strings.toString(msg.sender.balance)), ENSHelper.getName(msg.sender)
        );
        telepathyBroadcaster.sendViaStorage(_recipientChainId, _recipientMailbox, bytes(data));
    }

    /// @notice Allows owner to set a new fee.
    /// @param _fee The new fee to use.
    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    /// @notice Allows owner to claim all fees sent to this contract.
    function claimFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
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
