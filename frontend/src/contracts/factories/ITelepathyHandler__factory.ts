/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ITelepathyHandler,
  ITelepathyHandlerInterface,
} from "../ITelepathyHandler";

const _abi = [
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
] as const;

export class ITelepathyHandler__factory {
  static readonly abi = _abi;
  static createInterface(): ITelepathyHandlerInterface {
    return new utils.Interface(_abi) as ITelepathyHandlerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ITelepathyHandler {
    return new Contract(address, _abi, signerOrProvider) as ITelepathyHandler;
  }
}
