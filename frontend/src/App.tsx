import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route } from "react-router-dom";
import Overview from "./pages/Overview";

const App = () => {
  return (
    <div className="page">
      <Switch>
        <Route path="/overview">{<Overview />}</Route>
      </Switch>
    </div>
  );
};

export default App;
