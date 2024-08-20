import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { X, AlignJustify } from "lucide-react";
import { useHedera } from "app/hederacontext"; 
import { getUserByAddress } from "utils/queries";
import { HederaWalletSnap } from "@hashgraph/hedera-wallet-snap";


const snapId = `npm:@hashgraph/hedera-wallet-snap`;

const ActionButtons: React.FC = () => {
  const { connectWallet, snapInstalled, isLoading, client } = useHedera();

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState("");

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      if (snapInstalled) {
        try {
          const hederaSnap = new HederaWalletSnap();
          const accountId = await hederaSnap.getAccountId(); // Use Hedera Wallet Snap to get account ID

          if (accountId) {
            setAuthenticated(true);
            const userInfo = await getUserByAddress(accountId.toString());
            setUserInfo(userInfo);
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
        }
      }
    };

    checkAuthentication();
  }, [snapInstalled]);

  const getProvider = async () => {
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
    console.log("snap id", snapId);
    const provider = await getProvider();
    let snaps = await provider.request({
      method: "wallet_getSnaps"
    });
    console.log("Installed snaps: ", snaps);

    try {
      const result = await provider.request({
        method: "wallet_requestSnaps",
        params: {
          [snapId]: {}
        }
      });
      console.log("result: ", result);

      snaps = await provider.request({
        method: "wallet_getSnaps"
      });
      console.log("snaps: ", snaps);

      if (snapId in snaps) {
        console.log("Hedera Wallet Snap is installed");
        setAuthenticated(true); // Mark as authenticated if snap is installed
      } else {
        console.log(
          "Hedera Wallet Snap is not installed. Please install it at https://snaps.metamask.io/snap/npm/hashgraph/hedera-wallet-snap"
        );
        alert(
          "Hedera Wallet Snap is not installed. Please install it at https://snaps.metamask.io/snap/npm/hashgraph/hedera-wallet-snap"
        );
      }
    } catch (e) {
      console.log(
        `Failed to obtain installed snaps: ${JSON.stringify(e, null, 4)}`
      );
      alert(`Failed to obtain installed snaps: ${JSON.stringify(e, null, 4)}`);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connect(); // Use the connect function to install and connect the snap
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleDisconnect = () => {
    setAuthenticated(false);
    setUserInfo("");
  };

  const handleSnapAPIRequest = async () => {
    console.log("Interacting with 'hello' API of Hedera Wallet Snap");
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
      console.log("response: ", response_str);
      if (response_str && response_str != "null") {
        alert(response_str);
      }
    } catch (err) {
      console.error(err);
      alert("Error while interacting with the snap: " + err.message || err);
    }
  };

  return (
    <div className="pr-2">
      <div className="items-center justify-center flex">
        <div className="flex xl:space-x-4">
          {/* ... (rest of the desktop menu items remain unchanged) ... */}
        </div>
        <div className="flex lg:space-x-2 items-center pr-4">
          {/* ... (rest of the desktop buttons remain unchanged) ... */}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            {isDropdownVisible ? (
              <X className="h-5 w-5" />
            ) : (
              <AlignJustify className="h-6 w-6" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {authenticated && userInfo !== "User does not exist." && (
            <DropdownMenuItem>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
          )}
          {authenticated && userInfo === "User does not exist." && (
            <DropdownMenuItem>
              <Link href="/onboard">Get ID</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <Link href="/free">Free</Link>
          </DropdownMenuItem>
          {authenticated ? (
            <DropdownMenuItem onClick={handleDisconnect}>
              Disconnect
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleConnectWallet} disabled={isLoading}>
              {isLoading ? "Connecting..." : "Connect"}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionButtons;
