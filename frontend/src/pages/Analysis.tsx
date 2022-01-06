/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-duplicate-imports */
import React, { useContext, useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import "./Analysis.css";
import { useParams } from "react-router-dom";
import { nameMap } from "../CoinData";
import axios from "axios";
import {
  exampleData,
  initalData,
} from "../exampleData/ExampleDetailedAnalysis";
import PriceHistoryGraph from "../components/PriceHistoryGraph";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
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
  marketDominationPercentage: number;
  activeAddresses: number;
  transactions24h: number;
  transactionFee24h: number;
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

const priceInfoNames: { [name: string]: string } = {
  high24h: "24 Hour High",
  low24h: "24 Hour Low",
  high1y: "1Y High",
  low1y: "1Y LOW",
  change1y: "1Y Change",
  change24h: "24 Hour Change",
  volume24h: "24 Hour Volume",
  marketCap: "Market Cap",
};

const futureNames: { [name: string]: string[] } = {
  perpetualPrice: ["Perpetual Price", "EXPLANATION NEEDED"],
  fundingRate: ["Funding Rate", "EXPLANATION NEEDED"],
  basis: ["Basis", "EXPLANATION NEEDED"],
  openInterest: ["Open Interest", "EXPLANANTION NEEDED"],
};

const curInfoNames: { [name: string]: string[] } = {
  currentSupply: ["Current Supply", "EXPLAIN"],
  totalSupply: ["Total Supply", "EXPLAIN"],
  transactionsPerSecond: ["Transactions Per Second", ""],
  totalTransactions: ["Total Transactions", ""],
  marketDominationPercentage: ["Market Domination Percentage", "EXPLAIN"],
  activeAddresses: ["Active Addresses", "EXPLAIN"],
  transactions24h: ["Daily Transactions", "EXPLAIN"],
  transactionFee24h: ["Daily Transaction Fee", "EXPLAIN"],
};

export const PairContext = React.createContext<string>("");
const SubAnalysis = () => {
  const pair = useContext(PairContext);
  const [currencyInfo, setCurrencyInfo] = useState<data>(exampleData);

  const currencyInfoAddr = `http://${window.location.hostname}:8000/api/general-info/${pair}`;

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
        <PriceHistoryGraph />
        <div className="coin-summary">
          <h2 className="summary-title">Price Information</h2>
          <div className="price-info-columns">
            {Object.entries(currencyInfo.priceInformation).map(
              ([name, value], idx) => {
                return (
                  <h3 key={idx}>
                    {priceInfoNames[name]}: {value.toLocaleString("en-UK")}
                  </h3>
                );
              }
            )}
          </div>
        </div>
        <div className="coin-summary">
          <h2 className="summary-title">Future Information</h2>
          <div className="price-info-columns">
            {Object.entries(currencyInfo.futureInformation).map(
              ([name, value], idx) => {
                const tooltip = (
                  <Tooltip id="button-tooltip">{futureNames[name][1]}</Tooltip>
                );
                return (
                  <OverlayTrigger
                    key={idx}
                    placement="bottom"
                    overlay={tooltip}
                  >
                    <h3>
                      {futureNames[name][0]}: {value.toLocaleString("en-UK")}
                    </h3>
                  </OverlayTrigger>
                );
              }
            )}
          </div>
        </div>
        <div className="coin-summary">
          <h2 className="summary-title">Currency Information</h2>
          <div className="price-info-columns">
            {Object.entries(currencyInfo.currencyInformation).map(
              ([name, value], idx) => {
                const [fullName, toolTip] = curInfoNames[name];
                const percentValue = value * 100;
                const string =
                  fullName === "Market Domination Percentage"
                    ? `${percentValue} %`
                    : value;
                const text = (
                  <h3 key={idx}>
                    {curInfoNames[name][0]}: {string}
                  </h3>
                );
                if (toolTip === "") {
                  return text;
                }
                const toolTipC = (
                  <Tooltip id="button-tooltip">{curInfoNames[name][1]}</Tooltip>
                );
                return (
                  <OverlayTrigger key={idx} placement="top" overlay={toolTipC}>
                    {text}
                  </OverlayTrigger>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function Analysis(): JSX.Element {
  const { pair } = useParams<paramType>();

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
