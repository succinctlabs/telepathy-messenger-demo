
CONSTRUCTOR_ARGS=$(cast abi-encode "constructor(address)" $TELEPATHY_ADDRESS)

source .env

echo "CONSTUCTOR_ARGS: ${CONSTRUCTOR_ARGS}"
echo "MAILER_ADDR: ${MAILER_ADDRESS}"
echo "MAILBOX_ADDR: ${MAILBOX_ADDRESS}"

forge build

forge verify-contract $MAILER_ADDRESS contracts/src/CrossChainMailbox.sol:CrossChainMailer $ETHERSCAN_API_KEY_1 --chain 1 --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILER_ADDRESS contracts/src/CrossChainMailbox.sol:CrossChainMailer $ETHERSCAN_API_KEY_5 --chain 5 --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILER_ADDRESS contracts/src/CrossChainMailbox.sol:CrossChainMailer $ETHERSCAN_API_KEY_100 --chain 100 --verifier-url="https://api.gnosisscan.io/api" --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILER_ADDRESS contracts/src/CrossChainMailbox.sol:CrossChainMailer $ETHERSCAN_API_KEY_137 --chain 137 --watch --constructor-args $CONSTRUCTOR_ARGS

forge verify-contract $MAILBOX_ADDRESS contracts/src/CrossChainMailbox.sol:CrossChainMailbox $ETHERSCAN_API_KEY_1 --chain 1 --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILBOX_ADDRESS contracts/src/CrossChainMailbox.sol:CrossChainMailbox $ETHERSCAN_API_KEY_5 --chain 5 --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILBOX_ADDRESS contracts/src/CrossChainMailbox.sol:CrossChainMailbox $ETHERSCAN_API_KEY_56 --chain 56 --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILBOX_ADDRESS contracts/src/CrossChainMailbox.sol:CrossChainMailbox $ETHERSCAN_API_KEY_100 --chain 100 --verifier-url="https://api.gnosisscan.io/api" --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILBOX_ADDRESS contracts/src/CrossChainMailbox.sol:CrossChainMailbox $ETHERSCAN_API_KEY_137 --chain 137 --watch --constructor-args $CONSTRUCTOR_ARGS