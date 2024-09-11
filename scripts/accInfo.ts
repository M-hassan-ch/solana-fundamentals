import { PublicKey, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

export async function accInfo(address: string) {
    const publicKey = new PublicKey(address);
    const connection = new Connection('http://localhost:8899', "confirmed");
    const info = await connection.getAccountInfo(publicKey);
    if (info) {
        // console.log({ info });
        const accBalance = info?.lamports / LAMPORTS_PER_SOL;
        console.log(address, ':',  accBalance);
        return accBalance
    }
}

// const address = 'HGrc1mjtm3wB9KQHb1L1FCM7C3hqV7uauqgdjx2VNqaH';
// accInfo(address);