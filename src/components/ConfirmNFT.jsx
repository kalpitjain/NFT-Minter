import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Contract from "../Contract.json";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const ConfirmNFT = ({ address, network }) => {
  const { address: walletAddress } = useAccount();
  const [hasNFTs, setHasNFTs] = useState(false);
  const navigate = useNavigate();

  async function hasNFT() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const chainId = await provider
        .getNetwork()
        .then((network) => network.chainId);

      let appContract;

      if (chainId === 80001) {
        appContract = {
          contractAddress: Contract.MumbaiContractAddress,
          contractAbi: Contract.abi,
        };
      } else if (chainId === 97) {
        appContract = {
          contractAddress: Contract.BNBContractAddress,
          contractAbi: Contract.abi,
        };
      } else {
        appContract = {
          contractAddress: Contract.GoerliContractAddresss,
          contractAbi: Contract.abi,
        };
      }

      const contract = new ethers.Contract(
        appContract.contractAddress,
        appContract.contractAbi,
        provider
      );

      const supply = await contract.totalSupply(walletAddress);

      if (supply > 0) {
        setHasNFTs(true);
      }
    } catch (error) {
      console.error("Error retrieving total supply:", error);
    }
  }

  useEffect(() => {
    hasNFT();
  });

  // Check if user has a Project Management NFT, if so, redirect them to /dashboard/projects page after 10 seconds
  if (hasNFT) {
    setTimeout(() => {
      // navigate("/dashboard/projects");
      navigate("/Dashboard");
    }, 10000); // 10000 milliseconds = 10 seconds
  }

  return (
    <div>
      {hasNFT ? (
        <p>You own a Project Management NFT! Well done!</p>
      ) : (
        <p>You don't own a Project Management NFT yet :(</p>
      )}
    </div>
  );
};

export default ConfirmNFT;
