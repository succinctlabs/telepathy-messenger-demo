// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import {ITelepathyBroadcaster} from "telepathy/amb/interfaces/ITelepathy.sol";
import {TelepathyHandler} from "telepathy/amb/interfaces/TelepathyHandler.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

struct Message {
    uint32 sourceChain;
    address sender;
    string message;
}

contract CrossChainMailboxSender is Ownable {
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

    /// @notice Sends a message to a target recipient on a target chain.
    function sendMail(uint32 _recipientChainId, address _recipientMailbox, bytes calldata _message) external payable {
        if (msg.value < fee) {
            revert InsufficientFee(msg.value, fee);
        }
        bytes memory data = abi.encode(_message); // TODO add extra params to encode
        telepathyBroadcaster.sendViaStorage(_recipientChainId, _recipientMailbox, data);
    }

    /// @notice to claimFees to the owner of the contract
    function claimFees() external onlyOwner {
        address payable owner = payable(msg.sender);
        owner.transfer(address(this).balance);
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
