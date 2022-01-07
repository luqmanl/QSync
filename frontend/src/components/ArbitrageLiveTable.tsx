/* eslint-disable no-magic-numbers */
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "./ArbitrageLiveTable.css";
import { exampleData } from "../exampleData/ExampleLiveArbitrageTable";

export interface LiveTableData {
  currency: string;
  maxArbitrage: number; // percentage
  highestBid: number;
  bidExchange: string;
  askExchange: string;
  lowestAsk: number;
  price: number;
}

export type tableRep = { [name: string]: LiveTableData };

const ArbitrageLiveTable = () => {
  const [tableData, setTableData] = useState<tableRep>(exampleData);

  const url = "ws://localhost:8000/ws/data/arbitrage-overview-table/";

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
      const update: LiveTableData = JSON.parse(ev.data);
      const newData = tableData;
      tableData[update.currency] = update;
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
          {Object.entries(tableData).map(([name, value], idx) => {
            const percentValue = (value.maxArbitrage * 100).toPrecision(3);
            return (
              <tr key={idx}>
                <td>{name}</td>
                <td>{value.price.toLocaleString("en-UK")}</td>
                <td>{percentValue} %</td>
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
