import fetch from '../../utils/fetch/fetch';

// const siteConfig = require('./../../../common/'+process.env.SITE);
export const FETCH_REQUEST = 'FETCH_REQUEST';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';

function fetchDataFailure(error) {
  return {
    type: FETCH_FAILURE,
    payload: error.message,
  };
}
function fetchDataSuccess(data) {
  return {
    type: FETCH_SUCCESS,
    meta: {
      receivedAt: Date.now(),
    },
    payload: data,
  };
}

function fetchData() {
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  return dispatch => {
    dispatch({
      type: FETCH_REQUEST,
    });
    const promise1 = fetch(apiUrl);

    return Promise.all([promise1])
      .then(data => dispatch(fetchDataSuccess(data)), error => dispatch(fetchDataFailure(error)))
      .catch(error => {
        dispatch(fetchDataFailure(error));
      });
  };
}

function shouldFetchData(state) {
  if (typeof state.home.value !== 'undefined' && state.home.value.length > 0) {
    return false;
  }
  return true;
}

export function fetchDataIfNeeded(params, query) {
  return (dispatch, getState) => {
    if (shouldFetchData(getState(), params, query)) {
      return dispatch(fetchData(getState(), params, query));
    }

    return Promise.resolve([]);
  };
}
