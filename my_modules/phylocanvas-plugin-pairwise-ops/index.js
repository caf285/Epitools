import { Tree, utils } from 'phylocanvas';

const { getPixelRatio } = utils.canvas;

const DEFAULTS = {
  active: true,
  pairwiseMatrix: {},
  clusterMatrix: [],
  clusterDistance: 2,
  clusterSize: 2,
  buildCluster: () => {}
};

function walkMatrix(tree, node, path, distance) {
  let newDistance = Array.from(distance)
  let newPath = Array.from(path)
  newDistance.push(node.branchLength)
  if (node.leaf === false) {
    newPath.push(node.id)
    tree.pairwiseOps.pairwiseMatrix.internalNodes[node.id] = []
    for (let child of node.children) {
      walkMatrix(tree, child, newPath, newDistance)
    }
  } else {
    tree.pairwiseOps.pairwiseMatrix.leaves[node.id] = {}
    newDistance.push(newDistance.shift())
    for (let i in newPath) {
      let nodeLength = newDistance.slice(i).reduce((previousValue, currentValue) => previousValue + currentValue)
      for (let leaf of tree.pairwiseOps.pairwiseMatrix.internalNodes[newPath[i]]) {
        if (! Object.keys(tree.pairwiseOps.pairwiseMatrix.leaves[node.id]).includes(leaf[0])) {
          tree.pairwiseOps.pairwiseMatrix.leaves[node.id][leaf[0]] = leaf[1] + nodeLength
        } else if (tree.pairwiseOps.pairwiseMatrix.leaves[node.id][leaf[0]] > leaf[1] + nodeLength) {
          tree.pairwiseOps.pairwiseMatrix.leaves[node.id][leaf[0]] = leaf[1] + nodeLength
        }
      }
      tree.pairwiseOps.pairwiseMatrix.internalNodes[newPath[i]].push([node.id, nodeLength])
    }
  }  
}

function buildPairwiseMatrix() {
  this.pairwiseOps.pairwiseMatrix = {"internalNodes": {}, "leaves": {}}
  walkMatrix(this, this.root, [], [])
  for (let node in this.pairwiseOps.pairwiseMatrix.leaves) {
    for (let leaf in this.pairwiseOps.pairwiseMatrix.leaves[node]) {
      this.pairwiseOps.pairwiseMatrix.leaves[leaf][node] = this.pairwiseOps.pairwiseMatrix.leaves[node][leaf]
    }
  }
}

function buildClusterMatrix() {
  // build initial clusterMatrix
  this.pairwiseOps.clusterMatrix = []
  for (let leaf in this.pairwiseOps.pairwiseMatrix.leaves) {
    this.pairwiseOps.clusterMatrix.push([leaf])
    for (let pair in this.pairwiseOps.pairwiseMatrix.leaves) {
      if (this.pairwiseOps.pairwiseMatrix.leaves[leaf][pair] <= this.pairwiseOps.clusterDistance) {
        this.pairwiseOps.clusterMatrix[this.pairwiseOps.clusterMatrix.length - 1].push(pair)
      }
    }
  }

  // combine arrays with like objects
  for (let i in this.pairwiseOps.clusterMatrix) {
    for (let j = 0; j < i; j++) {
      if (this.pairwiseOps.clusterMatrix[i].filter(x => this.pairwiseOps.clusterMatrix[j].includes(x)).length) {
        this.pairwiseOps.clusterMatrix[i] = this.pairwiseOps.clusterMatrix[i].concat(this.pairwiseOps.clusterMatrix[j].filter(x => !this.pairwiseOps.clusterMatrix[i].includes(x)))
        this.pairwiseOps.clusterMatrix[j] = this.pairwiseOps.clusterMatrix[i]
      }
    }
  }

  // reduce initial cluster matrix
  this.pairwiseOps.clusterMatrix = new Set(this.pairwiseOps.clusterMatrix.filter(x => x.length >= this.pairwiseOps.clusterSize).map(x => JSON.stringify(x.sort())))
  this.pairwiseOps.clusterMatrix = Array.from(this.pairwiseOps.clusterMatrix).map(x => JSON.parse(x)).sort()
  //console.log(this.pairwiseOps.clusterDistance, this.pairwiseOps.clusterSize)
  return this.pairwiseOps.clusterMatrix
}

export default function plugin(decorate) {
  decorate(this, 'createTree', (delegate, args) => {
    const tree = delegate(...args);
    const [ , config = {} ] = args;
    tree.pairwiseOps = Object.assign({}, DEFAULTS, config.pairwiseOps || {});
    return tree;
  });
  decorate(Tree, 'load', function (delegate, args) {
    delegate.apply(this, args);
    if (this.pairwiseOps.active) {
      buildPairwiseMatrix.apply(this);
      this.pairwiseOps.buildCluster = () => buildClusterMatrix.apply(this)
    }   
  });
}
