import { PublicKey, Connection, LAMPORTS_PER_SOL, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js";
import { accInfo } from "./accInfo";
import { convertStringToArray } from "../utils/general";

require('dotenv').config()

export async function transferSol(from: Keypair, to: PublicKey, amount: number) {
    const connection = new Connection('http://localhost:8899', "confirmed");
    const transaction = new Transaction();

    const instruction = SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: amount * LAMPORTS_PER_SOL
    })
    transaction.add(instruction);

    console.log("\nBalances before transfer");
    await accInfo(from.publicKey.toString());
    await accInfo(to.toString());

    const txSignature = await sendAndConfirmTransaction(connection, transaction, [from]);

    console.log("\nBalances after transfer");
    await accInfo(from.publicKey.toString());
    await accInfo(to.toString());

    console.log({ txSignature });
}

const secret = Uint8Array.from(convertStringToArray(process.env.SECRET as string));
const fromKeypair = Keypair.fromSecretKey(secret);
const toPublicKey = new PublicKey('EJSqMUibq3Xzg4p1Tq1W1QY5QTmB9DRx249druouSmBM');
const amountToTransfer = 10;

transferSol(fromKeypair, toPublicKey, amountToTransfer);