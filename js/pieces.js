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
