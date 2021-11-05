/* eslint-disable no-magic-numbers */
import React, { useState } from "react";
import "./App.css";
import OrderBookTable from "./components/OrderBookTable";
import RealTimeCandleSticksChart from "./components/RealTimeCandleSticksChart";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NvBar";
import LatestTrades from "./components/LatestTrades";
import { Form } from "react-bootstrap";

export type dataPoint = {
  x: number;
  y: number;
};

export interface Item {
  id: number;
  bookData: bookData;
}

interface bookData {
  time: string;
  sym: string;
  feedhandlerTime: string;
  bids: number[];
  asks: number[];
  bidSizes: number[];
  askSizes: number[];
}

const App = () => {
  const [showLatest, setShowLatest] = useState(false);

  return (
    <div>
      <NavBar />
      <div className="flex-container">
        <div className="graph-container">
          <RealTimeCandleSticksChart
            id="my-chart"
            yAxis="Price (USD)"
            xAxis="Time (UTC)"
            graphTitle="Price against Time"
          />
        </div>
        <Form>
          <Form.Check
            type="checkbox"
            id="default-checkbox"
            label="Toggle latest trade/order book view"
            onChange={() => {
              setShowLatest(!showLatest);
            }}
          ></Form.Check>
        </Form>
        <div className="order-book-container">
          {showLatest ? <LatestTrades /> : <OrderBookTable />}
        </div>
      </div>
    </div>
  );
};

export default App;
