import React from 'react';
import GameWindow from './GameWindow';
import StartWindow from './StartWindow';
import EndWindow from './EndWindow';
import { checkLSState } from './gameMethods';
import RS from '../assets/rs_school_js.svg';

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
    } else component = <EndWindow {...{ points, stopWatchDisplay }} onEnd={this.endGame} />;
    return (
      <>
        <h1 className="title">Snake Game</h1>
        { component }
        <footer>
          <div><i className="fas fa-copyright"> Copyright, 2021</i></div>
          <div><a href="https://rs.school/js/"><i className="fa fa-github">dn9wkalolz</i></a></div>
          <div>
            <img src={RS} alt="123" />
            <a href="https://rs.school/js/">RS School</a>
          </div>
        </footer>
      </>
    );
  }
}

export default App;
