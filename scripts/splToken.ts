import { createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID, transfer } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { convertStringToArray } from "../utils/general";

require('dotenv').config()

const createToken = async (mintWallet: Keypair) => {
    const connection = new Connection('http://localhost:8899', "confirmed");
    const token = await createMint(connection, mintWallet, mintWallet.publicKey, null, 9)
    return token;
}

const getTokenBalance = async (connection: Connection, tokenAccount: PublicKey) => {
    const balance = await connection.getTokenAccountBalance(tokenAccount);
    return balance.value.amount; 
}

const transferToken = async (token: PublicKey, fromWallet: Keypair, toWallet: PublicKey) => {
    const connection = new Connection('http://localhost:8899', "confirmed");
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        token,
        fromWallet.publicKey
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, token, toWallet);

    console.log("Balance before transfer:");
    console.log("From wallet balance:", await getTokenBalance(connection, fromTokenAccount.address));
    console.log("To wallet balance:", await getTokenBalance(connection, toTokenAccount.address));

    let signature = await mintTo(
        connection,
        fromWallet,
        token,
        fromTokenAccount.address,
        fromWallet.publicKey,
        2000000000
    );
    console.log('mint tx:', signature);

    signature = await transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        50
    );

    console.log('transfer tx:', signature);
    
    console.log("Balance after transfer:");
    console.log("From wallet balance:", await getTokenBalance(connection, fromTokenAccount.address));
    console.log("To wallet balance:", await getTokenBalance(connection, toTokenAccount.address));
}

(async function main() {
    const secret = Uint8Array.from(convertStringToArray(process.env.SECRET as string));
    const mintWallet = Keypair.fromSecretKey(secret);
    const token = await createToken(mintWallet);
    const toWallet = Keypair.generate();

    await transferToken(token, mintWallet, toWallet.publicKey)
    console.log("Token address: ", token.toBase58());
    console.log("Receiver address: ", toWallet.publicKey.toBase58());
})();

