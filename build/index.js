(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var pieces = require('./js/pieces');
var moves = require('./js/moves');

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x888888 )

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

var camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 1, 100 );
camera.position.x = 6;
camera.position.y = 3;
camera.position.z = 6;

var controls = new THREE.OrbitControls( camera );
controls.enablePan = false;
controls.minDistance = 6;
controls.maxDistance = 15;
controls.update();

// var axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

function init(renderer) {
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  };
};

var c = document.createElement('canvas'); c.id = 'scene';
document.body.appendChild( c );

var renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'default', canvas: c });
init(renderer);

var renderHD = false;

$('#toggle-quality').click(function() {
  console.log('click');
  $('#scene').remove();
  c = document.createElement('canvas'); c.id = 'scene';
  document.body.appendChild( c );
  renderHD = !renderHD;

  if (renderHD) {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', canvas: c });
    init(renderer);
    $(this).html('Quality: High');
  } else {
    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'default', canvas: c });
    init(renderer);
    $(this).html('Quality: Low');
  }
});


var light = new THREE.PointLight( 0xffffff, 1, 50 );
var light2 = new THREE.PointLight( 0xffffff, 1, 50 );
light.position.set( 10, 10, 10 );
light2.position.set( -10, 10, -10 );
scene.add( light );
scene.add( light2 );
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

var geometry = new THREE.SphereGeometry( 1.125, 10, 10 );
var material = new THREE.MeshBasicMaterial( {color: 0x1a1a1a, wireframe: false} );
var sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

var green = new THREE.Color(0, 1, 0);
var black = new THREE.Color(0x1a1a1a);

// add all the pieces to the scene
pieces.all.forEach((p) => { scene.add(p); });

var queue = [], temp_queue = [];
document.addEventListener('keydown', function(e) {

  if (/^[fFbBuUdDlLrR]$/.test(e.key)) {
    let key = '';
    switch (e.key) {
      case 'f': key = 'F'; break;
      case 'F': key = "F'"; break;
      case 'b': key = 'B'; break;
      case 'B': key = "B'"; break;
      case 'u': key = 'U'; break;
      case 'U': key = "U'"; break;
      case 'd': key = 'D'; break;
      case 'D': key = "D'"; break;
      case 'l': key = 'L'; break;
      case 'L': key = "L'"; break;
      case 'r': key = 'R'; break;
      case 'R': key = "R'"; break;
    }
    temp_queue.push(key);
    queue.push(key);
  }
});

var reverseSolve = false;
function doReverseSolve() {
  if (queue.length > 0) {
    let move = queue.pop();
    let reverseMove = move.includes("'") ? move.replace("'",'') : `${move}'`;
    moves.doMove(reverseMove);
  } else {
    reverseSolve = false;
    queue = [];
    temp_queue = [];
  }
}

$('#reverse-solve').click(function() {
  reverseSolve = true;
});

function simplifyMoves(q) {
  let qStr = q.join('');
  qStr = qStr.replace(/(.)\1'|(.)'\2(?!')|(.'?)\3{3}/g, '');

  qStr = qStr.replace(/(.')\1{2}/g, "$1".replace("'",''));
  qStr = qStr.replace(/(.)\1{2}/g, "$1'");

  qStr = qStr.replace(/.'?/g, '$& ').trim();
  return qStr.split(' ')
}

function animate() {
  stats.begin();

  if (!moves.isLocked() && reverseSolve) {
    doReverseSolve();
  } else if (!moves.isLocked() && temp_queue.length > 0) {
    let move = temp_queue.shift();
    moves.doMove(move);
    queue = simplifyMoves(queue);
    console.clear();
    console.log(queue.join(' '));
  }

  $('.move-list').text(queue.join(' '));

  controls.update();
  stats.end();

  renderer.render( scene, camera );
  requestAnimationFrame( animate );
};

animate();

},{"./js/moves":3,"./js/pieces":4}],2:[function(require,module,exports){
// https://discourse.threejs.org/t/round-edged-box-2/1448
// https://jsfiddle.net/prisoner849/p614jc75/
class RubiksCubePiece extends THREE.Group {

  constructor(width, height, depth, radius, widthSegments, heightSegments, depthSegments, smoothness) {
    super();

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

    this.geometry = new THREE.Geometry();
    var material = new THREE.MeshLambertMaterial( { color: 0x1a1a1a, wireframe: false } );
    var sticker_material = new THREE.MeshLambertMaterial( { color: 0x1a1a1a } );

    // corners - 4 eighths of a sphere
    var corner1 = new THREE.SphereGeometry(radius, smoothness, smoothness, 0, Math.PI * .5, 0, Math.PI * .5);
    corner1.translate(-halfWidth, halfHeight, halfDepth);
    var corner2 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * .5, Math.PI * .5, 0, Math.PI * .5);
    corner2.translate(halfWidth, halfHeight, halfDepth);
    var corner3 = new THREE.SphereGeometry(radius, smoothness, smoothness, 0, Math.PI * .5, Math.PI * .5, Math.PI * .5);
    corner3.translate(-halfWidth, -halfHeight, halfDepth);
    var corner4 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * .5, Math.PI * .5, Math.PI * .5, Math.PI * .5);
    corner4.translate(halfWidth, -halfHeight, halfDepth);

    this.geometry.merge(corner1);
    this.geometry.merge(corner2);
    this.geometry.merge(corner3);
    this.geometry.merge(corner4);

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

    this.geometry.merge(edge);
    this.geometry.merge(side);

    // duplicate and flip
    var secondHalf = this.geometry.clone();
    secondHalf.rotateY(Math.PI);
    this.geometry.merge(secondHalf);

    // top
    var top = new THREE.PlaneGeometry(width - radius * 2, depth - radius * 2, widthSegments, depthSegments);
    top.rotateX(-Math.PI * .5);
    top.translate(0, height * .5, 0);

    // bottom
    var bottom = new THREE.PlaneGeometry(width - radius * 2, depth - radius * 2, widthSegments, depthSegments);
    bottom.rotateX(Math.PI * .5);
    bottom.translate(0, -height * .5, 0);

    this.geometry.merge(top);
    this.geometry.merge(bottom);

    this.geometry.mergeVertices();
    var cube = new THREE.Mesh( this.geometry, material );

    let clearance = 1e-2;
    let scale = 0.95;
    this.top_sticker = new THREE.Mesh( top.clone().translate(0, clearance, 0).scale(scale,1,scale), sticker_material.clone() );
    this.bottom_sticker = new THREE.Mesh( top.clone().translate(0, clearance, 0).scale(scale,1,scale), sticker_material.clone() ).rotateX(Math.PI);

    this.front_sticker = new THREE.Mesh( top.clone().translate(0, clearance, 0).scale(scale,1,scale), sticker_material.clone() ).rotateX(Math.PI/2);
    this.back_sticker = new THREE.Mesh( top.clone().translate(0, clearance, 0).scale(scale,1,scale), sticker_material.clone() ).rotateX(-Math.PI/2);

    this.right_sticker = new THREE.Mesh( top.clone().translate(0, clearance, 0).scale(scale,1,scale), sticker_material.clone() ).rotateZ(-Math.PI/2);
    this.left_sticker = new THREE.Mesh( top.clone().translate(0, clearance, 0).scale(scale,1,scale), sticker_material.clone() ).rotateZ(Math.PI/2);

    this.add(cube)
    this.add(this.top_sticker);
    this.add(this.bottom_sticker);
    this.add(this.front_sticker);
    this.add(this.back_sticker);
    this.add(this.right_sticker);
    this.add(this.left_sticker);

    return this;
  }

}

module.exports = RubiksCubePiece;

},{}],3:[function(require,module,exports){
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

    case 'L': case "L'": case 'R': case "R'":
      rotVector = new THREE.Vector3( -1, 0, 0 );
      axis = 'x';
      transAxis1 = 'z';
      transAxis2 = 'y';

      thres = (['R',"R'"].includes(move)) ? -1 : 1;
      theta = rads;

      theta *= (["L'",'R'].includes(move)) ? -1 : 1
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

},{"./pieces":4}],4:[function(require,module,exports){
var RubiksCubePiece = require('./RubiksCubePiece');

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

var green = new THREE.Color(0x00ee33);
var blue = new THREE.Color(0x0033ee);
var red = new THREE.Color(1, 0, 0);
var orange = new THREE.Color(0xff7a00);
var white = new THREE.Color(1, 1, 1);
var yellow = new THREE.Color(1, 1, 0);
var black = new THREE.Color(0x1a1a1a);

function cube_gen(pos_array) {

  let tmp_array = [];
  pos_array.forEach((piece) => {
    let size = 0.965;
    var cube = new RubiksCubePiece(size, size, size, 0.075, 1, 1, 1, 1);

    cube.position.x = piece[0];
    cube.position.y = piece[1];
    cube.position.z = piece[2];

    if (cube.position.z === 1) // front
      cube.front_sticker.material.color = white;
    if (cube.position.z === -1) // back
      cube.back_sticker.material.color = yellow;
    if (cube.position.y === 1) // up
      cube.top_sticker.material.color = orange;
    if (cube.position.y === -1) // down
      cube.bottom_sticker.material.color = red;
    if (cube.position.x === 1) // right
      cube.right_sticker.material.color = blue;
    if (cube.position.x === -1) // left
      cube.left_sticker.material.color = green;

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

},{"./RubiksCubePiece":2}]},{},[1]);
