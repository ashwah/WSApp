import React from "react"

class PodConfigForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    console.log(event);
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
    this.props.handleClose();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <p>{this.props.uuid}</p>
          <label>
            SKU:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <br></br>
          <label>
            Title:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <br></br>
          <label>
            Unit Weight:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <br></br>
          <input type="submit" value="Submit" />
        </form>
        <button onClick={this.props.handleClose}>Cancel</button>
      </div>
    );
  }
}

export default PodConfigForm;