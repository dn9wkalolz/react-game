import React from 'react';
import PropTypes from 'prop-types';

class StartWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      difficult: 'easy',
      fieldSize: '',
      user: '',
      disabled: true,
    };
  }

  handleSelectValue = ({ target }) => {
    this.setState({ difficult: target.value });
  }

  handleSizeInput = ({ target }) => {
    const { value } = target;
    const valueToNumber = parseInt(value, 10);
    let disabled = false;
    if (valueToNumber > 40 || valueToNumber < 10) {
      disabled = true;
    }
    this.setState({ fieldSize: valueToNumber || '', disabled });
  }

  handleUserInput = ({ target }) => {
    const { value } = target;
    const disabled = value.length < 1;
    this.setState({ user: value, disabled });
  }

  startGame = ({ target }) => {
    const { onStart } = this.props;
    const autoPlay = target.innerText === 'Autoplay';
    onStart({ ...this.state, start: 'game', autoPlay });
  }

  render() {
    const {
      difficult, fieldSize, user, disabled,
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
          <input value={fieldSize} placeholder="value 10-40" onChange={this.handleSizeInput} id="field-size" type="text" />
        </label>
        <select value={difficult} onChange={this.handleSelectValue} name="difficult" id="difficult">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button onClick={this.startGame} type="submit" disabled={disabled}>Normal Game</button>
        <button onClick={this.startGame} type="submit" disabled={disabled}>Autoplay</button>
        <table className="table">
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
      </div>
    );
  }
}

StartWindow.propTypes = {
  onStart: PropTypes.instanceOf(Function).isRequired,
};

export default StartWindow;
