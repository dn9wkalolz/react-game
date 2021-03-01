import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const EndWindow = (props) => {
  const { points, stopWatchDisplay, onEnd } = props;

  const onRestartHotKey = (e) => {
    if (e.keyCode !== 32) {
      return;
    }
    onEnd('start', null, null);
  };

  const onRestart = () => {
    onEnd('start', null, null);
  };

  useEffect(() => {
    window.addEventListener('keypress', onRestartHotKey);
    return () => {
      window.removeEventListener('keypress', onRestartHotKey);
    };
  });

  return (
    <div className="window-end">
      <h1>Game Over</h1>
      <div>
        <span>
          {`Points: ${points}`}
        </span>
        <span>
          {`Time: ${stopWatchDisplay}`}
        </span>
      </div>
      <button type="submit" onClick={onRestart}>Restart</button>
      <h2>Press space to restart</h2>
    </div>
  );
};

EndWindow.propTypes = {
  points: PropTypes.number.isRequired,
  stopWatchDisplay: PropTypes.string.isRequired,
  onEnd: PropTypes.instanceOf(Function).isRequired,
};

export default EndWindow;
