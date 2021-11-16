/* eslint-disable no-magic-numbers */
import React, { useState } from "react";
import "./App.css";
import OrderBookTable from "./components/OrderBookTable";
import RealTimeCandleSticksChart from "./components/RealTimeCandleSticksChart";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NvBar";
import LatestTrades from "./components/LatestTrades";
import { Form } from "react-bootstrap";
import Rectangle from "./components/Rectangle";

export type dataPoint = {
  x: number;
  y: number;
};

export interface Item {
  id: number;
  bookData: bookData;
}

export interface bookData {
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
    <div className='page'>
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
        <div className="order-book-container">
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
          {showLatest ? <LatestTrades /> : <OrderBookTable />}
        </div>
      </div> 
      <Rectangle/>
    </div>
  );
};

export default App;
