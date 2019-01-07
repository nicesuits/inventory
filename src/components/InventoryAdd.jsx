import React from "react";

export default class InventoryAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    let form = document.forms.itemAdd;
    this.props.createItem({
      owner: form.owner.value,
      title: form.title.value,
      status: "New",
      created: new Date()
    });
    form.owner.value = "";
    form.title.value = "";
  }
  render() {
    return (
      <div>
        <form name="itemAdd" onSubmit={this.handleSubmit}>
          <input type="text" name="owner" placeholder="Owner" />
          <input type="text" name="title" placeholder="Title" />
          <button>Add</button>
        </form>
      </div>
    );
  }
}
