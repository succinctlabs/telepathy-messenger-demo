// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "forge-std/Script.sol";
import {CrossChainMailer, CrossChainMailbox} from "contracts/src/CrossChainMailbox.sol";

contract DeployMailer is Script {
    function setUp() public {}

    function run() public {
        bytes32 CREATE2_SALT = vm.envBytes32("CREATE2_SALT");
        address TELEPATHY_ADDRESS = vm.envAddress("TELEPATHY_ADDRESS");
        vm.broadcast();
        new CrossChainMailer{salt: CREATE2_SALT}(TELEPATHY_ADDRESS);
    }
}

contract DeployMailbox is Script {
    function setUp() public {}

    function run() public {
        bytes32 CREATE2_SALT = vm.envBytes32("CREATE2_SALT");
        address TELEPATHY_ADDRESS = vm.envAddress("TELEPATHY_ADDRESS");
        vm.broadcast();
        new CrossChainMailbox{salt: CREATE2_SALT}(TELEPATHY_ADDRESS);
    }
}
