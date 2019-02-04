'use strict';
var WALL = '#';
var FOOD = '.';
var FOOD_VALUE = 1;
var EMPTY = ' ';
var POWER_FOOD = '*';
var CHERRY = '\u1F352';
var CHERRY_VALUE = 10;

var BOARD_LENGTH_SIZE = 10;
var GAME_OVER_MSG = 'Game Over ! ! !';
var VICTORIOUS_MSG = 'You are Victorious';
var CHERRY_INTERVAL = 15000;
var gEmptyCellList = [];
var gBoard;
var gCollectedFood = 0;
var gCreatedFood = 0;
var gCherryInterval = null;
var gGame = {
  score: 0,
  isOn: false
};

function init() {
  gBoard = buildBoard();

  createPacman(gBoard);
  createGhosts(gBoard);

  printMat(gBoard, '.board-container');
  // console.table(gBoard);
  gGame.isOn = true;
  gCherryInterval = setInterval(setCherry, CHERRY_INTERVAL);
}

function setCherry() {
  console.log(`gEmptyCellList.length=${gEmptyCellList.length}`)
  //search for an empty cell in the martix
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j] === EMPTY) {
        gEmptyCellList.push({ i: i, j: j });
      }
      //TODO: CHECK FOR GHOST THAT HAVE "EMPTY" UNDER
    }
  }

  //if there is no empty cell in the board - do nothing
  if (gEmptyCellList.length === 0) {
    console.log('no empty place in board... returnning without setting a cherry..')
    return;
  }

  //get a random index from the empty array
  var indx = getRandomIntInclusive(0, gEmptyCellList.length - 1);
  //set symbol 'cherry' in the gBoard 
  gBoard[gEmptyCellList[indx].i][gEmptyCellList[indx].j] = CHERRY;
  //render the cell
  renderCell({ i: gEmptyCellList[indx].i, j: gEmptyCellList[indx].j }, CHERRY);

}

function buildBoard() {
  var board = [];
  for (var i = 0; i < BOARD_LENGTH_SIZE; i++) {
    board.push([]);
    for (var j = 0; j < BOARD_LENGTH_SIZE; j++) {
      board[i][j] = FOOD;
      gCreatedFood++

      if (i === 0 || i === BOARD_LENGTH_SIZE - 1 ||
        j === 0 || j === BOARD_LENGTH_SIZE - 1 ||
        (j === 3 && i > 4 && i < BOARD_LENGTH_SIZE - 2)) {

        board[i][j] = WALL;
        gCreatedFood--;

      }
    }
  }

  //set power food on board corners
  board[1][1] = POWER_FOOD;
  board[1][8] = POWER_FOOD;
  board[8][1] = POWER_FOOD;
  board[8][8] = POWER_FOOD;
  gCreatedFood -= 4;

  return board;
}

function updateScore(value) {
  if (value === 1) gCollectedFood++;

  // Update both the model and the dom for the score
  gGame.score += value;
  document.querySelector('header h3 span').innerText = gGame.score;
}

function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell' + i + '-' + j;
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function gameOver() {
  console.log('Game Over');
  gGame.isOn = false;
  clearInterval(gIntervalGhosts);
  gIntervalGhosts = 0;
  //set status line
  if (isFoodFinished()) document.querySelector('.status').innerText = VICTORIOUS_MSG;
  else document.querySelector('.status').innerText = GAME_OVER_MSG;

  //show status line
  document.querySelector('.status').classList.remove('hidden');

  //Show button play again
  document.querySelector('.button').classList.remove('hidden');
  //document.querySelector('header div').innerHTML = '<span onclick="StartGame()>New Game<span>'
}

function StartNewGame() {
  document.querySelector('.status').classList.add('hidden')
  document.querySelector('.button').classList.add('hidden')
  document.querySelector('header h3 span').innerText = 0;

  gGame.score = 0;
  gCreatedFood = 0
  gCollectedFood = 0;
  init();

}


function isFoodFinished() {
  return gCollectedFood === gCreatedFood;
}

