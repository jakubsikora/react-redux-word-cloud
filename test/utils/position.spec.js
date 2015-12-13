import expect from 'expect';
import Position from '../../utils/position';
import { DIRECTIONS } from '../../constants/main';

const mockContainer = {
  top: 0,
  left: 0,
  width: 100,
  height: 100
};

const mockElements1 = [
  {
    top: 0,
    left: 0,
    width: 20,
    height: 20
  },
  {
    top: 0,
    left: 0,
    width: 25,
    height: 25
  },
  {
    top: 0,
    left: 0,
    width: 100,
    height: 20
  }
];

const mockElements2 = [
  {
    top: 101,
    left: 0,
    width: 20,
    height: 20
  },
  {
    top: 0,
    left: -10,
    width: 20,
    height: 20
  },
  {
    top: 0,
    left: 10,
    width: 95,
    height: 20
  },
  {
    top: 10,
    left: 10,
    width: 20,
    height: 95
  },
  {
    top: 45,
    left: 45,
    width: 10,
    height: 10
  }
];

let positionObj;

describe('Utils position', () => {
  beforeEach(() => {
    positionObj = new Position(mockContainer, mockElements1);
  });

  afterEach(() => {

  });

  it('should set initial properties on object creation', () => {
    const initialCache = positionObj.initCache();
    expect(positionObj.containerCoords).toEqual(mockContainer);
    expect(positionObj.elements).toEqual(mockElements1);
    expect(positionObj.elementsCoords.length).toEqual(0);
    expect(positionObj.initialized).toEqual(false);
    expect(positionObj.cache).toEqual(initialCache);
  });

  it('should have getNextDirection method working', () => {
    expect(positionObj.getNextDirection(DIRECTIONS[0]))
      .toEqual(DIRECTIONS[1]);

    expect(positionObj.getNextDirection(DIRECTIONS[DIRECTIONS.length]))
      .toEqual(DIRECTIONS[0]);

    expect(positionObj.getNextDirection('foo'))
      .toEqual(DIRECTIONS[0]);

    // Disable direction
    positionObj.cache[DIRECTIONS[0]].disabled = true;

    expect(positionObj.getNextDirection(DIRECTIONS[DIRECTIONS.length]))
      .toEqual(DIRECTIONS[1]);

    expect(positionObj.getNextDirection('foo'))
      .toEqual(DIRECTIONS[1]);
  });

  it('should have getStartingPoint method working', () => {
    expect(positionObj.getStartingPoint())
      .toEqual({
        left: mockContainer.left + mockContainer.width / 2,
        top: mockContainer.top + mockContainer.height / 2
      });
  });

  it('should have formatCoords method working', () => {
    expect(positionObj.formatCoords(10, 20, mockElements1[0]))
      .toEqual({
        top: 10,
        left: 20,
        width: mockElements1[0].width,
        height: mockElements1[0].height
      });
  });

  it('should have disableDirection method working', () => {
    let methodReturn;
    methodReturn = positionObj.disableDirection(DIRECTIONS[0]);
    expect(positionObj.cache[DIRECTIONS[0]].disabled).toEqual(true);
    expect(methodReturn).toEqual(true);

    // Disable other directions
    positionObj.disableDirection(DIRECTIONS[1]);
    positionObj.disableDirection(DIRECTIONS[2]);
    positionObj.disableDirection(DIRECTIONS[3]);
    positionObj.disableDirection(DIRECTIONS[4]);
    positionObj.disableDirection(DIRECTIONS[5]);
    positionObj.disableDirection(DIRECTIONS[6]);
    methodReturn = positionObj.disableDirection(DIRECTIONS[7]);
    expect(methodReturn).toEqual(false);
  });

  it('should have getLastInserted method working', () => {
    // Insert some items to cache
    positionObj.cache[DIRECTIONS[0]].items.push('foo1');
    positionObj.cache[DIRECTIONS[0]].items.push('foo2');

    expect(positionObj.getLastInserted(DIRECTIONS[0]))
      .toEqual('foo2');

    expect(positionObj.getLastInserted(DIRECTIONS[1]))
      .toEqual(undefined);

    positionObj.elementsCoords.push('foo');
    expect(positionObj.getLastInserted(DIRECTIONS[1]))
      .toEqual('foo');
  });

  it('should have checkCollision method working', () => {
    expect(positionObj.checkCollision(mockElements1[0])).toEqual(false);
    expect(positionObj.checkCollision(mockElements2[0])).toEqual(true);
    expect(positionObj.checkCollision(mockElements2[1])).toEqual(true);
    expect(positionObj.checkCollision(mockElements2[2])).toEqual(true);
    expect(positionObj.checkCollision(mockElements2[3])).toEqual(true);
  });

  it('should have getPositionN method working', () => {
    expect(positionObj.getPositionN(mockElements2[4], mockElements1[0]))
      .toEqual({
        top: 25,
        left: 50
      });
  });

  it('should have getPositionNE method working', () => {
    expect(positionObj.getPositionNE(mockElements2[4], mockElements1[0]))
      .toEqual({
        top: 25,
        left: 55
      });
  });

  it('should have getPositionE method working', () => {
    expect(positionObj.getPositionE(mockElements2[4], mockElements1[0]))
      .toEqual({
        top: 50,
        left: 55
      });
  });

  it('should have getPositionSE method working', () => {
    expect(positionObj.getPositionSE(mockElements2[4], mockElements1[0]))
      .toEqual({
        top: 55,
        left: 55
      });
  });

  it('should have getPositionS method working', () => {
    expect(positionObj.getPositionS(mockElements2[4], mockElements1[0]))
      .toEqual({
        top: 55,
        left: 30
      });
  });

  it('should have getPositionSW method working', () => {
    expect(positionObj.getPositionSW(mockElements2[4], mockElements1[0]))
      .toEqual({
        top: 55,
        left: 25
      });
  });

  it('should have getPositionW method working', () => {
    expect(positionObj.getPositionW(mockElements2[4], mockElements1[0]))
      .toEqual({
        top: 50,
        left: 25
      });
  });

  it('should have getPositionNW method working', () => {
    expect(positionObj.getPositionNW(mockElements2[4], mockElements1[0]))
      .toEqual({
        top: 25,
        left: 25
      });
  });

  it('should have working calculate method', () => {
    // Based on mocks last element is too big for the container
    expect.spyOn(positionObj, 'getStartingPoint').andCallThrough();
    expect.spyOn(positionObj, 'formatCoords').andCallThrough();
    expect.spyOn(positionObj, 'getPosition').andCallThrough();
    expect.spyOn(positionObj, 'getNextDirection').andCallThrough();
    positionObj.calculate();

    expect(positionObj.elementsCoords.length).toEqual(2);
    expect(positionObj.getStartingPoint).toHaveBeenCalled();
    expect(positionObj.formatCoords).toHaveBeenCalled();
    expect(positionObj.getPosition).toHaveBeenCalled();
    expect(positionObj.getNextDirection).toHaveBeenCalled();
  });
});
