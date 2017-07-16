import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import Network from 'network-vis';
import './App.css';

const myURL = 'http://localhost:3000/';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listOfNodes: [],
    };
    this.handleNodeClick = this
      .handleNodeClick
      .bind(this);
  }

  async handleNodeClick(node) {
    try {
      const jsonPromise = await fetch(`${myURL}${node}`);
      this.setState({
        listOfNodes: await jsonPromise.json(),
      });
    } catch (err) {
        console.log('failed');
    }
  }

  render() {
    return (
      <div className="App">
        <Network
          root='HAPPY'
          subNodes={this.state.listOfNodes}
          outgoing={true}
          onNodeClick={this.handleNodeClick}
        />
      </div>
    );
  }
}

export default App;
