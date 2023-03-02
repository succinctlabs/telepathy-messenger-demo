// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {CrossChainMailboxReceiver} from "contracts/src/CrossChainMailbox.sol";

contract CounterScript is Script {
    function setUp() public {}

    function run() public {
        bytes32 CREATE2_SALT = vm.envBytes32("CREATE2_SALT");
        address TELEPATHY_ADDRESS = vm.envAddress("TELEPATHY_ADDRESS");
        vm.broadcast();
        new CrossChainMailboxReceiver{salt: CREATE2_SALT}(TELEPATHY_ADDRESS);
    }
}
