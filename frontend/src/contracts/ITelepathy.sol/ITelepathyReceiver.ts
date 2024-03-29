/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface ITelepathyReceiverInterface extends utils.Interface {
  functions: {
    "executeMessage(uint64,bytes,bytes[],bytes[])": FunctionFragment;
    "executeMessageFromLog(bytes,bytes,bytes32[],bytes32,bytes[],bytes,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "executeMessage" | "executeMessageFromLog"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "executeMessage",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>[],
      PromiseOrValue<BytesLike>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "executeMessageFromLog",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>[],
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>[],
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "executeMessage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeMessageFromLog",
    data: BytesLike
  ): Result;

  events: {
    "ExecutedMessage(uint32,uint64,bytes32,bytes,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ExecutedMessage"): EventFragment;
}

export interface ExecutedMessageEventObject {
  sourceChainId: number;
  nonce: BigNumber;
  msgHash: string;
  message: string;
  status: boolean;
}
export type ExecutedMessageEvent = TypedEvent<
  [number, BigNumber, string, string, boolean],
  ExecutedMessageEventObject
>;

export type ExecutedMessageEventFilter = TypedEventFilter<ExecutedMessageEvent>;

export interface ITelepathyReceiver extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ITelepathyReceiverInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    executeMessage(
      slot: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      accountProof: PromiseOrValue<BytesLike>[],
      storageProof: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    executeMessageFromLog(
      srcSlotTxSlotPack: PromiseOrValue<BytesLike>,
      messageBytes: PromiseOrValue<BytesLike>,
      receiptsRootProof: PromiseOrValue<BytesLike>[],
      receiptsRoot: PromiseOrValue<BytesLike>,
      receiptProof: PromiseOrValue<BytesLike>[],
      txIndexRLPEncoded: PromiseOrValue<BytesLike>,
      logIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  executeMessage(
    slot: PromiseOrValue<BigNumberish>,
    message: PromiseOrValue<BytesLike>,
    accountProof: PromiseOrValue<BytesLike>[],
    storageProof: PromiseOrValue<BytesLike>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  executeMessageFromLog(
    srcSlotTxSlotPack: PromiseOrValue<BytesLike>,
    messageBytes: PromiseOrValue<BytesLike>,
    receiptsRootProof: PromiseOrValue<BytesLike>[],
    receiptsRoot: PromiseOrValue<BytesLike>,
    receiptProof: PromiseOrValue<BytesLike>[],
    txIndexRLPEncoded: PromiseOrValue<BytesLike>,
    logIndex: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    executeMessage(
      slot: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      accountProof: PromiseOrValue<BytesLike>[],
      storageProof: PromiseOrValue<BytesLike>[],
      overrides?: CallOverrides
    ): Promise<void>;

    executeMessageFromLog(
      srcSlotTxSlotPack: PromiseOrValue<BytesLike>,
      messageBytes: PromiseOrValue<BytesLike>,
      receiptsRootProof: PromiseOrValue<BytesLike>[],
      receiptsRoot: PromiseOrValue<BytesLike>,
      receiptProof: PromiseOrValue<BytesLike>[],
      txIndexRLPEncoded: PromiseOrValue<BytesLike>,
      logIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ExecutedMessage(uint32,uint64,bytes32,bytes,bool)"(
      sourceChainId?: PromiseOrValue<BigNumberish> | null,
      nonce?: PromiseOrValue<BigNumberish> | null,
      msgHash?: PromiseOrValue<BytesLike> | null,
      message?: null,
      status?: null
    ): ExecutedMessageEventFilter;
    ExecutedMessage(
      sourceChainId?: PromiseOrValue<BigNumberish> | null,
      nonce?: PromiseOrValue<BigNumberish> | null,
      msgHash?: PromiseOrValue<BytesLike> | null,
      message?: null,
      status?: null
    ): ExecutedMessageEventFilter;
  };

  estimateGas: {
    executeMessage(
      slot: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      accountProof: PromiseOrValue<BytesLike>[],
      storageProof: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    executeMessageFromLog(
      srcSlotTxSlotPack: PromiseOrValue<BytesLike>,
      messageBytes: PromiseOrValue<BytesLike>,
      receiptsRootProof: PromiseOrValue<BytesLike>[],
      receiptsRoot: PromiseOrValue<BytesLike>,
      receiptProof: PromiseOrValue<BytesLike>[],
      txIndexRLPEncoded: PromiseOrValue<BytesLike>,
      logIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    executeMessage(
      slot: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      accountProof: PromiseOrValue<BytesLike>[],
      storageProof: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    executeMessageFromLog(
      srcSlotTxSlotPack: PromiseOrValue<BytesLike>,
      messageBytes: PromiseOrValue<BytesLike>,
      receiptsRootProof: PromiseOrValue<BytesLike>[],
      receiptsRoot: PromiseOrValue<BytesLike>,
      receiptProof: PromiseOrValue<BytesLike>[],
      txIndexRLPEncoded: PromiseOrValue<BytesLike>,
      logIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
