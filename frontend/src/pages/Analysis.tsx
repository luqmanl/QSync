/* eslint-disable no-duplicate-imports */
import React, { useContext, useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import "./Analysis.css";
import { useParams } from "react-router-dom";
import { nameMap, coinSummary } from "../CoinData";
import StandardLineChart from "../components/StandardLineChart";
import { Button } from "react-bootstrap";
import axios from "axios";

interface paramType {
  pair: string;
}

interface graphPoint {
  x: number;
  y: number;
}

export const PairContext = React.createContext<string>("");

const Arbitrage = () => {
  return <div className="main-content-box"></div>;
};

const SubAnalysis = () => {
  const pair = useContext(PairContext);
  const [data, setData] = useState<graphPoint[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState(0);

  const timePeriods = ["1D", "7D", "1M", "3M", "1Y", "all"];
  const endpoint = "/api/prices/fdfdsjk";
  const addr = `http://${
    process.env.PUBLIC_URL || "localhost:8000"
  }/${endpoint}/${timePeriods[selectedPeriod]}`;

  useEffect(() => {
    axios
      .get(addr)
      .then((res) => {
        const { prices } = res.data;
        setData(prices);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedPeriod]);

  return (
    <div
      className="main-content-box"
      style={{ display: "grid", gridTemplateColumns: "50% 50%" }}
    >
      <div className="coin-summary">
        <h2 className="summary-title">General Info</h2>
        <p>
          {coinSummary[pair] || `COIN SUMMARY NEEDED FOR ${nameMap[pair]}`}
        </p>{" "}
        {/* dev note*/}
      </div>
      <div className="his-price-graph-container">
        <StandardLineChart
          data={data}
          id="id"
          graphTitle={`Price of ${nameMap[pair]}`}
          xAxis="Price"
          yAxis="Time"
        />
        <div className="time-buttons-container">
          {timePeriods.map((period, idx) => {
            return (
              <Button
                key={idx}
                className="time-button"
                disabled={idx === selectedPeriod}
                onClick={() => {
                  setSelectedPeriod(idx);
                }}
                variant="dark"
              >
                {period}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
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
            {nameMap[pair] || "Update Pair Name Map"}
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
