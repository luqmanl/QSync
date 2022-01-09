/* eslint-disable no-magic-numbers */
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import "./NewsFeed.css";

export type reponseType = newsListing[];

export interface newsListing {
  provider: string;
  timestamp: string;
  description: string;
  url: string;
}

const MAX_LENGTH = 100;

const NewsFeed = () => {
  const url = `http://${
    process.env.back || "localhost:8000"
  }/api/data/newsfeed`;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<newsListing[]>([]);

  useEffect(() => {
    axios
      .get(url)
      .then((resp) => {
        resp.data.newsListings.forEach((elem: newsListing) => {
          const timeDiffMins = Math.floor(
            (new Date().getTime() - new Date(elem.timestamp).getTime()) /
              (1000 * 60)
          );
          if (timeDiffMins < 60) {
            elem.timestamp = `${timeDiffMins.toString()} mins ago`;
          } else {
            elem.timestamp = `${Math.floor(timeDiffMins / 60)} hour${
              timeDiffMins < 120 ? "" : "s"
            } ago`;
          }
        });

        setNews(resp.data.newsListings);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="newsfeed-container">
      <h1 className="title">Newsfeed</h1>
      <p className="newsfeed-desc">Latest cryptocurrency news displayed here</p>
      {loading ? (
        <div className="loading-container">
          <Spinner animation="border" variant="dark" />
        </div>
      ) : (
        <div className="news-box">
          {news.map((item) => {
            return (
              <div key={Date.now()} className="headline-container">
                <div className="source-box">
                  <h3 className="provider">{item.provider}</h3>
                  <h3 className="timestamp">{item.timestamp}</h3>
                </div>
                <div className="headlineDiv">
                  <a href={item.url} className="headline">
                    <h3>
                      {item.description.length > MAX_LENGTH
                        ? `${item.description.substring(0, MAX_LENGTH)}...`
                        : item.description}
                    </h3>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
