import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import Analysis from "./pages/Analysis";

const App = () => {
  return (
    <div className="page">
      <Switch>
        <Route path="/overview">{<Overview />}</Route>
        <Route path="/analysis/:pair">{<Analysis />}</Route>
      </Switch>
    </div>
  );
};

export default App;
