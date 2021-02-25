import { DIRECTION } from './constants';
import { getTemplate } from './gameMethods';

const getAutoDirection = (snakeHeadPosition, foodPosition, snakeDirection) => {
  let autoDirection = [snakeDirection];
  const deltaX = foodPosition.x - snakeHeadPosition.x;
  const deltaY = foodPosition.y - snakeHeadPosition.y;
  const saveDirectionY = deltaY === 0
   && (snakeDirection === DIRECTION.right
    || snakeDirection === DIRECTION.left);
  const saveDirectionX = deltaX === 0
    && (snakeDirection === DIRECTION.top
     || snakeDirection === DIRECTION.bottom);
  if (saveDirectionX || saveDirectionY) {
    return autoDirection;
  }
  const xDirectionArr = deltaX < 0
    ? getTemplate(Math.abs(deltaX)).map(() => DIRECTION.left)
    : getTemplate(Math.abs(deltaX)).map(() => DIRECTION.right);
  const yDirectionArr = deltaY < 0
    ? getTemplate(Math.abs(deltaY)).map(() => DIRECTION.top)
    : getTemplate(Math.abs(deltaY)).map(() => DIRECTION.bottom);
  if (snakeDirection === DIRECTION.right || snakeDirection === DIRECTION.left) {
    autoDirection = [...yDirectionArr, ...xDirectionArr];
  } else if (snakeDirection === DIRECTION.top || snakeDirection === DIRECTION.bottom) {
    autoDirection = [...xDirectionArr, ...yDirectionArr];
  }
  return autoDirection;
};

export default getAutoDirection;
