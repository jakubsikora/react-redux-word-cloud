import expect from 'expect';
import { getBoundries, getMinBound } from '../../utils/boundries';

describe('Boundries utils', () => {
  it('has working getBoundries method', () => {
    const mockWords = [
      {
        volume: 0
      },
      {
        volume: 1
      },
      {
        volume: 2
      }
    ];

    expect(getBoundries(mockWords, 3)).toEqual([0, 1, 2]);
    expect(getBoundries(mockWords, 2)).toEqual([0, 1]);
    expect(getBoundries(mockWords, 1)).toEqual([0]);
    expect(getBoundries(mockWords, 0)).toEqual([]);
  });

  it('has working getMinBound method', () => {
    const mockBounds = [0, 2, 4];

    expect(getMinBound(1, mockBounds)).toEqual(0);
    expect(getMinBound(2, mockBounds)).toEqual(2);
    expect(getMinBound(3, mockBounds)).toEqual(2);
    expect(getMinBound(4, mockBounds)).toEqual(4);
    expect(getMinBound(5, mockBounds)).toEqual(4);
  });
});
