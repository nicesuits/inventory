import React from "react";
import ReactDOM from "react-dom";
import {
  Route,
  Redirect,
  HashRouter,
  Switch,
  withRouter
} from "react-router-dom";

import IssueList from "./components/IssueList";
import IssueEdit from "./components/IssueEdit";

const contentNode = document.getElementById("contents");
const NoMatch = () => <p>Page Not Found</p>;
const App = () => (
  <div>
    <header className="header">
      <h1>Issue Tracker</h1>
    </header>
    <main className="contents">
      <HashRouter>
        <Switch>
          <Route exact path="/issues" component={withRouter(IssueList)} />
          <Route exact path="/issues/:id" component={IssueEdit} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </HashRouter>
    </main>
    <footer className="footer">
      Full source code available at GitHub.com{" "}
      <a href="https://github.com/raion314/mern" target="_blank">
        Repo
      </a>
    </footer>
  </div>
);

const RoutedApp = () => (
  <HashRouter>
    <Switch>
      <Redirect exact from="/" to="/issues" />
      <Route path="/" component={App} />
    </Switch>
  </HashRouter>
);

ReactDOM.render(<RoutedApp />, contentNode);
