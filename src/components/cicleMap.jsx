import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TreeMap } from 'react-vis';

class CiclePack extends Component {

    render() {
        return (
            <Treemap
              title={'Parts Hierarchy'}
              width={600}
              height={600}
              data={this.props.data}
            />
        );
    }
}

CirclePack.propTypes = {
    data: PropTypes.object.isRequired,
}

export default CiclePack;
