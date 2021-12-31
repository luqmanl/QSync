/* eslint-disable no-magic-numbers */
import React, { useEffect, useState } from "react";
import exampleData from "./ExampleTopCurrencyGraphData";
import { LegendBoxBuilders, lightningChart, Themes } from "@arction/lcjs";
import "./TopCurrencyGraph.css";
export interface data {
  data: dataPoint[];
}

export interface dataPoint {
  currency: string;
  percentage: number;
  timestamp: number;
}

interface graphPoint {
  x: number;
  y: number;
}

// const colours = ["red", "blue", "green", "pink", "brown"];

const TopCurrencyGraph = () => {
  const [graphData, setGraphData] = useState<Map<string, graphPoint[]>>(
    new Map()
  );

  useEffect(() => {
    const updatedGraphData = graphData;
    exampleData.data.forEach((item) => {
      if (updatedGraphData.has(item.currency)) {
        const curList = updatedGraphData.get(item.currency);
        curList?.push({ x: item.timestamp, y: item.percentage });
      } else {
        updatedGraphData.set(item.currency, [
          { x: item.timestamp, y: item.percentage },
        ]);
      }
    });
    setGraphData(updatedGraphData);
  });

  useEffect(() => {
    // eslint-disable-next-line new-cap
    const chart = lightningChart().ChartXY({
      theme: Themes.lightNew,
      container: "currency-graph",
    });
    chart.setTitle("Top Currencies");
    chart.getDefaultAxisX().setTitle("Time");
    chart.getDefaultAxisY().setTitle("Percentage Change");

    graphData.forEach((list, name) => {
      const newSeries = chart
        .addLineSeries({
          dataPattern: {
            pattern: "ProgressiveX",
          },
        })
        .setStrokeStyle((strokeStyle) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          strokeStyle.setFillStyle((fill: any) => fill.setA(70)).setThickness(5)
        )
        .setName(name);

      newSeries.add(list);
    });
    chart.addLegendBox(LegendBoxBuilders.HorizontalLegendBox).add(chart);
  }, []);

  return (
    <div className="graph-container">
      <div id="currency-graph" className="graph-container"></div>
    </div>
  );
};

export default TopCurrencyGraph;
