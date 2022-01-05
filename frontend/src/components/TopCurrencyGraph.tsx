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
  const [loading, setLoading] = useState(true);

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
            x: new Date(obj.timestamp).getTime() * (60 * 24),
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
        <Spinner animation="border" />
      ) : (
        <MultiLineGraph map={graphDataMap} />
      )}
    </div>
  );
};

export default TopCurrencyGraph;
