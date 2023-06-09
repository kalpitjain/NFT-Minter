import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Contract from "../Contract.json";
import FlipCard, { BackCard, FrontCard } from "../components/Flipcard";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

function App() {
  const [mounted, setMounted] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [isMintLoading, setIsMintLoading] = useState(false);
  const [isMintStarted, setIsMintStarted] = useState(false);
  const [mintHash, setMintHash] = useState("");
  const [totalMinted, setTotalMinted] = useState(0n);
  const { isConnected, address } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    isConnected && getTotalSupply();
  }, []);

  async function mint(mintAmount) {
    setIsMintLoading(true);

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
      } else if (chainId === 5) {
        appContract = {
          contractAddress: Contract.GoerliContractAddresss,
          contractAbi: Contract.abi,
        };
      } else {
        throw new Error("Unsupported chain ID");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        appContract.contractAddress,
        appContract.contractAbi,
        signer
      );

      const tx = await contract.mint(mintAmount, { gasLimit: 300000 });

      setIsMintLoading(false);
      setIsMintStarted(true);

      await tx.wait();

      setIsMintStarted(true);
      setIsMinted(true);
      setMintHash(tx.hash);

      if (tx.type === 2) {
        setTotalMinted((prev) => prev.toNumber() + 1);

        setTimeout(() => {
          navigate("/Hello");
        }, 10000);
      } else {
        setIsMintStarted(false);
        setIsMinted(false);
        alert("Something Went Wrong! Please try once again.");
      }
    } catch (error) {
      setIsMintStarted(false);
      setIsMinted(false);
      console.error("Error during minting:", error);
      alert("Something Went Wrong! Please try once again.");
    }
  }

  async function getTotalSupply() {
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

      setTotalMinted(supply);
    } catch (error) {
      console.error("Error retrieving total supply:", error);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div style={{ flex: "1 1 auto" }}>
          <div style={{ padding: "24px 24px 24px 0" }}>
            <h1>Project Management NFT</h1>
            <p style={{ margin: "12px 0 24px" }}>
              {Number(totalMinted)} minted so far!
            </p>
            <ConnectButton showBalance={false} chainStatus="icon" />

            {mounted && isConnected && !isMinted && (
              <button
                style={{ marginTop: 24 }}
                disabled={!mint || isMintLoading || isMintStarted}
                className="button"
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
                onClick={() => mint(1)}
              >
                {isMintLoading && "Waiting for approval"}
                {isMintStarted && "Minting..."}
                {!isMintLoading && !isMintStarted && "Mint"}
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: "0 0 auto" }}>
          <FlipCard>
            <FrontCard isCardFlipped={isMinted}>
              <img
                layout="responsive"
                src="../nft.png"
                width={300}
                height={300}
                alt="RainbowKit Demo NFT"
              />
            </FrontCard>

            <BackCard isCardFlipped={isMinted}>
              <div style={{ padding: 24 }}>
                <img
                  src="../nft.png"
                  width={80}
                  height={80}
                  alt="RainbowKit Demo NFT"
                  style={{ borderRadius: 8 }}
                />
                <h2 style={{ marginTop: 24, marginBottom: 6 }}>NFT Minted!</h2>
                <p style={{ marginBottom: 24 }}>
                  Your NFT will show up in your wallet in the next few minutes.
                </p>
                <p style={{ marginBottom: 6 }}>
                  View on{" "}
                  <a href={`https://mumbai.polygonscan.com/tx/${mintHash}`}>
                    Polygonscan
                  </a>
                </p>
                <p>
                  View on{" "}
                  <a
                    href={`https://testnets.opensea.io/assets/polygon/${address?.to}/1`}
                  >
                    Opensea
                  </a>
                </p>
              </div>
            </BackCard>
          </FlipCard>
        </div>
      </div>
    </div>
  );
}

export default App;
