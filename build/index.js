(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var pieces = require('./js/pieces.js');
var moves = require('./js/moves.js');

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x888888 )

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.x = 3;
camera.position.y = 2;
camera.position.z = 3;

var controls = new THREE.OrbitControls( camera );
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 10;
controls.update();

var axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

var light = new THREE.PointLight( 0xffffff, 2.5, 100 );
var light2 = new THREE.PointLight( 0xffffff, 2.5, 100 );
light.position.set( 10, 8, 10 );
light2.position.set( -10, 10, -10 );
scene.add( light );
scene.add( light2 );

// add all the pieces to the scene
pieces.all.forEach((p) => { scene.add(p); });


var queue, temp_queue = [];
// var pressedKey = '';
document.addEventListener('keydown', function(e) {
  queue.push(e.key);
  temp_queue.push(e.key);
});

var animate = function () {
	requestAnimationFrame( animate );

  if (!moves.isLocked()) {
    switch (temp_queue.shift()) {
      case 'u': moves._U(); break;
      case 'U': moves._U(true); break;
      case 'f': moves._F(); break;
      case 'F': moves._F(true); break;
    }
  }

  controls.update();
	renderer.render( scene, camera );
};

animate();

},{"./js/moves.js":2,"./js/pieces.js":3}],2:[function(require,module,exports){
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

},{"./pieces.js":3}],3:[function(require,module,exports){

var center_pos = [
  [ 0, 0, 1], // front
  [ 0, 0,-1], // back
  [-1, 0, 0], // left
  [ 1, 0, 0], // right
  [ 0, 1, 0], // up
  [ 0,-1, 0]  // down
]

var edge_pos = [
  // front
  [ 0, 1, 1],
  [ 1, 0, 1],
  [ 0,-1, 1],
  [-1, 0, 1],

  // middle
  [-1, 1, 0],
  [ 1, 1, 0],
  [ 1,-1, 0],
  [-1,-1, 0],

  // back
  [ 0, 1,-1],
  [ 1, 0,-1],
  [ 0,-1,-1],
  [-1, 0,-1]
]

function cube_gen(pos_array) {
  let tmp_array = [];
  pos_array.forEach((piece) => {
    var geometry = new THREE.BoxGeometry( 0.95, 0.95, 0.95 );
    var material = new THREE.MeshLambertMaterial( { color: 0x222222 } );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = piece[0];
    cube.position.y = piece[1];
    cube.position.z = piece[2];
    tmp_array.push( cube );
  });
  return tmp_array;
}

var centers = cube_gen(center_pos);
var edges = cube_gen(edge_pos);

module.exports = {
  centers: centers,
  edges: edges,
  all: centers.concat(edges)
}

},{}]},{},[1]);
