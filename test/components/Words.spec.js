import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Words from '../../components/Words';

function setup() {
  const props = {
    words: [
      {
        id: 0
      },
      {
        id: 1
      }
    ],
    handleWordClick: expect.createSpy()
  };

  const renderer = TestUtils.createRenderer()
  renderer.render(<Words {...props} />)
  const output = renderer.getRenderOutput()

  return {
    props: props,
    output: output,
    renderer: renderer
  }
}

describe('Words component', () => {
  it('initial render', () => {
    const { output } = setup();

    expect(output.type).toBe('ul');
    expect(output.ref).toBe('words');
    expect(output.props.children.length).toBe(2);
  });

  it('call the handleClick callback', () => {
    const { output, props } = setup();
    const word = output.props.children[0];
    word.props.handleClick();
    expect(props.handleWordClick).toHaveBeenCalled();
  });
});
