import { combineReducers } from 'redux';
import * as action from '../actions/words';
import * as type from '../constants/actionTypes';

/**
 * selectedWord reducer.
 * @param {Object} state Initial state
 * @param {Object} action Action creator.
 * @returns {Object} Word from the action creator or initial state.
 */
export function selectedWord(state = {}, action) {
  switch (action.type) {
    case type.SELECT_WORD:
      return action.word;
    default:
      return state;
  }
}

/**
 * Words reducer.
 * @param {Object} state Initial state
 * @param {Object} action Action creator.
 * @returns {Object} Words object or initial state.
 */
export function words(state = {
  isFetching: false,
  items: [],
  ex: undefined
}, action) {
  switch (action.type) {
    case type.REQUEST_WORDS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case type.RECEIVE_WORDS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.words
      });
    case type.FETCH_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        ex: action.ex
      });
    default:
      return state;
  }
}

// Combine all reducers
const rootReducer = combineReducers({
  selectedWord,
  words
});

export default rootReducer;
