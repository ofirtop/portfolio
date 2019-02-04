//#region variables
var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE';

var GAMER_IMG = '<img src="img/gamer.png">';
var BALL_IMG = '<img src="img/ball.png">';
var GLUE_IMG = '<img src="img/candy.png">';

var gBoard;
var gGamerPos;
var gIntervalHandlerBall;
var gIntervalHandlerGlue;
var gGluePos = null;
var gCollectedBalls = 0;
var gCreatedBalls = 0;
var gIsFrozen = false;

var MAX_ROWS = 10;
var MAX_COLS = 12;

var audioCollectingBalls = new Audio('sounds/collect.mp3');
var audiosteppingOnGlue = new Audio('sounds/glue.mp3')

var TIME_TO_FREEZE = 3000;
var TIME_TO_GENERATE_BALLS = 1000;
var TIME_TO_GENERATE_GLUE = 5000;
//#endregion

function initGame() {
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);

	//every few seconds set a ball in a random place
	generateBalls();
	generateGlue();
}

function buildBoard() {
	// Create the Matrix
	var board = new Array(10);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(12);
	}

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			var cell = { type: FLOOR, gameElement: null };
			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 ||
				j === board[0].length - 1) {
				cell.type = WALL;
			}
			//make passages in walls
			if ((i === 0 && j === 5) || (i === board.length - 1 && j === 5) ||
				(j === 0 && i === 5) || (j === board[0].length - 1 && i === 5)) {
				cell.type = FLOOR;
			}
			board[i][j] = cell;
		}
	}
	// Place the gamer
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;
	gCreatedBalls = 2;

	console.log(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var elBoard = document.querySelector('.board');
	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			strHTML += '\t<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	// console.log('strHTML is:');
	console.log(strHTML);
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	if (gIsFrozen) {
		return;
	}

	var isOnPassage = false;

	/**
	 * 
	 * MOVING THROUGH PASSAGES - START
	 * 
	 */


	//from upper side to lower side
	if (i === -1 && j === 5) {//&& gGamerPos.i === 0 && gGamerPos.j ===5) {
		i = 9;
		isOnPassage = true;
	}
	//from lower side to upper side
	if (i === 10 && j === 5) {
		i = 0;
		isOnPassage = true;
	}
	//from right side to left side
	if (i === 5 && j === 12) {
		j = 0;
		isOnPassage = true;
	}
	//from left side to right side
	if (i === 5 && j === -1) {
		j = 11;
		isOnPassage = true;
	}
	/**
	 * 
	 * MOVING THROUGH PASSAGES - END
	 * 
	 */


	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) ||
		(jAbsDiff === 1 && iAbsDiff === 0) || isOnPassage) {

		if (targetCell.gameElement === BALL) {
			console.log('Collecting balls!');

			audioCollectingBalls.play();


			if (++gCollectedBalls === gCreatedBalls) {
				clearInterval(gIntervalHandlerBall);
				document.querySelector('h3').innerText = 'Game Over !';
			}

		}

		if (targetCell.gameElement === GLUE) {
			console.log('stepping on glue!');
			audiosteppingOnGlue.play();
			gIsFrozen = true;
			setTimeout(() => {
				gIsFrozen = false;
			}, TIME_TO_FREEZE);


		}

		// MOVING
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);
		el = document.querySelector('.collected');
		el.innerText = gCollectedBalls;
	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function onClickRestartGame() {
	gCreatedBalls = 0
	gCollectedBalls = 0;
	el = document.querySelector('.collected');
	el.innerText = gCollectedBalls;
	document.querySelector('h3').innerText = '';
	generateBalls();
	generateGlue();
}

function generateBalls() {
	gIntervalHandlerBall = setInterval(() => {
		console.log('into func')
		//do not make more balls if the board if full
		if (gCreatedBalls - gCollectedBalls >= 78) return

		var row = getRandomIntInclusive(1, 8)
		var col = getRandomIntInclusive(1, 10)

		while (gBoard[row][col].gameElement !== null) {
			console.log('searching')
			row = getRandomIntInclusive(1, 8)
			col = getRandomIntInclusive(1, 10)
		}
		gBoard[row][col].gameElement = BALL;
		renderCell({ i: row, j: col }, BALL_IMG);
		gCreatedBalls++;
	}, TIME_TO_GENERATE_BALLS);
}

function generateGlue() {
	gIntervalHandlerGlue = setInterval(() => {
		//remove current glue 
		if (gGluePos !== null) {
			//dont remove the gameElement in the gGluePos if the GAMER on it						if (gBoard[gGluePos.i][gGluePos.j].gameElement !== null) {
			if (gBoard[gGluePos.i][gGluePos.j].gameElement !== GAMER) {
				gBoard[gGluePos.i][gGluePos.j].gameElement = null;
				renderCell({ i: gGluePos.i, j: gGluePos.j }, '');
			}
		}

		var row = getRandomIntInclusive(1, 8)
		var col = getRandomIntInclusive(1, 10)

		while (gBoard[row][col].gameElement !== null) {
			row = getRandomIntInclusive(1, 8)
			col = getRandomIntInclusive(1, 10)
		}
		gBoard[row][col].gameElement = GLUE;
		gGluePos = { i: row, j: col };

		renderCell({ i: row, j: col }, GLUE_IMG);
	}, TIME_TO_GENERATE_GLUE);
} 0