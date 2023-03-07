// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "forge-std/Script.sol";
import {CrossChainMailer, CrossChainMailbox} from "contracts/src/CrossChainMailbox.sol";
import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";

contract DeployMailer is Script {
    function setUp() public {}

    function run() public {
        bytes32 CREATE2_SALT = vm.envBytes32("CREATE2_SALT");
        address TELEPATHY_ADDRESS = vm.envAddress("TELEPATHY_ADDRESS");
        vm.broadcast();
        CrossChainMailbox mailbox = new CrossChainMailbox{salt: CREATE2_SALT}(TELEPATHY_ADDRESS);
        vm.setEnv("MAILBOX_ADDRESS", Strings.toHexString(address(mailbox)));
        vm.writeLine("./contracts/.env", string.concat("MAILBOX_ADDRESS=", Strings.toHexString(address(mailbox))));
    }
}

contract DeployMailbox is Script {
    function setUp() public {}

    function run() public {
        bytes32 CREATE2_SALT = vm.envBytes32("CREATE2_SALT");
        address TELEPATHY_ADDRESS = vm.envAddress("TELEPATHY_ADDRESS");
        vm.broadcast();
        CrossChainMailer mailer = new CrossChainMailer{salt: CREATE2_SALT}(TELEPATHY_ADDRESS);
        vm.setEnv("MAILER_ADDRESS", Strings.toHexString(address(mailer)));
        vm.writeLine("./contracts/.env", string.concat("MAILER_ADDRESS=", Strings.toHexString(address(mailer))));
    }
}
