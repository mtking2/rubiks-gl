var centers = [
  [0,0,1],
  [0,0,-1],
  [-1,0,0],
  [1,0,0],
  [0,1,0],
  [0,-1,0]
]

var edges = [
  [0,1,1],
  [1,0,1],
  [0,-1,1],
  [-1,0,1],
]

module.exports = {
  centers: centers,
  edges: edges,
  all: centers.concat(edges)
}
