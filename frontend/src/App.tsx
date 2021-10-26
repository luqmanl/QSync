import React from "react";
import "./App.css";
import OrderBook from "./components/OrderBook";
import OrderBookTable from "./components/OrderBookTable";
import RealTimeCandleSticksChart from "./components/RealTimeCandleSticksChart";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export type dataPoint = {
  x: number;
  y: number;
};

export interface Item {
  id: number;
  bookData: bookData;
}

interface bookData {
  time: string;
  sym: string;
  feedhandlerTime: string;
  bids: number[];
  asks: number[];
  bidSizes: number[];
  askSizes: number[];
}

type thisState = {
  data: Item;
  counter: number;
  socket: WebSocket;
  graphData: dataPoint[];
};

const otherData: Item = {
  id: 1,
  bookData: {
    time: "1649141143000",
    sym: "BTC-USDT",
    feedhandlerTime: "688087649133238000",
    bids: [
      65994.95, 65994.94, 65994.35, 65993.95, 65993.38, 65990.83, 65990.0,
      65989.0, 65988.69, 65986.42, 65986.41, 65986.25, 65985.39, 65985.38,
      65985.0, 65984.68, 65984.28, 65982.36, 65982.02, 65980.65, 65994.96,
    ],
    asks: [
      66000.01, 66000.72, 66005.56, 66005.57, 66008.16, 66008.54, 66008.55,
      66010.33, 66010.34, 66010.98, 66010.99, 66011.0, 66011.65, 66013.79,
      66015.11, 66015.12, 66015.92, 66019.77, 66022.53, 1.10593, 0.11363,
    ],
    bidSizes: [
      0.89523, 0.07576, 0.00556, 0.00758, 0.04701, 0.0017, 0.09765, 0.0591,
      0.00554, 0.14659, 0.04418, 0.1825, 0.00437, 0.05, 0.00227, 0.0303, 0.0125,
      0.3416, 0.61913, 0.00413, 0.05813,
    ],
    askSizes: [
      0.008, 0.00717, 0.1825, 0.035, 0.00025, 0.18286, 0.09408, 0.29342, 0.0591,
      0.09612, 0.02, 0.23524, 0.0591, 0.1825, 0.00712, 0.29, 0.1825,
    ],
  },
};

type thisProps = unknown;
class App extends React.Component<thisProps, thisState> {
  constructor(props: thisProps) {
    super(props);

    this.state = {
      data: otherData,
      counter: 0,
      socket: new WebSocket("ws://localhost:2000"),
      graphData: [{ x: 1, y: 2 }],
    };
  }

  componentDidMount() {
    this.setState({
      ...this.state,
    });
    this.state.socket.addEventListener("message", (event: MessageEvent) => {
      this.setState({
        ...this.state,
        graphData: JSON.parse(event.data).points,
      });
    });
    window.setInterval(() => this.refreshList(), 1000);
  }

  refreshList = () => {
    axios
      .get<Item[]>("http://localhost:8000/api/book/")
      .then((res) => {
        this.setState({
          data: res.data[res.data.length - 1],
        });
        console.log(res.data.length - 1);
      })
      .catch((err) => console.log(err));
  };

  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div>
        <RealTimeCandleSticksChart
          id="chart-2"
          data={this.state.graphData}
          yAxis="Price (USD)"
          xAxis="Time (UTC)"
          graphTitle="Price against Time"
        />
        <OrderBook />
        <OrderBookTable data={this.state.data} />
      </div>
    );
  }
}

export default App;
