/* eslint-disable no-magic-numbers */
import React, { useState, useEffect } from "react";
import { Item } from "../App";
import { Table } from "react-bootstrap";
import "./OrderBookTable.css";
import axios from "axios";

// time     tickersymbol     bid/ask     price      quantity

const OrderBookTableDivision = (props: { data: string | number }) => {
  return <td className="table-row">{props.data}</td>;
};

type rowPropType = {
  data: Item;
  index: number;
};

const deafult: Item = {
  id: 1,
  bookData: {
    time: "1649141143000",
    sym: "BTC-USDT",
    feedhandlerTime: "688087649133238000",
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
  return (
    <tr>
      <OrderBookTableDivision data={props.data.bookData.sym} />
      <OrderBookTableDivision data={props.data.bookData.asks[props.index]} />
      <OrderBookTableDivision
        data={props.data.bookData.askSizes[props.index]}
      />
      <OrderBookTableDivision
        data={(
          props.data.bookData.askSizes[props.index] *
          props.data.bookData.asks[props.index]
        ).toFixed(numDPs)}
      />
      <OrderBookTableDivision data={props.data.bookData.sym} />
      <OrderBookTableDivision data={props.data.bookData.bids[props.index]} />
      <OrderBookTableDivision
        data={props.data.bookData.bidSizes[props.index]}
      />
      <OrderBookTableDivision
        data={(
          props.data.bookData.bidSizes[props.index] *
          props.data.bookData.bids[props.index]
        ).toFixed(numDPs)}
      />
    </tr>
  );
};

const OrderBookTable = () => {
  const [data, setData] = useState<Item>(deafult);

  const refreshList = () => {
    axios
      .get<Item[]>("http://localhost:8000/api/book/")
      .then((res) => {
        setData(res.data[res.data.length - 1]);
        console.log(res.data.length - 1);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshList();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <Table striped bordered hover variant="dark">
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
            <OrderBookTableDivision data="ticker" />
            <OrderBookTableDivision data="price ($)" />
            <OrderBookTableDivision data="quantity" />
            <OrderBookTableDivision data="order total ($)" />
            <OrderBookTableDivision data="ticker" />
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