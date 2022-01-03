import React from "react";
import exampleData from "../exampleData/ExampleAnalysisLandingPage";

export type data = {
  analysesRows: analysisRow[];
};

export type analysisRow = {
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  currentSupply: number;
  orderImbalance: number;
};

const AnalaysisLanding = () => {
  return <div></div>;
};

export default AnalaysisLanding;
