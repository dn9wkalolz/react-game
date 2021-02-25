import React from 'react';
import PropTypes from 'prop-types';
import Template from './SnakeTemplate';
import { DIRECTION, initialState } from './constants';
import * as gameMethods from './gameMethods';
import backgroundSound from '../assets/beach.mp3';
import crossFoodSound from '../assets/true.mp3';
import crossMyselfSound from '../assets/gameover.mp3';
import getAutoDirection from './howToPlay';

const [backgroundAudio, crossFoodAudio, crossMyselfAudio] = [
  backgroundSound,
  crossFoodSound,
  crossMyselfSound,
].map((audio) => new Audio(audio));

let foodPosition;
let isAutoplayOn;
let snakeDirection = [DIRECTION.top];
let stopWatchDisplay = '0 : 00';
let points = 0;

const getNewHead = (head, fieldSize) => {
  const { x, y } = head;
  return {
    x: gameMethods.checkPosition(x + snakeDirection[0].x, fieldSize),
    y: gameMethods.checkPosition(y + snakeDirection[0].y, fieldSize),
  };
};

const autoSetSnake = (snakeState, fieldSize) => {
  const [head] = snakeState;
  const newHead = getNewHead(head, fieldSize);
  if (gameMethods.isCrossWithFood(newHead, foodPosition)) {
    crossFoodAudio.currentTime = 0;
    crossFoodAudio.play();
    foodPosition = gameMethods.getRandomFoodPosition(fieldSize);
    snakeDirection = getAutoDirection(newHead, foodPosition, snakeDirection[0]);
    points += 1;
    return [newHead, ...snakeState];
  }
  if (snakeDirection.length > 1) {
    snakeDirection.shift();
  }
  return [newHead, ...snakeState.slice(0, -1)];
};

const manualSetSnake = (snakeState, fieldSize) => {
  const [head] = snakeState;
  if (snakeDirection.length > 1) {
    snakeDirection.shift();
  }
  const newHead = getNewHead(head, fieldSize);
  if (gameMethods.isCrossWithFood(newHead, foodPosition)) {
    crossFoodAudio.currentTime = 0;
    crossFoodAudio.play();
    foodPosition = gameMethods.getRandomFoodPosition(fieldSize);
    points += 1;
    return [newHead, ...snakeState];
  }
  return [newHead, ...snakeState.slice(0, -1)];
};

const setSnakePosition = (snakeState, fieldSize) => {
  if (isAutoplayOn) {
    return autoSetSnake(snakeState, fieldSize);
  }
  return manualSetSnake(snakeState, fieldSize);
};

const handleChangeDirection = ({ keyCode }) => {
  const currDirect = snakeDirection[1] || snakeDirection[0];
  if (keyCode === 38 && currDirect !== DIRECTION.bottom && currDirect !== DIRECTION.top) {
    snakeDirection.push(DIRECTION.top);
  } else if (
    keyCode === 40 && currDirect !== DIRECTION.top && currDirect !== DIRECTION.bottom
  ) {
    snakeDirection.push(DIRECTION.bottom);
  } else if (
    keyCode === 37 && currDirect !== DIRECTION.right && currDirect !== DIRECTION.left
  ) {
    snakeDirection.push(DIRECTION.left);
  } else if (
    keyCode === 39 && currDirect !== DIRECTION.left && currDirect !== DIRECTION.right
  ) {
    snakeDirection.push(DIRECTION.right);
  }
};

class GameWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snakePosition: initialState,
      moveTimer: null,
      stopwatchTimer: null,
      stopwatch: 0,
      difficult: gameMethods.getDifficultValue(props.difficult),
      fieldSize: parseInt(props.fieldSize, 10),
      backgroundVolume: 10,
      effectsVolume: 10,
    };
    foodPosition = gameMethods.getRandomFoodPosition(props.fieldSize);
    isAutoplayOn = props.autoPlay;
  }

  componentDidMount() {
    backgroundAudio.play();
    const { difficult, snakePosition } = this.state;
    window.addEventListener('keydown', handleChangeDirection);
    if (isAutoplayOn) {
      const [head] = snakePosition;
      snakeDirection = getAutoDirection(head, foodPosition, snakeDirection[0]);
      window.removeEventListener('keydown', handleChangeDirection);
    }
    const moveTimer = setInterval(this.move, difficult);
    const stopwatchTimer = setInterval(this.startStopwatch, 1000);
    this.setState({ moveTimer, stopwatchTimer });
  }

  componentDidUpdate(prevProps, prevState) {
    const { snakePosition, moveTimer } = this.state;
    if (prevState.snakePosition !== snakePosition) {
      const { onEnd } = this.props;
      if (gameMethods.isCrossWithMyself(snakePosition)) {
        crossMyselfAudio.play();
        clearInterval(moveTimer);
        onEnd('end', points, stopWatchDisplay);
      }
    }
  }

  componentWillUnmount() {
    const { moveTimer, stopwatchTimer } = this.state;
    clearInterval(stopwatchTimer);
    clearInterval(moveTimer);
    backgroundAudio.pause();
    if (!isAutoplayOn) {
      window.removeEventListener('keydown', this.handleChangeDirection);
    }
  }

  move = () => {
    this.setState((state) => {
      const { snakePosition, fieldSize } = state;
      return {
        snakePosition: setSnakePosition(snakePosition, fieldSize),
      };
    });
  }

  backgroundVolumeHandler = ({ target }) => {
    const { value } = target;
    gameMethods.changeVolume([backgroundAudio], value);
    this.setState({ backgroundVolume: value });
  }

  effectsVolumeHandler = ({ target }) => {
    const { value } = target;
    gameMethods.changeVolume([crossFoodAudio, crossMyselfAudio], value);
    this.setState({ effectsVolume: value });
  }

  startStopwatch = () => {
    this.setState((state) => {
      const time = state.stopwatch;
      const minutes = Math.floor(time / 60);
      let seconds = time % 60;
      seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      stopWatchDisplay = `${minutes} : ${seconds}`;
      return { stopwatch: state.stopwatch + 1 };
    });
  }

  render() {
    const {
      snakePosition, fieldSize, backgroundVolume, effectsVolume,
    } = this.state;
    const arr = gameMethods.getTemplate(fieldSize);
    return (
      <div className="game" style={{ flexDirection: 'column' }}>
        <div className="game__container" style={{ flexDirection: 'column' }}>
          <Template arr={arr} snakePosition={snakePosition} foodPosition={foodPosition} />
        </div>
        <div className="game__statistics">
          <span className="game__statistics__time">
            Time:
            {' '}
            {stopWatchDisplay}
          </span>
          <span className="game__statistics__points">
            Points:
            {' '}
            {points}
          </span>
        </div>
        <div className="game__options">
          <label htmlFor="sound">
            {' '}
            Background Volume
            <input type="range" min="0" max="10" value={backgroundVolume} onChange={this.backgroundVolumeHandler} />
          </label>
          <label htmlFor="sound">
            {' '}
            Effects Volume
            <input type="range" min="0" max="10" value={effectsVolume} onChange={this.effectsVolumeHandler} />
          </label>
          <button type="submit" onClick={gameMethods.toggleFullScreen}>Full Screen mode</button>
        </div>
      </div>
    );
  }
}

GameWindow.propTypes = {
  fieldSize: PropTypes.string.isRequired,
  difficult: PropTypes.string.isRequired,
  onEnd: PropTypes.instanceOf(Function).isRequired,
  autoPlay: PropTypes.bool.isRequired,
};

export default GameWindow;
