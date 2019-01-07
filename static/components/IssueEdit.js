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
    if (prevProps.match.params.id !== this.props.match.params.id) this.loadData();
  }
  onChange(e, convertedValue) {
    const issue = Object.assign({}, this.state.issue);
    const value = convertedValue !== undefined ? convertedValue : e.target.value;
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
    }).then(response => {
      if (response.ok) {
        response.json().then(updatedIssue => {
          updatedIssue.created = new Date(updatedIssue.created);
          if (updatedIssue.completionDate) updatedIssue.completionDate = new Date(updatedIssue.completionDate);
          this.setState({ issue: updatedIssue });
          console.log("Updated issue successfully");
        });
      } else {
        response.json().then(err => {
          console.error(`[MongoDB - UPDATE ERROR] Failed to update issue: ${err.message}`);
        });
      }
    }).catch(err => {
      console.error(`[MongoDB - UPDATE ERROR] Error in sending data to server while update issue: ${err.message}`);
    });
  }
  loadData() {
    fetch(`/api/issues/${this.props.match.params.id}`).then(response => {
      if (response.ok) {
        response.json().then(issue => {
          issue.created = new Date(issue.created);
          issue.completionDate = issue.completionDate != null ? new Date(issue.completionDate) : null;
          this.setState({ issue });
        });
      } else {
        response.json().then(err => {
          console.error(`[MongoDB - Update ERROR]: Error in fetching data from server: ${err.message}`);
        });
      }
    });
  }
  render() {
    const issue = this.state.issue;
    const validationMessage = Object.keys(this.state.invalidFields).length === 0 ? null : React.createElement(
      "div",
      { className: "error" },
      "Please correct invalid fields before submitting"
    );
    return React.createElement(
      "div",
      null,
      React.createElement(
        "form",
        { onSubmit: this.onSubmit },
        "ID: ",
        issue._id,
        React.createElement("br", null),
        "Created: ",
        issue.created ? issue.created.toDateString() : "",
        React.createElement("br", null),
        "Status:",
        " ",
        React.createElement(
          "select",
          { name: "status", value: issue.status, onChange: this.onChange },
          React.createElement(
            "option",
            { value: "New" },
            "New"
          ),
          React.createElement(
            "option",
            { value: "Open" },
            "Open"
          ),
          React.createElement(
            "option",
            { value: "Assigned" },
            "Assigned"
          ),
          React.createElement(
            "option",
            { value: "Fixed" },
            "Fixed"
          ),
          React.createElement(
            "option",
            { value: "Verified" },
            "Verified"
          ),
          React.createElement(
            "option",
            { value: "Closed" },
            "Closed"
          )
        ),
        React.createElement("br", null),
        "Owner:",
        " ",
        React.createElement("input", {
          type: "text",
          name: "owner",
          value: issue.owner,
          onChange: this.onChange
        }),
        React.createElement("br", null),
        "Effort:",
        " ",
        React.createElement(NumInput, {
          size: 5,
          name: "effort",
          value: issue.effort,
          onChange: this.onChange
        }),
        React.createElement("br", null),
        "Completion Date:",
        " ",
        React.createElement(DateInput, {
          name: "completionDate",
          value: issue.completionDate,
          onChange: this.onChange,
          onValidityChange: this.onValidityChange
        }),
        React.createElement("br", null),
        "Title:",
        " ",
        React.createElement("input", {
          type: "text",
          size: 50,
          name: "title",
          value: issue.title,
          onChange: this.onChange
        }),
        React.createElement("br", null),
        validationMessage,
        React.createElement(
          "button",
          { type: "submit" },
          "Submit"
        ),
        React.createElement("br", null),
        React.createElement(
          Link,
          { to: "/issues" },
          "Back to issue list"
        )
      )
    );
  }
}