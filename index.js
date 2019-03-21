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

  if (/^[fFbBuUdDlLrRxXyYzZ]$/.test(e.key)) {
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
      case 'x': key = 'X'; break;
      case 'X': key = "X'"; break;
      case 'y': key = 'Y'; break;
      case 'Y': key = "Y'"; break;
      case 'z': key = 'Z'; break;
      case 'Z': key = "Z'"; break;
      default: key = e.key; break;
    }
    temp_queue.push(key);
    queue.push(key);
  }
});

var scramble = false;
var scrambleQueue = []
function doScramble() {
  if (scrambleQueue.length > 0) {
    moves.doMove(scrambleQueue.shift());
  } else {
    moves.setIncrement(8);
    scramble = false;
  }
}

$('#scramble').click(function() {
  let m = ['F','B','U','D','R','L']
  m = m.concat(m.map(e => e+"'"));
  moves.setIncrement(1);

  let scrambleMoves = []
  for (let i=0; i<50; i++) {
    let move = m[Math.floor(Math.random() * m.length)];
    scrambleMoves.push( move );
  }
  scrambleMoves = simplifyMoves(scrambleMoves);
  scrambleQueue = scrambleMoves;
  queue = queue.concat(scrambleMoves);
  scramble = true;
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
  } else if (!moves.isLocked() && scramble) {
    doScramble();
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
