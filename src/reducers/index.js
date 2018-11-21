import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import app from './app/app';
import home from './home/home';

const rootReducer = combineReducers({
  app,
  home,
  routing: routerReducer,
});

export default rootReducer;
