# Edit these array to add/remove chains
SOURCE_CHAIN_IDS=(1 5 100 137)
DESTINATION_CHAINS_IDS=(1 5 56 100 137)

source .env.deployments

CONSTRUCTOR_ARGS=$(cast abi-encode "constructor(address)" $TELEPATHY_ADDRESS)
echo "CONSTUCTOR_ARGS: ${CONSTRUCTOR_ARGS}"

forge build

for chain_id in $SOURCE_CHAIN_IDS; do
    address_var=$(echo 'MAILER_ADDRESS_'"${chain_id}")
    address=$(echo $(eval echo "\$$address_var"))

    etherscan_key_var=$(echo 'ETHERSCAN_API_KEY_'"${chain_id}")
    etherscan_key=$(echo $(eval echo "\$$etherscan_key_var"))

    echo "Verifying Mailer $address on chain $chain_id"
    forge verify-contract $address contracts/src/CrossChainMailbox.sol:CrossChainMailer $etherscan_key --chain ${chain_id} --watch --constructor-args $CONSTRUCTOR_ARGS
done

for chain_id in $DESTINATION_CHAINS_IDS; do
    address_var=$(echo 'MAILBOX_ADDRESS_'"${chain_id}")
    address=$(echo $(eval echo "\$$address_var"))

    etherscan_key_var=$(echo 'ETHERSCAN_API_KEY_'"${chain_id}")
    etherscan_key=$(echo $(eval echo "\$$etherscan_key_var"))

    echo "Verifying Mailbox $address on chain $chain_id"
    forge verify-contract $address contracts/src/CrossChainMailbox.sol:CrossChainMailbox $etherscan_key --chain ${chain_id} --watch --constructor-args $CONSTRUCTOR_ARGS
done
