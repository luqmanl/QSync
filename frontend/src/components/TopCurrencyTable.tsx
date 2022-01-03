/* eslint-disable no-mixed-operators */
/* eslint-disable no-magic-numbers */
import React, { useState } from "react";
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

// eslint-disable-next-line no-magic-numbers
const defaultData: responseType = {
  name: "-",
  price: 0,
  change24h: 0,
  change7d: 0,
  marketCap: 0,
};

const defaultTable: tableRep = {
  " ": defaultData,
  "": defaultData,
  "	": defaultData,
  "­": defaultData,
  "͏": defaultData,
};

const tableColumns = [
  "Currency",
  "Price",
  "24H Change",
  "7H Change",
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

const TopCurrencyTable = () => {
  const endPoint = "/ws/data/top_currencies_table/";
  const ws = new WebSocket(
    `ws://${process.env.PUBLIC_URL || "localhost:8000"}${endPoint}`
  );

  const [tableData, setTableData] = useState<tableRep>(defaultTable);
  const [loading, setLoading] = useState(true);

  ws.addEventListener("message", (ev) => {
    const res: responseType = JSON.parse(ev.data);
    if (loading) {
      setLoading(false);
      setTableData({});
    }
    const updatedTable = tableData;
    updatedTable[res.name] = res;
  });

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
                <td>${data.price.toLocaleString("en-UK")}</td>
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
