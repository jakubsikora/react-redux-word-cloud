import { DIRECTIONS, ELEMENT_SPACING_PX } from '../constants/main';

/**
 * Class for calculating positions of given elements on the container.
 * Algorithm is using cardinal directions starting from North clockwise
 * trying to avoid collisions.
 */
export default class Position {
  constructor(containerCoords, elements) {
    // Coordinates for the container
    this.containerCoords = containerCoords;

    // All elements which will be positioned on the container
    this.elements = elements;

    // Cache of calculated elements per direction
    this.cache = this.initCache();

    // Final coordinates list
    this.elementsCoords = [];

    // `True` if 1st element put in the center of container.
    this.initialized = false;
  }

  /**
   * Initlize empty cache.
   * @returns {Object} Intitial state of cache
   */
  initCache() {
    return {
      N: {
        disabled: false,
        items: []
      },
      NE: {
        disabled: false,
        items: []
      },
      E: {
        disabled: false,
        items: []
      },
      SE: {
        disabled: false,
        items: []
      },
      S: {
        disabled: false,
        items: []
      },
      SW: {
        disabled: false,
        items: []
      },
      W: {
        disabled: false,
        items: []
      },
      NW: {
        disabled: false,
        items: []
      }
    }
  }

  /**
   * Based on given cardinal direction, return the next one from the list.
   * @param {String} direction Given direction
   * @returns {String} Next direction
   */
  getNextDirection(direction) {
    // Get given direction index
    const length = DIRECTIONS.length;
    let currentIndex = DIRECTIONS.indexOf(direction);

    let nextDirection;

    // Check for next direction
    if (currentIndex + 1 >= length) {
      nextDirection = DIRECTIONS[0];
    } else if (currentIndex === -1) {
      nextDirection = DIRECTIONS[0];
    } else {
      nextDirection = DIRECTIONS[currentIndex+1];
    }

    // If choosen direction is disable try to find another.
    if (this.cache[nextDirection].disabled) {
      return this.getNextDirection(nextDirection);
    }

    return nextDirection;
  }

  /**
   * Main calculation functionality. Loop through all elements and try
   * to position them following cardinal directions, checking the collisions
   * with the container.
   * @returns {Object} Newly calcuated coordinates for elements.
   */
  calculate() {
    let newCoords;
    let currentDirection = 'N';

    this.elements.forEach(element => {
      if (!this.initialized) {
        // Calculate center of the container as a starting point for the
        // first element
        const startingPoint = this.getStartingPoint(element);

        // Add inital element to the center of the container
        this.elementsCoords.push(
          this.formatCoords(
            startingPoint.top - element.height / 2,
            startingPoint.left - element.width / 2,
            element
          )
        );

        // Initialize the process for next elements
        this.initialized = true;
      } else {
        // Calculate position based on given direction
        newCoords = this.getPosition(currentDirection, element);

        // If coordinates exist, add then to the main list and cache.
        if (newCoords) {
          // Update the direction
          currentDirection = this.getNextDirection(newCoords.direction);

          // Add to the main list of coordinates
          this.elementsCoords.push(
            this.formatCoords(newCoords.top, newCoords.left, element)
          );

          this.cache[newCoords.direction].items.push(newCoords);
        }
      }
    });

    return this.elementsCoords;
  }

  /**
   * Based on given direction, position the element inside the container.
   * @param {String} direction Describe where to put the element
   * @param {Object} element Element to be put into the container.
   * @returns {Object|boolean} Newly calcuated coordinates or false if there is
   *                           no space for the element
   */
  getPosition(direction, element) {
    let newCoords = {
      top: 0,
      left: 0,
      width: element.width,
      height: element.height,
      direction: direction
    };

    // Get last element coordinates
    let lastCoords = this.getLastInserted(direction);

    // Based on given direction and last element coordinates calculate new
    // coordinates for given element.
    switch (direction) {
      case 'N':
        newCoords = Object.assign(
          {}, newCoords, this.getPositionN(lastCoords, element)
        );
      break;

      case 'NE':
        newCoords = Object.assign(
          {}, newCoords, this.getPositionNE(lastCoords, element)
        );
      break;

      case 'E':
        newCoords = Object.assign(
          {}, newCoords, this.getPositionE(lastCoords, element)
        );
      break;

      case 'SE':
        newCoords = Object.assign(
          {}, newCoords, this.getPositionSE(lastCoords, element)
        );
      break;

      case 'S':
        newCoords = Object.assign(
          {}, newCoords, this.getPositionS(lastCoords, element)
        );
      break;

      case 'SW':
        newCoords = Object.assign(
          {}, newCoords, this.getPositionSW(lastCoords, element)
        );
      break;

      case 'W':
        newCoords = Object.assign(
          {}, newCoords, this.getPositionW(lastCoords, element)
        );
      break;

      case 'NW':
        newCoords = Object.assign(
          {}, newCoords, this.getPositionNW(lastCoords, element)
        );
      break;
    }

    // Check for collisions with the container
    if(this.checkCollision(newCoords)) {
      // Make sure we have a enable direction
      if (!this.disableDirection(direction)) return false;

      // Call next direction for the same element
      return this.getPosition(
        this.getNextDirection(direction),
        element
      );
    }

    return newCoords;
  }

  /**
   * Calculate coordinates for North direction
   * @param {Object} coords Previous element coords
   * @param {Object} element New element
   * @returns {Object} New coordinates for given element
   */
  getPositionN(coords, element) {
    return {
      top: coords.top - element.height,
      left: coords.left + ELEMENT_SPACING_PX
    };
  }

  /**
   * Calculate coordinates for North-East direction
   * @param {Object} coords Previous element coords
   * @param {Object} element New element
   * @returns {Object} New coordinates for given element
   */
  getPositionNE(coords, element) {
    return {
      top: coords.top - element.height,
      left: coords.left + coords.width
    };
  }

  /**
   * Calculate coordinates for East direction
   * @param {Object} coords Previous element coords
   * @param {Object} element New element
   * @returns {Object} New coordinates for given element
   */
  getPositionE(coords, element) {
    return {
      top: coords.top + ELEMENT_SPACING_PX,
      left: coords.left + coords.width
    };
  }

  /**
   * Calculate coordinates for South-East direction
   * @param {Object} coords Previous element coords
   * @param {Object} element New element
   * @returns {Object} New coordinates for given element
   */
  getPositionSE(coords, element) {
    return {
      top: coords.top + coords.height,
      left: coords.left + coords.width
    };
  }

  /**
   * Calculate coordinates for South direction
   * @param {Object} coords Previous element coords
   * @param {Object} element New element
   * @returns {Object} New coordinates for given element
   */
  getPositionS(coords, element) {
    return {
      top: coords.top + coords.height,
      left: coords.left + coords.width - element.width - ELEMENT_SPACING_PX
    };
  }

  /**
   * Calculate coordinates for South-West direction
   * @param {Object} coords Previous element coords
   * @param {Object} element New element
   * @returns {Object} New coordinates for given element
   */
  getPositionSW(coords, element) {
    return {
      top: coords.top + coords.height,
      left: coords.left - element.width
    };
  }

  /**
   * Calculate coordinates for West direction
   * @param {Object} coords Previous element coords
   * @param {Object} element New element
   * @returns {Object} New coordinates for given element
   */
  getPositionW(coords, element) {
    return {
      top: coords.top + ELEMENT_SPACING_PX,
      left: coords.left - element.width
    };
  }

  /**
   * Calculate coordinates for North-West direction
   * @param {Object} coords Previous element coords
   * @param {Object} element New element
   * @returns {Object} New coordinates for given element
   */
  getPositionNW(coords, element) {
    return {
      top: coords.top - element.height,
      left: coords.left - element.width
    };
  }

  /**
   * Check collisions of given coords element with the container.
   * @param {Object} coords New element coords
   * @returns {boolean} `True` if there is a collision otherwise false.
   */
  checkCollision(coords) {
    if ( (coords.top + coords.height > this.containerCoords.top + this.containerCoords.height)
      || (coords.left + coords.width > this.containerCoords.left + this.containerCoords.width)
      || (coords.left < this.containerCoords.left)
      || (coords.top < this.containerCoords.top)
     ) {
      return true;
    }

    return false;
  }

  /**
   * Get previously inserted element for given direction.
   * @param {String} direction Direction for previous element.
   * @returns {Object} Coordinates from cache for given direction of 1st inserted
   *                   element if empty cache.
   */
  getLastInserted(direction) {
    const length = this.cache[direction].items.length;

    if (length > 0) {
      return this.cache[direction].items[length-1];
    } else {
      return this.elementsCoords[0];
    }
  }

  /**
   * Calculate center of the container
   * @returns {Object} Center of the container coordinates
   */
  getStartingPoint() {
    return {
      left: this.containerCoords.width / 2,
      top: this.containerCoords.height / 2
    };
  }

  /**
   * Helper function to format coordinates.
   * @param {Number} top Top coordinate of the element
   * @param {Number} left Left coordinate of the element
   * @param {Object} element New element
   * @returns {Object} Newly formatted coordinates for given element
   */
  formatCoords(top, left, element) {
    return {
      top: top,
      left: left,
      width: element.width,
      height: element.height
    };
  }

  /**
   * Helper function to disable direction in the cache.
   * @param {String} direction The direction to be disabled
   * @returns {Boolean} `True` if there are still enabled directions,
   *                     otherwise false.
   */
  disableDirection(direction) {
    this.cache[direction].disabled = true;

    const directionStatus =
      DIRECTIONS.filter(direction => !this.cache[direction].disabled);

    return directionStatus.length > 0;
  }
}
