pragma solidity ^0.8.16;

import "forge-std/Vm.sol";
import "forge-std/console.sol";
import "forge-std/Test.sol";

import {CrossChainMailboxSender, CrossChainMailboxReceiver, Message} from "contracts/src/CrossChainMailbox.sol";
import {MockTelepathy} from "telepathy/amb/mocks/MockTelepathy.sol";

contract MailboxTest is Test {
    uint256 constant FEE = 0.01 ether;
    uint32 constant SOURCE_CHAIN_ID = 1;
    uint32 constant TARGET_CHAIN_ID = 100;
    bytes constant MESSAGE = "Hello, world!";

    CrossChainMailboxSender mailboxSender;
    CrossChainMailboxReceiver mailboxReceiver;
    MockTelepathy source;
    MockTelepathy target;
    address owner;
    address alice;

    bool checkForENS;
    // this address resolves to succinct.eth on Goerli
    address constant ENS_TEST_ADDR = 0xe2B19845Fe2B7Bb353f377d12dD51af012fbba20;
    string constant ENS_TEST_NAME = "succinct.eth";

    event MessageReceived(uint32 indexed sourceChain, address indexed sender, string message);

    function setUp() public {
        string memory GOERLI_RPC_URL = vm.envString("GOERLI_RPC_URL");
        uint256 forkId = vm.createSelectFork(GOERLI_RPC_URL);
        if (forkId != 0) {
            checkForENS = true;
        }

        source = new MockTelepathy(SOURCE_CHAIN_ID);
        target = new MockTelepathy(TARGET_CHAIN_ID);
        source.addTelepathyReceiver(TARGET_CHAIN_ID, target);

        owner = payable(makeAddr("owner"));
        vm.prank(owner);
        mailboxSender = new CrossChainMailboxSender(FEE, address(source));
        mailboxReceiver = new CrossChainMailboxReceiver(address(target));

        alice = payable(makeAddr("alice"));
        deal(alice, 1 ether);
    }

    function test_Send() public {
        assertEq(mailboxReceiver.messagesLength(), 0);

        vm.prank(alice);
        mailboxSender.sendMail{value: FEE}(TARGET_CHAIN_ID, address(mailboxReceiver), MESSAGE);

        vm.expectEmit(true, true, true, true);
        emit MessageReceived(SOURCE_CHAIN_ID, address(mailboxSender), string(abi.encode(MESSAGE, alice.balance, "")));
        source.executeNextMessage();

        assertEq(mailboxReceiver.messagesLength(), 1);
        (uint32 sourceChain, address sender, string memory message) = mailboxReceiver.messages(0);
        assertEq(sourceChain, SOURCE_CHAIN_ID);
        assertEq(sender, address(mailboxSender));
        assertEq(message, string(abi.encode(MESSAGE, alice.balance, "")));
        assertEq(address(mailboxSender).balance, FEE);
    }

    function test_Send_WhenSenderHasENS() public {
        if (!checkForENS) {
            return;
        }

        vm.prank(ENS_TEST_ADDR);
        mailboxSender.sendMail{value: FEE}(TARGET_CHAIN_ID, address(mailboxReceiver), MESSAGE);

        vm.expectEmit(true, true, true, true);
        emit MessageReceived(
            SOURCE_CHAIN_ID, address(mailboxSender), string(abi.encode(MESSAGE, ENS_TEST_ADDR.balance, ENS_TEST_NAME))
        );
        source.executeNextMessage();

        assertEq(mailboxReceiver.messagesLength(), 1);
        (uint32 sourceChain, address sender, string memory message) = mailboxReceiver.messages(0);
        assertEq(sourceChain, SOURCE_CHAIN_ID);
        assertEq(sender, address(mailboxSender));
        assertEq(message, string(abi.encode(MESSAGE, ENS_TEST_ADDR.balance, ENS_TEST_NAME)));
        assertEq(address(mailboxSender).balance, FEE);
    }

    function test_RevertSend_WhenFeeTooLow() public {
        assertEq(mailboxReceiver.messagesLength(), 0);

        vm.prank(alice);
        vm.expectRevert();
        mailboxSender.sendMail{value: FEE - 1}(TARGET_CHAIN_ID, address(mailboxReceiver), MESSAGE);
    }

    function test_setFee() public {
        assertEq(mailboxSender.fee(), FEE);

        vm.prank(owner);
        mailboxSender.setFee(FEE + 1);

        assertEq(mailboxSender.fee(), FEE + 1);
    }

    function test_RevertSetFee_WhenNotOwner() public {
        assertEq(mailboxSender.fee(), FEE);

        vm.prank(alice);
        vm.expectRevert();
        mailboxSender.setFee(FEE + 1);
    }

    function test_collectFees() public {
        assertEq(mailboxReceiver.messagesLength(), 0);

        vm.prank(alice);
        mailboxSender.sendMail{value: FEE}(TARGET_CHAIN_ID, address(mailboxReceiver), MESSAGE);

        vm.expectEmit(true, true, true, true);
        emit MessageReceived(SOURCE_CHAIN_ID, address(mailboxSender), string(abi.encode(MESSAGE, alice.balance, "")));
        source.executeNextMessage();

        assertEq(mailboxReceiver.messagesLength(), 1);
        (uint32 sourceChain, address sender, string memory message) = mailboxReceiver.messages(0);
        assertEq(sourceChain, SOURCE_CHAIN_ID);
        assertEq(sender, address(mailboxSender));
        assertEq(message, string(abi.encode(MESSAGE, alice.balance, "")));
        assertEq(address(mailboxSender).balance, FEE);

        vm.prank(owner);
        mailboxSender.claimFees();
        assertEq(address(mailboxSender).balance, 0);
    }

    function test_RevertCollectFees_WhenNotOwner() public {
        assertEq(mailboxReceiver.messagesLength(), 0);

        vm.prank(alice);
        mailboxSender.sendMail{value: FEE}(TARGET_CHAIN_ID, address(mailboxReceiver), MESSAGE);

        vm.expectEmit(true, true, true, true);
        emit MessageReceived(SOURCE_CHAIN_ID, address(mailboxSender), string(abi.encode(MESSAGE, alice.balance, "")));
        source.executeNextMessage();

        assertEq(mailboxReceiver.messagesLength(), 1);
        (uint32 sourceChain, address sender, string memory message) = mailboxReceiver.messages(0);
        assertEq(sourceChain, SOURCE_CHAIN_ID);
        assertEq(sender, address(mailboxSender));
        assertEq(message, string(abi.encode(MESSAGE, alice.balance, "")));
        assertEq(address(mailboxSender).balance, FEE);

        vm.prank(alice);
        vm.expectRevert();
        mailboxSender.claimFees();
    }
}
