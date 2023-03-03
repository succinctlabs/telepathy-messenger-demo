pragma solidity ^0.8.16;

import "forge-std/console.sol";
import {ENS} from "ens-contracts/registry/ENS.sol";
import {IAddrResolver} from "ens-contracts/resolvers/profiles/IAddrResolver.sol";
import {INameResolver} from "ens-contracts/resolvers/profiles/INameResolver.sol";

library ENSHelper {
    using BytesUtils for bytes;

    // Same address for Mainet, Ropsten, Rinkerby, Gorli and other networks;
    ENS constant ensRegistry = ENS(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);

    function getName(address _addr) public view returns (string memory name) {
        bytes32 node = reverseNode(_addr);

        // Use reverse resolver to get the ENS name that address this has.
        INameResolver reverseResolver = INameResolver(ensRegistry.resolver(node));
        if (address(reverseResolver) != address(0x0)) {
            name = reverseResolver.name(node);
            if (bytes(name).length == 0) {
                return "";
            }
        }

        // ENS does not enforce the accuracy of reverse records, so you you must always perform a
        // forward resolution for the returned name and check it matches the original address.
        bytes32 namehash = bytes(name).namehash(0);
        IAddrResolver forwardResolver = IAddrResolver(ensRegistry.resolver(namehash));
        if (address(forwardResolver) != address(0x0)) {
            address forwardAddr = forwardResolver.addr(namehash);
            if (forwardAddr == _addr) {
                return name;
            }
        }

        return "";
    }

    // Below are helper functions from ReverseRecords.sol, used so we do not have to maintain a
    // a reference to the contract on each chain.
    // Source: https://github.com/ensdomains/reverse-records/blob/6ef80ba0a445b3f7cdff7819aaad1efbd8ad22fb/contracts/ReverseRecords.sol

    /// @notice This is the equivalant of namehash('addr.reverse')
    bytes32 public constant ADDR_REVERSE_NODE = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2;

    /// @notice Returns the node hash for a given account's reverse records.
    function reverseNode(address _addr) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(ADDR_REVERSE_NODE, sha3HexAddress(_addr)));
    }

    function sha3HexAddress(address addr) private pure returns (bytes32 ret) {
        addr;
        ret; // Stop warning us about unused variables
        assembly {
            let lookup := 0x3031323334353637383961626364656600000000000000000000000000000000

            for { let i := 40 } gt(i, 0) {} {
                i := sub(i, 1)
                mstore8(i, byte(and(addr, 0xf), lookup))
                addr := div(addr, 0x10)
                i := sub(i, 1)
                mstore8(i, byte(and(addr, 0xf), lookup))
                addr := div(addr, 0x10)
            }

            ret := keccak256(0, 40)
        }
    }
}

/// @dev Source: https://github.com/ensdomains/ens-contracts/blob/f5f2ededccbb7e52be44925c0050620d71762e32/contracts/wrapper/BytesUtils.sol#L2
//       We need a compatible Solidity version to compile this contract.
library BytesUtils {
    /*
     * @dev Returns the keccak-256 hash of a byte range.
     * @param self The byte string to hash.
     * @param offset The position to start hashing at.
     * @param len The number of bytes to hash.
     * @return The hash of the byte range.
     */
    function keccak(bytes memory self, uint256 offset, uint256 len) internal pure returns (bytes32 ret) {
        require(offset + len <= self.length);
        assembly {
            ret := keccak256(add(add(self, 32), offset), len)
        }
    }

    /**
     * @dev Returns the ENS namehash of a DNS-encoded name.
     * @param self The DNS-encoded name to hash.
     * @param offset The offset at which to start hashing.
     * @return The namehash of the name.
     */
    function namehash(bytes memory self, uint256 offset) internal pure returns (bytes32) {
        (bytes32 labelhash, uint256 newOffset) = readLabel(self, offset);
        if (labelhash == bytes32(0)) {
            require(offset == self.length - 1, "namehash: Junk at end of name");
            return bytes32(0);
        }
        return keccak256(abi.encodePacked(namehash(self, newOffset), labelhash));
    }

    /**
     * @dev Returns the keccak-256 hash of a DNS-encoded label, and the offset to the start of the next label.
     * @param self The byte string to read a label from.
     * @param idx The index to read a label at.
     * @return labelhash The hash of the label at the specified index, or 0 if it is the last label.
     * @return newIdx The index of the start of the next label.
     */
    function readLabel(bytes memory self, uint256 idx) internal pure returns (bytes32 labelhash, uint256 newIdx) {
        require(idx < self.length, "readLabel: Index out of bounds");
        uint256 len = uint256(uint8(self[idx]));
        if (len > 0) {
            labelhash = keccak(self, idx + 1, len);
        } else {
            labelhash = bytes32(0);
        }
        newIdx = idx + len + 1;
    }
}
