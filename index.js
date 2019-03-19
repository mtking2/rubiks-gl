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

var renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'default' });
init(renderer);
var renderHD = false;

$('#toggle-quality').click(function() {
  console.log('click');
  $('canvas').remove();
  renderHD = !renderHD;

  if (renderHD) {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    init(renderer);
    $(this).html('Quality: High');
  } else {
    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'default' });
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

function reverseSolve() {
  var id = requestAnimationFrame( reverseSolve );
  if (queue.length > 0) {
    if (!moves.isLocked()) {
      let move = queue.pop();
      let reverseMove = move.includes("'") ? move.replace("'",'') : `${move}'`;
      moves.doMove(reverseMove);
      $('.move-list').text(queue.join(' '));
    }
  } else {
    cancelAnimationFrame( id );
  }
  controls.update();
  renderer.render( scene, camera );
}

$('#reverse-solve').click(function() {
  reverseSolve();
});

function animate() {
	requestAnimationFrame( animate );

  if (!moves.isLocked() && temp_queue.length > 0) {
    let move = temp_queue.shift();
    console.log(move);
    moves.doMove(move);
    $('.move-list').text(queue.join(' '));
  }

  controls.update();
  renderer.render( scene, camera );
};

animate();
