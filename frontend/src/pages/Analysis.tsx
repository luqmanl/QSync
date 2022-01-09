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
  marketDominancePercentage: number;
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
  low1y: "1Y Low",
  change1y: "1Y Change",
  change24h: "24 Hour Change",
  volume24h: "24 Hour Volume",
  marketCap: "Market Cap",
};

const futureNames: { [name: string]: string[] } = {
  perpetualPrice: [
    "Perpetual Price",
    "Perepetuals are a type of derivative that are supported by some exchanges for some currencies. They provide an indication of where market participants believe the price of the underlying currency is heading.",
  ],
  fundingRate: [
    "Funding Rate",
    "Perpetual futures have a concept called funding rate, where buyers and sellers of the contracts have to periodically pay a fee to the counterparty depending on this funding rate.",
  ],
  basis: ["Basis", "Spot currency price - perpetual future price"],
  openInterest: [
    "Open Interest",
    "The number of contracts or commitments outstanding in futures and options trading on an official exchange at any one time.",
  ],
};

const curInfoNames: { [name: string]: string[] } = {
  currentSupply: [
    "Current Supply",
    "Current supply of this currency in circulation",
  ],
  totalSupply: [
    "Total Supply",
    "Maximum possible supply achievable for this currency. Note that some currencies do not have a maximum supply",
  ],
  transactionsPerSecond: [
    "Transactions Per Second",
    "Average transaction rate per second over the last 24 hours",
  ],
  totalTransactions: [
    "Total Transactions",
    "All time total number of transactions",
  ],
  marketDominancePercentage: [
    "Market Dominance Percentage",
    "This currency's market cap as a percentage of all cryptocurrency market caps.",
  ],
  activeAddresses: [
    "Active Addresses",
    "Addresses that have some unit of currency in them.",
  ],
  transactions24h: [
    "Daily Transactions",
    "Total number of transactions in the last 24 hours",
  ],
  transactionFee24h: [
    "Daily Transaction Fee",
    "Average transaction fee over the last 24 hours.",
  ],
};

export const PairContext = React.createContext<string>("");
const SubAnalysis = () => {
  const pair = useContext(PairContext);
  const [currencyInfo, setCurrencyInfo] = useState<data>(initalData);

  const currencyInfoAddr = `http://${window.location.hostname}/api/data/general-info/${pair.split("-")[0]}`;

  useEffect(() => {
    axios
      .get(currencyInfoAddr)
      .then((res) => {
        const { data } = res;
        setCurrencyInfo(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="main-content-box">
      <div className="analysis-column-left">
        <div className="price-chart">
          <h2 className="price-chart-title">
            {nameMap[pair] || "Update Pair Name Map"} to USDT Chart
          </h2>
          <p className="price-chart-desc">
            {" "}
            This shows the real-time price changes for{" "}
            {nameMap[pair] || "Update Pair Name Map"} to USDT over time
          </p>
          <PriceHistoryGraph />
        </div>
        <div className="orderbook">
          <OrderBookScatterGraph />
        </div>
      </div>
      <div className="analysis-column-right">
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

        <div className="coin-summary">
          <h2 className="summary-title">Price Information</h2>
          <div className="price-info-columns">
            {Object.entries(currencyInfo.priceInformation).map(
              ([name, value], idx) => {
                if (value === null) {
                  return (
                    <h4 key={idx}>
                      {priceInfoNames[name]}:{" -"}
                    </h4>
                  );
                }

                let displayString = `${value.toLocaleString("en-UK")}`;

                if (
                  name === "high24h" ||
                  name === "low24h" ||
                  name === "high1y" ||
                  name === "low1y" ||
                  name === "volume24h" ||
                  name === "marketCap"
                ) {
                  displayString = `$${value.toLocaleString("en-UK")}`;
                }

                if (name === "change1y" || name === "change24h") {
                  displayString = `${value.toLocaleString("en-UK")}%`;
                }

                return (
                  <h4 key={idx}>
                    {priceInfoNames[name]}: {displayString}
                  </h4>
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

                if (value === null) {
                  return (
                    <OverlayTrigger
                      key={idx}
                      placement="bottom"
                      overlay={tooltip}
                    >
                      <h4>
                        {futureNames[name][0]}: {"-"}
                      </h4>
                    </OverlayTrigger>
                  );
                }

                let displayString = `${value.toLocaleString("en-UK")}`;

                if (
                  name === "perpetualPrice" ||
                  name === "basis" ||
                  name === "openInterest"
                ) {
                  displayString = `$${value.toLocaleString("en-UK")}`;
                }

                if (name === "fundingRate") {
                  displayString = `${value.toLocaleString("en-UK")}%`;
                }

                return (
                  <OverlayTrigger
                    key={idx}
                    placement="bottom"
                    overlay={tooltip}
                  >
                    <h4>
                      {futureNames[name][0]}: {displayString}
                    </h4>
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
                if (value === null) {
                  return "-";
                }

                const [fullName, toolTip] = curInfoNames[name];
                const percentValue = value;
                let string: number | string = value;

                if (fullName === "Market Dominance Percentage") {
                  string = `${percentValue}%`;
                } else if (
                  fullName === "Daily Transaction Fee" ||
                  fullName === "Transactions Per Second"
                ) {
                  string = value === null ? "-" : value.toFixed(4);
                } else {
                  string = value;
                }

                const text = (
                  <h4 key={idx}>
                    {curInfoNames[name][0]}: {string}
                  </h4>
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
