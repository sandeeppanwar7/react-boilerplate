import isomorphicFetch from 'isomorphic-fetch';
import NetworkError from '../networkerror/NetworkError';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw response;
}

function parseSuccess(response, options) {
  if (response.status === 201 || response.status === 204) {
    return {};
  }

  if (options && options.type === 'jsonp') {
    return response.text().catch(() => {
      throw new NetworkError('Invalid JSON Response', response.status);
    });
  }

  return response.json().catch(() => {
    throw new NetworkError('Invalid JSON Response', response.status);
  });
}

function parseError(response) {
  if (response && typeof response.json === 'function') {
    return response.json().then(
      json => {
        throw new NetworkError(response.statusText, response.status, json);
      },
      () => {
        throw new NetworkError(response.statusText, response.status);
      },
    );
  }
  // Network errors, e.g. cors / offline etc.
  throw new NetworkError(response.message);
}

/**
 * Wrapper around `window.fetch` to handle json parsing and offer a
 * consistent error interface.
 *
 * fetch('/Users')
 *     .then(json => {
 *         console.log('success', json);
 *     }, networkError => {
 *         console.log('error', networkError);
 *     }).catch(error => {
 *         throw error; // Ensure runtime errors bubble up to `window.onerror`
 *     });
 *
 * @param  {String} url     The url.
 * @param  {Object} options https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch
 * @return {Promise}
 */
function fetch(url, options = {}) {
  options = Object.assign(
    {
      headers: {
        Accept: 'application/json',
        // 'Content-Type': 'application/json',
        // 'method':'GET'
      },
    },
    options,
  );
  return isomorphicFetch(url, options)
    .then(checkStatus)
    .then(resp => parseSuccess(resp, options), parseError)
    .catch(() => {
      parseError({ message: 'page not found' });
    });
}

export default fetch;
