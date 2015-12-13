import sinon from 'sinon';
import axios from 'axios';
import expect from 'expect';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as types from '../../constants/actionTypes';
import * as action from '../../actions/words';
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

      expect(action.selectWord(word)).toEqual({
        type: types.SELECT_WORD,
        word
      });
    });

    it('requestWords should create REQUEST_WORDS action', () => {
      expect(action.requestWords()).toEqual({
        type: types.REQUEST_WORDS
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

      expect(action.receiveWords(response)).toEqual({
        type: types.RECEIVE_WORDS,
        words: expectedWords
      });
    });

    it('failureFetch should create FETCH_FAILURE action', () => {
      const ex = {
          foo: 'bar'
      };

      expect(action.failureFetch(ex)).toEqual({
        type: types.FETCH_FAILURE,
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
        { type: types.REQUEST_WORDS },
        {
          type: types.RECEIVE_WORDS,
          words: expectedResponse.data.topics
        }
      ];

      const store = mockStore({ words: [] }, expectedActions, done);
      store.dispatch(action.fetchWords());
    });

    it('creates FETCH_FAILURE when fetching words fails the response', (done) => {
      const expectedResponse = {
        data: {},
        status: 404,
        statusText: 'Not found.'
      };

      stubAxios.rejects(expectedResponse);

      const expectedActions = [
        { type: types.REQUEST_WORDS },
        {
          type: types.FETCH_FAILURE,
          ex: expectedResponse
        }
      ];

      const store = mockStore({ words: [] }, expectedActions, done);
      store.dispatch(action.fetchWords());
    });
  });
});
