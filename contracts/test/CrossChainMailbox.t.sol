pragma solidity ^0.8.16;

import "forge-std/console.sol";

import "forge-std/Vm.sol";
import "forge-std/Test.sol";
import {CrossChainMailer, CrossChainMailbox} from "contracts/src/CrossChainMailbox.sol";
import {ENSHelper} from "contracts/src/utils/ENSHelper.sol";
import {StringHelper} from "contracts/src/utils/StringHelper.sol";
import {MockTelepathy} from "telepathy/amb/mocks/MockTelepathy.sol";

contract MailboxTest is Test, ENSHelper {
    uint256 constant FEE = 0.01 ether;
    uint32 constant SOURCE_CHAIN_ID = 1;
    uint32 constant TARGET_CHAIN_ID = 100;
    bytes constant MESSAGE = "Hello, world!";

    CrossChainMailer mailboxSender;
    CrossChainMailbox mailboxReceiver;
    MockTelepathy source;
    MockTelepathy target;
    address owner;
    address alice;

    bool checkForENS;
    // this address resolves to succinct.eth on Goerli
    address constant ENS_TEST_ADDR = 0xe2B19845Fe2B7Bb353f377d12dD51af012fbba20;

    event MessageReceived(uint32 indexed sourceChain, address indexed sender, string message);

    function setUp() public {
        string memory GOERLI_RPC_URL = vm.envString("RPC_5");
        uint256 forkId = vm.createSelectFork(GOERLI_RPC_URL);
        if (forkId != 0) {
            checkForENS = true;
        }

        source = new MockTelepathy(SOURCE_CHAIN_ID);
        target = new MockTelepathy(TARGET_CHAIN_ID);
        source.addTelepathyReceiver(TARGET_CHAIN_ID, target);

        owner = payable(makeAddr("owner"));
        vm.prank(owner);
        mailboxSender = new CrossChainMailer(address(source));
        vm.prank(owner);
        mailboxReceiver = new CrossChainMailbox(address(target));

        vm.prank(owner);
        mailboxSender.setFee(FEE);

        alice = payable(makeAddr("alice"));
        deal(alice, 0.01789 ether);
    }

    function test_Send() public {
        assertEq(mailboxReceiver.messagesLength(), 0);

        vm.prank(alice);
        mailboxSender.sendMail{value: FEE}(TARGET_CHAIN_ID, address(mailboxReceiver), MESSAGE);

        string memory expectedMessage = StringHelper.formatMessage(MESSAGE, alice.balance, getName(alice));
        vm.expectEmit(true, true, true, true);
        emit MessageReceived(SOURCE_CHAIN_ID, address(mailboxSender), expectedMessage);
        source.executeNextMessage();

        assertEq(mailboxReceiver.messagesLength(), 1);
        string memory message = mailboxReceiver.messages(0);
        assertEq(message, expectedMessage);
        assertEq(address(mailboxSender).balance, FEE);
    }

    function test_Send_WhenSenderHasENS() public {
        if (!checkForENS) {
            return;
        }

        vm.prank(ENS_TEST_ADDR);
        mailboxSender.sendMail{value: FEE}(TARGET_CHAIN_ID, address(mailboxReceiver), MESSAGE);

        string memory expectedMessage =
            StringHelper.formatMessage(MESSAGE, ENS_TEST_ADDR.balance, getName(ENS_TEST_ADDR));
        vm.expectEmit(true, true, true, true);
        emit MessageReceived(SOURCE_CHAIN_ID, address(mailboxSender), expectedMessage);
        source.executeNextMessage();

        assertEq(mailboxReceiver.messagesLength(), 1);
        string memory message = mailboxReceiver.messages(0);
        assertEq(message, expectedMessage);
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

        string memory expectedMessage = StringHelper.formatMessage(MESSAGE, alice.balance, getName(alice));
        vm.expectEmit(true, true, true, true);
        emit MessageReceived(SOURCE_CHAIN_ID, address(mailboxSender), expectedMessage);
        source.executeNextMessage();

        assertEq(mailboxReceiver.messagesLength(), 1);
        string memory message = mailboxReceiver.messages(0);
        console.log(message);
        assertEq(message, expectedMessage);
        assertEq(address(mailboxSender).balance, FEE);

        vm.prank(owner);
        mailboxSender.claimFees();
        assertEq(address(mailboxSender).balance, 0);
    }

    function test_RevertCollectFees_WhenNotOwner() public {
        assertEq(mailboxReceiver.messagesLength(), 0);

        vm.prank(alice);
        mailboxSender.sendMail{value: FEE}(TARGET_CHAIN_ID, address(mailboxReceiver), MESSAGE);

        string memory expectedMessage = StringHelper.formatMessage(MESSAGE, alice.balance, getName(alice));
        vm.expectEmit(true, true, true, true);
        emit MessageReceived(SOURCE_CHAIN_ID, address(mailboxSender), expectedMessage);
        source.executeNextMessage();

        assertEq(mailboxReceiver.messagesLength(), 1);
        string memory message = mailboxReceiver.messages(0);
        assertEq(message, expectedMessage);
        assertEq(address(mailboxSender).balance, FEE);

        vm.prank(alice);
        vm.expectRevert();
        mailboxSender.claimFees();
    }

    function test_formatBalance_WhenGt1Eth() public {
        string memory balanceStr = StringHelper.formatBalance(1234.5605 ether);
        assertEq(balanceStr, "1234.56 ETH");
    }

    function test_formatBalance_WhenLt1Eth() public {
        string memory balanceStr = StringHelper.formatBalance(0.0234 ether);
        assertEq(balanceStr, "0.02 ETH");
    }

    function test_formatBalance_WhenZero() public {
        string memory balanceStr = StringHelper.formatBalance(0 ether);
        assertEq(balanceStr, "0.00 ETH");
    }

    function test_formatBalance_WhenDifferentChain() public {
        vm.chainId(100);
        string memory balanceStr = StringHelper.formatBalance(1234.5605 ether);
        assertEq(balanceStr, "1234.56 xDAI");
    }
}
