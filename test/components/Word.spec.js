import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Word from '../../components/Word';

function setup(propOverrides) {
  const props = Object.assign({
    word: {
      id: 0,
      label: 'foo'
    },
    handleClick: expect.createSpy(),
    sentimentClass: 'foo',
    fontSize: 1,
    coords: {
      left: 10,
      top: 10
    }
  }, propOverrides);

  const renderer = TestUtils.createRenderer();

  renderer.render(
    <Word {...props} />
  );

  let output = renderer.getRenderOutput();

  return {
    props: props,
    output: output,
    renderer: renderer
  };
}

describe('Word component', () => {
  it('initial render', () => {
    const { output } = setup();

    expect(output.type).toBe('li');

    const anchor = output.props.children;

    expect(anchor.type).toBe('a');
    expect(anchor.props.className).toBe('word foo');
    expect(anchor.props.style).toEqual({
      fontSize: '1em',
      left: 10,
      top: 10,
      visibility: 'visible'
    });
    expect(anchor.props.children).toBe('foo');
  });

  it('link onClick should call handleClick', () => {
    const { output, props } = setup();
    const anchor = output.props.children;
    anchor.props.onClick({
      preventDefault: () => { return; }
    });
    expect(props.handleClick).toHaveBeenCalled();
  });

  it('should hide on empty coords', () => {
    const { output } = setup({ coords: null });
    const anchor = output.props.children;
    expect(anchor.props.className).toBe('word foo');
    expect(anchor.props.style).toEqual({
      fontSize: '1em',
      left: 0,
      top: 0,
      visibility: 'hidden'
    });
    expect(anchor.props.children).toBe('foo');
  });
});
