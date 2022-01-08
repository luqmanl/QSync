/* eslint-disable no-mixed-operators */
/* eslint-disable no-magic-numbers */
import React, { useEffect, useState } from "react";
import "./KeyMetrics.css";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export interface metricInfo {
  metricName: string;
  metricValue: string;
  isPercentage: boolean;
}

interface colour {
  red: number;
  green: number;
  blue: number;
}

const explanations: { [name: string]: string } = {
  "Fear and Greed indicator":
    "Measures how much greed or fear there is in the market. The higher the value, the more greed there is. Uses inputs like market volatility, surveys and social media to generate this value",
  "Top Coin Change (1D)":
    "Measures how much the price of the top coins have changed in the last day. Useful to see the short term direction of the crypto market",
  "Top Coin Change (7D)":
    "Measures how much the price of the top coins have changed in the week day. Useful to see the short term direction of the crypto market",
  "Total Volume":
    "Measures the total activity in the top coins over the last 24 hours",
  "Most Dominant Coin":
    "The coin which has the largest market cap out of all cryptocurrencies",
  "Max Arbitrage":
    "A discovered arbitrage opportunity which offers the largest return",
  "NASDAQ Crypto Index":
    "Tracks the performance of a diverse range of USD-traded digital assests to assess the perfomance of the crypto market",
};

const generateColour = (value: number): colour => {
  const maxGreen: colour = { red: 32, green: 156, blue: 5 };
  const maxRed: colour = { red: 255, green: 10, blue: 10 };
  const gradient: colour = { red: 222, green: 156, blue: 5 };
  if (value >= 20) {
    return maxGreen;
  }
  if (value <= -20) {
    return maxRed;
  }
  return {
    red: 143.5 - (gradient.red / 40) * value,
    green: 80 + (gradient.green / 40) * value,
    blue: 7.5 + (gradient.blue / 40) * value,
  };
};

const generateMetric = (item: metricInfo) => {
  let colour: colour = { red: 0, green: 0, blue: 0 };
  if (item.isPercentage) {
    colour = generateColour(parseFloat(item.metricValue));
  }
  return (
    <div key={item.metricName} className="metric">
      <p>
        {item.metricName} :{" "}
        <span
          style={
            item.isPercentage
              ? { color: `rgb(${colour.red},${colour.green},${colour.blue})` }
              : {}
          }
        >
          {item.metricValue}{" "}
        </span>
      </p>
    </div>
  );
};

const generateToolTip = (tip: string) => {
  return <Tooltip id="button-tooltip">{tip}</Tooltip>;
};

const KeyMetrics = () => {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<metricInfo[]>([]);

  const linkAddr = `http://${window.location.hostname}:8000/api/key_metrics`;

  useEffect(() => {
    axios
      .get(linkAddr)
      .then((res) => {
        const { data } = res;
        setInfo(data.metrics);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="metric-box">
      <h3 className="metric-title">Key Metrics</h3>
      {loading ? (
        <div className="spinner-container">
          <Spinner animation="border" variant="dark" />
        </div>
      ) : (
        <div className="metrics-container">
          {info.map((item) => {
            return (
              <OverlayTrigger
                key={item.metricName}
                placement="bottom"
                overlay={generateToolTip(explanations[item.metricName])}
              >
                {generateMetric(item)}
              </OverlayTrigger>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KeyMetrics;
