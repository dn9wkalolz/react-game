import React from 'react';
import PropTypes from 'prop-types';
import Template from './SnakeTemplate';
import { DIRECTION, initialState } from './constants';
import * as gameMethods from './gameMethods';
import backgroundSound from '../assets/backgroundTheme.mp3';
import crossFoodSound from '../assets/true.mp3';
import crossMyselfSound from '../assets/gameover.mp3';
import getAutoDirection from './howToPlay';

const [backgroundAudio, crossFoodAudio, crossMyselfAudio] = [
  backgroundSound,
  crossFoodSound,
  crossMyselfSound,
].map((audio) => new Audio(audio));

let foodPosition;
let autoPlay;
let snakeDirection;
let stopWatchDisplay = '0 : 00';
let points;

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
  if (autoPlay) {
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
    const {
      snakePosition, stopwatch, effectsVolume, ...lsState
    } = gameMethods.checkLSState();
    this.state = {
      snakePosition: snakePosition || initialState,
      stopwatch: stopwatch || 0,
      difficult: props.difficult,
      fieldSize: props.fieldSize,
      backgroundVolume: 0,
      effectsVolume: effectsVolume || 10,
      user: props.user,
    };
    foodPosition = lsState.foodPosition || gameMethods.getRandomFoodPosition(props.fieldSize);
    autoPlay = props.autoPlay;
    const nativeArr = lsState.snakeDirection?.map((direct) => DIRECTION[direct.name]);
    snakeDirection = nativeArr || [DIRECTION.top];
    points = lsState.points || 0;
  }

  componentDidMount() {
    const {
      difficult, snakePosition, effectsVolume, backgroundVolume, stopwatch,
    } = this.state;
    gameMethods.changeVolume([crossFoodAudio, crossMyselfAudio], effectsVolume);
    gameMethods.changeVolume([backgroundAudio], backgroundVolume);
    window.addEventListener('keydown', handleChangeDirection);
    if (autoPlay && stopwatch === 0) {
      const [head] = snakePosition;
      snakeDirection = getAutoDirection(head, foodPosition, snakeDirection[0]);
      window.removeEventListener('keydown', handleChangeDirection);
    }
    this.moveTimer = setInterval(this.move, gameMethods.getDifficultValue(difficult));
    this.stopwatchTimer = setInterval(this.startStopwatch, 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    const { snakePosition } = this.state;
    const { onEnd } = this.props;
    const curState = JSON.stringify({
      ...this.state, foodPosition, snakeDirection, points, autoPlay, gamePhase: 'game',
    });
    localStorage.setItem('state', curState);
    if (prevState.snakePosition !== snakePosition) {
      if (gameMethods.isCrossWithMyself(snakePosition)) {
        crossMyselfAudio.play();
        clearInterval(this.moveTimer);
        onEnd('end', points, stopWatchDisplay);
        localStorage.removeItem('state');
      }
    }
  }

  componentWillUnmount() {
    const { user } = this.state;
    clearInterval(this.stopwatchTimer);
    backgroundAudio.pause();
    if (!autoPlay) {
      window.removeEventListener('keydown', this.handleChangeDirection);
    }
    gameMethods.saveResultLS({ points, stopWatchDisplay, user });
  }

  move = () => {
    this.setState((state) => {
      const { snakePosition, fieldSize } = state;
      return {
        snakePosition: setSnakePosition(snakePosition, fieldSize),
      };
    });
  }

  onEnd = () => {
    const { onEnd } = this.props;
    clearInterval(this.moveTimer);
    localStorage.removeItem('state');
    onEnd('end', points, stopWatchDisplay);
  }

  backgroundVolumeHandler = ({ target }) => {
    const { value } = target;
    if (backgroundAudio.paused) {
      backgroundAudio.play();
    }
    gameMethods.changeVolume([backgroundAudio], value);
    target.blur();
    this.setState({ backgroundVolume: value });
  }

  effectsVolumeHandler = ({ target }) => {
    const { value } = target;
    gameMethods.changeVolume([crossFoodAudio, crossMyselfAudio], value);
    target.blur();
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
      <div className="game">
        <div className="game__container">
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
          <div className="game__options__volume">
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
          </div>
          <div className="game__options__buttons">
            <button type="submit" onClick={gameMethods.toggleFullScreen}>Full Screen mode</button>
            <button type="submit" onClick={this.onEnd}>End Game</button>
          </div>
        </div>
      </div>
    );
  }
}

GameWindow.propTypes = {
  fieldSize: PropTypes.number.isRequired,
  difficult: PropTypes.string.isRequired,
  autoPlay: PropTypes.bool.isRequired,
  user: PropTypes.string.isRequired,
  onEnd: PropTypes.instanceOf(Function).isRequired,
};

export default GameWindow;
