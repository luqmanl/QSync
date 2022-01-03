import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import Analysis from "./pages/Analysis";
import AnalysisLanding from "./pages/AnalysisLanding";

const App = () => {
  return (
    <div className="page">
      <Switch>
        <Route path="/overview">{<Overview />}</Route>
        <Route exact path="/analysis">
          {<AnalysisLanding />}
        </Route>
        <Route path="/analysis/:pair">{<Analysis />}</Route>
      </Switch>
    </div>
  );
};

export default App;
