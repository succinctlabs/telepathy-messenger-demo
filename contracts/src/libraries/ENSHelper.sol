pragma solidity ^0.8.16;

import "forge-std/console.sol";

import {Address} from "openzeppelin-contracts/contracts/utils/Address.sol";
import {ENS} from "ens-contracts/registry/ENS.sol";
import {IAddrResolver} from "ens-contracts/resolvers/profiles/IAddrResolver.sol";
import {INameResolver} from "ens-contracts/resolvers/profiles/INameResolver.sol";

contract ENSHelper {
    using Address for address;
    using BytesUtils for bytes;

    // Same address for Mainet, Ropsten, Rinkerby, Gorli and other networks;
    address constant ensRegistryAddr = 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e;

    /// The namehash of the `eth` TLD in the ENS registry, eg. namehash("eth").
    bytes32 public constant ETH_NODE = keccak256(abi.encodePacked(bytes32(0), keccak256("eth")));

    function getName(address _addr) public view returns (string memory name) {
        if (!ensRegistryAddr.isContract()) {
            return "";
        }

        console.log("Getting name for address: ", _addr);

        bytes32 node = reverseNode(_addr);

        console.logBytes32(node);

        // Use reverse resolver to get the ENS name that address this has.
        address reverseResolverAddr = ENS(ensRegistryAddr).resolver(node);
        // address reverseResolverAddr = 0x342cf18D3e41DE491aa1a3067574C849AdA6a2Ad;
        console.log("reverseResolverAddr: ", reverseResolverAddr);
        if (reverseResolverAddr == address(0) || !reverseResolverAddr.isContract()) {
            return "";
        }

        name = INameResolver(reverseResolverAddr).name(node);
        console.log("name: ", name);
        if (bytes(name).length == 0) {
            return "";
        }

        // ENS does not enforce the accuracy of reverse records, so you you must always perform a
        // forward resolution for the returned name and check it matches the original address.
        // bytes32 namehash = bytes(name).namehash(0);
        // console.logBytes32(namehash);

        bytes32 label = keccak256(bytes(name));
        bytes32 node2 = namehash(ETH_NODE, label);

        address forwardResolverAddr = ENS(ensRegistryAddr).resolver(namehash);
        if (forwardResolverAddr == address(0) || !forwardResolverAddr.isContract()) {
            return "";
        }

        console.log("forwardResolverAddr: ", forwardResolverAddr);
        console.logBytes32(namehash);

        address forwardAddr = IAddrResolver(forwardResolverAddr).addr(namehash);
        if (forwardAddr == _addr) {
            return name;
        } else {
            return "";
        }
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

    function namehash(bytes32 parent, bytes32 label) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(parent, label));
    }

    /**
     * @dev Returns the ENS namehash of a DNS-encoded name.
     * @param self The DNS-encoded name to hash.
     * @param offset The offset at which to start hashing.
     * @return The namehash of the name.
     */
    function namehash(bytes memory self, uint256 offset) internal view returns (bytes32) {
        (bytes32 labelhash, uint256 newOffset) = readLabel(self, offset);
        if (labelhash == bytes32(0)) {
            require(offset == self.length - 1, "namehash: Junk at end of name");
            return bytes32(0);
        }
        console.logBytes32(labelhash);
        return keccak256(abi.encodePacked(namehash(self, newOffset), labelhash));
    }

    /**
     * @dev Returns the keccak-256 hash of a DNS-encoded label, and the offset to the start of the next label.
     * @param self The byte string to read a label from.
     * @param idx The index to read a label at.
     * @return labelhash The hash of the label at the specified index, or 0 if it is the last label.
     * @return newIdx The index of the start of the next label.
     */
    function readLabel(bytes memory self, uint256 idx) internal view returns (bytes32 labelhash, uint256 newIdx) {
        console.log(idx);
        require(idx < self.length, "readLabel: Index out of bounds");
        uint256 len = uint256(uint8(self[idx]));
        console.log(len);
        if (len > 0) {
            labelhash = keccak(self, idx + 1, len);
        } else {
            labelhash = bytes32(0);
        }
        newIdx = idx + len + 1;
    }
}
