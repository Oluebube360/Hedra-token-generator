import { useEffect, useState } from "react";
import { HederaProvider } from "./hederacontext";  // Ensure the path is correct

const snapId = `npm:@hashgraph/hedera-wallet-snap`;

const Layout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snapInstalled, setSnapInstalled] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

  // Detects MetaMask and its providers
  const getProvider = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    let mmFound = false;
    if ("detected" in window.ethereum) {
      for (const provider of window.ethereum.detected) {
        try {
          await provider.request({
            method: "wallet_getSnaps"
          });
          window.ethereum.setProvider(provider);
          mmFound = true;
          return provider;
        } catch {
          // no-op
        }
      }
    }
    if (!mmFound && "providers" in window.ethereum) {
      for (const provider of window.ethereum.providers) {
        try {
          await provider.request({
            method: "wallet_getSnaps"
          });
          window.ethereum = provider;
          mmFound = true;
          return provider;
        } catch {
          // no-op
        }
      }
    }
    return window.ethereum;
  };

  const connect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = await getProvider();
      let snaps = await provider.request({
        method: "wallet_getSnaps"
      });
      console.log("Installed snaps: ", snaps);

      const result = await provider.request({
        method: "wallet_requestSnaps",
        params: {
          [snapId]: {}
        }
      });
      console.log("Snap request result: ", result);

      snaps = await provider.request({
        method: "wallet_getSnaps"
      });
      console.log("Snaps after request: ", snaps);

      if (snapId in snaps) {
        console.log("Hedera Wallet Snap is installed");
        setSnapInstalled(true);
      } else {
        throw new Error(
          "Hedera Wallet Snap is not installed. Please install it at https://snaps.metamask.io/snap/npm/hashgraph/hedera-wallet-snap"
        );
      }
    } catch (e) {
      console.log(`Failed to obtain installed snaps: ${JSON.stringify(e, null, 4)}`);
      setError(`Failed to obtain installed snaps: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnapAPIRequest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = await getProvider();
      const response = await provider.request({
        method: "wallet_invokeSnap",
        params: {
          snapId,
          request: { method: "hello", params: { network: "testnet" } }
        }
      });
      const response_str = JSON.stringify(response, null, 4);
      console.log("Snap API response: ", response_str);
      setTransactionStatus(response_str);
    } catch (err) {
      console.error("Error while interacting with the snap: ", err);
      setError("Error while interacting with the snap: " + (err.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Welcome to Your dApp</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={connect} disabled={isLoading}>
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

export default function AppLayout({ children }) {
  return (
    <HederaProvider>
      <Layout>{children}</Layout>
    </HederaProvider>
  );
}
