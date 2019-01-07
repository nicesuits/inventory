import React from "react";
import { Link } from "react-router-dom";
import qs from "query-string";

import InventoryAdd from "./InventoryAdd";
import InventoryFilter from "./InventoryFilter";

function InventoryTable(props) {
  const itemsRows = props.items.map(item => React.createElement(InventoryRow, { key: item._id, item: item, deleteItem: props.deleteItem }));
  return React.createElement(
    "table",
    { className: "bordered-table" },
    React.createElement(
      "thead",
      null,
      React.createElement(
        "tr",
        null,
        React.createElement(
          "th",
          null,
          "ID"
        ),
        React.createElement(
          "th",
          null,
          "Status"
        ),
        React.createElement(
          "th",
          null,
          "Manufactured"
        ),
        React.createElement(
          "th",
          null,
          "Expires"
        ),
        React.createElement(
          "th",
          null,
          "Lot Number"
        ),
        React.createElement(
          "th",
          null,
          "Part Number"
        ),
        React.createElement(
          "th",
          null,
          "Expires Lot Number"
        ),
        React.createElement("th", null)
      )
    ),
    React.createElement(
      "tbody",
      null,
      itemsRows
    )
  );
}

const InventoryRow = props => {
  function onDeleteClick() {
    props.deleteItem(props.item._id);
  }
  return React.createElement(
    "tr",
    null,
    React.createElement(
      "td",
      null,
      React.createElement(
        Link,
        { to: `/inventory/${props.item._id}` },
        props.item._id.substr(-6)
      )
    ),
    React.createElement(
      "td",
      null,
      props.item.status
    ),
    React.createElement(
      "td",
      null,
      props.item.manufactured.substr(-7)
    ),
    React.createElement(
      "td",
      null,
      props.item.expires.substr(-6)
    ),
    React.createElement(
      "td",
      null,
      props.item.lotnumber.substr(-7)
    ),
    React.createElement(
      "td",
      null,
      props.item.partnumber.substr(6, 6)
    ),
    React.createElement(
      "td",
      null,
      props.item.expireslotnumber.substr(-7)
    ),
    React.createElement(
      "td",
      null,
      React.createElement(
        "button",
        { onClick: onDeleteClick },
        "Delete"
      )
    )
  );
};

export default class InventoryList extends React.Component {
  constructor() {
    super();
    this.state = { items: [] };
    this.createItem = this.createItem.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }
  componentDidMount() {
    this.loadData();
  }
  componentDidUpdate(prevProps) {
    const oldQuery = prevProps.location.search;
    const newQuery = this.props.location.search;
    if (oldQuery.status === newQuery.status && oldQuery.effort_gte === newQuery.effort_gte && oldQuery.effort_lte === newQuery.effort_lte) {
      return;
    }
    this.loadData();
  }
  setFilter(query) {
    this.props.history.push({
      pathname: this.props.location.pathname,
      search: `?${qs.stringify(query)}`
    });
  }
  loadData() {
    fetch(`/api/inventory${this.props.location.search}`).then(response => {
      if (response.ok) {
        response.json().then(data => {
          console.log(`Total count of records: ${data._metadata.total_count}`);
          data.records.forEach(item => {
            item.created = new Date(item.created);
            if (item.completionDate) item.completionDate = new Date(item.completionDate);
          });
          this.setState({ items: data.records });
        });
      } else {
        response.json().then(err => {
          console.error(`[API GET - Failed to fetch items]: ${err.message}`);
        });
      }
    }).catch(err => {
      console.error(`[API GET - ERROR to fetch items]: ${err}`);
    });
  }
  createItem(newItem) {
    fetch("/api/inventory", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newItem)
    }).then(response => response.json()).then(updatedItem => {
      updatedItem.created = new Date(updatedItem.created);
      if (updatedItem.completionDate) updatedItem.completionDate = new Date(updatedItem.completionDate);
      const newItems = this.state.items.concat(updatedItem);
      this.setState({ items: newItems });
    }).catch(err => console.error(`Error in sending data to server: ${err.message}`));
  }
  deleteItem(id) {
    fetch(`/api/inventory/${id}`, { method: "DELETE" }).then(response => {
      if (!response.ok) console.error("[MongoDB - DELETE ERROR]: Failed to delete item");else this.loadData();
    });
  }
  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(InventoryFilter, {
        setFilter: this.setFilter,
        initFilter: this.props.location.search
      }),
      React.createElement("hr", null),
      React.createElement(InventoryTable, { items: this.state.items, deleteItem: this.deleteItem }),
      React.createElement("hr", null),
      React.createElement(InventoryAdd, { createItem: this.createItem })
    );
  }
}