/* eslint-disable no-magic-numbers */
import React, { useEffect, useState } from "react";
import exampleData from "../exampleData/ExampleTopCurrencyGraphData";
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

const CurrencyGraph = (props: { data: string }) => {
  const [graphData, setGraphData] = useState<graphPoint[]>([]);

  useEffect(() => {
    const updatedGraphData = graphData;
    exampleData.data.forEach((item) => {
      if (item.currency === props.data) {
        //   change item.percentage to actual price of coin
        updatedGraphData?.push({
          x: new Date(item.timestamp).getTime(),
          y: item.percentage,
        });
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
      .setName(props.data);

    newSeries.add(graphData);
    chart.addLegendBox(LegendBoxBuilders.HorizontalLegendBox).add(chart);
  }, []);

  return (
    <div className="graph-container">
      <div id="currency-graph" className="graph-container"></div>
    </div>
  );
};

export default CurrencyGraph;
