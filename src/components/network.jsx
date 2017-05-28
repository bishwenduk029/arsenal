import React, { Component } from 'react';
import PropTypes from 'prop-types';
import vis from 'vis';

import '../stylesheets/network.css';

export default class Network extends Component {
  constructor(props) {
    super(props);
    this.nodes = new vis.DataSet();
    this.edges = new vis.DataSet();

    this.data = {
      nodes: this.nodes,
      edges: this.edges,
    };
    this.state = {
      selectedNode: {},
    };

    this.options = {
      nodes: {
        shape: 'dot',
        scaling: {
          min: 20,
          max: 30,
          label: {
            min: 14,
            max: 30,
            drawThreshold: 9,
            maxVisible: 20,
          },
        },
        font: {
          size: 14,
          face: 'Helvetica Neue, Helvetica, Arial',
          color: 'black',
        },
      },
      edges: {
        arrows: 'to',
        font: {
          color: '#001e46',
          strokeWidth: 0,
        },
        labelHighlightBold: true,
      },
      interaction: {
        hover: true,
        hoverConnectedEdges: true,
        selectConnectedEdges: true,
      },
      physics: {
        barnesHut: {
          gravitationalConstant: -4850,
          centralGravity: 1.1,
          springLength: 95,
          springConstant: 0.08,
          damping: 0.09,
          avoidOverlap: 0,
        },
      },
    };
    this.sign = this.sign.bind(this);
    this.getCenter = this.getCenter.bind(this);
    this.makeNetwork = this.makeNetwork.bind(this);
    this.addRootNode = this.addRootNode.bind(this);
    this.expandNetwork = this.expandNetwork.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.getEdgeConnecting = this.getEdgeConnecting.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.root !== nextProps.root) {
      this.addRootNode(nextProps.root);
    }
    if (this.props.subNodes != nextProps.subNodes) {
      this.expandNetwork(nextProps.subNodes);
    }
  }

  // Get the id of the edge connecting two nodes a and b
  getEdgeConnecting(a, b) {
    let edge = this.edges.get({
      filter: function (edge) {
        return edge.from === a && edge.to === b;
      } })[0];
    return edge;
  }


  getSpawnPosition(parentID) {
    // Get position of the node with specified id.
    const pos = this.network.getPositions(parentID)[parentID];
    const x = pos.x;
    const y = pos.y;
    const cog = this.getCenter();
    // Distances from center of gravity to parent node
    const dx = cog[0] - x;
    const dy = cog[1] - y;

    let relSpawnX;
    let relSpawnY;

    if (dx === 0) { // Node is directly above center of gravity or on it, so
      // slope will fail.
      relSpawnX = 0;
      relSpawnY = -this.sign(dy) * 100;
    } else {
      // Compute slope
      const slope = dy / dx;
      // Compute the new node position.
      const dis = 95; // Distance from parent. This should be equal to
      // network.options.physics.springLength;
      relSpawnX = dis / Math.sqrt((slope ** 2) + 1);
      relSpawnY = relSpawnX * slope;
    }
    return [
      Math.round(relSpawnX + x),
      Math.round(relSpawnY + y),
    ];
  }


  // Get the network's center of gravity
  getCenter() {
    const nodePositions = this.network.getPositions();
    const keys = Object.keys(nodePositions);
    // Find the sum of all x and y values
    let xsum = 0;
    let ysum = 0;
    for (let i = 0; i < keys.length; i++) {
      const pos = nodePositions[keys[i]];
      xsum += pos.x;
      ysum += pos.y;
    }
    return [
      xsum / keys.length,
      ysum / keys.length,
    ]; // Average is sum
    // divided by length
  }

  sign(x) {
    if (Math.sign) {
      return Math.sign(x);
    } else if (x === 0) {
      return 0;
    } else {
      return x > 0 ? 1 : -1;
    }
  }


  bindEventsToNetwork() {
    this.network.on('click', this.handleNodeClick);
  }


  handleNodeClick(params) {
    if (params.nodes.length) {
      this.props.onNodeClick(params.nodes[0]);
      this.setState({ selectedNode: params.nodes[0] });
    }
  }

  makeNetwork(container) {
    this.network = new vis.Network(container, this.data, this.options);
    this.addRootNode();
    this.bindEventsToNetwork();
  }


  addRootNode() {
    this.nodes = new vis.DataSet([
      {
        id: this.props.root.toUpperCase(),
        label: this.props.root,
        value: 2,
        level: 0,
        color: '#03a9f4',
        x: 0,
        y: 0,
        parent: this.props.root.toUpperCase(),
      },
    ]);
    this.edges = new vis.DataSet();
    this.data = {
      nodes: this.nodes,
      edges: this.edges,
    };
    this
      .network
      .setData(this.data);
  }

  expandNetwork(nodeList) {
    const subNodeList = [];
    const newEdges = [];
    const parentNode = this.nodes.get(this.state.selectedNode);
    const nodeSpawn = this.getSpawnPosition(parentNode.id);
    for (let i = 0; i < nodeList.length; i++) {
      if (this.nodes.getIds().indexOf(nodeList[i].toUpperCase()) === -1) {
        subNodeList.push({
        	id: nodeList[i].toUpperCase(),
          label: nodeList[i],
          value: 1,
          level: parentNode.level + 1,
          parent: parentNode.id,
          x: nodeSpawn[0],
          y: nodeSpawn[1],
          color: '#03a9f4',
        });
      }
      const existingEdges = this.getEdgeConnecting(nodeList[i].toUpperCase(), parentNode.id);
      if (!existingEdges) {
        newEdges.push({
          from: parentNode.id,
          to: nodeList[i].toUpperCase(),
          color: '#03a9f4',
          level: parentNode.level + 1,
          selectionWidth: 2,
          hoverWidth: 0,
        });
      }
    }
    this.nodes.add(subNodeList);
    this.edges.add(newEdges);
  }

  render() {
    return (<div id="network" ref={this.makeNetwork} />);
  }
}

Network.propTypes = {
  root: PropTypes.string.isRequired,
  onNodeClick: PropTypes.func,
  subNodes: PropTypes.arrayOf(PropTypes.string),
};