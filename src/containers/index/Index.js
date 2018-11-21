import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { withCookies } from 'react-cookie';
import Loader from '../../components/lib/loader/Loader';
import { fetchDataIfNeeded } from '../../actions/home/home';

export class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch, query, params } = this.props;
    Index.fetchData({ dispatch, query, params });
  }

  render() {
    const { value } = this.props;
    return (
      <div className="body-content">
        {typeof value !== 'undefined' && value.length > 0 ? (
          value.map(v => {
            return (
              <div key={v.id}>
                <Link to={`/post/${v.id}`}>{v.title}</Link>
              </div>
            );
          })
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}

Index.fetchData = function({ dispatch, query, params }) {
  return dispatch(fetchDataIfNeeded(params, query));
};

Index.propTypes = {
  value: PropTypes.array,
  cookie: PropTypes.any,
  dispatch: PropTypes.any,
  query: PropTypes.any,
  params: PropTypes.any,
};

function mapStateToProps(state) {
  return {
    ...state.home,
  };
}

export default connect(mapStateToProps)(withCookies(Index));
