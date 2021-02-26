export const getTemplate = (fieldSize) => [...new Array(fieldSize).keys()];

export const getRandomFoodPosition = (fieldSize) => ({
  x: Math.floor(Math.random() * fieldSize),
  y: Math.floor(Math.random() * fieldSize),
});

export const checkPosition = (position, fieldSize) => {
  if (position >= fieldSize) {
    return 0;
  } if (position < 0) {
    return fieldSize - 1;
  }
  return position;
};

export const isCrossWithFood = (snakeHeadPos, foodPos) => {
  if (snakeHeadPos.x === foodPos.x && snakeHeadPos.y === foodPos.y) {
    return true;
  }
  return false;
};

export const isCrossWithMyself = (snakeState) => {
  const [head, ...tail] = snakeState;
  const isCross = tail.some((tailPart) => head.x === tailPart.x && head.y === tailPart.y);
  return isCross;
};

export const getDifficultValue = (value) => {
  let difficult;
  switch (value) {
    case 'easy':
      difficult = 1000;
      break;
    case 'medium':
      difficult = 600;
      break;
    case 'hard':
      difficult = 300;
      break;
    default:
      break;
  }
  return difficult;
};

export const changeVolume = (audioArr, volume) => {
  const currentVolume = volume / 10;
  audioArr.forEach((audio) => {
    // eslint-disable-next-line no-param-reassign
    audio.volume = currentVolume;
  });
};

export const toggleFullScreen = () => {
  if (!document.FullScreen) {
    document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  } else {
    document.webkitCancelFullScreen();
  }
};

export const saveResultLS = (newResult) => {
  const currResults = JSON.parse(localStorage.getItem('results'));
  const newResults = [
    ...currResults || [],
    newResult,
  ].sort((a, b) => b.points - a.points).slice(0, 10);
  localStorage.setItem('results', JSON.stringify(newResults));
};

export const checkLSState = () => {
  const lsState = JSON.parse(localStorage.getItem('state'));
  return lsState || {};
};
