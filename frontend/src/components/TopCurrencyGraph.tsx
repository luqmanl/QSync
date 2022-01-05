/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-magic-numbers */
import React, { useEffect, useState } from "react";
import { LegendBoxBuilders, lightningChart, Themes } from "@arction/lcjs";
import "./TopCurrencyGraph.css";
import axios from "axios";
export interface data {
  data: dataPoint[];
}

export interface dataPoint {
  currency: string;
  percentage: number;
  timestamp: string;
}

interface graphPoint {
  x: number;
  y: number;
}

// const colours = ["red", "blue", "green", "pink", "brown"];

const TopCurrencyGraph = () => {
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
      })
      .catch((err) => {
        console.log(err, historicalAddr);
      });
    const chart = lightningChart().ChartXY({
      theme: Themes.lightNew,
      container: "currency-graph",
    });
    chart.setTitle("Top Currencies");
    chart.getDefaultAxisX().setTitle("Time");
    chart.getDefaultAxisY().setTitle("Percentage Change");

    const entries = Object.entries(map);
    const names = entries.map(([a, _b]) => a);
    const lists = entries.map(([_, b]) => b);

    const seriesArray = new Array(5).fill(null).map((_, idx) =>
      chart
        .addLineSeries({
          dataPattern: {
            pattern: "ProgressiveX",
          },
        })
        // eslint-disable-next-line arrow-parens
        .setStrokeStyle((stroke) => stroke.setThickness(1))
        .setName(names[idx])
    );

    seriesArray.forEach((series, idx) => {
      if (idx === 1) {
        series.add(lists[idx]);
      }
    });

    chart.addLegendBox(LegendBoxBuilders.HorizontalLegendBox).add(chart);

    return () => {
      chart.dispose();
    };
  }, []);

  // done thnx
  return (
    <div className="graph-container">
      <div id="currency-graph" className="graph-container"></div>
    </div>
  );
};

export default TopCurrencyGraph;
