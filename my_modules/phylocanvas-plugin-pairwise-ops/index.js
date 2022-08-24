import { Tree, utils } from 'phylocanvas';

const { getPixelRatio } = utils.canvas;

const DEFAULTS = {
  active: true,
  pairwiseMatrix: {},
  clusterActive: true,
  clusterDraw: true,
  clusterMatrix: [],
  clusterMaxDistance: 20,
  clusterDistance: 3,
  clusterSamples: 3,
};

// OLDER cluster matrix code
/*
function walkMatrix(tree, start, node, walked, distance, max) {
  walked.push(node)

  if (distance >= max) {
    return
  }
  if (node !== start && node.leaf === true) {
    tree.pairwiseOps.pairwiseMatrix[start.id].push([node.id, distance])
  }
  for (let child of node.children) {
    if (! walked.includes(child)) {
      let newDistance = distance + child.branchLength
      newDistance = parseFloat(newDistance.toFixed(10))
      walkMatrix(tree, start, child, walked, newDistance, max)
    }
  }
  if (node.parent && ! walked.includes(node.parent)) {
    let newDistance = distance + node.branchLength
    newDistance = parseFloat(newDistance.toFixed(10))
    walkMatrix(tree, start, node.parent, walked, newDistance, max)
  }
}

function buildPairwiseMatrix() {
  for (let leaf of this.leaves) {
    this.pairwiseOps.pairwiseMatrix[leaf.id] = []
    walkMatrix(this, leaf, leaf, [], 0, this.pairwiseOps.clusterMaxDistance)
  }
  //console.log(this.pairwiseOps.pairwiseMatrix)
}
*/

/*
function buildClusterMatrix() {
  this.pairwiseOps.clusterMatrix = []
  for (let leaf in this.pairwiseOps.pairwiseMatrix) {
    let cluster = [leaf]
    for (let node of this.pairwiseOps.pairwiseMatrix[leaf]) {
      if (node[1] <= this.pairwiseOps.clusterDistance) {
        cluster.push(node[0])
      }
    }
    if (cluster.length >= this.pairwiseOps.clusterSamples) {
      cluster.sort()
      cluster = JSON.stringify(cluster)
      if (! this.pairwiseOps.clusterMatrix.includes(cluster)) {
        this.pairwiseOps.clusterMatrix.push(cluster)
      }
    }
  }
}
*/

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
  //console.log(this.pairwiseOps.pairwiseMatrix.leaves)
}

function buildClusterMatrix() {
  this.pairwiseOps.clusterMatrix = []
  for (let leaf in this.pairwiseOps.pairwiseMatrix.leaves) {
    let cluster = [leaf]
    for (let pair in this.pairwiseOps.pairwiseMatrix.leaves[leaf]) {
      if (this.pairwiseOps.pairwiseMatrix.leaves[leaf][pair] <= this.pairwiseOps.clusterDistance) {
        cluster.push(pair)
      }
    }
    if (cluster.length >= this.pairwiseOps.clusterSamples) {
      cluster.sort()
      cluster = JSON.stringify(cluster)
      if (! this.pairwiseOps.clusterMatrix.includes(cluster)) {
        this.pairwiseOps.clusterMatrix.push(cluster)
      }
    }
  }
}

function colorNode() {
  for (let leaf of this.leaves) {
    leaf.setDisplay({
      colour: this.branchColour,
    })
    leaf.label = leaf.id
  }
  for (let cluster of this.pairwiseOps.clusterMatrix) {
    cluster = JSON.parse(cluster)
    for (let id of cluster) {
      
      for (let leaf of this.findLeaves(id)) {
        leaf.label += "+"
        leaf.setDisplay({
          colour: 'red',
        })
      }
    }
  }
  this.draw()
}

function drawClusterInfo() {
  let label = "Cluster Size: " + String(this.pairwiseOps.clusterSamples) + "; Cluster Distance: " + String(this.pairwiseOps.clusterDistance)
  let ctx = this.canvas
  let pixelRatio = getPixelRatio(ctx)
  ctx.save()
  ctx.font = `${30 * pixelRatio / 2}px Arial`;
  ctx.fillText(label, ctx.canvas.width - ctx.measureText(label).width - 10, ctx.canvas.height - 10)
  ctx.restore()
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
      if (this.pairwiseOps.clusterActive) {
        this.pairwiseOps.clusterDraw = true;
      }
    }   
  });
  decorate(Tree, 'draw', function (delegate, args) {
    delegate.apply(this, args);
    if (this.pairwiseOps.clusterActive) {
      if (this.pairwiseOps.clusterDraw) {
        this.pairwiseOps.clusterDraw = false;
        buildClusterMatrix.apply(this);
        colorNode.apply(this);
      }
      drawClusterInfo.apply(this);
    }
  });
}
