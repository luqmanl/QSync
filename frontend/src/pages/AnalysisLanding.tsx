/* eslint-disable no-mixed-operators */
/* eslint-disable no-magic-numbers */
import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import "./AnalysisLanding.css";
import { Table, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Link } from "react-router-dom";
import { nameMap } from "../NameMap";

interface colour {
  red: number;
  green: number;
  blue: number;
}

const maxGreen: colour = { red: 32, green: 156, blue: 5 };
const maxRed: colour = { red: 255, green: 10, blue: 10 };
const gradient: colour = { red: 222, green: 156, blue: 5 };

const generateColour7d = (value: number): colour => {
  if (value >= 5) {
    return maxGreen;
  }
  if (value <= -5) {
    return maxRed;
  }
  return {
    red: 143.5 - (gradient.red / 10) * value,
    green: 80 + (gradient.green / 10) * value,
    blue: 7.5 + (gradient.blue / 10) * value,
  };
};

const generateColour24h = (value: number): colour => {
  if (value >= 10) {
    return maxGreen;
  }
  if (value <= -10) {
    return maxRed;
  }
  return {
    red: 143.5 - (gradient.red / 20) * value,
    green: 80 + (gradient.green / 20) * value,
    blue: 7.5 + (gradient.blue / 20) * value,
  };
};

export type data = {
  analysesRows: analysisRow[];
};

export type analysisRow = {
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  currentSupply: number;
  orderImbalance: number;
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
    "EXPLANATION NEEDED",
  ];

  const endPoint = "/ws/data/analyses-table";
  const linkAddr = `ws://${
    process.env.PUBLIC_URL || "localhost:8000"
  }${endPoint}`;

  useEffect(() => {
    const ws = new WebSocket(linkAddr);
    ws.addEventListener("message", (ev) => {
      if (loading) {
        setLoading(false);
      }
      const newData: data = ev.data;
      const updated = analyses;
      newData.analysesRows.forEach((e) => {
        updated[e.name] = e;
      });
      setAnalyses(updated);
    });
  }, []);

  return (
    <div className="landing-page-box">
      <div className="landing-title-box">
        <SideBar addr="detailed Analysis" />
        <h2 className="landing-title">Top Currencies</h2>
      </div>
      <div className="landing-main">
        <h3 className="landing-subtitle">
          Hover over the columns to find out more and click on the names to find
          more detailed analysis!
        </h3>
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
              const colour24h = generateColour24h(data.change24h);
              const colour7d = generateColour7d(data.change7d);
              const link = `analysis/${data.name}`;
              return (
                <tr key={name}>
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
                    {data.change24h.toFixed(3)}%
                  </td>
                  <td
                    style={{
                      color: `rgb(${colour7d.red},${colour7d.green},${colour24h.blue})`,
                    }}
                  >
                    {data.change7d.toFixed(3)}%
                  </td>
                  <td>${data.marketCap.toLocaleString("en-UK")}</td>
                  <td>{data.currentSupply.toLocaleString("en-UK")}</td>
                  <td>{data.orderImbalance.toFixed(3)}</td>
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
