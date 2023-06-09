import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Contract from "../Contract.json";
import { ethers } from "ethers";

const ConfirmNFT = ({ address, network }) => {
  const [hasNFT, setHasNFT] = useState(false);
  const navigate = useNavigate();

  async function checkNFT() {
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

      const supply = await contract.totalSupply();

      if (supply > 0) {
        setHasNFT(true);

        setTimeout(() => {
          navigate("/Dashboard");
        }, 10000);
      } else {
        setHasNFT(false);
      }
    } catch (error) {
      console.error("Error retrieving total supply:", error);
    }
  }

  return (
    <div>
      <button onClick={checkNFT}>Check NFT</button>
      {hasNFT ? (
        <p>You own a Project Management NFT! Well done!</p>
      ) : (
        <p>You don't own a Project Management NFT yet :(</p>
      )}
    </div>
  );
};

export default ConfirmNFT;
