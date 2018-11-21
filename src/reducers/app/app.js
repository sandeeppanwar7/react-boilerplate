import { FETCH_APP_REQUEST, FETCH_APP_SUCCESS, FETCH_APP_FAILURE } from '../../actions/app/app';

function app(
  state = {
    bnews: '',
    isFetching: false,
    error: false,
    minitv: {},
  },
  action,
) {
  switch (action.type) {
    case FETCH_APP_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case FETCH_APP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        value: action.payload[0],
      };
    case FETCH_APP_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    default:
      return state;
  }
}

export default app;
