import React, { Component } from "react"
//import update from 'react-addons-update';
import Table from "./Table"
import logo from './logo.svg'
import styled from 'styled-components'
import './App.css'
import './Modal.css'
import PodConfigForm from './PodConfigForm'

const WS_URL = process.env.REACT_APP_WS_URL
const API_URL = process.env.REACT_APP_API_URL

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
            accessor: '',
          },
          {
            Header: 'Title',
            accessor: '',
          },
          {
            Header: 'Unit Weight',
            accessor: '',
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
    let data = [...this.state.data]
    let item = {...data[index]}
    item.weight_value = weight_value
    item.timestamp = timestamp
    data[index] = item
    this.setState({data})
    this.setState({newId: index})
  }

  addNewDataItem(newData, index) {
    let data = [...this.state.data]
    let item = {}
    item.pod_uuid = newData.pod_uuid
    item.weight_value = newData.weight_value
    item.timestamp = newData.timestamp
    data.push(item)
    this.setState({data})
    this.setState({newId: index})
  }

  componentDidMount() {
    fetch(API_URL)
      .then(response => response.json())
      .then((data) => {
        return this.setState({data})
      })

    this.ws.onmessage = evt => {
      let newData = JSON.parse(evt.data)
      let isNew = true
      let i
      for (i = 0; i < this.state.data.length; i++) {
        if (this.state.data[i].pod_uuid === newData.pod_uuid) {
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
          {this.state.data &&
            <Table columns={this.columns} data={this.state.data} newId={this.state.newId}/>
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