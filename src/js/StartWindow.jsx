import React from 'react';
import PropTypes from 'prop-types';

class StartWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      difficult: 'easy',
      fieldSize: '',
      user: '',
      disabledSize: true,
      disabledUser: true,
      // disabled: true,
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.startGameHotKey);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.startGameHotKey);
  }

  handleSelectValue = ({ target }) => {
    this.setState({ difficult: target.value });
  }

  handleSizeInput = ({ target }) => {
    const { value } = target;
    const valueToNumber = +value;
    let disabledSize = false;
    if (valueToNumber > 32 || valueToNumber < 10) {
      disabledSize = true;
    }
    this.setState({ fieldSize: valueToNumber || '', disabledSize });
  }

  handleUserInput = ({ target }) => {
    const { value } = target;
    const disabledUser = value.length < 1;
    this.setState({ user: value, disabledUser });
  }

  startGameHotKey = (e) => {
    const { disabledSize, disabledUser } = this.state;
    if (e.keyCode !== 115 && e.keyCode !== 120) return;
    if (!(disabledUser === disabledSize && disabledSize === false && disabledUser === false)) {
      return;
    }
    const { onStart } = this.props;
    const autoPlay = e.keyCode === 120;
    onStart({ ...this.state, start: 'game', autoPlay });
  }

  startGame = ({ target }) => {
    const { onStart } = this.props;
    const autoPlay = target.innerText === 'Autoplay';
    onStart({ ...this.state, start: 'game', autoPlay });
  }

  render() {
    const {
      difficult, fieldSize, user, disabledSize, disabledUser,
    } = this.state;
    const ladderBoard = JSON.parse(localStorage.getItem('results'));
    const ladderBoardList = ladderBoard
      ? ladderBoard.map((res, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <tr key={idx}>
          <td>{res.user}</td>
          <td>{res.points}</td>
          <td>{res.stopWatchDisplay}</td>
        </tr>
      ))
      : <tr><td>Empty</td></tr>;
    return (
      <div className="window-start">
        <h1>Start Game</h1>
        <label htmlFor="field-size">
          Enter your name
          <input value={user} placeholder="at least 1 symbol" onChange={this.handleUserInput} id="user" type="text" />
        </label>
        <label htmlFor="field-size">
          Select field size
          <input value={fieldSize} placeholder="value 10-32" onChange={this.handleSizeInput} id="field-size" type="text" />
        </label>
        <select value={difficult} onChange={this.handleSelectValue} name="difficult" id="difficult">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <div>
          <button onClick={this.startGame} type="submit" disabled={!(disabledUser === disabledSize && disabledSize === false && disabledUser === false)}>Normal Game</button>
          <button onClick={this.startGame} type="submit" disabled={!(disabledUser === disabledSize && disabledSize === false && disabledUser === false)}>Autoplay</button>
        </div>
        <table className="table">
          <caption>Ladder Board</caption>
          <thead>
            <tr>
              <th>Player</th>
              <th>Points</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {ladderBoardList}
          </tbody>
        </table>
        <h2>Press F4 to start Normal Game or F9 to start Autoplay</h2>
      </div>
    );
  }
}

StartWindow.propTypes = {
  onStart: PropTypes.instanceOf(Function).isRequired,
};

export default StartWindow;
