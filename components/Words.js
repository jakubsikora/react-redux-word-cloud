import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import Word from './Word';
import * as cc from '../constants/main';
import Position from '../utils/position';
import { getBoundries, getMinBound } from '../utils/boundries';

/**
 * Component responsible for positioning the words, calulating the class
 * and font sizes.
 */
export default class Words extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coords: []
    };

    this.handleResize = _.debounce(this.handleResize.bind(this), 300);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);

    // In this moment the words HTML elements are already avaiable
    // within the DOM, so we've got access to their sizes.
    this.calculatePositions(this.props.words);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { words, handleWordClick } = this.props;
    const bounds = getBoundries(words, cc.BOUNDARIES_NUMBER);

    return (
      <ul ref='words'>
        {words.map((word, i) => {
          let coords = this.state.coords.length > 0 && this.state.coords[i]
            ? this.state.coords[i]
            : null;

          return (
            <Word ref={`word_${word.id}`}
                  key={i}
                  word={word}
                  handleClick={handleWordClick}
                  sentimentClass={this.getSentimentClass(word.sentimentScore)}
                  fontSize={this.calculateFontSize(word.volume, bounds)}
                  coords={coords}/>
          );
        })}
      </ul>
    );
  }

  handleResize() {
    // On each window resize, update the position of the words
    this.calculatePositions(this.props.words);
  }

  /**
   * Based on given score get the sentiment class.
   * @param {Number} sentimentScore A word sentiment score
   * @returns {String} CSS class based on the score.
   */
  getSentimentClass(sentimentScore) {
    if (sentimentScore > cc.POSITIVE_SENTIMENT_SCORE) {
      return cc.POSITIVE_SENTIMENT_CLASS;
    } else if (sentimentScore >= cc.NEUTRAL_SENTIMENT_SCORE) {
      return cc.NEUTRAL_SENTIMENT_CLASS;
    } else {
      return cc.NEGATIVE_SENTIMENT_CLASS;
    }
  }

  /**
   * Based on boundries and a word volume calculate the font size.
   * @param {Number} volume A word volume
   * @param {Array} bounds All boundries.
   * @returns {String} New font size based on the constant factor
   */
  calculateFontSize(volume, bounds) {
    let fontSize = cc.BASE_FONT_SIZE;
    return fontSize +
      (cc.FONT_SIZE_FACTOR * bounds.indexOf(getMinBound(volume, bounds)));
  }

  /**
   * Calculate the words position inside the container.
   * @param {Array} words All the words
   * @returns {undefined}
   */
  calculatePositions(words) {
    // Get the container coords
    const containerCords = this.refs.words.getBoundingClientRect();
    const position = new Position(
      containerCords,
      words.map(word => this.getWordCoords(word.id))
    );

    this.setState({coords: position.calculate()});
  }

  /**
   * Return the coordinates of the given React ref
   * @param {String} id The word id
   * @returns {Object} The word coordinates
   */
  getWordCoords(id) {
    return ReactDOM.findDOMNode(this.refs[`word_${id}`])
      .children[0] // we need anchor tag
      .getBoundingClientRect();
  }
}

Words.PropTypes = {
  words: PropTypes.array.isRequired,
  handleWordClick: PropTypes.func.isRequired
};
