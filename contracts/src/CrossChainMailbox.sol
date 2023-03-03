// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import {ITelepathyBroadcaster} from "telepathy/amb/interfaces/ITelepathy.sol";
import {TelepathyHandler} from "telepathy/amb/interfaces/TelepathyHandler.sol";
import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {ENS} from "ens-contracts/registry/ENS.sol";
import {Resolver} from "ens-contracts/resolvers/Resolver.sol";
import {IReverseRegistrar} from "ens-contracts/registry/IReverseRegistrar.sol";
import {BytesUtils} from "ens-contracts/wrapper/BytesUtils.sol";

struct Message {
    uint32 sourceChain;
    address sender;
    string message;
}

contract CrossChainMailboxSender is Ownable {
    using BytesUtils for bytes;

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

    function getName(address _addr) public view returns (string memory name) {
        bytes32 node = reverseNode(_addr);

        // Use reverse resolver to get the ENS name that address this has.
        Resolver reverseResolver = Resolver(ensRegistry.resolver(node));
        if (address(reverseResolver) != address(0x0)) {
            name = resolver.name(node);
            if (bytes(name).length == 0) {
                return "";
            }
        }

        // ENS does not enforce the accuracy of reverse records, so you you must always perform a
        // forward resolution for the returned name and check it matches the original address.
        bytes32 namehash = namehash(name).namehash(0);
        Resolver forwardResolver = Resolver(ensRegistry.resolver(namehash));
        if (address(forwardResolver) != address(0x0)) {
            address forwardAddr = forwardResolver.addr(namehash);
            if (forwardAddr == _addr) {
                return name;
            }
        }

        return "";
    }

    /// @notice This is the equivalant of namehash('addr.reverse')
    bytes32 public constant ADDR_REVERSE_NODE = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2;

    /// @notice Returns the node hash for a given account's reverse records.
    function reverseNode(address _addr) public pure override returns (bytes32) {
        return keccak256(abi.encodePacked(ADDR_REVERSE_NODE, sha3HexAddress(_addr)));
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

library Strings {
    struct slice {
        uint256 _len;
        uint256 _ptr;
    }

    /*
     * @dev Returns a slice containing the entire string.
     * @param self The string to make a slice from.
     * @return A newly allocated slice containing the entire string.
     */
    function toSlice(string memory self) internal pure returns (slice memory) {
        uint256 ptr;
        assembly {
            ptr := add(self, 0x20)
        }
        return slice(bytes(self).length, ptr);
    }

    /*
     * @dev Returns the keccak-256 hash of the slice.
     * @param self The slice to hash.
     * @return The hash of the slice.
     */
    function keccak(slice memory self) internal pure returns (bytes32 ret) {
        assembly {
            ret := keccak256(mload(add(self, 32)), mload(self))
        }
    }

    /*
     * @dev Returns true if the slice is empty (has a length of 0).
     * @param self The slice to operate on.
     * @return True if the slice is empty, False otherwise.
     */
    function empty(slice memory self) internal pure returns (bool) {
        return self._len == 0;
    }

    // Returns the memory address of the first byte after the last occurrence of
    // `needle` in `self`, or the address of `self` if not found.
    function rfindPtr(uint256 selflen, uint256 selfptr, uint256 needlelen, uint256 needleptr)
        private
        pure
        returns (uint256)
    {
        uint256 ptr;

        if (needlelen <= selflen) {
            if (needlelen <= 32) {
                bytes32 mask = bytes32(~(2 ** (8 * (32 - needlelen)) - 1));

                bytes32 needledata;
                assembly {
                    needledata := and(mload(needleptr), mask)
                }

                ptr = selfptr + selflen - needlelen;
                bytes32 ptrdata;
                assembly {
                    ptrdata := and(mload(ptr), mask)
                }

                while (ptrdata != needledata) {
                    if (ptr <= selfptr) {
                        return selfptr;
                    }
                    ptr--;
                    assembly {
                        ptrdata := and(mload(ptr), mask)
                    }
                }
                return ptr + needlelen;
            } else {
                // For long needles, use hashing
                bytes32 hash;
                assembly {
                    hash := keccak256(needleptr, needlelen)
                }
                ptr = selfptr + (selflen - needlelen);
                while (ptr >= selfptr) {
                    bytes32 testHash;
                    assembly {
                        testHash := keccak256(ptr, needlelen)
                    }
                    if (hash == testHash) {
                        return ptr + needlelen;
                    }
                    ptr -= 1;
                }
            }
        }
        return selfptr;
    }

    /*
     * @dev Splits the slice, setting `self` to everything before the last
     *      occurrence of `needle`, and `token` to everything after it. If
     *      `needle` does not occur in `self`, `self` is set to the empty slice,
     *      and `token` is set to the entirety of `self`.
     * @param self The slice to split.
     * @param needle The text to search for in `self`.
     * @param token An output parameter to which the first token is written.
     * @return `token`.
     */
    function rsplit(slice memory self, slice memory needle, slice memory token) internal pure returns (slice memory) {
        uint256 ptr = rfindPtr(self._len, self._ptr, needle._len, needle._ptr);
        token._ptr = ptr;
        token._len = self._len - (ptr - self._ptr);
        if (ptr == self._ptr) {
            // Not found
            self._len = 0;
        } else {
            self._len -= token._len + needle._len;
        }
        return token;
    }
}

library Namehash {
    using Strings for *;

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
