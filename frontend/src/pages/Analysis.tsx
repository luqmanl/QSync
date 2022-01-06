/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-duplicate-imports */
import React, { useContext, useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import "./Analysis.css";
import { useParams } from "react-router-dom";
import { nameMap } from "../CoinData";
import StandardLineChart from "../components/StandardLineChart";
import { Button } from "react-bootstrap";
import axios from "axios";
import {
  exampleData,
  initalData,
} from "../exampleData/ExampleDetailedAnalysis";
import PriceHistoryGraph from "../components/PriceHistoryGraph";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import BasisTable from "../components/BasisTable";
import OrderBookScatterGraph from "../components/OrderBookScatterGraph";

interface paramType {
  pair: string;
}
export interface graphPoint {
  x: number;
  y: number;
}

export type data = {
  generalInfoDescription: string;
  currencyCharacteristics: string[][];
  currencyInformation: currencyInformation;
  priceInformation: priceInformation;
  futureInformation: futuresInformation;
};

type currencyInformation = {
  currentSupply: number;
  totalSupply: number;
  transactionsPerSecond: number;
  totalTransactions: number;
  totalAddresses: number;
  activeAddresses: number;
  dailyTransactions: number;
  transactionFee: number;
};

type priceInformation = {
  high24h: number;
  low24h: number;
  high1y: number;
  low1y: number;
  change1y: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
};

type futuresInformation = {
  perpetualPrice: number;
  fundingRate: number;
  basis: number;
  openInterest: number;
};

export const PairContext = React.createContext<string>("");

const priceInfoNames = [
  "24H High",
  "24H Low",
  "1Y High",
  "1Y Low",
  "24H Change",
  "24H Volume",
  "1Y Change",
  "Market Cap",
];

const futureNames = [
  ["", "EXPLANATION NEEDED"],
  ["Perpetual Price", "EXPLANATION NEEDED"],
  ["Funding Rate", "EXPLANATION NEEDED"],
  ["Basis", "EXPLANATION NEEDED"],
  ["Open Interest", "EXPLANANTION NEEDED"],
];

const Arbitrage = () => {
  return (
    <div className="main-content-box">
      <div className="analysis-column">
        <div className="coin-summary">
          <h2 className="summary-title">Arbitrage Explained</h2>
          <p>INSERT EXPLANATION HERE</p>
        </div>
        <div style={{ height: "40vh" }}>
          <OrderBookScatterGraph />
        </div>
      </div>
      <div className="analysis-column">
        <BasisTable />
      </div>
    </div>
  );
};

const SubAnalysis = () => {
  const pair = useContext(PairContext);
  const [currencyInfo, setCurrencyInfo] = useState<data>(exampleData);

  const currencyInfoAddr = `http://${
    process.env.back || "localhost:8000"
  }/api/general-info/${pair}`;

  useEffect(() => {
    axios
      .get(currencyInfoAddr)
      .then((res) => {
        const { data } = res.data;
        setCurrencyInfo(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="main-content-box">
      <div className="analysis-column">
        <div className="coin-summary">
          <h2 className="summary-title">General Info</h2>
          <p>{currencyInfo.generalInfoDescription}</p>
          <div className="keyword-container">
            {currencyInfo.currencyCharacteristics.map((item, idx) => {
              const tooltip = <Tooltip id="button-tooltip">{item[1]}</Tooltip>;
              return (
                <OverlayTrigger key={idx} placement="top" overlay={tooltip}>
                  <div className="keyword">
                    <h4>{item[0]}</h4>
                  </div>
                </OverlayTrigger>
              );
            })}
          </div>
        </div>
        <OrderBookScatterGraph />
      </div>
      <div className="analysis-column">
        <div className="coin-summary">
          <h2 className="summary-title">Price Information</h2>
          <div className="price-info-columns">
            {Object.values(currencyInfo.priceInformation).map((item, idx) => {
              return (
                <h3 key={idx}>
                  {priceInfoNames[idx]}: {item.toLocaleString("en-UK")}
                </h3>
              );
            })}
          </div>
        </div>
        <div className="coin-summary">
          <h2 className="summary-title">Future Information</h2>
          <div className="price-info-columns">
            {Object.values(currencyInfo.futureInformation).map((item, idx) => {
              const tooltip = (
                <Tooltip id="button-tooltip">{futureNames[idx + 1][1]}</Tooltip>
              );
              return (
                <OverlayTrigger key={idx} placement="bottom" overlay={tooltip}>
                  <h3>
                    {futureNames[idx + 1][0]}: {item.toLocaleString("en-UK")}
                  </h3>
                </OverlayTrigger>
              );
            })}
          </div>
        </div>
        <PriceHistoryGraph />
      </div>
    </div>
  );
};

function Analysis(): JSX.Element {
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
            {nameMap[pair] || "Update Pair Name Map"}
          </h2>
        </div>
        <div className="analysis-content-box">
          <SubAnalysis />
        </div>
      </div>
    </PairContext.Provider>
  );
}

export default Analysis;
