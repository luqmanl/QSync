/* eslint-disable no-magic-numbers */
import React, { useEffect, useState } from "react";
import "./TopCurrencyGraph.css";
import axios from "axios";
import MultiLineGraph from "./MultiLineGraph";
import { Spinner } from "react-bootstrap";
export interface data {
  data: dataPoint[];
}

export interface dataPoint {
  currency: string;
  percentage: number;
  timestamp: string;
}

export interface graphPoint {
  x: number;
  y: number;
}

// const colours = ["red", "blue", "green", "pink", "brown"];

const TopCurrencyGraph = () => {
  const [graphDataMap, setGraphDataMap] = useState<{
    [name: string]: graphPoint[];
  }>({});
  // here
  const [loading, setLoading] = useState(true);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const historicalAddr = `http://${
    process.env.back || "localhost:8000"
  }/historical24hChangeData`;

  useEffect(() => {
    const map: { [name: string]: graphPoint[] } = {};
    axios
      .get(historicalAddr)
      .then((res) => {
        const { points } = res.data;
        const pointList = points as dataPoint[];
        pointList.forEach((obj) => {
          const newPoint = {
            x: new Date(obj.timestamp).getTime() - yesterday.getTime(),
            y: obj.percentage * 100,
          };
          if (obj.currency in map) {
            map[obj.currency].push(newPoint);
          } else {
            map[obj.currency] = [newPoint];
          }
        });
        setGraphDataMap(map);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err, historicalAddr);
      });
  }, []);

  return (
    <div className="graph-container">
      {loading ? (
        <div className="top-cur-graph-spinner-container">

          <Spinner animation="border" className="top-cur-graph-spinner-container" style={{height:"10vh", width:"10vh", margin:"auto"}} />
        </div>
      ) : (
        <MultiLineGraph map={graphDataMap} date={yesterday} />
      )}
    </div>
  );
};

export default TopCurrencyGraph;
