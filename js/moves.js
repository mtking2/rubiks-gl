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

// var rad = Math.PI/180
var inc = 10;
var rads = (Math.PI/2)/inc;

var [fc,fpc, uc,upc] = new Array(2).fill(0);

function _F(isPrime=false) {
  lock();

  var theta = isPrime ? rads : -rads
  var eulerTrans = new THREE.Euler( 0, 0, theta, 'XYZ' );

  let thetaRot = isPrime ? rads * (fpc+1) : -rads * (fc+1)
  let eulerRot = new THREE.Euler( 0, 0, thetaRot, 'XYZ' );

  if ( (isPrime ? fpc : fc) < inc) {
    pieces.all.forEach((piece) => {
      if (Math.round(piece.position.z) === 1) {
        piece.position.applyEuler(eulerTrans);
        piece.setRotationFromEuler(eulerRot);
      }
    });

    isPrime ? fpc++ : fc++;
    requestAnimationFrame((timestamp) => {
      _F(isPrime);
    });
  } else {
    unlock();
    isPrime ? fpc = 0 : fc = 0;
    return;
  }
}

function _U(isPrime=false) {
  lock();
  var theta = isPrime ? -rads : rads
  var eulerTrans = new THREE.Euler( 0, theta, 0, 'XYZ' );

  let thetaRot = isPrime ? -rads * (upc+1) : rads * (uc+1)
  let eulerRot = new THREE.Euler( 0, thetaRot, 0, 'XYZ' );

  if ( (isPrime ? upc : uc) < inc) {
    pieces.all.forEach((piece) => {
      if (Math.round(piece.position.y) === 1) {
        piece.position.applyEuler(eulerTrans);
        piece.setRotationFromEuler(eulerRot);
      }
    });

    isPrime ? upc++ : uc++;
    requestAnimationFrame((timestamp) => {
      _U(isPrime);
    });
  } else {
    unlock();
    isPrime ? upc = 0 : uc = 0;
    return;
  }
}

module.exports = {
  isLocked: isLocked,
  _U: _U,
  _F: _F
}
