import { createContext, useContext, useState, ReactNode } from "react";
import { Client } from "@hashgraph/sdk";  // Hedera SDK

interface HederaContextType {
  client: Client | null;
  connectWallet: () => Promise<void>;
  signTransaction: (transaction: string) => Promise<string>;
  snapInstalled: boolean;
  transactionStatus: string | null;
  isLoading: boolean;
  error: string | null;
  handleSnapAPIRequest: () => Promise<void>; // Include handleSnapAPIRequest
}

const HederaContext = createContext<HederaContextType | undefined>(undefined);

const snapId = `npm:@hashgraph/hedera-wallet-snap`;

export const HederaProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snapInstalled, setSnapInstalled] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

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

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = await getProvider();
      const hederaClient = Client.forTestnet(); // Testnet setup
      setClient(hederaClient);

      let snaps = await provider.request({
        method: "wallet_getSnaps"
      });

      const result = await provider.request({
        method: "wallet_requestSnaps",
        params: {
          [snapId]: {}
        }
      });

      snaps = await provider.request({
        method: "wallet_getSnaps"
      });

      if (snapId in snaps) {
        console.log("Hedera Wallet Snap is installed");
        setSnapInstalled(true);
      } else {
        throw new Error("Hedera Wallet Snap is not installed.");
      }
    } catch (e) {
      console.log(`Failed to connect: ${e.message}`);
      setError(`Failed to connect: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signTransaction = async (transaction: string) => {
    if (!client) throw new Error("Client is not connected");
    // Example: const txResponse = await client.submitTransaction(transaction);
    return "signed_transaction"; // Placeholder response
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
    <HederaContext.Provider
      value={{
        client,
        connectWallet,
        signTransaction,
        snapInstalled,
        transactionStatus,
        isLoading,
        error,
        handleSnapAPIRequest // Include handleSnapAPIRequest here
      }}
    >
      {children}
    </HederaContext.Provider>
  );
};

export const useHedera = () => {
  const context = useContext(HederaContext);
  if (!context) throw new Error("useHedera must be used within a HederaProvider");
  return context;
};
