/* eslint-disable no-mixed-operators */
/* eslint-disable no-magic-numbers */
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import "./TopCurrencyTable.css";

export type tableRep = { [name: string]: responseType };

interface responseType {
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
}

const tableColumns = [
  "Currency",
  "Price",
  "24H Change",
  "7D Change",
  "Market Cap",
];

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

const TopCurrencyTable = () => {
  const endPoint = "/ws/data/top_currencies_table/";

  const [tableData, setTableData] = useState<tableRep>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ws = new WebSocket(
      `ws://${window.location.hostname}:8000${endPoint}`
    );
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          exchange: "BINANCE",
          pairs: ["BTC-USDT", "ETH-USDT", "ADA-USDT", "SOL-USDT", "DOGE-USDT"],
        })
      );
    };
    ws.addEventListener("message", (ev) => {
      const res: { currencyData: responseType[] } = JSON.parse(ev.data);
      if (loading) {
        setLoading(false);
        setTableData({});
      }
      const updatedTable = tableData;
      res.currencyData.forEach((item) => {
        item.change24h = parseFloat((item.change24h * 100).toFixed(3));
        item.change7d = parseFloat((item.change7d * 100).toFixed(3));
        updatedTable[item.name] = item;
      });
      setTableData(updatedTable);
    });
  }, []);

  return (
    <div className="table-container">
      <Table>
        <thead>
          <tr>
            {tableColumns.map((col) => {
              return <th key={col}>{col}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {Object.entries(tableData).map(([name, data]) => {
            const colour24h = generateColour24h(data.change24h);
            const colour7d = generateColour7d(data.change7d);
            return (
              <tr key={name}>
                <td>{data.name}</td>
                <td>${data.price.toPrecision(5)}</td>
                <td
                  style={{
                    color: `rgb(${colour24h.red},${colour24h.green},${colour24h.blue})`,
                  }}
                >
                  {data.change24h}%
                </td>
                <td
                  style={{
                    color: `rgb(${colour7d.red},${colour7d.green},${colour24h.blue})`,
                  }}
                >
                  {data.change7d}%
                </td>
                <td>${data.marketCap.toLocaleString("en-UK")}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default TopCurrencyTable;
