import React from "react";
import "./App.css";
import Chart from "./components/Chart";

export interface Item {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export type dataPoint = { x: number; y: number };
type thisState = { data: dataPoint[]; socket: WebSocket };
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
        <Chart id="chart-1" data={this.state.data} />
      </div>
    );
  }
}

export default App;
