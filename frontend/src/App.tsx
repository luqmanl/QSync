import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Overview from "./pages/Overview";
import Analysis from "./pages/Analysis";
import AnalysisLanding from "./pages/AnalysisLanding";
import BasisTable from "./components/BasisTable";
const App = () => {
  return (
    <div className="page">
      <Switch>
        <Route path="/overview">
          <Overview />
        </Route>
        <Route exact path="/analysis">
          <AnalysisLanding />
        </Route>
        <Route path="/analysis/:pair">
          <Analysis />
        </Route>
        <Route path="/arbitrage">
          <BasisTable />
        </Route>
        <Redirect from="*" to="/overview" />
      </Switch>
    </div>
  );
};

export default App;
