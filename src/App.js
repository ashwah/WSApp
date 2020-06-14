import React, { Component, useMemo, useState, useEffect } from "react";
import update from 'react-addons-update';
import Table from "./Table";
import logo from './logo.svg';
import styled from 'styled-components'
import './App.css';
import makeData from './makeData'

const WS_URL = 'ws://localhost:8080'
const API_URL = 'http://weight-see.herokuapp.com/api/weight-data'

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



  constructor(){

    super()
    this.ws = new WebSocket(WS_URL)
    this.columns = [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'pod_uuid',
          },
          {
            Header: 'Visits',
            accessor: 'weight_value',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
          },
        ],
      },
    ]
    this.state = {
      data: []
    }
  }

  updateWeightByIndex(index, weight_value) {
    console.log(index)
    let data = [...this.state.data]
    let item = {...data[index]}
    item.weight_value = weight_value
    data[index] = item
    this.setState({data})
  }

  componentDidMount() {
    console.log('componentdidmount')
    fetch(API_URL)
      .then(response => response.json())
      .then((data) => {
        console.log('fetch')
        return this.setState({data})
      })

    // console.log('did mount')
    // this.ws.onopen = () => {
    //   // on connecting, do nothing but log it to the console
    //   console.log('connected')
    //   this.ws.send('xxxx')
    // }

    this.ws.onmessage = evt => {
      let newData = JSON.parse(evt.data)
      for (let i = 0; i < this.state.data.length; i++) {
        if (this.state.data[i].pod_uuid == newData.pod_uuid) {
          this.updateWeightByIndex(i, newData.weight_value)
        }
      }
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      // // automatically try to reconnect on connection loss
      // this.setState({
      //   ws: new WebSocket(URL),
      // })
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/*<p>*/}
          {/*  Edit <code>src/App.js</code> and save to reload.*/}
          {/*</p>*/}
          {/*<a*/}
          {/*  className="App-link"*/}
          {/*  href="https://reactjs.org"*/}
          {/*  target="_blank"*/}
          {/*  rel="noopener noreferrer"*/}
          {/*>*/}
          {/*  Learn ReactFaceArse*/}
          {/*</a>*/}
        </header>
        <Styles>
          <Table columns={this.columns} data={this.state.data} />
        </Styles>
      </div>
    );
  }

}

export default App;
