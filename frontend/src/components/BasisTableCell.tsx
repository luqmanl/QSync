/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable new-cap */
/* eslint-disable no-undefined */
import { useState, useEffect, useRef } from "react";
import "./BasisTable.css";
import "./BasisTableCell.css";
import { Modal, Button } from "react-bootstrap";
import StandardLineChart from "./StandardLineChart";
import { ExampleBasisHistory } from "../exampleData/ExampleBasisHistory";
import { lightningChart } from "@arction/lcjs";
import { graphPoint } from "./TopCurrencyGraph";
import axios from "axios";

interface btcPropsType {
  spot: string;
  future: string;
  value: string;
}

const basisHistoryGraph = (spot: string, future: string) => {
  const changeDate = (date: Date, period: number) => {
    if (period === 0) {
      date.setDate(date.getDate() - 1);
    } else if (period === 1) {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setFullYear(date.getFullYear() - 1);
    }
  };

  const freqMap = ["SECOND", "MINUTE", "HOUR"];
  const periodMap = ["MONTH", "WEEK", "YEAR"];
  const [period, setPeriod] = useState(2);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [data, setData] = useState<graphPoint[]>([]);

  const url = `http://localhost:8000/historicalBasisData/1w/BTC-USDT/BTC-USD-PERP/${spot}/${future}`;

  useEffect(() => {
    const newDate = new Date();
    changeDate(newDate, period);
    setDate(newDate);
    axios
      .get(url, {})
      .then((res) => {
        const newData = res.data.data.map((item: { x: string; y: number }) => {
          return {
            x: new Date(item.x).getTime() - newDate.getTime(),
            y: item.y,
          };
        });
        console.log(data);
        setData(newData);
        console.log(newData);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, [period]);

  const loadingSpinner = (
    <div className="d-flex justify-content-center">
      <div
        className="spinner-border"
        style={{ height: "750px", width: "750px", marginTop: "5vh" }}
      ></div>
    </div>
  );

  return (
    <div>
      {loading ? (
        loadingSpinner
      ) : (
        <div>
          <StandardLineChart
            graphTitle="Basis History Graph"
            data={data}
            date={date}
            id="basis-history-graph"
            xAxis="Time"
            yAxis="Basis"
          />
          <div className="button-container">
            <h3>Set Data Period:</h3>
            {periodMap.map((opt, i) => {
              return (
                <Button
                  key={i}
                  disabled={period === i}
                  onClick={() => {
                    setLoading(true);
                    setPeriod(i);
                  }}
                  className="button"
                >
                  {opt}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const BasisTableCell = (props: btcPropsType) => {
  const [showDetailed, setShowDetailed] = useState(false);

  const handleClose = () => setShowDetailed(false);
  const handleOpen = () => setShowDetailed(true);

  return (
    <td onClick={handleOpen} className="table-cell">
      <Modal show={showDetailed} onHide={handleClose} fullscreen>
        <Modal.Body>{basisHistoryGraph(props.spot, props.future)}</Modal.Body>
      </Modal>
      {props.value}
    </td>
  );
};

export default BasisTableCell;
