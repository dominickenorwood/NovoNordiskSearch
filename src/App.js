import React, { Component } from 'react';

import Aux from './hoc/Auxillary.js';
import NovoNordiskSearch from './containers/NovoNordiskSearch/NovoNordiskSearch';

class App extends Component {

  render() {
    console.log('APP URL', this.props.appUrl);
    console.log('DRUG ID', this.props.drugId);
    return (
      <Aux>
        <NovoNordiskSearch searchUrl={this.props.appUrl} monographUrl={this.props.monoUrl} searchId={this.props.drugId} />
      </Aux>
    );
  }
}

export default App;
