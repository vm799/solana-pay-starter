
import React, { useState, useEffect, useMemo } from "react";
import { Keypair, Transaction  } from "@solana/web3.js";
import { findReference, FindReferenceError } from "@solana/pay";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { InfinitySpin } from "react-loader-spinner";
import IPFSDownload from "./IpfsDownload";
import { addOrder, hasPurchased, fetchItem } from "../lib/api";


const STATUS = {
    Initial: "Initial",
    Submitted: "Submitted",
    Paid: "Paid",
  };

export default function Buy({ itemID }){
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const orderID = useMemo(() => Keypair.generate().publicKey, []);

    // const [paid, setPaid] = useState(null);
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(STATUS.Initial);

// useMemo hook only starts working if dependencies change
    const order = useMemo(
        () => ({
            buyer:publicKey.toString(),
            orderID: orderID.toString(),
            itemID: itemID,
        }),
        [publicKey, orderID, itemID]
    );

    const processTransaction = async () => {
        setLoading(true);
        const txResponse = await fetch("../api/createTransaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
        });
        const txData = await txResponse.json();

        const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
        console.log("Tx data is", tx);

    try {
        const txHash = await sendTransaction(tx, connection);
        console.log(`Transaction sent://solscan.io/tx/${txHash}?cluster=devnet`);
        setStatus(STATUS.Submitted);
    } catch (error){
        console.error(error);
    } finally {
        setLoading(false);
    }
    };


    useEffect(() => {
        async function checkPurchased() {
            const purchased = await hasPurchased(publicKey, itemID);
            if (purchased) {
                setStatus(STATUS.Paid);
                const item = await fetchItem(itemID);
                setItem(item);
            }
        }
    checkPurchased();
}, [publicKey, itemID]);

    useEffect(() => {
        if (status === STATUS.Submitted){
            setLoading(true);
            const interval = setInterval(async () => {
            try {
            const result = await findReference(connection, orderID);
            console.log("Finding tx reference", result.confirmationStatus);
            if (
                result.confirmationStatus === "confirmed" || 
                result.confirmationStatus === "finalised"
               ) {
                clearInterval(interval);
                setStatus(STATUS.Paid);
                setLoading(false);
                addOrder(order);
                alert("Thank you for your purchase! We hope you enjoy it");
            }
        } catch (e) {
            if (e instanceof FindReferenceError){
                return null;
            }
            console.error("Unknown error", e);
        } finally {
            setLoading(false);
        }
    }, 1000);
    return () => {
        clearInterval(interval);
    };
}

async function getItem(itemID) {
    const item = await fetchItem(itemID);
    setItem(item);
}

if (status === STATUS.Paid) {
    getItem(itemID);
 }
}, [status]);

    if (!publicKey) {
        return (
            <div>
                <p>You need to connect your wallet to make a transaction</p>
            </div>
        );
    }

    if (loading) {
        return <InfinitySpin color="gray" />;
    }

    return (
        <div>
            {status === STATUS.Paid ? (
                <IPFSDownload 
                filename={item.filename} 
                hash={item.hash} 
               
                />
                ) : (
                <button 
                disabled={loading}  
                className="buy-button" 
                onClick={processTransaction}
                >
                    Buy Now 🥷🏽
                </button>
            )}
        </div>
    );
}