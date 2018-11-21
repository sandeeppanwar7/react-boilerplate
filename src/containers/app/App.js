import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import ErrorBoundary from '../../components/lib/errorboundery/ErrorBoundary';
import '../../public/css/main.css';
//  DON'T REMOVE THIS - this is merging this into final css loader module in webpack
//  const siteConfig = require(`./../../../common/${process.env.SITE}`);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children } = this.props;
    return (
      <div>
        <Helmet
          defaultTitle="NBT"
          titleTemplate="%s"
          meta={[{ name: 'description', content: 'NBT' }]}
          htmlAttributes={{ lang: 'en' }}
        />

        <div className="m-scene">
          <div id="parentContainer" className="animated">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
};

function mapStateToProps(state) {
  return {
    ...state.app,
    config: state.config,
  };
}

export default connect(mapStateToProps)(App);
