
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
