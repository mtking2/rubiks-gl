var pieces = require('./pieces.js');

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
var step_count = 0;

function doMove(move) {
  lock();
  var theta = 0,
      rotVector = new THREE.Vector3( 0, 0, 0 ),
      axis = '',
      transAxis1 = '',
      transAxis2 = '',
      thres = null;

  switch (move) {

    case 'f': case 'F': case 'b': case 'B':
      rotVector = new THREE.Vector3( 0, 0, -1 );
      axis = 'z';
      transAxis1 = 'y';
      transAxis2 = 'x';

      thres = (['b','B'].includes(move)) ? -1 : 1;
      theta = rads;

      theta *= (['F','b'].includes(move)) ? -1 : 1
      break;

    case 'u': case 'U': case 'd': case 'D':
      rotVector = new THREE.Vector3( 0, -1, 0 );
      axis = 'y';
      transAxis1 = 'x';
      transAxis2 = 'z';

      thres = (['d','D'].includes(move)) ? -1 : 1;
      theta = rads;

      theta *= (['U','d'].includes(move)) ? -1 : 1
      break;

    case 'l': case 'L': case 'r': case 'R':
      rotVector = new THREE.Vector3( -1, 0, 0 );
      axis = 'x';
      transAxis1 = 'z';
      transAxis2 = 'y';

      thres = (['r','R'].includes(move)) ? -1 : 1;
      theta = rads;

      theta *= (['L','r'].includes(move)) ? -1 : 1
      break;

  }

  if (step_count < inc) {
    pieces.all.forEach((piece) => {
      if (Math.round(piece.position[axis]) === thres) {
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
  doMove: doMove
}
