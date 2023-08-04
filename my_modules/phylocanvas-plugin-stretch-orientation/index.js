import { Tree, Branch, treeTypes, utils } from 'phylocanvas';

const DEFAULTS = {
  active: true,
  orientation: "both"
};

function scroll(event) {
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
      if (this.branches[branch]["parent"] == null) {  // hot fix for graphical glitch
        this.branches[branch]["starty"] *= Math.pow(this.branchScalingStep, sign)
      }
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

function setFontSize(ystep) {
  this.canvas.font = this.textSize + 'pt ' + this.font
}

function getLabelSize() {
  this.canvas.font = this.getFontString();
  return this.canvas.measureText(this.getLabel()).width;
}

export default function plugin(decorate) {
  decorate(this, 'createTree', (delegate, args) => {
    const tree = delegate(...args);
    const [ , config = {} ] = args;
    tree.stretchOrientation = Object.assign({}, DEFAULTS, config.stretchOrientation || {});
    return tree;
  });
  decorate(Tree, 'scroll', function (delegate, args) {
    if (this.stretchOrientation.active) {
      scroll.apply(this, args);
    } else {
      delegate.apply(this, args);
    }
  });
  decorate(Tree, 'setFontSize', function (delegate, args) {
    if (this.stretchOrientation.active) {
      setFontSize.apply(this, args);
    } else {
      delegate.apply(this, args);
    }
  });
  decorate(Branch, 'getLabelSize', function (delegate) {
    if (this.tree.stretchOrientation.active) {
      return getLabelSize.apply(this);
    } else {
      return delegate.apply(this);
    }
  })
}
