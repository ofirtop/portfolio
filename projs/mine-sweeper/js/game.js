'use strict';

var MINE = 'MINE';
var FLOOR = 'FLOOR';
var FLAG = 'FLAG';
var TIMER_START = '000';

var FLAG_IMG = '<img src="img/flag.png">';
var MINE_IMG = '<img src="img/mine.png">';
var SMILEY_HAPPY_IMG = '<image src="img/smiley_happy.png" ></image>';
var SMILEY_SAD_IMG = '<image src="img/smiley_sad.png" ></image>' ;
var SMILEY_SUN_IMG = '<image src="img/smiley_sun.png" ></image>';

var gSmileySelector = '.nav.newGame';
var gBulbContainerSelector = '.bulbContainer';
var gFlagsSelector = '.flags';
var gTimerSelector = '.timer';
var gStatusSelector = '.status';

var BEGINNER_BOARD_LENGTH_SIZE = 4;
var BEGINNER_MINES_COUNT = 2;

var MEDUIM_BOARD_LENGTH_SIZE = 6;
var MEDUIM_MINES_COUNT = 5;

var EXPERT_BOARD_LENGTH_SIZE = 8;
var EXPERT_MINES_COUNT = 15;

var TIME_HINT_EXPOSE = 1000;
var TIMER_INTERVAL = 1000;
var MAX_HINTS = 3;

var WELCOME_MSG = 'Welcome to Mine Sweeper';

var gBoard = [];
var gBoardSize = BEGINNER_BOARD_LENGTH_SIZE;
var gLevelMinesCount = BEGINNER_MINES_COUNT;
var gFlagCounter = BEGINNER_MINES_COUNT;
var gHintRequested = false;
var gSeconds = 990;
var gTimeIntervalHandler = null;
var gIsFirstClick = true;
var gGame = {
  score: 0,
  isOn: false
};

function initGame() {

  //initialize vars..
  gSeconds = 0;
  gGame.isOn = true;
  gIsFirstClick = true;

  gBoard = buildBoard();
  renderBoard(gBoard, '.board-container');

  //set mines\flags counter
  gFlagCounter = gLevelMinesCount;
  renderElement(gFlagsSelector,gFlagCounter)

  //set seconds timer
  renderElement(gTimerSelector,TIMER_START)
  clearInterval(gTimeIntervalHandler);  
  renderElement(gStatusSelector,WELCOME_MSG);

  renderSmiley(SMILEY_HAPPY_IMG);
  renderBulbSet();
  setBestScore(true);
}
function renderElement(selector,val){
  document.querySelector(selector).innerText = val;
}
function renderSmiley(typeofSmiley) {
  document.querySelector(gSmileySelector).innerHTML = typeofSmiley;
}

function buildBoard() {
  var board = [];
  for (var i = 0; i < gBoardSize; i++) {
    board.push([]);
    for (var j = 0; j < gBoardSize; j++) {
      var cell = {
        type: FLOOR,
        minesAroundCount: 0,
        isShow: false,
        isMine: false,
        isMarked: false
      };

      board[i][j] = cell;
    }
  }

  return board;
}

//set mines and count the negs
function setMinesAndNegs(rowIdx, colIdx) {
  for (var i = 0; i < gLevelMinesCount; i++) {
    var row = getRandomIntInclusive(0, gBoardSize - 1)
    var col = getRandomIntInclusive(0, gBoardSize - 1)
    //if this is a mine OR also the user first click
    while (gBoard[row][col].isMine || (rowIdx === row && colIdx === col)) {

      row = getRandomIntInclusive(0, gBoardSize - 1)
      col = getRandomIntInclusive(0, gBoardSize - 1)
    }
    gBoard[row][col].isMine = true;
  }

  setMinesNegsCount();
}

//iterating the matrix and sending each cell to be inspected for negs
function setMinesNegsCount() {
  for (var i = 0; i < gBoardSize; i++) {
    for (var j = 0; j < gBoardSize; j++) {
      gBoard[i][j].minesAroundCount = countNbrsMines(i, j);
    }
  }
}

//find number of mines arround the given cell
function countNbrsMines(rowIdx, colIdx) {

  var minesCount = 0;
  for (var i = (rowIdx - 1); i <= (rowIdx + 1); i++) {
    for (var j = (colIdx - 1); j <= (colIdx + 1); j++) {
      if ((i !== rowIdx || j !== colIdx) && (i >= 0 && j >= 0) &&
        (i < gBoardSize && j < gBoardSize)) {
        if (gBoard[i][j].isMine) minesCount++;
      }
    }
  }

  return minesCount;
}


/**
 * Open OR Hide each cell at the given point and arround it.
 * This is part of the HINT functionality
 * @param {Row Index} rowIdx 
 * @param {Column Index} colIdx 
 * @param {open (true) or hide (false) cells} isExpose
 */
function exposeNegs(rowIdx, colIdx, isExpose) {
  for (var i = (rowIdx - 1); i <= (rowIdx + 1); i++) {
    for (var j = (colIdx - 1); j <= (colIdx + 1); j++) {
      if ((i >= 0 && j >= 0) && (i < gBoardSize && j < gBoardSize)) {
        if (isExpose) {
          if (gBoard[i][j].isMine) renderCell({ i: i, j: j }, MINE_IMG);
          else renderCell({ i: i, j: j }, gBoard[i][j].minesAroundCount);
        } else {
          if (!gBoard[i][j].isShow) {            
            renderCell({ i: i, j: j }, '');
            if(gBoard[i][j].isMarked) renderCell({ i: i, j: j }, FLAG_IMG);
          }
        }
      }
    }
  }
}

//CORE FUNCTIONALITY
//expand the empty cells and their surrounding in a recursive manner
function markEmptyCells(rowIdx, colIdx) {
  for (var i = (rowIdx - 1); i <= (rowIdx + 1); i++) {
    for (var j = (colIdx - 1); j <= (colIdx + 1); j++) {
      if ((i !== rowIdx || j !== colIdx) && (i >= 0 && j >= 0) &&
        (i < gBoardSize && j < gBoardSize)) {

        if (gBoard[i][j].isMine === false && gBoard[i][j].isShow === false) {

          gBoard[i][j].isShow = true;
          if (gBoard[i][j].minesAroundCount === 0) {
            renderCell({ i: i, j: j }, getClickedCellHTML(gBoard[i][j].minesAroundCount));

            markEmptyCells(i, j);
          }

          else renderCell({ i: i, j: j }, gBoard[i][j].minesAroundCount);

        }
      }
    }
  }
}

//Render board
function renderBoard(board, selector) {

  var elBoard = document.querySelector(selector);
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n';
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      var cellClass = getClassName({ i: i, j: j })

      if (currCell.type === FLOOR) cellClass += ' floor';

      strHTML += '\t<td class="cell pointer ' + cellClass +
        '"  onMouseDown="cellClicked(event,' + i + ',' + j + ')" oncontextmenu="onContextMenu()">\n';

      if (currCell.isMine && currCell.isShow) strHTML += MINE_IMG;
      if (currCell.minesAroundCount !== 0 && currCell.isShow) strHTML += currCell.minesAroundCount;

      strHTML += '\t</td>\n';
    }
    strHTML += '</tr>\n';
  }

  elBoard.innerHTML = strHTML;
}

//disable contextmenu on right click
function onContextMenu() {
  document.oncontextmenu = function () {
    return false;
  }
}

function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}


function cellClicked(ev, rowIdx, colIdx) {
  if (!gGame.isOn) return;

  //START TIME COUNTER - if this is the first click of the game
  if (gIsFirstClick) {

    gTimeIntervalHandler = setInterval(() => {
      gSeconds++;

      if (gSeconds === 1000) {
        clearInterval(gTimeIntervalHandler);
        return;
      }
      if (gSeconds < 10) document.querySelector(gTimerSelector).innerText = '00' + gSeconds;
      else if (9 < gSeconds < 100) document.querySelector(gTimerSelector).innerText = '0' + gSeconds;
      if (gSeconds > 99) document.querySelector(gTimerSelector).innerText = gSeconds;
// CR - no need to keep TIMER_INTERVAL as global var - when you use it only here for 1sec = 1000ms
    }, TIMER_INTERVAL);

    setMinesAndNegs(rowIdx, colIdx)
    gIsFirstClick = false;
  }

  /********** RIGHT CLICK **********/
  if (ev.button == 2) {

    //if the flag is already marked - remove it and update the counter
    if (gBoard[rowIdx][colIdx].isMarked) {
      gBoard[rowIdx][colIdx].isMarked = false;
      gFlagCounter++;
      document.querySelector('.flags').innerText = gFlagCounter;
      renderCell({ i: rowIdx, j: colIdx }, ' ');
      return;
    }

    //if all flags were used, do nothing
    if (gFlagCounter === 0) return;

    //if the cell is not marked, mark it and update flag
    gBoard[rowIdx][colIdx].isMarked = true;
    renderCell({ i: rowIdx, j: colIdx }, FLAG_IMG);

    //update flag counter
    gFlagCounter--;
    document.querySelector('.flags').innerText = gFlagCounter;
    if (isGameOver()) gameOver(true);
    return;
  }

  /********** LEFT CLICK **********/

  //if the cell is marked with flag, return
  if (gBoard[rowIdx][colIdx].isMarked) return;


  //HINT IS REQUESTED
  if (gHintRequested) {
    //open the cell and it negs
    exposeNegs(rowIdx, colIdx, true);
    //turin hint indication off (the hint was given)
    document.querySelector('.indicationBulb').innerHTML = ''

    //close cell and negs after TIME_HINT_EXPOSE secs
    setTimeout(() => {
      exposeNegs(rowIdx, colIdx, false);
      gHintRequested = false;
    }, TIME_HINT_EXPOSE);
    return;
  }
  //END OF HINT FUNCTIONALITY


  gBoard[rowIdx][colIdx].isShow = true;

  /* THIS IS A MINE */
  if (gBoard[rowIdx][colIdx].isMine) {
    renderMines();

    gameOver(false);
    return
  }

  /* THIS IS AN EMPTY CELL */
  if (gBoard[rowIdx][colIdx].minesAroundCount === 0) {

    renderCell({ i: rowIdx, j: colIdx }, getClickedCellHTML(gBoard[rowIdx][colIdx].minesAroundCount));

    //START EXPANSION **********************
    markEmptyCells(rowIdx, colIdx)
    //END EXPANSION   **********************

    if (isGameOver()) {
      gameOver(true);
    }
  }
  else {

    /* THIS IS A CELL WITH A NUMBER */
    renderCell({ i: rowIdx, j: colIdx }, gBoard[rowIdx][colIdx].minesAroundCount);
    if (isGameOver()) {
      gameOver(true);
    }
  }
}

function renderMines() {
  for (var i = 0; i < gBoardSize; i++) {
    for (var j = 0; j < gBoardSize; j++) {
      if (gBoard[i][j].isMine) {
        renderCell({ i: i, j: j }, MINE_IMG);
      }
    }
  }
}
//change board size
// CR - its better to send the board size as parameter, instead taking it from class
function clickChangeBoard(el) {
  if (el.classList.contains('small')) {
    gBoardSize = BEGINNER_BOARD_LENGTH_SIZE
    gLevelMinesCount = BEGINNER_MINES_COUNT;
    gFlagCounter = BEGINNER_MINES_COUNT;
  }
  if (el.classList.contains('medium')) {
    gBoardSize = MEDUIM_BOARD_LENGTH_SIZE
    gLevelMinesCount = MEDUIM_MINES_COUNT;
    gFlagCounter = MEDUIM_MINES_COUNT;
  }
  if (el.classList.contains('large')) {
    gBoardSize = EXPERT_BOARD_LENGTH_SIZE
    gLevelMinesCount = EXPERT_MINES_COUNT;
    gFlagCounter = EXPERT_MINES_COUNT;
  }
  initGame();
}
//render hint bubles
function renderBulbSet() {
  var strHtml = '';
  for (var i = 0; i < MAX_HINTS; i++) {
    strHtml += `<div class="bulb pointer">
                    <image src="img/light-bulb.png" onclick="clickHint()" ></image>
                 </div>`;
  }
  document.querySelector(gBulbContainerSelector).innerHTML = strHtml;
}
//render cells
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}
//check is game is over
function isGameOver() {
  if (gFlagCounter === 0 && gLevelMinesCount === getCoveredCellsNum()) return true;
  return false;
}
//set / get score from / to local storage
function setBestScore(isStartGame) {
  
  var score = parseInt(localStorage.getItem('board-size-' + gBoardSize));
  if (isNaN(score)) score = 0;

  if (isStartGame) {
    document.querySelector('.score').innerText = 'Best Score: ' + score;
  } else {//if the user win a game - check against best score
    if (score === 0 || score === null) {
      localStorage.setItem('board-size-' + gBoardSize, gSeconds);
      document.querySelector('.score').innerText = 'Best Score: ' + gSeconds;
    } else {//if score > 0 
      if (gSeconds < score) {
        localStorage.setItem('board-size-' + gBoardSize, gSeconds);
        document.querySelector('.score').innerText = 'Best Score: ' + gSeconds;
      } else {
        document.querySelector('.score').innerText = 'Best Score: ' + score;
      }
    }
  }
}
//set game over
function gameOver(isWin) {
  // debugger
  if (!isWin) renderSmiley(SMILEY_SAD_IMG)
  else {
    renderSmiley(SMILEY_SUN_IMG);
    setBestScore(false);
  }

  gGame.isOn = false;
  clearInterval(gTimeIntervalHandler);
  document.querySelector('.status').innerText = 'Game Over !'
}

function getCoveredCellsNum() {

  var coveredCellsCount = 0;
  for (var i = 0; i < gBoardSize; i++) {
    for (var j = 0; j < gBoardSize; j++) {
      if (!gBoard[i][j].isShow) coveredCellsCount++
    }
  }

  return coveredCellsCount;
}

function clickHint() {
  //if hint was not used, and a second hint is requested, return
  if (gHintRequested) return;

  gHintRequested = true;
  //turn on the indication bulb
  document.querySelector('.indicationBulb').innerHTML = '<image src="img/light-bulb.png" height="15px">'


  //remove one bulb if hint is requested
  var bulbs = document.querySelectorAll('.bulb');
  for (var i = 0; i < bulbs.length; i++) {
    if (bulbs[i].children[0].tagName === 'IMG') {
      bulbs[i].innerHTML = '<span></span>';
      return;
    }
  }
}

function getClickedCellHTML() {
  return `<span style="text-align:center;height:40px; width:40px;display:block;overflow:auto; background-color:green;"></span>`
}