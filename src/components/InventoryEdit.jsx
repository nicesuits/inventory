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
          Status:{item.status}
          <br />
          Manufactured: {item.manufactured}
          <br />
          Expires: {item.expires}
          <br />
          Lot Number: {item.lotnumber}
          <br />
          Part Number: {item.partnumber}
          <br />
          Expires Part Number: {item.expireslotnumber}
          <br />
          <Link to="/inventory">Back to inventory list</Link>
        </form>
      </div>
    );
  }
}
