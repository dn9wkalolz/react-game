import React from 'react';
import PropTypes from 'prop-types';

const rowStyle = { width: '20px', height: '20px', textAlign: 'center' };
const getElem = (y, x, snakePosition, foodPosition) => {
  if (y === foodPosition.y && x === foodPosition.x) {
    return '🍎';
  }
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < snakePosition.length; i++) {
    if (y === snakePosition[i].y && x === snakePosition[i].x) {
      return '■';
    }
  }
  return false;
};

const Template = ({ arr, snakePosition, foodPosition }) => {
  const template = arr.map((y) => (
    <div style={{ display: 'flex' }} key={y}>
      {
      arr.map((x) => (
        <div style={{ ...rowStyle }} key={x}>{getElem(y, x, snakePosition, foodPosition) || '﹡'}</div>
      ))
      }
    </div>
  ));
  return template;
};

Template.propTypes = {
  arr: PropTypes.instanceOf(Array).isRequired,
  snakePosition: PropTypes.instanceOf(Array).isRequired,
  foodPosition: PropTypes.instanceOf(Object).isRequired,
};

export default Template;
