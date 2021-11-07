/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-magic-numbers */
import {
  lightningChart,
  OHLCSeriesTypes,
  // LineSeries,
  // OHLCSeriesWithAutomaticPacking,
  // AxisScrollStrategies,
  // AxisTickStrategies,
  // Series2D,
} from "@arction/lcjs";
import { dataPoint } from "../App";
import React, { useState, useLayoutEffect } from "react";

type propsType = {
  id: string;
  graphTitle: string;
  xAxis: string;
  yAxis: string;
};

const RealTimeCandleSticksChart = (props: propsType) => {
  const [data, setData] = useState<dataPoint[]>([]);

  useLayoutEffect(() => {
    const chart = lightningChart().ChartXY({ container: props.id });
    chart.setTitle(props.graphTitle);
    chart.getDefaultAxisX().setTitle(props.xAxis);
    chart.getDefaultAxisY().setTitle(props.yAxis);

    const series = chart
      .addLineSeries()
      .setCursorEnabled(false)
      .setStrokeStyle((strokeStyle) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        strokeStyle.setFillStyle((fill: any) => fill.setA(70)).setThickness(1)
      );

    const ohlcSeriesAutoPacking = chart.addOHLCSeries(
      // Specify type of OHLC-series for adding pointsif (!chaif (!chartRef.mounted)rtRef.mounted)
      { seriesConstructor: OHLCSeriesTypes.AutomaticPacking }
    );

    const webSocket = new WebSocket("ws://localhost:3456");

    webSocket.onmessage = (event) => {
      const newData = JSON.parse(event.data.toString());
      setData((oldData) => [...oldData, newData]);
      series.add(newData);
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
      }}
      id={props.id}
      className={props.id}
    ></div>
  );
};

export default RealTimeCandleSticksChart;
