// Also test https://www.ag-grid.com/
/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themesAnimated from "@amcharts/amcharts4/themes/animated";
import React from 'react';

/* Chart code */
// Themes begin
am4core.useTheme(am4themesAnimated);
// Themes end

type thisState = {
    chart: am4charts.XYChart;
}

class OrderBook extends React.Component<unknown, thisState> {
    componentDidMount() {
        // Create chart instance
        const chart = am4core.create("chartdiv", am4charts.XYChart);

        // Add data
        chart.dataSource.url = "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=50";
        chart.dataSource.reloadFrequency = 1000;
        chart.dataSource.adapter.add("parsedData", function(data) {
            const res: any = [];

            // Function to process (sort and calculate cummulative volume)
            const processData = (list: any, type: any, desc: any) => {

                // Convert to data points
                for(let i = 0; i < list.length; i++) {
                    list[i] = {
                        value: Number(list[i][0]),
                        volume: Number(list[i][1]),
                    }
                }

                // Sort list just in case
                list.sort((a: any, b: any) => {
                    if (a.value > b.value) {
                        return 1;
                    }
                    else if (a.value < b.value) {
                        return -1;
                    }
                    
                    return 0;
                });

                // Calculate cummulative volume
                if (desc) {
                    for(let i = list.length - 1; i >= 0; i--) {
                        if (i < (list.length - 1)) {
                            list[i].totalvolume = list[i+1].totalvolume + list[i].volume;
                        }
                        else {
                            list[i].totalvolume = list[i].volume;
                        }
                        const v1 = `${type}volume`;
                        const v2 = `${type}totalvolume`;
                        const dp = {
                            value: list[i].value,
                            v1: list[i].volume,
                            v2: list[i].totalvolume
                        };
                        res.unshift(dp);
                    }
                }
                else {
                    for(let i = 0; i < list.length; i++) {
                        if (i > 0) {
                            list[i].totalvolume = list[i-1].totalvolume + list[i].volume;
                        }
                        else {
                            list[i].totalvolume = list[i].volume;
                        }
                        const v1 = `${type}volume`;
                        const v2 = `${type}totalvolume`;
                        const dp = {
                            value: list[i].value,
                            v1: list[i].volume,
                            v2: list[i].totalvolume
                        };
                        res.push(dp);
                    }
                }

            }

            // Init
            processData(data.bids, "bids", true);
            processData(data.asks, "asks", false);

            return res;
        });

        // Set up precision for numbers
        chart.numberFormatter.numberFormat = "#,###.####";

        // Create axes
        const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        xAxis.dataFields.category = "value";
        // xAxis.renderer.grid.template.location = 0;
        xAxis.renderer.minGridDistance = 50;
        xAxis.title.text = "Price (BTC/ETH)";

        const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.title.text = "Volume";

        // Create series
        const series = chart.series.push(new am4charts.StepLineSeries());
        series.dataFields.categoryX = "value";
        series.dataFields.valueY = "bidstotalvolume";
        series.strokeWidth = 2;
        series.stroke = am4core.color("#0f0");
        series.fill = series.stroke;
        series.fillOpacity = 0.1;
        series.tooltipText = "Ask: [bold]{categoryX}[/]\nTotal volume: [bold]{valueY}[/]\nVolume: [bold]{bidsvolume}[/]"

        const series2 = chart.series.push(new am4charts.StepLineSeries());
        series2.dataFields.categoryX = "value";
        series2.dataFields.valueY = "askstotalvolume";
        series2.strokeWidth = 2;
        series2.stroke = am4core.color("#f00");
        series2.fill = series2.stroke;
        series2.fillOpacity = 0.1;
        series2.tooltipText = "Ask: [bold]{categoryX}[/]\nTotal volume: [bold]{valueY}[/]\nVolume: [bold]{asksvolume}[/]"

        const series3 = chart.series.push(new am4charts.ColumnSeries());
        series3.dataFields.categoryX = "value";
        series3.dataFields.valueY = "bidsvolume";
        series3.strokeWidth = 0;
        series3.fill = am4core.color("#000");
        series3.fillOpacity = 0.2;

        const series4 = chart.series.push(new am4charts.ColumnSeries());
        series4.dataFields.categoryX = "value";
        series4.dataFields.valueY = "asksvolume";
        series4.strokeWidth = 0;
        series4.fill = am4core.color("#000");
        series4.fillOpacity = 0.2;

        // Add cursor
        chart.cursor = new am4charts.XYCursor();

        this.setState({
            chart: chart
        })
    }

    componentWillUnmount() {
        if (this.state.chart) {
            this.state.chart.dispose();
        }
    }

    render() {
        console.log(this.state);
        return (
            <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
        );
    }
}

export default OrderBook;

