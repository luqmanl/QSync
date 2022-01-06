/* eslint-disable no-magic-numbers */
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

  const changeDate = (curDate: Date, period: number): void => {
    if (period === 0) {
      curDate.setDate(curDate.getDay() - 1);
    } else if (period === 1) {
      curDate.setDate(curDate.getDay() - 7);
    } else if (period === 2) {
      curDate.setMonth(curDate.getMonth() - 1);
    } else if (period === 3) {
      curDate.setMonth(curDate.getMonth() - 1);
    } else if (period === 4) {
      curDate.setFullYear(curDate.getFullYear() - 1);
    } else {
      curDate.setFullYear(2020);
    }
  };

  useEffect(() => {
    const c = setInterval(()=>{setLoading(false)},2000)

    const pastDate = new Date();
    changeDate(pastDate, selectedPeriod);
    setDate(pastDate);
    axios
      .get(addr)
      .then((res) => {
        let { data } = res.data;
        data = data.map((item: { time: string; price: number }) => {
          return {
            x: new Date(item.time).getTime() - pastDate.getTime(),
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
        <Spinner
          animation="border"
          style={{ height: "30vh", width: "30vh", margin: "auto auto" }}
        />
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
