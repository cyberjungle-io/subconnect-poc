// polkadotExtension.js
import { web3Enable, web3Accounts, web3FromSource } from '@polkadot/extension-dapp';
import { signatureVerify } from '@polkadot/util-crypto';

function verifySignature(message, signature, address) {
    const { isValid } = signatureVerify(message, signature, address);
    return isValid;
}

export async function getAccounts(appName) {
    // Request access to the user's Polkadot.js extension accounts
    const injected = await web3Enable(appName);

    if (injected.length === 0) {
        console.log('No extension found');
        return [];
    }

    // Get all the accounts in the user's Polkadot.js extension
    const accounts = await web3Accounts();
    if (accounts.length === 0) {
        console.log('No accounts found');
        return [];
    }
    
    return accounts;
}

export async function signTransaction(account, transaction) {
    // Get the injector for the given account
    const injector = await web3FromSource(account.meta.source);

    // Sign the transaction payload
    const signedTransaction = await injector.signer.signPayload({
        address: account.address,
        ...transaction,
    });

    return signedTransaction;
}

export async function verifyMessage(message, signature, address) {
    return verifySignature(message, signature, address);
}