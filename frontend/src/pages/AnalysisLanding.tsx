/* eslint-disable no-mixed-operators */
/* eslint-disable no-magic-numbers */
import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import "./AnalysisLanding.css";
import { Table, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Link } from "react-router-dom";
import { nameMap } from "../CoinData";

interface colour {
  red: number;
  green: number;
  blue: number;
}

const generateColourAnalysis = (value: number): colour => {
  if (value > 0) {
    return {
      red: 0,
      green: Math.min(255, 20 + 255 * value),
      blue: 0,
    };
  }

  return {
    red: Math.min(255, 20 + 255 * -value),
    green: 0,
    blue: 0,
  };
};

export type data = {
  currencyData: analysisRow[];
};

export type analysisRow = {
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  currentSupply: number;
  imbalance: number;
};

const AnalaysisLanding = () => {
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<{ [name: string]: analysisRow }>({});
  const tableColumns = [
    "Currency",
    "Price",
    "24H Change",
    "7D Change",
    "Market Cap",
    "Current Supply",
    "Order Book Imbalance",
  ];
  const columnExplanations = [
    "The name of the currency",
    "The current price of the currency",
    "The % change in price of the currency over the last 24 hours",
    "The % change in price of the currency over the last 7 days",
    "The number of coins in circulation multiplied by the value of a single coin",
    "The current amount of coins",
    "Difference in volume between bids and asks in the order book",
  ];

  const linkAddr = `ws://${
    process.env.back || "localhost:8000"
  }/ws/data/general-analysis-table/`;

  useEffect(() => {
    const ws = new WebSocket(linkAddr);
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          exchange: "BINANCE",
          pairs: ["BTC-USDT", "ETH-USDT", "ADA-USDT", "SOL-USDT", "DOGE-USDT"],
        })
      );
    };
    ws.addEventListener("message", (ev) => {
      if (loading) {
        setLoading(false);
        setAnalyses({});
      }
      const newData: data = JSON.parse(ev.data);
      const updated = analyses;
      newData.currencyData.forEach((e) => {
        updated[e.name] = e;
      });
      setAnalyses(updated);
    });
  }, []);

  return (
    <div className="landing-page-box">
      <div className="landing-title-box">
        <SideBar addr="detailed Analysis" />
        <h2 className="landing-title">Analysis</h2>
      </div>
      <div className="landing-main">
        <h2 className="table-title">Top Cryptocurrency Prices</h2>
        <p className="table-desc">
          Displaying live cryptocurrency prices with the top percentage changes
          in price
        </p>
        <Table className="landing-table">
          <thead>
            <tr>
              {tableColumns.map((name, idx) => {
                const tooltip = (
                  <Tooltip id="button-tooldtip">
                    {columnExplanations[idx]}
                  </Tooltip>
                );
                return (
                  <OverlayTrigger
                    key={idx}
                    placement="bottom"
                    overlay={tooltip}
                  >
                    {<th>{name}</th>}
                  </OverlayTrigger>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Object.entries(analyses).map(([name, data]) => {
              const colour24h = generateColourAnalysis(data.change24h * 100);
              const colour7d = generateColourAnalysis(data.change7d * 100);
              const link = `analysis/${data.name}`;
              return (
                <tr key={name} style={{ fontSize: "x-large" }}>
                  <Link
                    to={link}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {
                      <td>
                        {nameMap[data.name] ||
                          `UPDATE NAME MAP FOR ${data.name}`}
                      </td>
                    }
                  </Link>
                  <td>${data.price.toLocaleString("en-UK")}</td>
                  <td
                    style={{
                      color: `rgb(${colour24h.red},${colour24h.green},${colour24h.blue})`,
                    }}
                  >
                    {(data.change24h * 100).toFixed(3)}%
                  </td>
                  <td
                    style={{
                      color: `rgb(${colour7d.red},${colour7d.green},${colour24h.blue})`,
                    }}
                  >
                    {(data.change7d * 100).toFixed(3)}%
                  </td>
                  <td>${data.marketCap.toLocaleString("en-UK")}</td>
                  <td>{data.currentSupply.toLocaleString("en-UK")}</td>
                  <td>{data.imbalance.toFixed(3)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AnalaysisLanding;
