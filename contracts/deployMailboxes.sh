# Edit these array to add/remove chains
SOURCE_CHAIN_IDS=(1 5 100)
DESTINATION_CHAINS_IDS=(1 5 10 56 100 137 42161 43114)

for chain_id in $SOURCE_CHAIN_IDS; do
    rpc_var=$(echo 'RPC_'"${chain_id}")
    rpc=$(echo $(eval echo "\$$rpc_var"))

    echo "deploying Mailer on chain $chain_id"
    forge script script/DeployMailbox.s.sol:DeployMailer --rpc-url $rpc --broadcast --private-key $PRIVATE_KEY
done

for chain_id in $DESTINATION_CHAINS_IDS; do
    rpc_var=$(echo 'RPC_'"${chain_id}")
    rpc=$(echo $(eval echo "\$$rpc_var"))

    echo "deploying Mailbox on chain $chain_id"
    forge script script/DeployMailbox.s.sol:DeployMailbox --rpc-url $rpc --broadcast --private-key $PRIVATE_KEY
done
