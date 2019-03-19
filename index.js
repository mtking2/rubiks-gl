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

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

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
