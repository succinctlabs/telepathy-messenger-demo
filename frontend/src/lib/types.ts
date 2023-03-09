export enum ExecutionStatus {
  WAITING_SLOT_FINALITY = "WAITING_SLOT_FINALITY",
  WAITING_LIGHT_CLIENT_UPDATE = "WAITING_LIGHT_CLIENT_UPDATE",
  WAITING_SAFETY_DELAY = "WAITING_SAFETY_DELAY",
  WAITING_RELAYER = "WAITING_RELAYER",
  EXECUTED_SUCCESS = "EXECUTED_SUCCESS",
  EXECUTED_FAIL = "EXECUTED_FAIL", // relayed but call handleTelepathy reverted
  UNKNOWN = "UNKNOWN",
  // TODO: for messages that are WAITING_RELAYER, we can check if the target chain is frozen with ethers
  // TARGET_CHAIN_FROZEN = "TARGET_CHAIN_FROZEN",
}

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

// From .graphclient
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type SentMessage = {
  id: Scalars["Bytes"];
  version: Scalars["Int"];
  msgHash: Scalars["Bytes"];
  message: Scalars["Bytes"];
  messageNonce: Scalars["BigInt"];
  messageSenderChainID: Scalars["BigInt"];
  messageSender: Scalars["Bytes"];
  messageReceiverChainID: Scalars["BigInt"];
  messageReceiver: Scalars["Bytes"];
  messageData: Scalars["Bytes"];
  transactionOrigin: Scalars["Bytes"];
  blockNumber: Scalars["BigInt"];
  blockTimestamp: Scalars["BigInt"];
  transactionHash: Scalars["Bytes"];
};

export type ExecutedMessage = {
  id: Scalars["Bytes"];
  version: Scalars["Int"];
  msgHash: Scalars["Bytes"];
  message: Scalars["Bytes"];
  messageNonce: Scalars["BigInt"];
  messageSenderChainID: Scalars["BigInt"];
  messageSender: Scalars["Bytes"];
  messageReceiverChainID: Scalars["BigInt"];
  messageReceiver: Scalars["Bytes"];
  messageData: Scalars["Bytes"];
  status: Scalars["Boolean"];
  transactionOrigin: Scalars["Bytes"];
  blockNumber: Scalars["BigInt"];
  blockTimestamp: Scalars["BigInt"];
  transactionHash: Scalars["Bytes"];
};
