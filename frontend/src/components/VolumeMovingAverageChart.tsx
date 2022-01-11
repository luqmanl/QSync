/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable new-cap */
import {
  lightningChart,
  emptyLine,
  LineSeries,
  AxisTickStrategies,
  LegendBoxBuilders,
} from "@arction/lcjs";
import React from "react";

type dataPoint = {
  x: number;
  y: number;
};

type stateType = {
  series: LineSeries;
  id: string;
};
type propsType = {
  id: string;
  stockData: dataPoint[];
  volumeData: dataPoint[];
  graphTitle: string;
  xAxis: string;
  yAxis: string;
};

class VolumeMovingAverageChart extends React.Component<propsType, stateType> {
  componentDidMount() {
    const db = lightningChart().Dashboard({
      // theme: Themes.darkGold
      numberOfRows: 2,
      numberOfColumns: 1,
    });

    const chartOHLC = db.createChartXY({
      columnIndex: 0,
      rowIndex: 0,
      columnSpan: 1,
      rowSpan: 1,
    });
    // Use DateTime TickStrategy with custom date origin for X Axis.
    chartOHLC
      .getDefaultAxisX()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .setTickStrategy(AxisTickStrategies.DateTime, (tickStrategy: any) =>
        tickStrategy.setDateOrigin(Date.now())
      );
    // Modify Chart.
    chartOHLC
      .setTitle("Trading dashboard")
      // Style AutoCursor.
      .setAutoCursor((cursor) => {
        cursor.disposeTickMarkerY();
        cursor.setGridStrokeYStyle(emptyLine);
      })
      .setPadding({ right: 40 });

    // The top chart should have 66% of view height allocated to it. By giving the first row a height of 2, the relative
    // height of the row becomes 2/3 of the whole view (default value for row height / column width is 1)
    db.setRowHeight(0, 2);

    // Create a LegendBox for Candle-Stick and Bollinger Band
    const legendBoxOHLC = chartOHLC
      .addLegendBox(LegendBoxBuilders.VerticalLegendBox)
      // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
      .setAutoDispose({
        type: "max-width",
        maxWidth: 0.3,
      });

    // Define function which sets Y axis intervals nicely.
    let setViewNicely;

    // Create OHLC Figures and Area-range.
    // region

    // Get Y-axis for series (view is set manually).
    const stockAxisY = chartOHLC
      .getDefaultAxisY()
      .setScrollStrategy()
      .setTitle("USD")
      // Synchronize left margins of the stacked charts by assigning a static Y Axis thickness for both.
      .setThickness(80);


    const stockFigureWidth = 5.0;
    const stock = chartOHLC
      .addOHLCSeries({ yAxis: stockAxisY })
      .setName("Candle-Sticks")
      // Setting width of figures
      .setFigureWidth(stockFigureWidth);

    const chart = lightningChart().ChartXY({ container: this.props.id });
    const series = chart.addLineSeries();

    this.setState({
      series: series,
      id: this.props.id,
    });

    chart.setTitle(this.props.graphTitle);

    chart.getDefaultAxisX().setTitle(this.props.xAxis);

    chart.getDefaultAxisY().setTitle(this.props.yAxis);
    // NOTE: unsure whether this is volumeData or stockData
    series.add(this.props.volumeData);
  }

  componentDidUpdate() {
    // NOTE: unsure whether this is volumeData or stockData
    this.state.series.add(this.props.stockData);
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

export default VolumeMovingAverageChart;
