
import { createContext, useContext, useState, ReactNode } from "react";
import { Client } from "@hashgraph/sdk";  // Hedera SDK

interface HederaContextType {
  client: Client | null;
  connectWallet: () => Promise<void>;
  signTransaction: (transaction: string) => Promise<string>;
}

const HederaContext = createContext<HederaContextType | undefined>(undefined);

export const HederaProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<Client | null>(null);

  const connectWallet = async () => {
    // Implement MetaMask Snap connection logic
    const hederaClient = Client.forTestnet(); // Testnet setup
    setClient(hederaClient);
  };

  const signTransaction = async (transaction: string) => {
    if (!client) throw new Error("Client is not connected");
    // Signing logic using Hedera SDK
    // Example: const txResponse = await client.submitTransaction(transaction);
    return "signed_transaction"; // Placeholder response
  };

  return (
    <HederaContext.Provider value={{ client, connectWallet, signTransaction }}>
      {children}
    </HederaContext.Provider>
  );
};

export const useHedera = () => {
  const context = useContext(HederaContext);
  if (!context) throw new Error("useHedera must be used within a HederaProvider");
  return context;
};
