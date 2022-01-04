/* eslint-disable no-magic-numbers */
import React, { useEffect,useState } from "react";
import exampleData from "../exampleData/ExampleTopCurrencyGraphData";
import { LegendBoxBuilders, lightningChart, Themes, LineSeries } from "@arction/lcjs";
import "./TopCurrencyGraph.css";
import axios from "axios"
export interface data {
  data: dataPoint[];
}

export interface dataPoint {
  currency: string;
  percentage: number;
  timestamp: string;
}

interface graphPoint {
  x: number;
  y: number;
}

// const colours = ["red", "blue", "green", "pink", "brown"];

const TopCurrencyGraph = () => {
  const historicalAddr = `http://${process.env.back || "localhost:8000"}/historical24hChangeData`
  const [stuf, setStuf] = useState<{[name : string] : graphPoint[]}>({})

  
  
  useEffect(() => {
    const map: { [name: string]: graphPoint[] } = {}
    axios.get(historicalAddr).then((res) => {
      const { points } = res.data;
      const pointList = points as dataPoint[]
      pointList.forEach((obj)=>{
        const newPoint = {x : new Date(obj.timestamp).getTime(), y : obj.percentage}
        if (obj.currency in map){
          map[obj.currency].push(newPoint)
          
        } else {
          map[obj.currency] = [newPoint]
        }
      })
      setStuf(map)
    }).catch((err) => { console.log(err, historicalAddr) })
}, [])

useEffect(()=>{
  const chart = lightningChart().ChartXY({
    theme: Themes.lightNew,
    container: "currency-graph",
  })
  chart.setTitle("Top Currencies");
  chart.getDefaultAxisX().setTitle("Time");
  chart.getDefaultAxisY().setTitle("Percentage Change");

  const seriesMap : {[cur : string] : LineSeries} = {}


  const entries = Object.entries(stuf)
  const names = entries.map(([a,_])=> a)
  const lists = entries.map(([_,b])=>b)

  const seriesArray = new Array(5).fill(null).map((_,idx) => chart
    .addLineSeries({ dataPattern: {
      pattern: 'ProgressiveX',
    } })
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .setName(names[idx])
  )

  seriesArray.forEach((series,idx)=>{
    series.add(lists[idx])
  })

 

  chart.addLegendBox(LegendBoxBuilders.HorizontalLegendBox).add(chart);
  
  console.log(seriesArray)
},[stuf])

// done thnx
return (
  <div className="graph-container">
    <div id="currency-graph" className="graph-container"></div>
  </div>
);
};

export default TopCurrencyGraph;
