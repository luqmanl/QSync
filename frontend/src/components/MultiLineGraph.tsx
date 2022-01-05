import { LegendBoxBuilders, lightningChart, Themes } from "@arction/lcjs";
import React, { useEffect } from "react";
import { graphPoint } from "./TopCurrencyGraph";

interface propsType {
  map: { [name: string]: graphPoint[] };
}

const MultiLineGraph = (props: propsType) => {
  const { map } = props;

  useEffect(() => {
    // eslint-disable-next-line new-cap
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
      if (idx === 1) {
        series.add(lists[idx]);
      }
    });

    chart.addLegendBox(LegendBoxBuilders.HorizontalLegendBox).add(chart);

    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="currency-graph" style={{height:"100%"}}></div>;
};

export default MultiLineGraph;
