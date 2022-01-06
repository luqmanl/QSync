/* eslint-disable new-cap */
import React, { useContext, useEffect } from "react";
import { bookData } from "./OrderBookTable";
import { PairContext } from "../pages/Analysis";
import {
  LegendBoxBuilders,
  lightningChart,
  PointShape,
  Themes,
} from "@arction/lcjs";
import "./OrderBookScatterGraph.css";

const UPDATE_LIMIT = 10;

const OrderBookScatterGraph = () => {
  const pair = useContext(PairContext);

  useEffect(() => {
    const chart = lightningChart().ChartXY({
      container: "orderbook-scatter-graph",
      theme: Themes.lightNew,
    });
    chart.setTitle("Order Book Scatter Graph");
    const askSeries = chart
      .addPointLineSeries({ pointShape: PointShape.Square })
      .setName("Asks");
    const bidSeries = chart
      .addPointLineSeries({ pointShape: PointShape.Circle })
      .setName("Bids");
    const legend = chart
      .addLegendBox(LegendBoxBuilders.HorizontalLegendBox)
      .setAutoDispose({
        type: "max-width",
        maxWidth: 0.8,
      });
    legend.add(askSeries);
    legend.add(bidSeries);

    let x = 0;
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
      console.log("HLO");
      x += 1;
      const res = JSON.parse(ev.data);
      const { data } = res;
      const newData = data as bookData;
      const askList = newData.asks.map((price, idx) => {
        return { x: price, y: newData.askSizes[idx] };
      });
      const bidList = newData.bids.map((price, idx) => {
        return { x: price, y: newData.bidSizes[idx] };
      });
      if (x === UPDATE_LIMIT) {
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
      <div id="orderbook-scatter-graph"></div>
    </div>
  );
};

export default OrderBookScatterGraph;
