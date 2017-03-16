import rootReducer from '../reducers';
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

export default (initialState) => {
  const logger = createLogger();

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, logger));
}