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
