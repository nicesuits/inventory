import React, { Component } from "react";
import { Link } from "react-router-dom";

import DateInput from "./DateInput";
import NumInput from "./NumInput";

export default class IssueEdit extends Component {
  constructor() {
    super();
    this.state = {
      issue: {
        _id: "",
        title: "",
        status: "",
        owner: "",
        effort: null,
        completionDate: null,
        created: null
      },
      invalidFields: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.loadData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id)
      this.loadData();
  }
  onChange(e, convertedValue) {
    const issue = Object.assign({}, this.state.issue);
    const value =
      convertedValue !== undefined ? convertedValue : e.target.value;
    issue[e.target.name] = value;
    this.setState({ issue });
  }
  onValidityChange(e, valid) {
    const invalidFields = Object.assign({}, this.state.invalidFields);
    if (!valid) {
      invalidFields[e.target.name] = true;
    } else {
      delete invalidFields[e.target.name];
    }
    this.setState({ invalidFields });
  }
  onSubmit(e) {
    e.preventDefault();
    if (Object.keys(this.state.invalidFields).length !== 0) return;
    fetch(`/api/issues/${this.props.match.params.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(this.state.issue)
    })
      .then(response => {
        if (response.ok) {
          response.json().then(updatedIssue => {
            updatedIssue.created = new Date(updatedIssue.created);
            if (updatedIssue.completionDate)
              updatedIssue.completionDate = new Date(
                updatedIssue.completionDate
              );
            this.setState({ issue: updatedIssue });
            console.log("Updated issue successfully");
          });
        } else {
          response.json().then(err => {
            console.error(
              `[MongoDB - UPDATE ERROR] Failed to update issue: ${err.message}`
            );
          });
        }
      })
      .catch(err => {
        console.error(
          `[MongoDB - UPDATE ERROR] Error in sending data to server while update issue: ${
            err.message
          }`
        );
      });
  }
  loadData() {
    fetch(`/api/issues/${this.props.match.params.id}`).then(response => {
      if (response.ok) {
        response.json().then(issue => {
          issue.created = new Date(issue.created);
          issue.completionDate =
            issue.completionDate != null
              ? new Date(issue.completionDate)
              : null;
          this.setState({ issue });
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
    const issue = this.state.issue;
    const validationMessage =
      Object.keys(this.state.invalidFields).length === 0 ? null : (
        <div className="error">
          Please correct invalid fields before submitting
        </div>
      );
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          ID: {issue._id}
          <br />
          Created: {issue.created ? issue.created.toDateString() : ""}
          <br />
          Status:{" "}
          <select name="status" value={issue.status} onChange={this.onChange}>
            <option value="New">New</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="Fixed">Fixed</option>
            <option value="Verified">Verified</option>
            <option value="Closed">Closed</option>
          </select>
          <br />
          Owner:{" "}
          <input
            type="text"
            name="owner"
            value={issue.owner}
            onChange={this.onChange}
          />
          <br />
          Effort:{" "}
          <NumInput
            size={5}
            name="effort"
            value={issue.effort}
            onChange={this.onChange}
          />
          <br />
          Completion Date:{" "}
          <DateInput
            name="completionDate"
            value={issue.completionDate}
            onChange={this.onChange}
            onValidityChange={this.onValidityChange}
          />
          <br />
          Title:{" "}
          <input
            type="text"
            size={50}
            name="title"
            value={issue.title}
            onChange={this.onChange}
          />
          <br />
          {validationMessage}
          <button type="submit">Submit</button>
          <br />
          <Link to="/issues">Back to issue list</Link>
        </form>
      </div>
    );
  }
}
