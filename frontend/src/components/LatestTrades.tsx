import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

interface Trade {
  time: number;
  buy: boolean;
  volume: number;
  price: number;
}

const LatestTrades = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [trades, setTrades] = useState<Trade[]>([]);
  const DECIMAL_PLACES = 2;
  // const EXTEND_LIST_BY = 5;

  const generateRow = (trade: Trade) => {
    const pricePerVol = trade.price / trade.volume;
    return (
      <tr>
        <td>{trade.time}</td>
        <td>{trade.buy ? "BUY" : "SELL"}</td>
        <td>{trade.volume}</td>
        <td>{trade.price}</td>
        <td>{pricePerVol.toFixed(DECIMAL_PLACES)}</td>
      </tr>
    );
  };

  const generateExamples = () => {};

  useEffect(() => {
    const interval = setInterval(() => {
      generateExamples();
      // eslint-disable-next-line no-magic-numbers
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <Table hover striped bordered variant="dark" size="sm">
        <thead>
          <tr>
            <th>Time</th>
            <th>Buy/Sell</th>
            <th>Vol</th>
            <th>Price</th>
            <th>Price/Vol</th>
          </tr>
        </thead>
        <tbody>{trades.map(generateRow)}</tbody>
      </Table>
    </div>
  );
};

export default LatestTrades;
