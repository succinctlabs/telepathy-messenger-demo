/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type {
  CrossChainMailbox,
  CrossChainMailboxInterface,
} from "../CrossChainMailbox";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_telepathy",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "NotFromTelepathyReceiever",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint32",
        name: "sourceChain",
        type: "uint32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "MessageReceived",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_sourceChainId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "_senderAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "handleTelepathy",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "messages",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "messagesLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516105a83803806105a883398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610084565b60006020828403121561006657600080fd5b81516001600160a01b038116811461007d57600080fd5b9392505050565b610515806100936000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80630d80fefd146100465780633bdc60d61461006f578063e11dba541461009b575b600080fd5b61005961005436600461022e565b6100ac565b6040516100669190610247565b60405180910390f35b61008261007d3660046102ab565b610158565b6040516001600160e01b03199091168152602001610066565b600154604051908152602001610066565b600181815481106100bc57600080fd5b9060005260206000200160009150905080546100d790610396565b80601f016020809104026020016040519081016040528092919081815260200182805461010390610396565b80156101505780601f1061012557610100808354040283529160200191610150565b820191906000526020600020905b81548152906001019060200180831161013357829003601f168201915b505050505081565b600080546001600160a01b0316331461018a57604051631ee80c4f60e21b815233600482015260240160405180910390fd5b6101958484846101a5565b50631dee306b60e11b9392505050565b6001805480820182556000919091527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6016101e0828261041f565b50816001600160a01b03168363ffffffff167fcee7c9589f34e9a9367c67f5abbdd8970c49bf380828940c266d29187cfbc2fb836040516102219190610247565b60405180910390a3505050565b60006020828403121561024057600080fd5b5035919050565b600060208083528351808285015260005b8181101561027457858101830151858201604001528201610258565b506000604082860101526040601f19601f8301168501019250505092915050565b634e487b7160e01b600052604160045260246000fd5b6000806000606084860312156102c057600080fd5b833563ffffffff811681146102d457600080fd5b925060208401356001600160a01b03811681146102f057600080fd5b9150604084013567ffffffffffffffff8082111561030d57600080fd5b818601915086601f83011261032157600080fd5b81358181111561033357610333610295565b604051601f8201601f19908116603f0116810190838211818310171561035b5761035b610295565b8160405282815289602084870101111561037457600080fd5b8260208601602083013760006020848301015280955050505050509250925092565b600181811c908216806103aa57607f821691505b6020821081036103ca57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561041a57600081815260208120601f850160051c810160208610156103f75750805b601f850160051c820191505b8181101561041657828155600101610403565b5050505b505050565b815167ffffffffffffffff81111561043957610439610295565b61044d816104478454610396565b846103d0565b602080601f831160018114610482576000841561046a5750858301515b600019600386901b1c1916600185901b178555610416565b600085815260208120601f198616915b828110156104b157888601518255948401946001909101908401610492565b50858210156104cf5787850151600019600388901b60f8161c191681555b5050505050600190811b0190555056fea2646970667358221220041a296dc90178879e620fc089db4a24f5cdfc6d2a8458baaf2fb2085b4850b564736f6c63430008100033";

type CrossChainMailboxConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CrossChainMailboxConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CrossChainMailbox__factory extends ContractFactory {
  constructor(...args: CrossChainMailboxConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _telepathy: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<CrossChainMailbox> {
    return super.deploy(
      _telepathy,
      overrides || {}
    ) as Promise<CrossChainMailbox>;
  }
  override getDeployTransaction(
    _telepathy: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_telepathy, overrides || {});
  }
  override attach(address: string): CrossChainMailbox {
    return super.attach(address) as CrossChainMailbox;
  }
  override connect(signer: Signer): CrossChainMailbox__factory {
    return super.connect(signer) as CrossChainMailbox__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CrossChainMailboxInterface {
    return new utils.Interface(_abi) as CrossChainMailboxInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CrossChainMailbox {
    return new Contract(address, _abi, signerOrProvider) as CrossChainMailbox;
  }
}
