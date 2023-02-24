pragma solidity ^0.8.16;

import "forge-std/Vm.sol";
import "forge-std/console.sol";
import "forge-std/Test.sol";

import {CrossChainMailer} from "contracts/src/CrossChainMailer.sol";
import {CrossChainMailbox} from "contracts/src/CrossChainMailbox.sol";
import {MockTelepathy} from "telepathy/amb/mocks/MockTelepathy.sol";

contract MailboxTest is Test {
    CrossChainMailer mailer;
    CrossChainMailbox mailbox;
    MockTelepathy source;
    MockTelepathy target;

    event MessageSent(address indexed mailbox, uint32 indexed targetChain, address indexed sender, string message);
    event MessageReceived(uint32 indexed sourceChain, address indexed sender, string message);

    function setUp() public {
        source = new MockTelepathy(1);
        target = new MockTelepathy(100);
        source.addTelepathyReceiver(100, target);
        mailer = new CrossChainMailer(address(source));
        mailbox = new CrossChainMailbox(address(target), address(mailer));
    }

    function testMail() public {
        assertEq(mailer.sentMessagesLength(), 0);
        assertEq(mailbox.receivedMessagesLength(), 0);

        vm.expectEmit(true, true, true, true);
        emit MessageSent(address(mailbox), 100, address(this), "Hello, world!");
        mailer.sendMessage(address(mailbox), 100, "Hello, world!");

        assertEq(mailer.sentMessagesLength(), 1);
        (uint32 targetChain, address sender, string memory message) = mailer.sentMessages(0);
        assertEq(targetChain, 100);
        assertEq(sender, address(this));
        assertEq(message, "Hello, world!");

        vm.expectEmit(true, true, true, true);
        emit MessageReceived(1, address(this), "Hello, world!");
        source.executeNextMessage();

        assertEq(mailbox.receivedMessagesLength(), 1);
        (uint32 sourceChain, address sender2, string memory message2) = mailbox.receivedMessages(0);
        assertEq(sourceChain, 1);
        assertEq(sender2, address(this));
        assertEq(message2, "Hello, world!");
    }
}
