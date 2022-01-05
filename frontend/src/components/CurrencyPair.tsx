/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-magic-numbers */
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import defaultData from "../exampleData/ExampleCurrencyPair";
import "./CurrencyPair.css";

export interface CurrencyPairType {
  pairName: string;
  highestBid: string;
  lowestAsk: string;
  volumeLhr: string;
  orderImbalance: string;
}

const CurrencyPair = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<{ [name: string]: CurrencyPairType }>({});

  const wsAddr = `ws://${process.env.back || "localhost:8000"}/ws/data/l2overview/`;

  useEffect(() => {
    const socket = new WebSocket(wsAddr);

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          exchanges: ["BINANCE"],
          pairs: ["ETH-BTC", "BTC-USDT", "ETH-USDT"],
        })
      );
    };

    socket.addEventListener("message", (ev) => {
      const res = JSON.parse(ev.data);
      const cp: CurrencyPairType = {
        pairName: res.sym,
        highestBid: res.highestBid,
        lowestAsk: res.lowestAsk,
        volumeLhr: parseFloat(res.volume).toFixed(3),
        orderImbalance: parseFloat(res.imbalance).toFixed(3),
      };
      const imbalanceString = cp.orderImbalance;
      cp.orderImbalance = imbalanceString.substring(0, 5);
      const newData: { [name: string]: CurrencyPairType } = { ...data };
      data[cp.pairName] = cp;
      setData(newData);
    });
  }, []);

  const colourGenerator = (cur: number) => {
    const redNormaliser = 0.5 + 0.5 * Math.cos(Math.PI * (2 * cur + 1));
    const greenNormaliser = 0.5 - 0.5 * Math.cos(Math.PI * (2 * cur + 1));

    return {
      red: Math.floor(204 * redNormaliser + 45 * greenNormaliser),
      green: Math.floor(50 * redNormaliser + 201 * greenNormaliser),
      blue: Math.floor(50 * redNormaliser + 55 * greenNormaliser),
    };
  };

  const rowGenerator = (item: CurrencyPairType, key: number) => {
    const colour = colourGenerator(parseFloat(item.orderImbalance));
    return (
      <tr className="table-title" key={key}>
        <td className="table-cell">{item.pairName}</td>
        <td className="table-cell">{item.highestBid}</td>
        <td className="table-cell">{item.lowestAsk}</td>
        <td className="table-cell">{item.volumeLhr}</td>
        <td
          style={{
            color: `rgb(${colour.red}, ${colour.green}, ${colour.blue})`,
          }}
        >
          {item.orderImbalance}
        </td>
      </tr>
    );
  };

  return (
    <div>
      <h1 className="title">Currency Pairs</h1>
      <Table>
        <thead>
          <tr>
            <th className="table-cell">Pairs</th>
            <th className="table-cell">Bid</th>
            <th className="table-cell">Ask</th>
            <th className="table-cell">Vol</th>
            <th className="table-cell">Order Imbalance</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(data).map((item, index) => {
            return rowGenerator(item, index);
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default CurrencyPair;
