import { lightningChart, LineSeries } from "@arction/lcjs";
import { dataPoint } from "../App";
import React from "react";

type stateType = { series: LineSeries; id: string };
type propsType = { id: string; data: dataPoint[] };

class Chart extends React.Component<propsType, stateType> {
  componentDidMount() {
    const chart = lightningChart().ChartXY({ container: this.props.id });
    const series = chart.addLineSeries();

    this.setState({
      series: series,
      id: this.props.id,
    });

    series.add(this.props.data);
  }

  componentDidUpdate() {
    this.state.series.add(this.props.data);
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

export default Chart;
