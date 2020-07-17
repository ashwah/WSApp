import React, { Component } from "react"
//import update from 'react-addons-update';
import Table from "./Table"
import logo from './logo.svg'
import styled from 'styled-components'
import './App.css'
import './Modal.css'
import PodConfigForm from './PodConfigForm'

const WS_URL = process.env.REACT_APP_WS_URL
const API_URL_WEIGHT = process.env.REACT_APP_API_URL + "/api/weight-data"
const API_URL_PRODUCT = process.env.REACT_APP_API_URL + "/api/product-data"

const Styles = styled.div`
  padding: 1rem;
  table {
    margin-left:auto;
    margin-right:auto;
    border-spacing: 0;
    border: 1px solid black;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`

class App extends Component {

  constructor() {
    super()
    this.ws = new WebSocket(WS_URL)
    this.columns = [
      {
        Header: 'Weight Data',
        columns: [
          {
            Header: 'Pod ID',
            accessor: 'pod_uuid',
          },
          {
            Header: 'Weight',
            accessor: 'weight_value',
          },
          {
            Header: 'Last Updated',
            accessor: 'timestamp',
          }
        ]
      },
      {
        Header: 'Product Data',
        columns: [
          {
            Header: 'SKU',
            accessor: 'sku',
          },
          {
            Header: 'Title',
            accessor: 'title',
          },
          {
            Header: 'Unit Weight',
            accessor: 'unit_weight_string',
          }
        ]
      },
      {
        Header: 'Actions',
        Cell: ({ cell }) => (
          <button value={cell.row.values.name} onClick={(e) => this.showModal(e, cell)}>...</button>
        )
      }
    ]
    this.state = { show: false }
  }

  showModal = (e, cell) => {
    console.log(cell)
    this.setState({
      show: true,
      modalPodUuid: cell.row.values.pod_uuid,
    });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  updateWeightByIndex(index, weight_value, timestamp) {
    console.log('?')
    let weight_data = [...this.state.weight_data]
    let item = {...weight_data[index]}
    item.weight_value = weight_value
    item.timestamp = timestamp
    weight_data[index] = item
    console.log(weight_data)
    this.setState({weight_data})
    this.setState({newId: index})
  }

  addNewDataItem(newData, index) {
    let data = [...this.state.weight_data]
    let item = {}
    item.pod_uuid = newData.pod_uuid
    item.weight_value = newData.weight_value
    item.timestamp = newData.timestamp
    data.push(item)
    this.setState({data})
    this.setState({newId: index})
  }

  componentDidMount() {
    fetch(API_URL_WEIGHT)
      .then(response => response.json())
      .then((weight_data) => {
        fetch(API_URL_PRODUCT)
          .then(response => response.json())
          .then((product_data) => {
            let i
            for (i = 0; i < weight_data.length; i++) {
              let j
              for (j = 0; j < product_data.length; j++) {
                if (weight_data[i].pod_uuid === product_data[j].pod_uuid) {
                  weight_data[i].sku  = product_data[j].sku
                  weight_data[i].title  = product_data[j].title
                  weight_data[i].zero  = product_data[j].zero
                  weight_data[i].multiplier  = product_data[j].multiplier
                  weight_data[i].unit_weight  = product_data[j].unit_weight
                  weight_data[i].unit_weight_string  = product_data[j].unit_weight + ' ' + product_data[j].unit
                  weight_data[i].unit = product_data[j].unit
                }
              }
            }
            this.setState({weight_data})
          })
      })

    this.ws.onmessage = evt => {
      let newData = JSON.parse(evt.data)
      let isNew = true
      let i
      for (i = 0; i < this.state.weight_data.length; i++) {
        if (this.state.weight_data[i].pod_uuid == newData.pod_uuid) {
          this.updateWeightByIndex(i, newData.weight_value, newData.timestamp)
          isNew = false
        }
      }
      if (isNew) {
        this.addNewDataItem(newData, i + 1);
      }
    }

    this.ws.onclose = () => {
      console.log('disconnected')
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Styles>
          {this.state.weight_data &&
            <Table columns={this.columns} data={this.state.weight_data} newId={this.state.newId}/>
          }
        </Styles>
        <Modal show={this.state.show} handleClose={this.hideModal} uuid={this.state.modalPodUuid}></Modal>
      </div>
    );
  }

}

const Modal = ({ handleClose, show, uuid }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <PodConfigForm uuid={uuid} handleClose={handleClose}></PodConfigForm>
      </section>
    </div>
  );
};

export default App;