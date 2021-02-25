import React from 'react';
import PropTypes from 'prop-types';

class StartWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      difficult: 'easy',
      fieldSize: '',
    };
    this.handleSelectValue = this.handleSelectValue.bind(this);
    this.handleSizeInput = this.handleSizeInput.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  handleSelectValue(e) {
    this.setState({ difficult: e.target.value });
  }

  handleSizeInput(e) {
    const { value } = e.target;
    if (parseInt(value, 10) > 40) {
      return;
    }
    this.setState({ fieldSize: value });
  }

  startGame({ target }) {
    const { onStart } = this.props;
    const autoPlay = target.innerText === 'Autoplay';
    onStart({ ...this.state, start: 'game', autoPlay });
  }

  render() {
    const { difficult, fieldSize } = this.state;
    return (
      <div className="window-start">
        <h1>Start Game</h1>
        <h2>Best Score 1000</h2>
        <select value={difficult} onChange={this.handleSelectValue} name="difficult" id="difficult">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <label htmlFor="field-size">
          Select field size
          <input value={fieldSize} placeholder="max value 40" onChange={this.handleSizeInput} id="field-size" type="text" />
        </label>
        <button onClick={this.startGame} type="submit">Normal Game</button>
        <button onClick={this.startGame} type="submit">Autoplay</button>
      </div>
    );
  }
}

StartWindow.propTypes = {
  onStart: PropTypes.instanceOf(Function).isRequired,
};

export default StartWindow;
