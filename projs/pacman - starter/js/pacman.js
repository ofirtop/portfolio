var gPacman;
const PACMAN = '&#9786;';
const TIME_SUPER_POWER = 5000;

function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5
    },
    isSuper: false
  };
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
  gCreatedFood--
}

function movePacman(eventKeyboard) {
  if (!gGame.isOn) return;
  // console.log('eventKeyboard:', eventKeyboard);

  var nextLocation = getNextLocation(eventKeyboard);
  // User pressed none-relevant key in the keyboard
  if (!nextLocation) return;

  var nextCell = gBoard[nextLocation.i][nextLocation.j];

  // Hitting a WALL, not moving anywhere
  if (nextCell === WALL) return;

  //Hitting a POWER_FOOD
  if (nextCell === POWER_FOOD) {
    gPacman.isSuper = true;


    for (var i = 0; i < gGhosts.length; i++) {
      gGhosts[i].color = 'white';
      renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]))
    }

    setTimeout(() => {
      gPacman.isSuper = false;

      for (var i = 0; i < gGhosts.length; i++) {
        gGhosts[i].color = getRandomColor();
        renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]))
      }

    }, TIME_SUPER_POWER);
  }

  //Hitting a Cherry = 10 points
  if (nextCell === CHERRY) {
    updateScore(CHERRY_VALUE);
  }
  // Hitting FOOD? update score
  if (nextCell === FOOD) {
    updateScore(FOOD_VALUE);

    //check if food is done
    if (isFoodFinished()) {
      gameOver();
    }
  }

  if (nextCell === GHOST) {
    if (gPacman.isSuper) {
      var indexFound = false;
      var index = 0;
      for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === nextLocation.i && gGhosts[i].location.j === nextLocation.j) {
          if (gGhosts[i].currCellContent === FOOD) updateScore(FOOD_VALUE);
          if (gGhosts[i].currCellContent === CHERRY) updateScore(CHERRY_VALUE);
          index = i;
          indexFound = true;
        }
      }
      //if ghost is hitted and done
      if (indexFound) {
        gGhosts.splice(index, 1);

        setTimeout(() => {
          while (gGhosts.length < 2) {
            createGhost();
          }
        }, 5000);
      }

    } else {
      gameOver();
      renderCell(gPacman.location, EMPTY);
      return;
    }
  }

  // Update the model to reflect movement
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
  // Update the DOM
  renderCell(gPacman.location, EMPTY);

  // Update the pacman MODEL to new location  
  gPacman.location = nextLocation;

  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
  // Render updated model to the DOM
  renderCell(gPacman.location, PACMAN);

}


function getNextLocation(keyboardEvent) {
  debugger
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j
  };

  switch (keyboardEvent.code) {
    case 'ArrowUp':
      nextLocation.i--;
      break;
    case 'ArrowDown':
      nextLocation.i++;
      break;
    case 'ArrowLeft':
      nextLocation.j--;
      break;
    case 'ArrowRight':
      nextLocation.j++;
      break;
    default: return null;
  }

  return nextLocation;
}

  // function killGhost(nextLocation) {
  //   //get the ghost next location INDEX
  //   var index = getGhostIndexInLocation(nextLocation);
  //   //shift ghost from original array to storage array 
  //   gGhostStorage.push(gGhosts.splice(index, 1)[0]);
  //   console.log('ghost remove from array to the storage')
  //   //upon kill \ insert to the storage, set timeout to restore ghost
  //   setTimeout(() => {
  //     console.log(`about to revive ghost...\nstorage have ${gGhostStorage.length} ghosts.`)
  //     var ghost = gGhostStorage.shift();
  //     console.log(`first ghost shifted from storage LOCATION: {${ghost.location.i},${ghost.location.j}}`)
  //     ghost.color = getRandomColor();
  //     renderCell(ghost.location, getGhostHTML(ghost))
  //     gGhosts.push(ghost);
  //     console.log('ghost restored to the ghost array')
  //   }, 5000);
  // }












