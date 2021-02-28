import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const EndWindow = (props) => {
  const { points, stopWatchDisplay, onEnd } = props;

  const onRestart = (e) => {
    if (e.keyCode !== 32) {
      return;
    }
    onEnd('start', null, null);
  };

  useEffect(() => {
    window.addEventListener('keypress', onRestart);
    return () => {
      window.removeEventListener('keypress', onRestart);
    };
  });

  return (
    <div>
      <div>Game Over</div>
      <div>
        <span>
          Points:
          {points}
        </span>
        <span>
          Time:
          {stopWatchDisplay}
        </span>
        <h2>Press space to restart</h2>
      </div>
    </div>
  );
};

EndWindow.propTypes = {
  points: PropTypes.number.isRequired,
  stopWatchDisplay: PropTypes.string.isRequired,
  onEnd: PropTypes.instanceOf(Function).isRequired,
};

export default EndWindow;
