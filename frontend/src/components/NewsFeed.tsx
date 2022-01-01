import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import "./NewsFeed.css";

export type reponseType = newsListing[];

export interface newsListing {
  provider: string;
  timestamp: number;
  description: string;
  url: string;
}

const NewsFeed = () => {
  const url = `${process.env.PUBLIC_URL || "localhost:8000"}/api/data/newsfeed`;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<newsListing[]>([]);

  useEffect(() => {
    axios
      .get(url)
      .then((resp) => {
        setNews(resp.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="newsfeed-container">
      <h1 className="title">Newsfeed</h1>
      {loading ? (
        <div className="loading-container">
          <Spinner animation="border" variant="dark" />
        </div>
      ) : (
        <div className="news-box">
          {news.map((item) => {
            return (
              <div key={Date.now()} className="headline-container">
                <h5 className="source-box">
                  {item.provider} • {item.timestamp} hours ago
                </h5>
                <a href={item.url} className="headline">
                  <h5>{item.description}</h5>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
