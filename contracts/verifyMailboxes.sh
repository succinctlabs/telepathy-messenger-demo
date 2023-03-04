
CONSTRUCTOR_ARGS=$(cast abi-encode "constructor(address)" $TELEPATHY_ADDRESS)

echo $CONSTRUCTOR_ARGS
echo $MAILER_ADDRESS
echo $MAILBOX_ADDRESS

forge build

forge verify-contract $MAILER_ADDRESS contracts/src/CrossChainMailbox.sol:CrossChainMailer $ETHERSCAN_API_KEY_5 --chain 5 --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILER_ADDRESS contracts/src/CrossChainMailbox.sol:CrossChainMailer $ETHERSCAN_API_KEY_100 --chain 100 --verifier-url="https://api.gnosisscan.io/api" --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILER_ADDRESS contracts/src/CrossChainMailbox.sol:CrossChainMailer $ETHERSCAN_API_KEY_137 --chain 137 --watch --constructor-args $CONSTRUCTOR_ARGS

forge verify-contract $MAILBOX_ADDRESS contracts/src/CrossChainMailbox.sol:CrossChainMailbox $ETHERSCAN_API_KEY_5 --chain 5 --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILBOX_ADDRESS contracts/src/CrossChainMailbox.sol:CrossChainMailbox $ETHERSCAN_API_KEY_100 --chain 100 --verifier-url="https://api.gnosisscan.io/api" --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILBOX_ADDRESS contracts/src/CrossChainMailbox.sol:CrossChainMailbox $ETHERSCAN_API_KEY_137 --chain 137 --watch --constructor-args $CONSTRUCTOR_ARGS
