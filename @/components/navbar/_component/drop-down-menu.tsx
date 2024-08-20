"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import { getUserByAddress } from "utils/queries";
import { HederaWalletSnap } from "@hashgraph/hedera-wallet-snap";

// Define the snap ID
const snapId = `npm:@hashgraph/hedera-wallet-snap`;

interface DropDownMenuProps {
  onClose: () => void;
}

const DropdownMenu: React.FC<DropDownMenuProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        setIsAuthenticated(true); // Mark as authenticated if snap is installed
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
    setIsLoading(true);
    try {
      await connect(); // Use the connect function to install and connect the snap
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setIsAuthenticated(false);
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
      if (response_str && response_str !== "null") {
        alert(response_str);
      }
    } catch (err) {
      console.error(err);
      alert("Error while interacting with the snap: " + err.message || err);
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      let userInfo = (await getUserByAddress("0x0")) as any; // Default to "0x0" if not authenticated
      setUserInfo(userInfo);
    };

    getUserInfo();
  }, [isAuthenticated]);

  return (
    <div className="w-screen h-screen bg-white px-2 items-center justify-center absolute right-0 xl:hidden">
      <Accordion
        defaultValue="item-1"
        className="pl-2"
        type="single"
        collapsible
      >
        <Link
          href={"/"}
          className="flex flex-1 items-center justify-between mt-11 pt-2 py-4 border-b"
        >
          Home
        </Link>

        <Link
          href={"/jobs"}
          className="flex flex-1 items-center justify-between border-b py-4"
        >
          Jobs
        </Link>

        <Link
          href={"/verify-identity"}
          className="flex flex-1 items-center justify-between py-4 border-b"
        >
          Verify Identity
        </Link>
      </Accordion>

      <div className="pt-12">
        <div className="space-y-4 flex flex-col px-4">
          {isAuthenticated && userInfo !== "User does not exist." ? (
            <Link href={"/dashboard"}>
              <Button className="w-full">
                Dashboard
              </Button>
            </Link>
          ) : isAuthenticated && userInfo === "User does not exist." ? (
            <Link href={"/onboard"}>
              <Button variant={"outline"} className="w-full">
                Get DID
              </Button>
            </Link>
          ) : (
            ""
          )}
          {isAuthenticated ? (
            <Button variant={"outline"} onClick={handleDisconnect} className="w-full">
              Disconnect
            </Button>
          ) : (
            <Button variant={"outline"} onClick={handleConnectWallet} className="w-full" disabled={isLoading}>
              {isLoading ? "Connecting..." : "Connect"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
