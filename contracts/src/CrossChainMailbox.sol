// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import {ITelepathyBroadcaster} from "telepathy/amb/interfaces/ITelepathy.sol";
import {TelepathyHandler} from "telepathy/amb/interfaces/TelepathyHandler.sol";
import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {ENS} from "ens-contracts/registry/ENS.sol";
import {Resolver} from "ens-contracts/resolvers/Resolver.sol";
import {IReverseRegistrar} from "ens-contracts/registry/IReverseRegistrar.sol";

struct Message {
    uint32 sourceChain;
    address sender;
    string message;
}

abstract contract Resolver {
    function addr(bytes32 node) public view virtual returns (address);
}

// interface IReverseRegistrar {
//     function setDefaultResolver(address resolver) external;

//     function claim(address owner) external returns (bytes32);

//     function claimForAddr(
//         address addr,
//         address owner,
//         address resolver
//     ) external returns (bytes32);

//     function claimWithResolver(
//         address owner,
//         address resolver
//     ) external returns (bytes32);

//     function setName(string memory name) external returns (bytes32);

//     function setNameForAddr(
//         address addr,
//         address owner,
//         address resolver,
//         string memory name
//     ) external returns (bytes32);

//     function node(address addr) external pure returns (bytes32);
// }

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

    /// @notice Sends a message to a target recipient mailbox.
    /// @param _recipientChainId The chain ID where the target CrossChainMailboxReceiver.
    /// @param _recipientMailbox The address of the target CrossChainMailboxReceiver.
    /// @param _message The message to send.
    function sendMail(uint32 _recipientChainId, address _recipientMailbox, bytes calldata _message) external payable {
        if (msg.value < fee) {
            revert InsufficientFee(msg.value, fee);
        }
        bytes memory data = abi.encode(_message); // TODO add extra params to encode
        telepathyBroadcaster.sendViaStorage(_recipientChainId, _recipientMailbox, data);
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

    /// --- ENS HELPERS ---

    // Same address for Mainet, Ropsten, Rinkerby, Gorli and other networks;
    ENS ensRegistry = ENS(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);

    function resolve(bytes32 node) public view returns (address) {
        Resolver resolver = ensRegistry.resolver(node);
        return resolver.addr(node);
    }
    // ENS Reverse Record contract

    IReverseRegistrar ensReverseResolver = address(0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C);

    // The steps, given an input address, are:
    // 1. Construct namehash (node) for <address>.addr.reverse
    // 2. Lookup resolver for node in registry
    // 3. Call name on resolver to get the primary name
    // 4. Do forward resolution on that primary name to ensure it resolves to the same address as the input address

    // function reverseResolve(address _addr) internal view returns (string memory) {
    //     ensReverseResolver.node(_addr);
    // }

    // /// @notice Find ENS names for a given address
    // /// @param addr to lookup
    // /// @return ENS names
    // function getENSName(address _addr) public view returns (string[] memory) {
    //     ReverseRecords reverseRecords = ReverseRecords(ensReverseContractLookupAddress);
    //     address[] memory t = new address[](1); // Define a fixed length array for getNames lookup.
    //     t[0] = _addr;
    //     return reverseRecords.getNames(t);
    // }

    // TODO read https://docs.ens.domains/dapp-developer-guide/resolving-names#reverse-resolution
    // Forward resolution check is important because there is no enforcement at the contract level on reverse records.

    function getName(address _addr) public view returns (string memory) {
        bytes32 node = node(_addr);
        Resolver resolver = Resolver(ensRegistry.resolver(node));
        if (address(resolver) != address(0x0)) {
            Resolver resolver = Resolver(resolver);
            return resolver.name(node);
        }
        return "";
    }

    function getName(address _addr) public view returns (string memory) {
        bytes32 node = node(_addr);
        address resolverAddress = ensRegistry.resolver(node);
        if (resolverAddress != address(0x0)) {
            Resolver resolver = Resolver(resolverAddress);
            string memory name = resolver.name(node);
            if (bytes(name).length == 0) {
                return "";
            }
            bytes32 namehash = Namehash.namehash(name);
            address forwardResolverAddress = ensRegistry.resolver(namehash);
            if (forwardResolverAddress != address(0x0)) {
                Resolver forwardResolver = Resolver(forwardResolverAddress);
                address forwardAddress = forwardResolver.addr(namehash);
                if (forwardAddress == _addr) {
                    return name;
                }
            }
        }
        return "";
    }

    function node(address addr) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(ADDR_REVERSE_NODE, sha3HexAddress(addr)));
    }

    function namehash(string memory name) internal pure returns (bytes32 hash) {
        hash = bytes32(0);
        Strings.slice memory nameslice = name.toSlice();
        Strings.slice memory delim = ".".toSlice();
        Strings.slice memory token;
        for (nameslice.rsplit(delim, token); !token.empty(); nameslice.rsplit(delim, token)) {
            hash = keccak256(abi.encodePacked(hash, token.keccak()));
        }
        return hash;
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
