import React, { useState } from "react";
import SideBar from "../components/SideBar";
import "./Analysis.css";
import { useParams } from "react-router-dom";

interface paramType {
  pair: string;
}

const pairNameMap: { [pairName: string]: string } = { "BTC-USDT": "Bitcoin" };

export const PairContext = React.createContext<string>("");

const Arbitrage = () => {
  return <div className="main-content-box"></div>;
};

const SubAnalysis = () => {
  return <div className="main-content-box"></div>;
};

const Analysis = () => {
  const { pair } = useParams<paramType>();
  const [showArbitrage, setShowArbitrage] = useState(false);
  const disabledButtonStyle = {
    background: "rgba(0, 0, 0, 0.1)",
    cursor: "auto",
  };

  return (
    <PairContext.Provider value={pair}>
      <div className="analysis-page-box">
        <div className="analysis-title-box">
          <SideBar addr="detailed Analysis" />
          <h2 className="analysis-page-title">
            {pairNameMap[pair] || "Update Pair Name Map"}
          </h2>
        </div>
        <div className="analysis-content-box">
          <div className="tab-container">
            <div
              className="tab"
              style={showArbitrage ? {} : disabledButtonStyle}
              onClick={() => {
                if (showArbitrage) {
                  setShowArbitrage(false);
                }
              }}
            >
              Analysis
            </div>
            <div
              className="tab"
              style={showArbitrage ? disabledButtonStyle : {}}
              onClick={() => {
                if (!showArbitrage) {
                  setShowArbitrage(true);
                }
              }}
            >
              Arbitrage
            </div>
          </div>
          {showArbitrage ? <Arbitrage /> : <SubAnalysis />}
        </div>
      </div>
    </PairContext.Provider>
  );
};

export default Analysis;
