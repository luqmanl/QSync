import React, { useState } from "react";
import { Table } from "react-bootstrap";
import "./TopCurrencyTable.css"

type tableRep = { [name: string]: responseType };

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

const TopCurrencyTable = () => {
  const endPoint = "/ws/data/top_currencies_table";
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
              return <th key={col}>col</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {Object.entries(tableData).map(([name, data]) => {
            return (
              <tr key={name}>
                <td>{data.name}</td>
                <td>{data.price}</td>
                <td>{data.change24h}</td>
                <td>{data.change7d}</td>
                <td>{data.marketCap}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default TopCurrencyTable;
