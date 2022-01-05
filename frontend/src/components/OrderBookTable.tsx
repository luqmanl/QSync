/* eslint-disable no-magic-numbers */
import React, { useState, useEffect, useContext } from "react";
import { Table } from "react-bootstrap";
import "./OrderBookTable.css";
import { PairContext } from "../pages/Analysis";

// time     tickersymbol     bid/ask     price      quantity

const OrderBookTableDivision = (props: { data: string | number }) => {
  return <td className="table-row">{props.data}</td>;
};

type rowPropType = {
  data: Item;
  index: number;
};

interface Item {
  bookData: bookData;
}

interface bookData {
  sym: string;
  exchange: string;
  bids: number[];
  asks: number[];
  bidSizes: number[];
  askSizes: number[];
}

// dataFrontend = {
//   'sym': book.symbol,
//   'exchange': book.exchange,
//   'bids': bids,
//   'asks': asks,
//   'bidSizes': bid_sizes,
//   'askSizes': ask_sizes
// }

const deafult: Item = {
  bookData: {
    exchange: "BINANCE",
    sym: "BTC-USDT",
    bids: [
      65994.95, 65994.94, 65994.35, 65993.95, 65993.38, 65990.83, 65990.0,
      65989.0, 65988.69, 65986.42, 65986.41, 65986.25, 65985.39, 65985.38,
      65985.0, 65984.68, 65984.28, 65982.36, 65982.02, 65980.65, 65994.96,
    ],
    asks: [
      66000.01, 66000.72, 66005.56, 66005.57, 66008.16, 66008.54, 66008.55,
      66010.33, 66010.34, 66010.98, 66010.99, 66011.0, 66011.65, 66013.79,
      66015.11, 66015.12, 66015.92, 66019.77, 66022.53, 1.10593, 0.11363,
    ],
    bidSizes: [
      0.89523, 0.07576, 0.00556, 0.00758, 0.04701, 0.0017, 0.09765, 0.0591,
      0.00554, 0.14659, 0.04418, 0.1825, 0.00437, 0.05, 0.00227, 0.0303, 0.0125,
      0.3416, 0.61913, 0.00413, 0.05813,
    ],
    askSizes: [
      0.008, 0.00717, 0.1825, 0.035, 0.00025, 0.18286, 0.09408, 0.29342, 0.0591,
      0.09612, 0.02, 0.23524, 0.0591, 0.1825, 0.00712, 0.29, 0.1825,
    ],
  },
};

const numDPs = 2;

const OrderBookTableRow = (props: rowPropType) => {
  const { data, index } = props;
  return (
    <tr>
      <OrderBookTableDivision data={data.bookData.asks[index]} />
      <OrderBookTableDivision data={data.bookData.askSizes[index]} />
      <OrderBookTableDivision
        data={(
          data.bookData.askSizes[index] * data.bookData.asks[index]
        ).toFixed(numDPs)}
      />
      <OrderBookTableDivision data={data.bookData.bids[index]} />
      <OrderBookTableDivision data={data.bookData.bidSizes[index]} />
      <OrderBookTableDivision
        data={(
          data.bookData.bidSizes[index] * data.bookData.bids[index]
        ).toFixed(numDPs)}
      />
    </tr>
  );
};

const OrderBookTable = () => {
  const [data, setData] = useState<Item>(deafult);
  const pair = useContext(PairContext);

  useEffect(() => {
    const socket = new WebSocket(
      `ws://${process.env.back || "localhost:8000"}/ws/data/l2orderbook/`
    );

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          exchange: "BINANCE",
          pair: pair,
        })
      );
    };

    socket.addEventListener("message", (ev) => {
      const res = JSON.parse(ev.data);
      const newBookData: bookData = {
        ...res,
      };
      const newData: Item = {
        bookData: newBookData,
      };
      setData(newData);
    });
  }, []);

  return (
    <div className="order-book-holder">
      <h2 className="component-title">Order Book</h2>
      <Table>
        <thead>
          <tr>
            <th className="table-header" colSpan={4}>
              bids
            </th>
            <th className="table-header" colSpan={4}>
              asks
            </th>
          </tr>
          <tr>
            <OrderBookTableDivision data="price ($)" />
            <OrderBookTableDivision data="quantity" />
            <OrderBookTableDivision data="order total ($)" />
            <OrderBookTableDivision data="price ($)" />
            <OrderBookTableDivision data="quantity" />
            <OrderBookTableDivision data="order total ($)" />
          </tr>
        </thead>
        <tbody>
          {data.bookData.asks.map((_item, i) => {
            return <OrderBookTableRow key={i} data={data} index={i} />;
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderBookTable;
