// polkadotExtension.js
import {
  web3Enable,
  web3Accounts,
  web3FromAddress
} from "@polkadot/extension-dapp";

import { signatureVerify, decodeAddress } from "@polkadot/util-crypto";
import { u8aToHex, stringToU8a, hexToU8a } from "@polkadot/util";
import { cryptoWaitReady } from '@polkadot/util-crypto';


export function verifySignature(message, signature, address) {
  const { isValid } = signatureVerify(message, signature, address);
  return isValid;
}

export async function getAccounts(appName) {
  // Request access to the user's Polkadot.js extension accounts
  const injected = await web3Enable(appName);

  if (injected.length === 0) {
    console.log("No extension found");
    return [];
  }

  // Get all the accounts in the user's Polkadot.js extension
  const accounts = await web3Accounts();
  if (accounts.length === 0) {
    console.log("No accounts found");
    return [];
  }

  return accounts;
}

export async function signTransaction(account, message, appName) {
    const injected = await web3Enable(appName);
    const injector = await web3FromAddress(account);
    const signRaw = injector?.signer?.signRaw;

    if (signRaw) {
      try {
        const { signature } = await signRaw({
          address: account,
          data: message,
          type: 'bytes'
        });
        return signature
      } catch (error) {
        console.error('Failed to sign message:', error);
        alert('Failed to sign message');
      }
    }
}

export const isValidSignature = async (signedMessage, signature, address) => {
    const publicKey = decodeAddress(address);
    const hexPublicKey = u8aToHex(publicKey);
    await cryptoWaitReady();
    return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
  };
