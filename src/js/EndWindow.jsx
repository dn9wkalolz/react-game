import React from 'react';
import PropTypes from 'prop-types';

class EndWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { points, stopWatchDisplay } = this.props;
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
        </div>
      </div>
    );
  }
}

EndWindow.propTypes = {
  points: PropTypes.number.isRequired,
  stopWatchDisplay: PropTypes.string.isRequired,
};

export default EndWindow;
