/* eslint-disable new-cap */
/* eslint-disable no-magic-numbers */
import React, { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { PairContext } from "../pages/Analysis";
import {
  LegendBoxBuilders,
  lightningChart,
  PointShape,
  Themes,
} from "@arction/lcjs";
import "./OrderBookScatterGraph.css";
import "./OrderBookTable.css";

type rowPropType = {
  data: Item;
  index: number;
};

interface Item {
  bookData: bookData;
}

export interface bookData {
  sym: string;
  exchange: string;
  bids: number[];
  asks: number[];
  bidSizes: number[];
  askSizes: number[];
}

const UPDATE_LIMIT = 10;
const POINT_SIZE = 10;
const numDPs = 2;
const deafult: Item = {
  bookData: {
    exchange: "BINANCE",
    sym: "BTC-USDT",
    bids: [],
    asks: [],
    bidSizes: [],
    askSizes: [],
  },
};

const OrderBookTableDivision = (props: { data: string | number }) => {
  return <td className="table-row">{props.data}</td>;
};

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

const OrderBookScatterGraph = () => {
  const pair = useContext(PairContext);
  const [data, setData] = useState<Item>(deafult);

  useEffect(() => {
    const chart = lightningChart().ChartXY({
      container: "orderbook-scatter-graph",
      theme: Themes.lightNew,
    });
    chart.setTitle("Order Book Scatter Graph");
    const askSeries = chart
      .addPointSeries({ pointShape: PointShape.Square })
      .setName("Asks")
      .setPointSize(POINT_SIZE);
    const bidSeries = chart
      .addPointSeries({ pointShape: PointShape.Circle })
      .setName("Bids")
      .setPointSize(POINT_SIZE);
    const legend = chart
      .addLegendBox(LegendBoxBuilders.HorizontalLegendBox)
      .setAutoDispose({
        type: "max-width",
        maxWidth: 0.8,
      });
    legend.add(askSeries);
    legend.add(bidSeries);

    let x = 9;
    const socket = new WebSocket(
      `ws://${process.env.REACT_APP_BACK || "localhost:8000"}/ws/data/l2orderbook/`
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
      x += 1;
      const res = JSON.parse(ev.data);
      const newData = res as bookData;
      const newBookData: bookData = {
        ...res,
      };
      const newData2: Item = {
        bookData: newBookData,
      };
      setData(newData2);
      const askList = newData.asks.map((price, idx) => {
        return { x: price, y: newData.askSizes[idx] };
      });
      const bidList = newData.bids.map((price, idx) => {
        return { x: price, y: newData.bidSizes[idx] };
      });
      if (x === UPDATE_LIMIT) {
        x = 0;
        askSeries.clear();
        bidSeries.clear();
        askSeries.add(askList);
        bidSeries.add(bidList);
      }
    });

    return () => {
      socket.close();
      chart.dispose();
    };
  }, []);

  return (
    <div className="scatter-graph-container">
      <div className="scatter-graph-container">
        <div id="orderbook-scatter-graph"></div>
      </div>
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
    </div>
  );
};

export default OrderBookScatterGraph;
