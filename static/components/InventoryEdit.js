import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class InventoryEdit extends Component {
  constructor() {
    super();
    this.state = {
      item: {
        _id: "",
        status: "",
        manufactured: "",
        expires: "",
        lotnumber: "",
        partnumber: "",
        expireslotnumber: ""
      }
    };
  }
  componentDidMount() {
    this.loadData();
  }
  loadData() {
    fetch(`/api/inventory/${this.props.match.params.id}`).then(response => {
      if (response.ok) {
        response.json().then(item => this.setState({ item }));
      } else {
        response.json().then(err => {
          console.error(`[MongoDB - Update ERROR]: Error in fetching data from server: ${err.message}`);
        });
      }
    });
  }
  render() {
    const item = this.state.item;
    return React.createElement(
      "div",
      null,
      React.createElement(
        "form",
        { onSubmit: this.onSubmit },
        "ID: ",
        item._id,
        React.createElement("br", null),
        "Status:",
        item.status,
        React.createElement("br", null),
        "Manufactured: ",
        item.manufactured,
        React.createElement("br", null),
        "Expires: ",
        item.expires,
        React.createElement("br", null),
        "Lot Number: ",
        item.lotnumber,
        React.createElement("br", null),
        "Part Number: ",
        item.partnumber,
        React.createElement("br", null),
        "Expires Part Number: ",
        item.expireslotnumber,
        React.createElement("br", null),
        React.createElement(
          Link,
          { to: "/inventory" },
          "Back to inventory list"
        )
      )
    );
  }
}