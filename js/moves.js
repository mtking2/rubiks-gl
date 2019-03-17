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
      thetaRot = 0,
      eulerTrans = new THREE.Euler( 0, 0, theta, 'XYZ' ),
      eulerRot = new THREE.Euler( 0, 0, thetaRot, 'XYZ' ),
      axis = '',
      thres = null;

  switch (move) {

    case 'f': case 'F': case 'b': case 'B':
      axis = 'z'; thres = (['b','B'].includes(move)) ? -1 : 1;
      theta = rads;
      thetaRot = rads * (step_count+1);
      if (move === 'f' || move === 'B') {
        theta *= -1;
        thetaRot *= -1;
      }
      eulerTrans = new THREE.Euler( 0, 0, theta, 'XYZ' );
      eulerRot = new THREE.Euler( 0, 0, thetaRot, 'XYZ' );
      break;

    case 'u': case 'U': case 'd': case 'D':
      axis = 'y'; thres = (['d','D'].includes(move)) ? -1 : 1;
      theta = rads;
      thetaRot = rads * (step_count+1);
      if (move === 'u' || move === 'D') {
        theta *= -1;
        thetaRot *= -1;
      }
      eulerTrans = new THREE.Euler( 0, theta, 0, 'XYZ' );
      eulerRot = new THREE.Euler( 0, thetaRot, 0, 'XYZ' );
      break;

    case 'l': case 'L': case 'r': case 'R':
      axis = 'x'; thres = (['r','R'].includes(move)) ? -1 : 1;
      theta = rads;
      thetaRot = rads * (step_count+1);
      if (move === 'l' || move === 'R') {
        theta *= -1;
        thetaRot *= -1;
      }
      eulerTrans = new THREE.Euler( theta, 0, 0, 'XYZ' );
      eulerRot = new THREE.Euler( thetaRot, 0, 0, 'XYZ' );
      break;

  }

  if (step_count < inc) {
    pieces.all.forEach((piece) => {
      if (Math.round(piece.position[axis]) === thres) {
        piece.position.applyEuler(eulerTrans);
        piece.setRotationFromEuler(eulerRot);
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
