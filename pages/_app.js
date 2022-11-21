import React, { useMemo } from "react";
// loads if dependcies change
import "../styles/globals.css";
import "../styles/App.css";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
// a loopable/enumerable object for network
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
// prompt to select wallet
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
// RPC enpoint communicates directly to solana nodes
// standard interface for connecting to wallets

import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { clusterApiUrl } from "@solana/web3.js";
// generates a RPC
import "@solana/wallet-adapter-react-ui/styles.css";

const App = ({ Component, pageProps }) => {

  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(()=> clusterApiUrl(network), [network]);
  
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new GlowWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new TorusWalletAdapter(),
  ],
  [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
         <Component {...pageProps} />
        </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
