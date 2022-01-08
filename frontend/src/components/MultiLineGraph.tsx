/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AxisTickStrategies,
  LegendBoxBuilders,
  lightningChart,
  Themes,
} from "@arction/lcjs";
import React, { useEffect } from "react";
import { graphPoint } from "./TopCurrencyGraph";

interface propsType {
  map: { [name: string]: graphPoint[] };
  date: Date;
}

const MultiLineGraph = (props: propsType) => {
  const { map, date } = props;
  useEffect(() => {
    // eslint-disable-next-line new-cap
    const chart = lightningChart().ChartXY({
      theme: Themes.lightNew,
      container: "currency-graph",
    });
    chart.setTitle("");
    chart
      .getDefaultAxisX()
      .setTitle("Time")
      .setTickStrategy(AxisTickStrategies.DateTime, (tickstrategy) =>
        tickstrategy.setDateOrigin(date)
      );
    date.setDate(date.getDate() - 1);
    chart.getDefaultAxisY().setTitle("Percentage Change");

    const entries = Object.entries(map);
    const names = entries.map(([a, _b]) => a);
    const lists = entries.map(([_, b]) => b);

    const seriesArray = new Array(entries.length).fill(null).map((_, idx) =>
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
      series.add(
        lists[idx].map((item) => {
          return { x: item.x, y: item.y };
        })
      );
      series.setCursorResultTableFormatter(
        (builder, series, xValue, yValue) => {
          return (
            builder
              .addRow(`Currency: ${series.getName()}`)
              .addRow(
                `Time: ${new Date(xValue + date.getTime()).toLocaleString(
                  "en-UK"
                )}`
              )
              // eslint-disable-next-line no-magic-numbers
              .addRow(`24h Percentage Change: ${yValue.toFixed(2)}%`)
          );
        }
      );
    });

    chart.addLegendBox(LegendBoxBuilders.HorizontalLegendBox).add(chart);

    chart
      .getDefaultAxisY()
      .addConstantLine()
      .setValue(0)
      .setMouseInteractions(false);

    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="currency-graph" style={{ height: "400px" }}></div>;
};

export default MultiLineGraph;
