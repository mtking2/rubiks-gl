var pieces = require('./pieces');

var locked = false;
function isLocked() {
  return locked;
}

function lock() {
  locked = true;
}

function unlock() {
  locked = false;
}

var inc = 8;
var rads = (Math.PI/2)/inc;
function setIncrement(i) {
  inc = i;
  rads = (Math.PI/2)/inc;
}

var step_count = 0;

function doMove(move) {
  lock();
  var theta = 0,
      rotVector = new THREE.Vector3( 0, 0, 0 ),
      axis = '',
      transAxis1 = '',
      transAxis2 = '',
      thres = null,
      faceMove = true;

  switch (move) {

    case 'F': case "F'": case 'B': case "B'":
      rotVector = new THREE.Vector3( 0, 0, -1 );
      axis = 'z';
      transAxis1 = 'y';
      transAxis2 = 'x';

      thres = (['B',"B'"].includes(move)) ? -1 : 1;
      theta = rads;

      theta *= (["F'",'B'].includes(move)) ? -1 : 1
      break;

    case 'U': case "U'": case 'D': case "D'":
      rotVector = new THREE.Vector3( 0, -1, 0 );
      axis = 'y';
      transAxis1 = 'x';
      transAxis2 = 'z';

      thres = (['D',"D'"].includes(move)) ? -1 : 1;
      theta = rads;

      theta *= (["U'",'D'].includes(move)) ? -1 : 1
      break;

    case 'R': case "R'": case 'L': case "L'":
      rotVector = new THREE.Vector3( -1, 0, 0 );
      axis = 'x';
      transAxis1 = 'z';
      transAxis2 = 'y';

      thres = (['L',"L'"].includes(move)) ? -1 : 1;
      theta = rads;

      theta *= (["L'",'R'].includes(move)) ? 1 : -1
      break;

    case 'X': case "X'":
      rotVector = new THREE.Vector3( -1, 0, 0 );
      axis = 'x';
      transAxis1 = 'z';
      transAxis2 = 'y';
      faceMove = false;
      theta = rads;
      theta *= (move.includes("'")) ? -1 : 1
      break;

    case 'Y': case "Y'":
      rotVector = new THREE.Vector3( 0, -1, 0 );
      axis = 'y';
      transAxis1 = 'x';
      transAxis2 = 'z';
      faceMove = false;
      theta = rads;
      theta *= (move.includes("'")) ? -1 : 1
      break;

    case 'Z': case "Z'":
      rotVector = new THREE.Vector3( 0, 0, -1 );
      axis = 'z';
      transAxis1 = 'y';
      transAxis2 = 'x';
      faceMove = false;
      theta = rads;
      theta *= (move.includes("'")) ? -1 : 1
      break;

  }

  if (step_count < inc) {
    pieces.all.forEach((piece) => {
      if (Math.round(piece.position[axis]) === thres || !faceMove) {
        let x_prime = piece.position[transAxis1] * Math.cos(theta) - piece.position[transAxis2] * Math.sin(theta);
        let y_prime = piece.position[transAxis1] * Math.sin(theta) + piece.position[transAxis2] * Math.cos(theta);
        piece.position[transAxis1] = x_prime;
        piece.position[transAxis2] = y_prime;
        piece.rotateOnWorldAxis(rotVector, theta);
      }
    });

    step_count++;
    requestAnimationFrame((timestamp) => {
      doMove(move);
    });
  } else {
    step_count = 0
    unlock();
    return;
  }
}

module.exports = {
  isLocked: isLocked,
  setIncrement: setIncrement,
  doMove: doMove
}
