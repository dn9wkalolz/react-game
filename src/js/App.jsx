import React from 'react';
import GameWindow from './SnakeRender';
import StartWindow from './StartWindow';
import EndWindow from './EndWindow';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      difficult: null,
      fieldSize: null,
      gamePhase: 'start',
      points: null,
      stopWatchDisplay: null,
      autoPlay: null,
    };
  }

  endGame = (gamePhase, points, stopWatchDisplay) => {
    this.setState({ gamePhase, points, stopWatchDisplay });
  }

  startGame = ({
    difficult, fieldSize, start, autoPlay,
  }) => {
    this.setState({
      difficult, fieldSize, gamePhase: start, autoPlay,
    });
  }

  render() {
    const {
      difficult, fieldSize, gamePhase, points, stopWatchDisplay, autoPlay,
    } = this.state;
    let component;
    if (gamePhase === 'start') component = <StartWindow onStart={this.startGame} />;
    else if (gamePhase === 'game') component = <GameWindow difficult={difficult} fieldSize={fieldSize} onEnd={this.endGame} autoPlay={autoPlay} />;
    else component = <EndWindow points={points} stopWatchDisplay={stopWatchDisplay} />;
    return (
      <>
        <h1>Snake Game</h1>
        { component }
      </>
    );
  }
}

export default App;
