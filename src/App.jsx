import React from "react";
import ReactDOM from "react-dom";
import {
  Route,
  Redirect,
  HashRouter,
  Switch,
  withRouter
} from "react-router-dom";

import InventoryList from "./components/InventoryList";
import InventoryEdit from "./components/InventoryEdit";

const contentNode = document.getElementById("contents");
const NoMatch = () => <p>Page Not Found</p>;
const App = () => (
  <div>
    <header className="header">
      <h1>Inventory</h1>
    </header>
    <main className="contents">
      <HashRouter>
        <Switch>
          <Route
            exact
            path="/inventory"
            component={withRouter(InventoryList)}
          />
          <Route exact path="/inventory/:id" component={InventoryEdit} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </HashRouter>
    </main>
    <footer className="footer">
      Full source code available at GitHub.com{" "}
      <a href="https://github.com/raion314/inventory" target="_blank">
        Repo
      </a>
    </footer>
  </div>
);

const RoutedApp = () => (
  <HashRouter>
    <Switch>
      <Redirect exact from="/" to="/inventory" />
      <Route path="/" component={App} />
    </Switch>
  </HashRouter>
);

ReactDOM.render(<RoutedApp />, contentNode);
