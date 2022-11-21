import React, { useEffect, useState } from 'react';
import Product  from "../components/Product";

// import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
// import dynamic from "next/dynamic";
// import HeadComponent from '../components/Head';
// import { useEffect, useState } from "react/cjs/react.production.min";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
const { publicKey } = useWallet();
const [products, setProducts] = useState([]);

useEffect(() => {
if (publicKey) {
  fetch(`/api/fetchProducts`)
  .then(response => response.json())
  .then(data => {
    setProducts(data);
    console.log("Products", data);
  });
}
}, [publicKey]);

  // const WalletMultiButtonDynamic = dynamic(
  //   async () => 
  //   (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  //   { ssr:false }
  // );

  
  const renderNotConnectedContainer = () => (
    <div>
      {/* <img src="https://media.giphy.com/media/jzHFPlw89eTqU/giphy.gif" alt="emoji" /> */}
      <div className="button-container">
        <WalletMultiButton className="cta-button connect-wallet-button" />
        </div>    
    </div>
  );

  const renderItemBuyContainer = () => {
    <div className="products-container">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  }
  
  return (
    <div className="App">
      {/* <HeadComponent/> */}
      <div className="container">
        <header className="header-container">
        <p className="sub-text">The only emoji🤓🥷🏽 😈  store that accepts sh*tcoins</p>

          <p className="header"> Buildspace X vm. emoji</p>
        </header>

        <main>
          
 {/* We only render the connect button if public key doesn't exist */}
 {publicKey ? renderItemBuyContainer(): renderNotConnectedContainer()}
        </main>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
