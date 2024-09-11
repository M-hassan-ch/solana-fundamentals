import { PublicKey, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

export async function airdrop(address: string, amount: number) {
    const publicKey = new PublicKey(address);
    const connection = new Connection('http://localhost:8899', "confirmed");
    const txSignature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);
    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txSignature,
    });
    console.log({txSignature});
}

const address = 'HGrc1mjtm3wB9KQHb1L1FCM7C3hqV7uauqgdjx2VNqaH';
const amount = 4;
airdrop(address, amount);