import React from "react";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
// import ConfirmNFT from "../CheckNFT/confirmnft";
import ConfirmNFT from "./ConfirmNFT";

const CheckNFT = () => {
  const { address } = useAccount();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
      // style={{ maxWidth: "1000px", width: "100%" }}
      >
        {/* <ConnectButton showBalance={false} chainStatus="none" /> */}
        {address && <ConfirmNFT />}
      </div>
    </div>
  );
};

export default CheckNFT;
