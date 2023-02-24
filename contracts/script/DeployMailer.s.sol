// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {CrossChainMailer} from "contracts/src/CrossChainMailer.sol";

contract Deploy is Script {
    function setUp() public {}

    function run() public {
        bytes32 CREATE2_SALT = vm.envBytes32("CREATE2_SALT");
        address TELEPATHY_ADDRESS = vm.envAddress("TELEPATHY_ADDRESS");
        vm.broadcast();
        new CrossChainMailer{salt: CREATE2_SALT}(TELEPATHY_ADDRESS);
    }
}
