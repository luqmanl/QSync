import React from "react";
import "./App.css";
import RealTimeCandleSticksChart from "./components/RealTimeCandleSticksChart";
import StandardLineChart from "./components/StandardLineChart";
import OrderBook from "./components/OrderBook";

export type dataPoint = { x: number; y: number };
type thisState = { 
  data: dataPoint[]; socket: WebSocket };
type thisProps = unknown;

class App extends React.Component<thisProps, thisState> {
  constructor(props: thisProps) {
    super(props);

    this.state = {
      data: [],
      socket: new WebSocket("ws://localhost:2000"),
    };
  }

  componentDidMount() {
    this.state.socket.addEventListener("message", (event: MessageEvent) => {
      this.setState({
        data: JSON.parse(event.data).points,
        socket: this.state.socket,
      });
    });
  }

  render() {
    return (
      <div>
        <StandardLineChart id="chart-1" data={this.state.data} yAxis="Price (USD)" xAxis="Time (UTC)" graphTitle="Random number generator" />
        <RealTimeCandleSticksChart id="chart-2" data={this.state.data} yAxis="Price (USD)" xAxis="Time (UTC)" graphTitle="Random number generator" />
        <OrderBook />
      </div>
    );
  }
}

export default App;
