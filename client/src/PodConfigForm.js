import React from "react"

class PodConfigForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sku: props.modalData.sku || '',
      product_title: props.modalData.title || '',
      unit_weight_string: props.modalData.unit_weight_string || '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  }

  handleSubmit(event) {
    console.log(event);
    alert('A name was submitted: ' + this.state.sku);
    event.preventDefault();
    this.props.handleClose();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <p>{this.props.modalData.pod_uuid}</p>
          <label>
            SKU:
            <input type="text" name="sku" value={this.state.sku} onChange={this.handleChange} />
          </label>
          <br></br>
          <label>
            Title:
            <input type="text" name="product_title" value={this.state.product_title} onChange={this.handleChange} />
          </label>
          <br></br>
          <label>
            Unit Weight:
            <input type="text" name="unit_weight_string" value={this.state.unit_weight_string} onChange={this.handleChange} />
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