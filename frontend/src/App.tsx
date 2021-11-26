/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-magic-numbers */
import React, { useState } from "react";
import "./App.css";
import BasisTable from "./components/BasisTable";
import RealTimeCandleSticksChart from "./components/RealTimeCandleSticksChart";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";
import LatestTrades from "./components/LatestTrades";
import CurrencyPair from "./components/CurrencyPair";
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
    <div className="page">
      <NavBar />
      <div className="flex-container">
        <Rectangle innerComponents={<CurrencyPair />} />
        <Rectangle innerComponents={<BasisTable />} />
      </div>
    </div>
  );
};

export default App;
