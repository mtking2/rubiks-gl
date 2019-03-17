(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var pieces = require('./js/pieces');
var moves = require('./js/moves');

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x888888 )

var camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 1, 100 );
camera.position.x = 6;
camera.position.y = 3;
camera.position.z = 6;

var controls = new THREE.OrbitControls( camera );
controls.enablePan = false;
controls.minDistance = 6;
controls.maxDistance = 15;
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


var queue = [], temp_queue = [];
// var pressedKey = '';
document.addEventListener('keydown', function(e) {
  let key = e.key;
  if (/^[fFbBuUdDlLrR]$/.test(key)) {
    temp_queue.push(e.key);
    queue.push(e.key);
  }
});

var animate = function () {
	requestAnimationFrame( animate );

  if (!moves.isLocked() && temp_queue.length > 0) {
    let move = temp_queue.shift();
    moves.doMove(move);
    console.log(move);
  }

  controls.update();
	renderer.render( scene, camera );
};

animate();

},{"./js/moves":3,"./js/pieces":4}],2:[function(require,module,exports){
// https://discourse.threejs.org/t/round-edged-box-2/1448
// https://jsfiddle.net/prisoner849/p614jc75/
class RoundEdgedBox {

  constructor(width, height, depth, radius, widthSegments, heightSegments, depthSegments, smoothness) {

    width = width || 1;
    height = height || 1;
    depth = depth || 1;
    radius = radius || (Math.min(Math.min(width, height), depth) * .25);
    widthSegments = Math.floor(widthSegments) || 1;
    heightSegments = Math.floor(heightSegments) || 1;
    depthSegments = Math.floor(depthSegments) || 1;
    smoothness = Math.max(3, Math.floor(smoothness) || 3);

    let halfWidth = width * .5 - radius;
    let halfHeight = height * .5 - radius;
    let halfDepth = depth * .5 - radius;

    var geometry = new THREE.Geometry();

    // corners - 4 eighths of a sphere
    var corner1 = new THREE.SphereGeometry(radius, smoothness, smoothness, 0, Math.PI * .5, 0, Math.PI * .5);
    corner1.translate(-halfWidth, halfHeight, halfDepth);
    var corner2 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * .5, Math.PI * .5, 0, Math.PI * .5);
    corner2.translate(halfWidth, halfHeight, halfDepth);
    var corner3 = new THREE.SphereGeometry(radius, smoothness, smoothness, 0, Math.PI * .5, Math.PI * .5, Math.PI * .5);
    corner3.translate(-halfWidth, -halfHeight, halfDepth);
    var corner4 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * .5, Math.PI * .5, Math.PI * .5, Math.PI * .5);
    corner4.translate(halfWidth, -halfHeight, halfDepth);

    geometry.merge(corner1);
    geometry.merge(corner2);
    geometry.merge(corner3);
    geometry.merge(corner4);

    // edges - 2 fourths for each dimension
    // width
    var edge = new THREE.CylinderGeometry(radius, radius, width - radius * 2, smoothness, widthSegments, true, 0, Math.PI * .5);
    edge.rotateZ(Math.PI * .5);
    edge.translate(0, halfHeight, halfDepth);
    var edge2 = new THREE.CylinderGeometry(radius, radius, width - radius * 2, smoothness, widthSegments, true, Math.PI * 1.5, Math.PI * .5);
    edge2.rotateZ(Math.PI * .5);
    edge2.translate(0, -halfHeight, halfDepth);

    // height
    var edge3 = new THREE.CylinderGeometry(radius, radius, height - radius * 2, smoothness, heightSegments, true, 0, Math.PI * .5);
    edge3.translate(halfWidth, 0, halfDepth);
    var edge4 = new THREE.CylinderGeometry(radius, radius, height - radius * 2, smoothness, heightSegments, true, Math.PI * 1.5, Math.PI * .5);
    edge4.translate(-halfWidth, 0, halfDepth);

    // depth
    var edge5 = new THREE.CylinderGeometry(radius, radius, depth - radius * 2, smoothness, depthSegments, true, 0, Math.PI * .5);
    edge5.rotateX(-Math.PI * .5);
    edge5.translate(halfWidth, halfHeight, 0);
    var edge6 = new THREE.CylinderGeometry(radius, radius, depth - radius * 2, smoothness, depthSegments, true, Math.PI * .5, Math.PI * .5);
    edge6.rotateX(-Math.PI * .5);
    edge6.translate(halfWidth, -halfHeight, 0);

    edge.merge(edge2);
    edge.merge(edge3);
    edge.merge(edge4);
    edge.merge(edge5);
    edge.merge(edge6);

    // sides
    // front
    var side = new THREE.PlaneGeometry(width - radius * 2, height - radius * 2, widthSegments, heightSegments);
    side.translate(0, 0, depth * .5);

    // right
    var side2 = new THREE.PlaneGeometry(depth - radius * 2, height - radius * 2, depthSegments, heightSegments);
    side2.rotateY(Math.PI * .5);
    side2.translate(width * .5, 0, 0);

    side.merge(side2);

    geometry.merge(edge);
    geometry.merge(side);

    // duplicate and flip
    var secondHalf = geometry.clone();
    secondHalf.rotateY(Math.PI);
    geometry.merge(secondHalf);

    // top
    var top = new THREE.PlaneGeometry(width - radius * 2, depth - radius * 2, widthSegments, depthSegments);
    top.rotateX(-Math.PI * .5);
    top.translate(0, height * .5, 0);

    // bottom
    var bottom = new THREE.PlaneGeometry(width - radius * 2, depth - radius * 2, widthSegments, depthSegments);
    bottom.rotateX(Math.PI * .5);
    bottom.translate(0, -height * .5, 0);

    geometry.merge(top);
    geometry.merge(bottom);

    geometry.mergeVertices();

    return geometry;
  }

}

module.exports = RoundEdgedBox;

},{}],3:[function(require,module,exports){
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

},{"./pieces.js":4}],4:[function(require,module,exports){
var RoundEdgedBox = require('./RoundEdgedBox');

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

var corner_pos = [
  [ 1, 1, 1], // fq1 (front quadrant 1)
  [ 1,-1, 1], // fq2
  [-1,-1, 1], // fq3
  [-1, 1, 1], // fq4

  [ 1, 1,-1], // bq1 (back quadrant 1)
  [ 1,-1,-1], // bq2
  [-1,-1,-1], // bq3
  [-1, 1,-1]  // bq4
]

function cube_gen(pos_array) {
  let tmp_array = [];
  pos_array.forEach((piece) => {
    let size = 0.98;
    // var geometry = new THREE.BoxGeometry( 0.95, 0.95, 0.95 );
    var geometry = new RoundEdgedBox(size, size, size, 0.075, 1, 1, 1, 5);
    var material = new THREE.MeshLambertMaterial( { color: 0x1a1a1a, wireframe: false } );
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
var corners = cube_gen(corner_pos);

module.exports = {
  centers: centers,
  edges: edges,
  corners: corners,
  all: centers.concat(edges).concat(corners)
}

},{"./RoundEdgedBox":2}]},{},[1]);
