import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import './App.css';
import Network from './components/network';

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

  handleNodeClick(node) {
    fetch(`${myURL}${node}`).then(resp => resp.json())
    .then((resp) => { this.setState({ listOfNodes: resp }); })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <Network
          root='JENNY'
          subNodes={this.state.listOfNodes} 
          onNodeClick={this.handleNodeClick}
        />
      </div>
    );
  }
}

export default App;
