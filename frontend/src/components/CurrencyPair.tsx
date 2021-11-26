/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-magic-numbers */
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import defaultData from "./ExampleCurrencyPair";
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

  const wsAddr = `ws://localhost:8000/ws/data/BINANCE/ETH-BTC+BTC-USDT+ETH-USDT/l2overview/`;

  useEffect(() => {
    const socket = new WebSocket(wsAddr);

    socket.addEventListener("message", (ev) => {
      const res = JSON.parse(ev.data);
      const cp: CurrencyPairType = {
        pairName: res.sym,
        highestBid: res.highestBid,
        lowestAsk: res.lowestAsk,
        volumeLhr: res.volume,
        orderImbalance: parseFloat(res.imbalance).toFixed(4),
      };
      const imbalanceString = cp.orderImbalance;
      cp.orderImbalance = imbalanceString.substring(0, 5);
      const newData: { [name: string]: CurrencyPairType } = { ...data };
      data[cp.pairName] = cp;
      console.log(data, newData);
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
      <tr key={key}>
        <td>{item.pairName}</td>
        <td>{item.highestBid}</td>
        <td>{item.lowestAsk}</td>
        <td>{item.volumeLhr}</td>
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
      <h1 className="table-title">Currency Pairs</h1>
      <Table variant="dark">
        <thead>
          <tr>
            <th className="row-title">Pairs</th>
            <th className="row-title">Bid</th>
            <th className="row-title">Ask</th>
            <th className="row-title">Vol</th>
            <th className="row-title">Order Imbalance</th>
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
