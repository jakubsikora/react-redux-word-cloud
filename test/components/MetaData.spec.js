import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import MetaData from '../../components/MetaData';

function setup(propOverrides) {
  const props = Object.assign({
    word: {
      id: 0,
      label: 'foo',
      volume: 10,
      sentiment: {
        positive: 1,
        neutral: 2,
        negative: 0
      }
    }
  }, propOverrides);

  const renderer = TestUtils.createRenderer();

  renderer.render(
    <MetaData {...props} />
  );

  let output = renderer.getRenderOutput();

  return {
    output: output,
    renderer: renderer
  };
}

describe('MetaData component', () => {
  it('initial render', () => {
    const { output } = setup();

    expect(output.type).toBe('div');
    expect(output.props.className).toBe('visible');

    const div = output.props.children;
    expect(div.type).toBe('div');
  });

  it('hides metadata on empty word', () => {
    const { output } = setup({ word: {}});
    expect(output.type).toBe('div');
    expect(output.props.className).toBe('');
    expect(output.props.children).toBe(false);
  });
});
