import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Overview from "./pages/Overview";

const App = () => {
  return (
    <div className="page">
      <Switch>
        <Route path="/overview">{<Overview />}</Route>
        <Redirect from="*" to="/overview" />
      </Switch>
    </div>
  );
};

export default App;
