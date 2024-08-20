import { ethers } from "ethers";
import { providers } from 'ethers'; 

import idapp from "./HederaIdentiFi.json";

export const contract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;
  if (ethereum) {
    const signer = provider.getSigner();
    const contractReader = new ethers.Contract(
      "0xe0266566d99d2e542009c39727a7c6e74565ff94",
      idapp.abi,
      signer
    );

    return contractReader;
  }
};