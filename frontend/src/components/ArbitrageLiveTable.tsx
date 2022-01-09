/* eslint-disable no-magic-numbers */
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "./ArbitrageLiveTable.css";

export interface LiveTableData {
  currency: string;
  maxArbitrage: number; // percentage
  highestBid: number;
  bidExchange: string;
  askExchange: string;
  lowestAsk: number;
  price: number;
}

interface colour {
  red: number;
  green: number;
  blue: number;
}

const generateColourArbitrage = (value: number): colour => {
  if (value > 0) {
    return {
      red: 0,
      green: Math.min(255, 255 * (100 * value)),
      blue: 0,
    };
  }

  return {
    red: Math.min(255, 255 * -(100 * value)),
    green: 0,
    blue: 0,
  };
};

export type tableRep = { [name: string]: LiveTableData };

const ArbitrageLiveTable = () => {
  const [tableData, setTableData] = useState<tableRep>({});
  const [loading, setLoading] = useState(true);

  const url = `ws://${window.location.hostname}:8000/ws/data/arbitrage-overview-table/`;

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          pairs: ["BTC-USDT", "ETH-USDT", "ADA-USDT", "SOL-USDT", "DOGE-USDT"],
        })
      );
    };

    ws.addEventListener("message", (ev) => {
      if (loading) {
        setLoading(false);
        setTableData({});
      }
      const update: LiveTableData = JSON.parse(ev.data);
      const newData = tableData;
      newData[update.currency] = update;
      setTableData(newData);
    });

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h3 className="arbitrage-sub-title" style={{ marginBottom: "10px" }}>
        Arbitrage Opportunities
      </h3>
      <Table className="arbitrage-table">
        <thead>
          <tr>
            <th>Currency</th>
            <th>Price</th>
            <th>Max Arbitrage</th>
            <th>Exchanges</th>
            <th>Highest Bid</th>
            <th>Lowest Ask</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(tableData).map(([name, value]) => {
            const percentValue = (value.maxArbitrage * 100).toPrecision(3);
            const colour24h = generateColourArbitrage(value.maxArbitrage * 100);
            return (
              <tr key={name}>
                <td>{name}</td>
                <td>{value.price.toLocaleString("en-UK")}</td>
                <td
                  style={{
                    color: `rgb(${colour24h.red},${colour24h.green},${colour24h.blue})`,
                  }}
                >
                  {percentValue} %
                </td>
                <td>
                  {value.bidExchange} {"->"} {value.askExchange}
                </td>
                <td>
                  {parseFloat(value.highestBid.toPrecision(5)).toLocaleString(
                    "en-UK"
                  )}
                </td>
                <td>
                  {parseFloat(value.lowestAsk.toPrecision(5)).toLocaleString(
                    "en-UK"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

// send request to the websocket
export default ArbitrageLiveTable;
