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
    var cube = new RubiksCubePiece(size, size, size, 0.075, 1, 1, 1, 5);

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
