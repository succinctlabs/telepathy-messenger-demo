
source .env

CONSTRUCTOR_ARGS=$(cast abi-encode "constructor(address)" $TELEPATHY_ADDRESS)
echo "CONSTUCTOR_ARGS: ${CONSTRUCTOR_ARGS}"

forge build

forge verify-contract $MAILER_ADDRESS_1 contracts/src/CrossChainMailbox.sol:CrossChainMailer $ETHERSCAN_API_KEY_1 --chain 1 --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILER_ADDRESS_5 contracts/src/CrossChainMailbox.sol:CrossChainMailer $ETHERSCAN_API_KEY_5 --chain 5 --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILER_ADDRESS_100 contracts/src/CrossChainMailbox.sol:CrossChainMailer $ETHERSCAN_API_KEY_100 --chain 100 --verifier-url="https://api.gnosisscan.io/api" --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILER_ADDRESS_137 contracts/src/CrossChainMailbox.sol:CrossChainMailer $ETHERSCAN_API_KEY_137 --chain 137 --watch --constructor-args $CONSTRUCTOR_ARGS

forge verify-contract $MAILBOX_ADDRESS_1 contracts/src/CrossChainMailbox.sol:CrossChainMailbox $ETHERSCAN_API_KEY_1 --chain 1 --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILBOX_ADDRESS_5 contracts/src/CrossChainMailbox.sol:CrossChainMailbox $ETHERSCAN_API_KEY_5 --chain 5 --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILBOX_ADDRESS_56 contracts/src/CrossChainMailbox.sol:CrossChainMailbox $ETHERSCAN_API_KEY_56 --chain 56 --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILBOX_ADDRESS_100 contracts/src/CrossChainMailbox.sol:CrossChainMailbox $ETHERSCAN_API_KEY_100 --chain 100 --verifier-url="https://api.gnosisscan.io/api" --watch --constructor-args $CONSTRUCTOR_ARGS
forge verify-contract $MAILBOX_ADDRESS_137 contracts/src/CrossChainMailbox.sol:CrossChainMailbox $ETHERSCAN_API_KEY_137 --chain 137 --watch --constructor-args $CONSTRUCTOR_ARGS