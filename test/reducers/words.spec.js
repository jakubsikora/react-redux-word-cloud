import expect from 'expect';
import { selectedWord, words } from '../../reducers/words';
import { SELECT_WORD, REQUEST_WORDS, RECEIVE_WORDS, FETCH_FAILURE } from '../../constants/actionTypes';

function requestWords() {
  return words(
    undefined,
    {
      type: REQUEST_WORDS
    }
  );
}

describe('reducers', () => {
  describe('selectWord reducer', () => {
    it('should handle initial state', () => {
      expect(
        selectedWord(undefined, {})
      ).toEqual({});
    });

    it('should handle SELECT_WORD', () => {
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

      expect(
        selectedWord(
          undefined,
          {
            type: SELECT_WORD,
            word
          }
        )
      ).toEqual(word);
    });
  });

  describe('words reducer', () => {
    it('shoud handle initial state', () => {
      expect(
        words(undefined, {})
      ).toEqual({
          isFetching: false,
          items: [],
          ex: undefined
        });
    });

    it('should handle REQUEST_WORDS', () => {
      expect(requestWords()).toEqual({
        isFetching: true,
        items: [],
        ex: undefined
      });
    });

    it('should handle RECEIVE_WORDS', () => {
      requestWords();
      expect(
        words(
          undefined,
          {
            type: RECEIVE_WORDS,
            words: ['foo', 'bar']
          }
        )
      ).toEqual({
        isFetching: false,
        items: ['foo', 'bar'],
        ex: undefined
      });
    });

    it('should handle FETCH_FAILURE', () => {
      requestWords();
      expect(
        words(
          undefined,
          {
            type: FETCH_FAILURE,
            ex: { foo: 'bar' }
          }
        )
      ).toEqual({
        isFetching: false,
        items: [],
        ex: { foo: 'bar' }
      });
    })
  });
});
