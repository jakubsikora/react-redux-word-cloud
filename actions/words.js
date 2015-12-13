import axios from 'axios';
import { SELECT_WORD, REQUEST_WORDS, RECEIVE_WORDS, FETCH_FAILURE } from '../constants/actionTypes';

const API_URL = '/api/topics.json';

/**
 * Action creator selectWord
 * @param {Object} word Selected word object
 * @returns {Object} selectWord action
 */
export function selectWord(word) {
  return {
    type: SELECT_WORD,
    word
  };
}

/**
 * Action creator requestWords
 * @returns {Object} requestWords action
 */
export function requestWords() {
  return {
    type: REQUEST_WORDS
  };
}

/**
 * Action creator receiveWords. Words sorted by volume descending.
 * @param {Object} json Returned json data from the api
 * @returns {Object} receiveWords action
 */
export function receiveWords(json) {
  return {
    type: RECEIVE_WORDS,
    words: json.topics.map(topic => {
      return {
        id: topic.id,
        label: topic.label,
        volume: topic.volume,
        sentiment: topic.sentiment,
        sentimentScore: topic.sentimentScore
      };
    }).sort((a, b) => {
      if (a.volume > b.volume) return -1;
      if (a.volume < b.volume) return 1;
      return 0;
    })
  };
}

/**
 * Action creator failureFetch.
 * @param {Object} ex Exception thrown during API fetch.
 * @returns {Object} failureFetch action
 */
export function failureFetch(ex) {
  return {
    type: FETCH_FAILURE,
    ex
  };
}

/**
 * Action creator fetchWords.
 * @returns {Object} fetchWords action
 */
export function fetchWords() {
  return dispatch => {
    dispatch(requestWords());

    return axios.get(API_URL)
      .then(response => {
        dispatch(receiveWords(response.data));
      })
      .catch(error => {
        dispatch(failureFetch(error))
      });
  };
}
