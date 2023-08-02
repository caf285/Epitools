import { Tree, Branch, utils } from 'phylocanvas';

const { getPixelRatio } = utils.canvas;

const DEFAULTS = {
  active: true,
};

function drawEnhancedBranchLabels() {
  //const { enhancedBranchLabels, zoom, branchScalar } = this;
  //const { position } = scalebar;
  //const cxt = this.canvas;
  //const canvas = cxt.canvas;
  //const pixelRatio = getPixelRatio(cxt);
  this.canvas.save();
  var labelStyle = this.internalLabelStyle || this.tree.internalLabelStyle;
  this.canvas.fillStyle = labelStyle.colour;
  this.canvas.font = labelStyle.format + ' ' + labelStyle.textSize + 'pt ' + labelStyle.font;
  this.canvas.textBaseline = 'middle';
  this.canvas.textAlign = 'center';
  var em = this.canvas.measureText('M').width * 2 / 3; 

  var x = this.tree.type.branchScalingAxis === 'y' ? this.centerx : (this.startx + this.centerx) / 2; 
  var y = this.tree.type.branchScalingAxis === 'x' ? this.centery : (this.starty + this.centery) / 2; 

  if (this.tree.showBranchLengthLabels && this.tree.branchLengthLabelPredicate(this)) {
    this.canvas.fillText(this.branchLength.toFixed(2), x, y + em); 
  }    

  if (this.tree.showInternalNodeLabels && !this.leaf && this.label) {
    this.canvas.fillText(this.label, x, y - em); 
  }    

  this.canvas.restore();
}

export default function plugin(decorate) {
  decorate(this, 'createTree', (delegate, args) => {
    const tree = delegate(...args);
    console.log(this, tree)
    const [ , config = {} ] = args;
    tree.enhancedBranchLabels = Object.assign({}, DEFAULTS, config.enhancedBranchLabels || {});
    return tree;
  });
  decorate(Branch, 'drawLabel', function (delegate, args) {
    delegate.apply(this, args);
    if (this.tree.enhancedBranchLabels.active) {
      //drawEnhancedBranchLabels.apply(this);
    }
  });
  decorate(Branch, 'drawLeaf', function (delegate, args) {
    delegate.apply(this, args);
    if (this.tree.enhancedBranchLabels.active) {
      //drawEnhancedBranchLabels.apply(this);
    }
  });
}
