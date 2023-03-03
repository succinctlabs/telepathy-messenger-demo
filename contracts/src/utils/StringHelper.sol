pragma solidity ^0.8.16;

import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";

library StringHelper {
    /// @notice Concatenates together a formatted message
    /// @param rawMessage The raw message bytes
    /// @param balance The balance of the sender
    /// @param ensName The ENS name of the sender ("" if none)
    /// @dev The formatting is like:
    ///
    ///     "hello, world!"
    ///     - alice.eth (1 ETH)
    function formatMessage(bytes memory rawMessage, uint256 balance, string memory ensName)
        internal
        view
        returns (string memory)
    {
        string memory messageStr = string(rawMessage);

        // Show the ETH balance of the sender with 2 decimal places (e.g. 1.23 ETH)
        string memory ethBalanceStr;
        if (balance == 0) {
            ethBalanceStr = "0";
        } else {
            bytes memory balanceByteArr = new bytes(4);

            balanceByteArr[0] = bytes(Strings.toString(balance / 1e18))[0];
            balanceByteArr[1] = ".";
            balanceByteArr[2] = bytes(Strings.toString(balance % 1e18))[0];
            balanceByteArr[3] = bytes(Strings.toString(balance % 1e18))[1];

            ethBalanceStr = string(balanceByteArr);
        }

        // Use the ENS name if it exists, otherwise use the address.
        string memory senderStr;
        if (bytes(ensName).length == 0) {
            senderStr = Strings.toHexString(msg.sender);
        } else {
            senderStr = ensName;
        }

        string memory lineOne = string.concat(string.concat("'", messageStr), "'\n");
        string memory lineTwo =
            string.concat(string.concat(string.concat(string.concat("- ", senderStr), " ("), ethBalanceStr), " ETH)");
        string memory data = string.concat(lineOne, lineTwo);
        return data;
    }
}
