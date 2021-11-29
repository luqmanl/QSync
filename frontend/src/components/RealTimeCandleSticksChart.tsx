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
import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";

type propsType = {
  id: string;
  graphTitle: string;
  xAxis: string;
  yAxis: string;
};

type dataPoint = {
  x: number;
  y: number;
};

const RealTimeCandleSticksChart = (props: propsType) => {
  const [data, setData] = useState<dataPoint[]>([]);
  const socket = new WebSocket(`ws://localhost:8000/ws/data/l2overview/`);

  useEffect(() => {
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

    socket.onopen = () => {
      console.log("OPEN");
      socket.send(
        JSON.stringify({
          exchanges: ["BINANCE"],
          pairs: ["BTC-USDT"],
        })
      );
    };

    socket.addEventListener("message", (ev) => {
      console.log(ev.data);
      const res = JSON.parse(ev.data);
      const newPoint: dataPoint = {
        y: res.highestBid,
        x: new Date().getSeconds()
      };
      const update = data;
      update.push(newPoint);
      setData(update);
      series.add(newPoint);
    });
  }, []);

  return (
    <>
      <div
        style={{
          height: "100vh",
        }}
        id={props.id}
        className={props.id}
      ></div>
    </>
  );
};

export default RealTimeCandleSticksChart;
