/* eslint-disable react/prop-types */
/* eslint-disable new-cap */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-magic-numbers */
import React, { useState, useEffect, useRef } from "react";
import "./BasisTable.css";
import "./BasisTableCell.css";
import { Modal, Spinner } from "react-bootstrap";
import StandardLineChart from "./StandardLineChart";
import axios from "axios";
import { ExampleBasisHistory } from "./ExampleBasisHistory";
import Module from "module";
import { lightningChart } from "@arction/lcjs";


const Chart = (props) => {
  const { data, id } = props
  const chartRef = useRef(undefined)

  useEffect(() => {
    // Create chart, series and any other static components.
    // NOTE: console log is used to make sure that chart is only created once, even if data is changed!
    console.log('create chart')
    const chart = lightningChart().ChartXY({ container: id })
    const series = chart.addLineSeries()
    // Store references to chart components.
    chartRef.current = { chart, series }

    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      console.log('destroy chart')
      chart.dispose()
      chartRef.current = undefined
    }
  }, [id])

  useEffect(() => {
    const components = chartRef.current
    if (!components) {return}

    // Set chart data.
    const { series } = components
    console.log('set chart data', data)
    series.clear().add(data)
  
  }, [data, chartRef])

  return <div id={id} className='chart'></div>
}

const basisHistoryGraph = (spot, future) => {
  const freqMap = ["SECOND", "MINUTE", "HOUR"];
  const periodMap = ["MONTH", "WEEK", "YEAR"];
  const [freq, setFreq] = useState(2);
  const [period, setPeriod] = useState(2);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(ExampleBasisHistory);

  const url = `http://localhost:8000/api/basis/${spot}/${future}/${freqMap[freq]}/${periodMap[period]}`;

  useEffect(() => {
    // axios.get(url).then((res) => {
    //   console.log(res);
    //   const resp = JSON.parse(res.data);
    //   setData(resp);
    //   setLoading(false);
    // });
  }, []);

  return <div>
    <Chart className="graph" data={data} id="id" />
  </div>;
};

const BasisTableCell = (props) => {
  const [showDetailed, setShowDetailed] = useState(false);

  const handleClose = () => setShowDetailed(false);
  const handleOpen = () => setShowDetailed(true);

  return (
    <td onClick={handleOpen}>
      <Modal show={showDetailed} onHide={handleClose} size="lg">
        <Modal.Body>{basisHistoryGraph(props.spot, props.future)}</Modal.Body>
      </Modal>
      {props.value}
    </td>
  );
};

export default BasisTableCell;