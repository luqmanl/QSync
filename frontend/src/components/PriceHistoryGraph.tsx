import React, { useState, useEffect, useContext } from "react";
import StandardLineChart from "./StandardLineChart";
import { nameMap } from "../CoinData";
import { Button, Spinner } from "react-bootstrap";
import { PairContext, graphPoint } from "../pages/Analysis";
import axios from "axios";

const PriceHistoryGraph = () => {
  const pair = useContext(PairContext);
  const [priceGraphData, setPriceGraphData] = useState<graphPoint[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const timePeriods = ["1D", "7D", "1M", "3M", "1Y", "ALL"];
  const priceGraphEndpoint = `api/priceHistory/BINANCE/${pair}`;
  const addr = `http://${
    process.env.BACK || "localhost:8000"
  }/${priceGraphEndpoint}/${timePeriods[selectedPeriod]}`;

  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setDate(yesterday);
    axios
      .get(addr)
      .then((res) => {
        const { data } = res.data;
        data.map((item: { time: string; price: number }) => {
          return {
            x: new Date(item.time).getTime() - yesterday.getTime(),
            y: item.price,
          };
        });
        setPriceGraphData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err, "hi");
      });
  }, [selectedPeriod]);

  return (
    <div className="his-price-graph-container">
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <StandardLineChart
          data={priceGraphData}
          date={date}
          id="history-price-graph"
          graphTitle={`Price of ${nameMap[pair]}`}
          xAxis="Price"
          yAxis="Time"
        />
      )}

      <div className="time-buttons-container">
        {timePeriods.map((period, idx) => {
          return (
            <Button
              key={idx}
              className="time-button"
              disabled={idx === selectedPeriod}
              onClick={() => {
                setLoading(true);
                setSelectedPeriod(idx);
              }}
              variant="dark"
            >
              {period}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default PriceHistoryGraph;
