import React from 'react';
import GameWindow from './GameWindow';
import StartWindow from './StartWindow';
import EndWindow from './EndWindow';
import { checkLSState } from './gameMethods';

class App extends React.Component {
  constructor() {
    super();
    const {
      difficult, fieldSize, gamePhase, autoPlay, user,
    } = checkLSState();
    this.state = {
      difficult: difficult || null,
      fieldSize: fieldSize || null,
      gamePhase: gamePhase || 'start',
      points: null,
      stopWatchDisplay: null,
      autoPlay,
      user: user || null,
    };
  }

  endGame = (gamePhase, points, stopWatchDisplay) => {
    this.setState({ gamePhase, points, stopWatchDisplay });
  }

  startGame = ({
    difficult, fieldSize, start, autoPlay, user,
  }) => {
    this.setState({
      difficult, fieldSize, gamePhase: start, autoPlay, user,
    });
  }

  render() {
    const {
      difficult, fieldSize, gamePhase, points, stopWatchDisplay, autoPlay, user,
    } = this.state;
    let component;
    if (gamePhase === 'start') component = <StartWindow onStart={this.startGame} />;
    else if (gamePhase === 'game') {
      component = (
        <GameWindow
          {...{
            difficult, fieldSize, autoPlay, user,
          }}
          onEnd={this.endGame}
        />
      );
    } else component = <EndWindow {...{ points, stopWatchDisplay }} />;
    return (
      <>
        <h1>Snake Game</h1>
        { component }
      </>
    );
  }
}

export default App;
