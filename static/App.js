import React from "react";
import ReactDOM from "react-dom";
import { Route, Redirect, HashRouter, Switch, withRouter } from "react-router-dom";

import IssueList from "./components/IssueList";
import IssueEdit from "./components/IssueEdit";

const contentNode = document.getElementById("contents");
const NoMatch = () => React.createElement(
  "p",
  null,
  "Page Not Found"
);
const App = () => React.createElement(
  "div",
  null,
  React.createElement(
    "header",
    { className: "header" },
    React.createElement(
      "h1",
      null,
      "Issue Tracker"
    )
  ),
  React.createElement(
    "main",
    { className: "contents" },
    React.createElement(
      HashRouter,
      null,
      React.createElement(
        Switch,
        null,
        React.createElement(Route, { exact: true, path: "/issues", component: withRouter(IssueList) }),
        React.createElement(Route, { exact: true, path: "/issues/:id", component: IssueEdit }),
        React.createElement(Route, { path: "*", component: NoMatch })
      )
    )
  ),
  React.createElement(
    "footer",
    { className: "footer" },
    "Full source code available at GitHub.com",
    " ",
    React.createElement(
      "a",
      { href: "https://github.com/raion314/mern", target: "_blank" },
      "Repo"
    )
  )
);

const RoutedApp = () => React.createElement(
  HashRouter,
  null,
  React.createElement(
    Switch,
    null,
    React.createElement(Redirect, { exact: true, from: "/", to: "/issues" }),
    React.createElement(Route, { path: "/", component: App })
  )
);

ReactDOM.render(React.createElement(RoutedApp, null), contentNode);