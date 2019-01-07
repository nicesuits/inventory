import React from "react";
import { Link } from "react-router-dom";
import qs from "query-string";

import InventoryAdd from "./InventoryAdd";
import InventoryFilter from "./InventoryFilter";

function InventoryTable(props) {
  const inventoryRows = props.inventory.map(item => (
    <InventoryRow key={item._id} item={item} deleteItem={props.deleteItem} />
  ));
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Completion Date</th>
          <th>Title</th>
          <th />
        </tr>
      </thead>
      <tbody>{inventoryRows}</tbody>
    </table>
  );
}

const InventoryRow = props => {
  function onDeleteClick() {
    props.deleteItem(props.item._id);
  }
  return (
    <tr>
      <td>
        <Link to={`/inventory/${props.item._id}`}>
          {props.item._id.substr(-4)}
        </Link>
      </td>
      <td>{props.item.status}</td>
      <td>{props.item.owner}</td>
      <td>{props.item.created.toDateString()}</td>
      <td>{props.item.effort}</td>
      <td>
        {props.item.completionDate
          ? props.item.completionDate.toDateString()
          : ""}
      </td>
      <td>{props.item.title}</td>
      <td>
        <button onClick={onDeleteClick}>Delete</button>
      </td>
    </tr>
  );
};

export default class InventoryList extends React.Component {
  constructor() {
    super();
    this.state = { inventory: [] };
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
    if (
      oldQuery.status === newQuery.status &&
      oldQuery.effort_gte === newQuery.effort_gte &&
      oldQuery.effort_lte === newQuery.effort_lte
    ) {
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
    fetch(`/api/inventory${this.props.location.search}`)
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            console.log(
              `Total count of records: ${data._metadata.total_count}`
            );
            data.records.forEach(item => {
              item.created = new Date(item.created);
              if (item.completionDate)
                item.completionDate = new Date(item.completionDate);
            });
            this.setState({ inventory: data.records });
          });
        } else {
          response.json().then(err => {
            console.error(
              `[API GET - Failed to fetch inventory]: ${err.message}`
            );
          });
        }
      })
      .catch(err => {
        console.error(`[API GET - ERROR to fetch inventory]: ${err}`);
      });
  }
  createIssue(newIssue) {
    fetch("/api/inventory", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newIssue)
    })
      .then(response => response.json())
      .then(updatedItem => {
        updatedItem.created = new Date(updatedItem.created);
        if (updatedItem.completionDate)
          updatedItem.completionDate = new Date(updatedItem.completionDate);
        const newIssues = this.state.inventory.concat(updatedItem);
        this.setState({ inventory: newIssues });
      })
      .catch(err =>
        console.error(`Error in sending data to server: ${err.message}`)
      );
  }
  deleteIssue(id) {
    fetch(`/api/inventory/${id}`, { method: "DELETE" }).then(response => {
      if (!response.ok)
        console.error("[MongoDB - DELETE ERROR]: Failed to delete item");
      else this.loadData();
    });
  }
  render() {
    return (
      <div>
        <InventoryFilter
          setFilter={this.setFilter}
          initFilter={this.props.location.search}
        />
        <hr />
        <InventoryTable
          inventory={this.state.inventory}
          deleteItem={this.deleteItem}
        />
        <hr />
        <InventoryAdd createItem={this.createItem} />
      </div>
    );
  }
}
