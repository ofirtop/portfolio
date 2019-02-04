var GHOST = '&#9781;';

var gIntervalGhosts;
var gGhosts;
var gGhostStorage = [];

function createGhost(board) {
    var ghost = {
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD,
        color: getRandomColor(),
        isDiminished: false
    };
    gGhosts.push(ghost);

    if (gBoard[ghost.location.i][ghost.location.j] === GHOST) {
        ghost.currCellContent = gGhosts[0].currCellContent;
    }
    else {
        ghost.currCellContent = gBoard[ghost.location.i][ghost.location.j];
    }

    board[ghost.location.i][ghost.location.j] = GHOST;

}


function createGhosts(board) {
    // Empty the gGhosts array, create some ghosts
    gGhosts = [];

    createGhost(board)
    createGhost(board)

    // Run the interval to move them
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];

        // Create the moveDiff
        var moveDiff = getMoveDiff();
        // console.log('moveDiff', moveDiff);
        var nextLocation = {
            i: ghost.location.i + moveDiff.i,
            j: ghost.location.j + moveDiff.j,
        }
        // console.log('nextLocation', nextLocation);

        var nextCell = gBoard[nextLocation.i][nextLocation.j]
        // If WALL return
        if (nextCell === GHOST) {
            //console.log('Ghost Hitting a GHOST');
            return;
        }
        if (nextCell === WALL) {
            //console.log('Ghost Hitting a Wall');
            return;
        }
        // DETECT gameOver
        if (nextCell === PACMAN) {
            console.log('Ghost Hitting a PACMAN');
            if (gPacman.isSuper) {
                killGhost(ghost.location);
            }
            else gameOver();
        }

        // Set back what we stepped on
        gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
        renderCell(ghost.location, ghost.currCellContent);

        // Move the ghost MODEL
        ghost.currCellContent = nextCell;
        ghost.location = nextLocation
        gBoard[ghost.location.i][ghost.location.j] = GHOST;

        // Updade the DOM 
        //renderCell(ghost.location, GHOST)
        renderCell(ghost.location, getGhostHTML(ghost))
    }
}

// There are 4 options where to go
function getMoveDiff() {
    // return { i: getRandomIntInclusive(-1, 1), j: getRandomIntInclusive(-1, 1) }
    var opts = [{ i: 0, j: 1 }, { i: 1, j: 0 }, { i: -1, j: 0 }, { i: 0, j: -1 }];
    return opts[getRandomIntInclusive(0, opts.length - 1)];
}

function diminishedGhosts(val) {
    // debugger
    for (var i = 0; i < gGhosts.length; i++) {
        console.log('diminishedGhosts')
        gGhosts[i].color = val ? 'white' : getRandomColor();
        gGhosts[i].isDiminished = val ? true : false;
        // renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]))
    }

    // if (!val) {
    //     while (gGhosts.length < 2) {
    //         createGhost(gBoard);
    //     }
    // }

    for (var i = 0; i < gGhosts.length; i++) {
        renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]))
    }
}

function getGhostHTML(ghost) {
    return `<span style="background-color:${ghost.color}">${GHOST}</span>`
}

function getGhostInLocation(location) {
    // for(var i = 0 ; i < gGhost.length ; i++){
    //     if(gGhost[i].locaion === location) return gGhost[i];        
    // }
    // debugger
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === location.i && gGhosts[i].location.j === location.j) {
            return gGhosts[i];
        }
    }
    return null;
}

function getGhostIndexInLocation(location) {
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === location.i && gGhosts[i].location.j === location.j) {
            return i;
        }
        return null;
    }
}