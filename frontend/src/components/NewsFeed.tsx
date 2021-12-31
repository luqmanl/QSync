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
      Culpa deserunt irure esse voluptate. Ex laborum quis excepteur ut enim.
      Sint sit velit ut duis qui in consequat. Ex aute eu culpa pariatur. Mollit
      laboris qui cillum consequat eiusmod anim pariatur cupidatat. Eiusmod ad
      adipisicing in dolor ullamco tempor nisi. Officia consequat dolore eu anim
      aliqua dolor amet proident duis culpa magna enim. Lorem ullamco sunt aute
      elit Lorem cillum proident labore. Laborum veniam ad excepteur
      exercitation ipsum et qui anim laboris. Non aute laborum officia minim non
      aliqua deserunt nulla nostrud labore velit adipisicing. Incididunt
      incididunt labore ipsum minim Lorem pariatur in proident qui cillum nisi.
      Qui sunt quis irure culpa amet quis deserunt ut reprehenderit irure duis
      magna consectetur commodo. Consectetur aliquip velit magna enim dolore ex.
      Commodo ea veniam aliquip fugiat id voluptate minim labore. Occaecat
      labore ea ex sit amet occaecat velit eiusmod quis voluptate pariatur est
      et. Non velit voluptate proident proident. Qui consequat ea sunt magna.
      Dolor et commodo quis ea duis aliquip aliquip. Officia qui commodo aliquip
      in eiusmod nulla mollit pariatur qui id culpa cupidatat consectetur
      deserunt. Deserunt adipisicing anim et aliquip ad esse aliquip excepteur
      mollit velit ullamco ut sunt. Culpa deserunt irure esse voluptate. Ex
      laborum quis excepteur ut enim. Sint sit velit ut duis qui in consequat.
      Ex aute eu culpa pariatur. Mollit laboris qui cillum consequat eiusmod
      anim pariatur cupidatat. Eiusmod ad adipisicing in dolor ullamco tempor
      nisi. Officia consequat dolore eu anim aliqua dolor amet proident duis
      culpa magna enim. Lorem ullamco sunt aute elit Lorem cillum proident
      labore. Laborum veniam ad excepteur exercitation ipsum et qui anim
      laboris. Non aute laborum officia minim non aliqua deserunt nulla nostrud
      labore velit adipisicing. Incididunt incididunt labore ipsum minim Lorem
      pariatur in proident qui cillum nisi. Qui sunt quis irure culpa amet quis
      deserunt ut reprehenderit irure duis magna consectetur commodo.
      Consectetur aliquip velit magna enim dolore ex. Commodo ea veniam aliquip
      fugiat id voluptate minim labore. Occaecat labore ea ex sit amet occaecat
      velit eiusmod quis voluptate pariatur est et. Non velit voluptate proident
      proident. Qui consequat ea sunt magna. Dolor et commodo quis ea duis
      aliquip aliquip. Officia qui commodo aliquip in eiusmod nulla mollit
      pariatur qui id culpa cupidatat consectetur deserunt. Deserunt adipisicing
      anim et aliquip ad esse aliquip excepteur mollit velit ullamco ut sunt.
    </div>
  );
};

export default NewsFeed;
