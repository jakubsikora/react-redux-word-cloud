import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/words';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore);

/**
 * Configure store.
 * @param {Object} initialState Initial state
 * @returns {Object} Store with applied middlewares.
 */
export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
