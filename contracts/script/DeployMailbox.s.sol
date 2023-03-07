// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "forge-std/Script.sol";
import {CrossChainMailer, CrossChainMailbox} from "contracts/src/CrossChainMailbox.sol";
import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";

contract Setup is Script {
    string constant ENV_FILE_PATH = "./contracts/.env.deployments";
    bytes32 CREATE2_SALT = vm.envBytes32("CREATE2_SALT");
    address TELEPATHY_ADDRESS = vm.envAddress("TELEPATHY_ADDRESS");

    function setUp() public {}
}

contract DeployMailer is Setup {
    function run() public {
        vm.broadcast();
        CrossChainMailer mailer = new CrossChainMailer{salt: CREATE2_SALT}(TELEPATHY_ADDRESS);

        string memory addrVar = string.concat("MAILER_ADDRESS_", Strings.toString(block.chainid));
        vm.setEnv(addrVar, Strings.toHexString(address(mailer)));
        vm.writeLine(ENV_FILE_PATH, string.concat(string.concat(addrVar, "="), Strings.toHexString(address(mailer))));
    }
}

contract DeployMailbox is Setup {
    function run() public {
        vm.broadcast();
        CrossChainMailbox mailbox = new CrossChainMailbox{salt: CREATE2_SALT}(TELEPATHY_ADDRESS);

        string memory addrVar = string.concat("MAILBOX_ADDRESS_", Strings.toString(block.chainid));
        vm.setEnv(addrVar, Strings.toHexString(address(mailbox)));
        vm.writeLine(ENV_FILE_PATH, string.concat(string.concat(addrVar, "="), Strings.toHexString(address(mailbox))));
    }
}
