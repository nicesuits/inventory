import React from "react";
import ReactDOM from "react-dom";
import { Route, Redirect, HashRouter, Switch, withRouter } from "react-router-dom";

import InventoryList from "./components/InventoryList";
import InventoryEdit from "./components/InventoryEdit";

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
      "Inventory"
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
        React.createElement(Route, {
          exact: true,
          path: "/inventory",
          component: withRouter(InventoryList)
        }),
        React.createElement(Route, { exact: true, path: "/inventory/:id", component: InventoryEdit }),
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
      { href: "https://github.com/raion314/inventory", target: "_blank" },
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
    React.createElement(Redirect, { exact: true, from: "/", to: "/inventory" }),
    React.createElement(Route, { path: "/", component: App })
  )
);

ReactDOM.render(React.createElement(RoutedApp, null), contentNode);