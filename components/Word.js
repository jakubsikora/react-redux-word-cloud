import React, { Component, PropTypes } from 'react';

export default class Word extends Component {
  render() {
    const { word, handleClick, sentimentClass, fontSize, coords } = this.props;

    // Format the word inline style
    const wordStyle = {
      fontSize: `${fontSize}em`,
      left: coords ? coords.left: 0,
      top: coords ? coords.top : 0,
      visibility: coords ? 'visible': 'hidden' // Hide word if no coords provided
    };

    let wordClass = ['word'];
    wordClass.push(sentimentClass);

    return (
      <li>
        <a className={wordClass.join(' ')}
           style={wordStyle}
           href='#'
           onClick={e => {
             e.preventDefault();
             handleClick(word);
           }}>{word.label}</a>
      </li>
    );
  }
}

Word.PropTypes = {
  word: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  sentimentClass: PropTypes.string.isRequired,
  fontSize: PropTypes.string.isRequired,
  coords: PropTypes.object
};
