import { lightningChart, LineSeries } from "@arction/lcjs";
import { dataPoint } from "../App";
import React from "react";

type stateType = { series: LineSeries; id: string };
type propsType = { 
  id: string; 
  data: dataPoint[];
  graphTitle: string;
  xAxis: string;
  yAxis: string;
};

class StandardLineChart extends React.Component<propsType, stateType> {
  componentDidMount() {
    const chart = lightningChart().ChartXY({ container: this.props.id });
    const series = chart.addLineSeries();

    this.setState({
      series: series,
      id: this.props.id,
    });

    chart.setTitle(this.props.graphTitle);

    chart.getDefaultAxisX()
      .setTitle(this.props.xAxis);

    chart.getDefaultAxisY()
      .setTitle(this.props.yAxis);

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

export default StandardLineChart;
