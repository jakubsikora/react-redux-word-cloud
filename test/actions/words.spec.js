import sinon from 'sinon';
import axios from 'axios';
import expect from 'expect';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { SELECT_WORD, REQUEST_WORDS, RECEIVE_WORDS, FETCH_FAILURE } from '../../constants/actionTypes';
import { fetchWords, selectWord, requestWords, receiveWords, failureFetch } from '../../actions/words';
require('sinon-as-promised');

describe('words actions', () => {
  describe('sync', () => {
    it('selectWord should create SELECT_WORD action', () => {
      const word = {
        id: 0,
        label: 'foo',
        volume: 165,
        sentiment: {
          negative: 1,
          neutral: 0,
          positive: 3
        }
      };

      expect(selectWord(word)).toEqual({
        type: SELECT_WORD,
        word
      });
    });

    it('requestWords should create REQUEST_WORDS action', () => {
      expect(requestWords()).toEqual({
        type: REQUEST_WORDS
      });
    });

    it('receiveWords should create RECEIVE_WORDS action', () => {
      const response = {
        topics: [{
          id: 0,
          label: 'foo',
          volume: 10,
          sentiment: {
            negative: 0,
            neutral: 1,
            positive: 2
          },
          sentimentScore: 1,
          foo: 'bar'
        }]
      };

      const expectedWords = [{
        id: 0,
        label: 'foo',
        volume: 10,
        sentiment: {
          negative: 0,
          neutral: 1,
          positive: 2
        },
        sentimentScore: 1
      }];

      expect(receiveWords(response)).toEqual({
        type: RECEIVE_WORDS,
        words: expectedWords
      });
    });

    it('failureFetch should create FETCH_FAILURE action', () => {
      const ex = {
          foo: 'bar'
      };

      expect(failureFetch(ex)).toEqual({
        type: FETCH_FAILURE,
        ex
      });
    });
  });

  describe('async', () => {
    const middlewares = [thunk];
    let stubAxios;

    function mockStore(getState, expectedActions, done) {
      if (!Array.isArray(expectedActions)) {
        throw new Error('expectedActions should be an array of expected actions.');
      }

      if (typeof done !== 'undefined' && typeof done !== 'function') {
        throw new Error('done should either be undefined or function.');
      }

      function mockStoreWithoutMiddleware() {
        return {
          getState() {
            return typeof getState === 'function' ?
              getState() :
              getState
          },

          dispatch(action) {
            const expectedAction = expectedActions.shift();

            try {
              expect(action).toEqual(expectedAction);

              if (done && !expectedActions.length) {
                done();
              }

              return action;
            } catch (e) {
              done(e);
            }
          }
        }
      }

      const mockStoreWithMiddleware = applyMiddleware(
        ...middlewares
      )(mockStoreWithoutMiddleware);

      return mockStoreWithMiddleware();
    }

    beforeEach(() => {
      stubAxios = sinon.stub(axios, 'get');
    });

    afterEach(() => {
      stubAxios.restore();
    });

    it('creates RECEIVE_WORDS when fetching words has been done', (done) => {
      const expectedResponse = {
        data: {
          topics: [
            {
              id: 0,
              label: 'foo',
              volume: 1,
              sentiment: 'foo',
              sentimentScore: 1
            }
          ]
        },
        status: 200,
        statusText: 'OK'
      };

      stubAxios.resolves(expectedResponse);

      const expectedActions = [
        { type: REQUEST_WORDS },
        {
          type: RECEIVE_WORDS,
          words: expectedResponse.data.topics
        }
      ];

      const store = mockStore({ words: [] }, expectedActions, done);
      store.dispatch(fetchWords());
    });

    it('creates FETCH_FAILURE when fetching words fails the response', (done) => {
      const expectedResponse = {
        data: {},
        status: 404,
        statusText: 'Not found.'
      };

      stubAxios.rejects(expectedResponse);

      const expectedActions = [
        { type: REQUEST_WORDS },
        {
          type: FETCH_FAILURE,
          ex: expectedResponse
        }
      ];

      const store = mockStore({ words: [] }, expectedActions, done);
      store.dispatch(fetchWords());
    });
  });
});
