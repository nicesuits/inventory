import React from "react";
import { Link } from "react-router-dom";
import qs from "query-string";

import InventoryAdd from "./InventoryAdd";
import InventoryFilter from "./InventoryFilter";

function InventoryTable(props) {
  const issueRows = props.issues.map(issue => (
    <InventoryRow
      key={issue._id}
      issue={issue}
      deleteIssue={props.deleteIssue}
    />
  ));
  return (
    <table className="bordered-table">
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
      <tbody>{issueRows}</tbody>
    </table>
  );
}

const InventoryRow = props => {
  function onDeleteClick() {
    props.deleteIssue(props.issue._id);
  }
  return (
    <tr>
      <td>
        <Link to={`/inventory/${props.issue._id}`}>
          {props.issue._id.substr(-4)}
        </Link>
      </td>
      <td>{props.issue.status}</td>
      <td>{props.issue.owner}</td>
      <td>{props.issue.created.toDateString()}</td>
      <td>{props.issue.effort}</td>
      <td>
        {props.issue.completionDate
          ? props.issue.completionDate.toDateString()
          : ""}
      </td>
      <td>{props.issue.title}</td>
      <td>
        <button onClick={onDeleteClick}>Delete</button>
      </td>
    </tr>
  );
};

export default class InventoryList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
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
            data.records.forEach(issue => {
              issue.created = new Date(issue.created);
              if (issue.completionDate)
                issue.completionDate = new Date(issue.completionDate);
            });
            this.setState({ issues: data.records });
          });
        } else {
          response.json().then(err => {
            console.error(`[API GET - Failed to fetch issues]: ${err.message}`);
          });
        }
      })
      .catch(err => {
        console.error(`[API GET - ERROR to fetch issues]: ${err}`);
      });
  }
  createIssue(newIssue) {
    fetch("/api/inventory", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newIssue)
    })
      .then(response => response.json())
      .then(updatedIssue => {
        updatedIssue.created = new Date(updatedIssue.created);
        if (updatedIssue.completionDate)
          updatedIssue.completionDate = new Date(updatedIssue.completionDate);
        const newIssues = this.state.issues.concat(updatedIssue);
        this.setState({ issues: newIssues });
      })
      .catch(err =>
        console.error(`Error in sending data to server: ${err.message}`)
      );
  }
  deleteIssue(id) {
    fetch(`/api/inventory/${id}`, { method: "DELETE" }).then(response => {
      if (!response.ok)
        console.error("[MongoDB - DELETE ERROR]: Failed to delete issue");
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
          issues={this.state.issues}
          deleteIssue={this.deleteIssue}
        />
        <hr />
        <InventoryAdd createIssue={this.createIssue} />
      </div>
    );
  }
}
