import React, { Component, PropTypes } from 'react';
import _ from 'underscore';

export default class MetaData extends Component {
  render() {
    const { word } = this.props;

    // If the word is empty hide the view
    const visible = !_.isEmpty(word);

    return (
      <div className={(visible ? 'visible' : '')}>
        {visible &&
        <div className='metadata-info'>
          <div>Information on topic</div>
          <div className='metadata-label'><strong>{word.label}</strong></div>
          <div className='metadata-volume'>Total Mentions: {word.volume}</div>

          {word.sentiment.positive &&
          <div className='metadata-sentiment positive'>
            Positive Mentions: {word.sentiment.positive}
          </div>
          }

          {word.sentiment.neutral &&
          <div className='metadata-sentiment neutral'>
            Neutral Mentions: {word.sentiment.neutral}
          </div>
          }

          {word.sentiment.negative &&
          <div className='metadata-sentiment negative'>
            Negative Mentions: {word.sentiment.negative}
          </div>
          }
        </div>
        }
      </div>
    );
  }
}

MetaData.PropTypes = {
  word: PropTypes.object.isRequired
};
