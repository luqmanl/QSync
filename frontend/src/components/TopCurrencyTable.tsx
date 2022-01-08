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

const tableColumns = ["Name", "Price", "24h %", "7d %", "Market Cap"];

interface colour {
  red: number;
  green: number;
  blue: number;
}

const generateColour = (value: number): colour => {
  if (value > 0) {
    return {
      red: 0,
      green: Math.min(255, 255 * value + 20),
      blue: 0,
    };
  }

  return {
    red: Math.min(255, 255 * -value + 20),
    green: 0,
    blue: 0,
  };
};

const TopCurrencyTable = () => {
  const endPoint = "/ws/data/top_currencies_table/";

  const [tableData, setTableData] = useState<tableRep>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ws = new WebSocket(
      `ws://${process.env.back || "localhost:8000"}${endPoint}`
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
      <h2 className="table-title">Top Cryptocurrency Prices</h2>
      <p className="table-desc">
        Displaying live cryptocurrency prices with the top percentage changes in
        price
      </p>
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
            const colour24h = generateColour(data.change24h);
            const colour7d = generateColour(data.change7d);
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
