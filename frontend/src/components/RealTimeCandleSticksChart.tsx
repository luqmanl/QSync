import { lightningChart, LineSeries, OHLCSeriesTypes, OHLCSeriesWithAutomaticPacking, AxisScrollStrategies } from "@arction/lcjs";
import { dataPoint } from "../App";
import React from "react";

type stateType = { 
  series: LineSeries; 
  id: string;
  ohlcSeriesAutoPacking: OHLCSeriesWithAutomaticPacking;
};
type propsType = { 
  id: string; 
  data: dataPoint[];
  graphTitle: string;
  xAxis: string;
  yAxis: string;
};

class RealTimeCandleSticksChart extends React.Component<propsType, stateType> {
  componentDidMount() {
    const chart = lightningChart().ChartXY({ container: this.props.id });
    const series = chart.addLineSeries()
      .setCursorEnabled(false)
      .setStrokeStyle((strokeStyle) => strokeStyle
        .setFillStyle((fill: any) => fill.setA(70))
        .setThickness(1)
    );

    const ohlcSeriesAutoPacking = chart.addOHLCSeries(
      // Specify type of OHLC-series for adding points
      { seriesConstructor: OHLCSeriesTypes.AutomaticPacking }
    ).setPackingResolution(50);

    this.setState({
      series: series,
      id: this.props.id,
      ohlcSeriesAutoPacking: ohlcSeriesAutoPacking
    });

    chart.getDefaultAxisX()
    .setScrollStrategy(AxisScrollStrategies.progressive)
      // View fits 5 minutes.
      .setInterval(0, 2000)

    chart.setTitle(this.props.graphTitle);

    chart.getDefaultAxisX()
      .setTitle(this.props.xAxis);

    chart.getDefaultAxisY()
      .setTitle(this.props.yAxis);

    series.add(this.props.data);
  }

  componentDidUpdate() {
    this.state.series.add(this.props.data);
    this.state.ohlcSeriesAutoPacking.add(this.props.data);
  }

  render() {
    return (
      <div
        style={{
          height: "100vh",
        }}
        id={this.props.id}
        className="chart"
      ></div>
    );
  }
}

export default RealTimeCandleSticksChart;
