pragma solidity ^0.8.16;

import "forge-std/Vm.sol";
import "forge-std/console.sol";
import "forge-std/Test.sol";

import {CrossChainMailbox, Message} from "contracts/src/CrossChainMailbox.sol";
import {MockTelepathy} from "telepathy/amb/mocks/MockTelepathy.sol";

contract MailboxTest is Test {
    CrossChainMailbox mailbox;
    MockTelepathy source;
    MockTelepathy target;

    event MessageReceived(uint32 indexed sourceChain, address indexed sender, string message);

    function setUp() public {
        source = new MockTelepathy(1);
        target = new MockTelepathy(100);
        source.addTelepathyReceiver(100, target);
        mailbox = new CrossChainMailbox(address(target));
    }

    function testMailbox() public {
        assertEq(mailbox.messagesLength(), 0);

        source.send(100, address(mailbox), "Hello, world!");

        vm.expectEmit(true, true, true, true);
        emit MessageReceived(1, address(this), "Hello, world!");
        source.executeNextMessage();

        assertEq(mailbox.messagesLength(), 1);
        (uint32 sourceChain, address sender, string memory message) = mailbox.messages(0);
        assertEq(sourceChain, 1);
        assertEq(sender, address(this));
        assertEq(message, "Hello, world!");
    }
}
