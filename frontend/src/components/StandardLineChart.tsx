import {
  FontSettings,
  lightningChart,
  LineSeries,
  Themes,
} from "@arction/lcjs";
import React from "react";

type stateType = { series: LineSeries; id: string };
type propsType = {
  id: string;
  data: dataPoint[];
  graphTitle: string;
  xAxis: string;
  yAxis: string;
};

export type dataPoint = {
  x: number;
  y: number;
};

class StandardLineChart extends React.Component<propsType, stateType> {
  componentDidMount() {
    // eslint-disable-next-line new-cap
    const chart = lightningChart().ChartXY({
      container: this.props.id,
      theme: Themes.lightNew,
    });
    const series = chart.addLineSeries();

    this.setState({
      series: series,
      id: this.props.id,
    });

    const font = new FontSettings({
      size: 20,
      family: "Nunito Sans, sans-serif",
    });
    chart.setTitleFont(font);

    chart.setTitle(this.props.graphTitle);

    chart.getDefaultAxisX().setTitle(this.props.xAxis).setTitleFont(font);

    chart.getDefaultAxisY().setTitle(this.props.yAxis).setTitleFont(font);

    series.add(this.props.data);
  }

  componentDidUpdate() {
    this.state.series.add(this.props.data);
  }

  render() {
    return <div id={this.props.id} className="chart"></div>;
  }
}

export default StandardLineChart;
