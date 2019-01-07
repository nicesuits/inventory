import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class InventoryEdit extends Component {
  constructor() {
    super();
    this.state = {
      item: {
        _id: "",
        title: "",
        status: "",
        owner: "",
        effort: "",
        completionDate: "",
        created: ""
      }
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.loadData();
  }
  onSubmit(e) {
    e.preventDefault();
    if (Object.keys(this.state.invalidFields).length !== 0) return;
    fetch(`/api/inventory/${this.props.match.params.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(this.state.item)
    })
      .then(response => {
        if (response.ok) {
          response.json().then(updatedItem => {
            updatedItem.created = new Date(updatedItem.created);
            if (updatedItem.completionDate)
              updatedItem.completionDate = new Date(updatedItem.completionDate);
            this.setState({ item: updatedItem });
            console.log("Updated item successfully");
          });
        } else {
          response.json().then(err => {
            console.error(
              `[MongoDB - UPDATE ERROR] Failed to update item: ${err.message}`
            );
          });
        }
      })
      .catch(err => {
        console.error(
          `[MongoDB - UPDATE ERROR] Error in sending data to server while update item: ${
            err.message
          }`
        );
      });
  }
  loadData() {
    fetch(`/api/inventory/${this.props.match.params.id}`).then(response => {
      if (response.ok) {
        response.json().then(item => {
          item.created = new Date(item.created);
          item.completionDate =
            item.completionDate != null ? new Date(item.completionDate) : null;
          this.setState({ item });
        });
      } else {
        response.json().then(err => {
          console.error(
            `[MongoDB - Update ERROR]: Error in fetching data from server: ${
              err.message
            }`
          );
        });
      }
    });
  }
  render() {
    const item = this.state.item;
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          ID: {item._id}
          <br />
          Created: {item.created ? item.created.toDateString() : ""}
          <br />
          Status:{" "}
          <select name="status" value={item.status}>
            <option value="New">New</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="Fixed">Fixed</option>
            <option value="Verified">Verified</option>
            <option value="Closed">Closed</option>
          </select>
          <br />
          Owner: <input type="text" name="owner" value={item.owner} />
          <br />
          Effort: <input size={5} name="effort" value={item.effort} />
          <br />
          Completion Date:{" "}
          <input name="completionDate" value={item.completionDate} />
          <br />
          Title: <input type="text" size={50} name="title" value={item.title} />
          <br />
          <button type="submit">Submit</button>
          <br />
          <Link to="/inventory">Back to inventory list</Link>
        </form>
      </div>
    );
  }
}
