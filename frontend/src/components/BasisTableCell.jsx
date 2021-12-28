/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable new-cap */
/* eslint-disable no-undefined */
import { useState, useEffect, useRef } from "react";
import "./BasisTable.css";
import "./BasisTableCell.css";
import { Modal, Button } from "react-bootstrap";
import { ExampleBasisHistory } from "./ExampleBasisHistory";
import { lightningChart } from "@arction/lcjs";
import axios from "axios";

const Chart = (props) => {
  const { data, id } = props;
  const chartRef = useRef(undefined);

  useEffect(() => {
    console.log("DATA", data);
    const chart = lightningChart().ChartXY({ container: id });
    chart.setTitle("Basis Graph");
    const series = chart.addLineSeries();
    chartRef.current = { chart, series };

    return () => {
      chart.dispose();
      chartRef.current = undefined;
    };
  }, [id]);

  useEffect(() => {
    const components = chartRef.current;
    if (!components) {
      return;
    }

    const { series } = components;
    console.log("set chart data", data);
    series.clear().add(data);
  }, [data, chartRef]);

  return <div id={id} className="chart"></div>;
};

const basisHistoryGraph = (spot, future) => {
  const freqMap = ["SECOND", "MINUTE", "HOUR"];
  const periodMap = ["MONTH", "WEEK", "YEAR"];
  const [freq, setFreq] = useState(2);
  const [period, setPeriod] = useState(2);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(ExampleBasisHistory);

  const url = `http://localhost:8000/historicalBasisData`;

  useEffect(() => {
    axios
      .get(url, {})
      .then((res) => {
        console.log("HELLLLLOOOO", res.data);
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, [freq, period]);

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
          <Chart className="graph" data={data} id="id" />
          <div className="button-container">
            <h3>Set Data Frequency:</h3>
            {freqMap.map((opt, i) => {
              return (
                <Button
                  key={i}
                  disabled={freq === i}
                  onClick={() => {
                    setFreq(i);
                  }}
                  className="button"
                >
                  {opt}
                </Button>
              );
            })}
          </div>
          <div className="button-container">
            <h3>Set Data Period:</h3>
            {periodMap.map((opt, i) => {
              return (
                <Button
                  key={i}
                  disabled={period === i}
                  onClick={() => {
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

const BasisTableCell = (props) => {
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
