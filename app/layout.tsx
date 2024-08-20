"use client";
import { Outfit } from "next/font/google";
import "./globals.css";

import { useHedera, HederaProvider } from "./hederacontext";

// Initialize the font
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "700"] });

const Layout = ({ children }) => {
  const {
    connectWallet,
    handleSnapAPIRequest,
    snapInstalled,
    transactionStatus,
    isLoading,
    error,
  } = useHedera();

  return (
    <div className={outfit.className}>

      <button onClick={connectWallet} disabled={isLoading}>
        {isLoading ? "Connecting..." : "Connect to MetaMask"}
      </button>

      {snapInstalled && (
        <>
          <button onClick={handleSnapAPIRequest} disabled={isLoading}>
            {isLoading ? "Processing..." : "Invoke Snap 'Hello' API"}
          </button>
          {transactionStatus && <pre>{transactionStatus}</pre>}
        </>
      )}

      {children}
    </div>
  );
};

const AppLayout = ({ children }) => (
  <HederaProvider>
    <Layout>{children}</Layout>
  </HederaProvider>
);

export default AppLayout;
