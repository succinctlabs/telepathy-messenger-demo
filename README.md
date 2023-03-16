# Cross-Chain Messaging Demo

This is a demonstration of sending arbitrary data across chains using the [Telepathy Protocol](https://www.telepathy.xyz/). Try out the demo [here](https://demo.telepathy.xyz)!

### Contracts


The source chain contract [CrossChainMailer](https://github.com/succinctlabs/messenger-demo/blob/49815261409963155871257a56c47f777d072bce/contracts/src/CrossChainMailbox.sol#L14) concatenates together a string message that includes:

* arbitrary text
* the sender's balance
* the sender's [ENS](https://ens.domains/) name (if applicable)

It then sends this data to the [Telepathy Router](https://docs.telepathy.xyz/protocol/contracts#router), which means it will be [relayed](https://docs.telepathy.xyz/protocol/actors#relayer) to the destination chain contract specified in:

```Solidity
    telepathyRouter.send(_destinationChainId, _destinationMailbox, bytes(data));
```

Once finalization occurs, it can be relayed to the destination chain contract [CrossChainMailbox](CrossChainMailbox), which handles the message in:

```Solidity
    function handleTelepathyImpl(uint32 _sourceChainId, address _sourceAddress, bytes memory _message)
        internal
        override
    {
        messages.push(string(_message));
        emit MessageReceived(_sourceChainId, _sourceAddress, string(_message));
    }
```

It store the message and emit an event.