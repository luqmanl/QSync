import axios from "axios";
import { useEffect, useState } from "react";
import "./NewsFeed.css";
import { exampleData } from "../exampleData/ExampleNewsFeed";

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
  const [news, setNews] = useState<newsListing[]>(exampleData);

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
    <div className="news-box">
      {news.map((item) => {
        return <h2 key={item.description}>{item.description}</h2>;
      })}
    </div>
  );
};

export default NewsFeed;
