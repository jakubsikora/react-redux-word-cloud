import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchWords, selectWord } from '../actions/words';
import Words from '../components/Words';
import MetaData from '../components/MetaData';
import '../assets/css/words.scss';

/**
 * Main app container.
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.handleWordClick = this.handleWordClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick);

    // Fetch words from the API.
    const { dispatch } = this.props;
    dispatch(fetchWords());
  }

  componentWillMount() {
    document.removeEventListener('click', this.handleClick);
  }

  handleClick() {
    // Select empty word, to hide the metadata sidebar
    const { dispatch } = this.props;
    dispatch(selectWord({}));
  }

  handleWordClick(word) {
    // Select word
    const { dispatch } = this.props;
    dispatch(selectWord(word));
  }

  render() {
    const { items, isFetching } = this.props.words;
    const { selectedWord } = this.props;

    return (
      <div className='container'>
        <header>
          <div className='header'>
            <div className='header-label'>React Redux Word Cloud</div>
          </div>
        </header>

        {isFetching && items.length === 0 &&
          <div className='loader'>Loading...</div>
        }
        {!isFetching && items.length === 0 &&
          <div className='no-words'>No words to display.</div>
        }
        {items.length > 0 &&
        <div className='words'>
          <Words words={items}
                 handleWordClick={this.handleWordClick}/>
        </div>
        }

        <div className='metadata'>
          <MetaData word={selectedWord} />
        </div>
      </div>
    );
  }
}

App.PropTypes = {
  words: PropTypes.array.isRequired,
  selectedWord: PropTypes.object.isRequired
};

/**
 * Map the store state into react component props
 * @param {Object} state Store state
 * @returns {Object} All the store states
 */
function mapStateToProps(state) {
  const { selectedWord, words } = state;

  return {
    selectedWord,
    words
  };
}

// Make sure that App react component will have injected props based on the state
export default connect(mapStateToProps)(App);
