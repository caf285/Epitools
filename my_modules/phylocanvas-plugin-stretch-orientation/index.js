import { Tree, treeTypes, utils } from 'phylocanvas';

const DEFAULTS = {
  active: true,
  orientation: "both"
};

function properZoom() {
  const { stretchOrientation } = this;

  if (this.disableZoom || 'wheelDelta' in event && event.wheelDelta === 0) {
    return;
  }    

  event.preventDefault();

  this._point.x = event.offsetX;
  this._point.y = event.offsetY;
  var sign = event.detail < 0 || event.wheelDelta > 0 ? 1 : -1;
  if (this.branchScaling && !event.altKey && (stretchOrientation.orientation == "horizontal" || event.ctrlKey)) {
    this.currentBranchScale *= Math.pow(this.branchScalingStep, sign);
    this.setBranchScale(this.currentBranchScale, this._point);
  } else if (this.branchScaling && (stretchOrientation.orientation == "vertical" || event.altKey)) {

    // exit if not scalable
    var treeType = treeTypes[this.treeType]
    if (!treeType.branchScalingAxis) { 
      return;
    }
    let branchScalingAxis = "y"
    if (treeType.branchScalingAxis == "y") {
      branchScalingAxis = "x"
    }
    // adjust all branch heights and log old and new total heights
    let oldHeight = 0
    let newHeight = 0
    for (let branch in this.branches) {
      oldHeight = Math.max(this.branches[branch]["center" + branchScalingAxis], oldHeight)
      this.branches[branch]["center" + branchScalingAxis] *= Math.pow(this.branchScalingStep, sign)
      newHeight = Math.max(this.branches[branch]["center" + branchScalingAxis], newHeight)
    }
    this.farthestNodeFromRootY *= Math.pow(this.branchScalingStep, sign)

    // calculate new offset from mouse position and redraw
    let offset = this["offset" + branchScalingAxis] * 2
    let pos = this._point[branchScalingAxis] * 2
    let proportion = (pos - offset) / oldHeight
    let newOffset = (newHeight - oldHeight) * proportion
    this["offset" + branchScalingAxis] -= newOffset / 2
    this.draw()
  } else {
    this.smoothZoom(sign, this._point);
  }
}

export default function plugin(decorate) {
  decorate(this, 'createTree', (delegate, args) => {
    const tree = delegate(...args);
    const [ , config = {} ] = args;
    tree.stretchOrientation = Object.assign({}, DEFAULTS, config.stretchOrientation || {});
    return tree;
  });
  decorate(Tree, 'scroll', function (delegate, args) {
    //delegate.apply(this, args);
    if (this.stretchOrientation.active) {
      properZoom.apply(this);
    }
  });
}
