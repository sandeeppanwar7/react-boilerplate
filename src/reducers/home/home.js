import { FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAILURE } from '../../actions/home/home';

function home(
  state = {
    isFetching: false,
    error: false,
    value: [],
  },
  action,
) {
  switch (action.type) {
    case FETCH_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case FETCH_SUCCESS:
      state.value = action.payload[0];
      return {
        ...state,
        isFetching: false,
      };

    case FETCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
      };

    default:
      return state;
  }
}

export default home;
