import { Branch, utils } from 'phylocanvas';

const { getPixelRatio } = utils.canvas;
const { Angles } = utils.constants;
console.log(utils, Angles)

const DEFAULTS = {
  active: true,
};

function drawPreLeaf() {
  let ctx = this.canvas
  ctx.save()
  ctx.fillStyle = "black"
  ctx.font = this.getFontString()
  ctx.lineWidth = ctx.measureText("M").width + 10

  // finding the maximum label length && tx
  if (this.tree.maxLabelLength[this.tree.treeType] === undefined) {
    this.tree.maxLabelLength[this.tree.treeType] = 0;
  }
  if (this.labelWidth > this.tree.maxLabelLength[this.tree.treeType]) {
    this.tree.maxLabelLength[this.tree.treeType] = this.labelWidth;
  }
  let tx = this.getLabelStartX();
  if (this.tree.alignLabels) {
    tx += Math.abs(this.tree.labelAlign.getLabelOffset(this));
  }
  let sx = this.tree.baseNodeSize
  if (this.angle > Angles.QUARTER && this.angle < Angles.HALF + Angles.QUARTER) {
    this.canvas.rotate(Angles.HALF);
    tx = -tx - this.labelWidth * 1;
    sx = -sx - ctx.lineWidth / 2
  } else {
    tx += this.labelWidth * 1;
    sx += ctx.lineWidth / 2
  }

  // stroke && fill
  ctx.beginPath()
  ctx.moveTo(sx, 0)
  ctx.lineTo(tx, 0)
  ctx.closePath()
  ctx.stroke()

  // Rotate canvas back to original position
  if (this.angle > Angles.QUARTER && this.angle < Angles.HALF + Angles.QUARTER) {
    this.canvas.rotate(Angles.HALF);
  }
  ctx.restore()
}

function drawLabel() {
  this.canvas.save()
  //this.canvas.fillStyle = this.getTextColour();
  this.canvas.fillStyle = "white"
  var fSize = this.getTextSize();
  var label = this.getLabel();

  this.canvas.font = this.getFontString();
  this.labelWidth = this.canvas.measureText(label).width;

  // finding the maximum label length && tx
  if (this.tree.maxLabelLength[this.tree.treeType] === undefined) {
    this.tree.maxLabelLength[this.tree.treeType] = 0;
  }
  if (this.labelWidth > this.tree.maxLabelLength[this.tree.treeType]) {
    this.tree.maxLabelLength[this.tree.treeType] = this.labelWidth;
  }
  var tx = this.getLabelStartX();
  if (this.tree.alignLabels) {
    tx += Math.abs(this.tree.labelAlign.getLabelOffset(this));
  }
  if (this.angle > Angles.QUARTER && this.angle < Angles.HALF + Angles.QUARTER) {
    this.canvas.rotate(Angles.HALF);
    tx = -tx - this.labelWidth * 1;
  }

  console.log([this.id, tx, tx + this.labelWidth * 1])
  this.canvas.textBaseLine = "bottom"

  // stroke && fill
  //this.canvas.strokeText(label, tx, fSize / 2)
  this.canvas.fillText(label, tx, (fSize - 1) / 2);


  this.canvas.strokeStyle = "red"

  this.canvas.beginPath()
  this.canvas.arc(0, 0, 7, 0, 2 * Math.PI)
  this.canvas.closePath()
  this.canvas.stroke()

  this.canvas.strokeStyle = "white"

  this.canvas.beginPath()
  this.canvas.arc(tx, 0, 7, 0, 2 * Math.PI)
  this.canvas.closePath()
  this.canvas.stroke()
  
  this.canvas.strokeStyle = "white"

  this.canvas.beginPath()
  this.canvas.arc(tx + this.labelWidth * 1, 0, 7, 0, 2 * Math.PI)
  this.canvas.closePath()
  this.canvas.stroke()



  // Rotate canvas back to original position
  if (this.angle > Angles.QUARTER && this.angle < Angles.HALF + Angles.QUARTER) {
    this.canvas.rotate(Angles.HALF);
  }
  this.canvas.restore()
}

export default function plugin(decorate) {
  decorate(this, 'createTree', (delegate, args) => {
    const tree = delegate(...args);
    console.log(this, tree)
    const [ , config = {} ] = args;
    tree.enhancedBranchLabels = Object.assign({}, DEFAULTS, config.enhancedBranchLabels || {});
    return tree;
  });
  decorate(Branch, 'drawLeaf', function (delegate, args) {
    if (this.tree.enhancedBranchLabels.active) {
      drawPreLeaf.apply(this);
    }
    delegate.apply(this, args);
  });
  decorate(Branch, 'drawLabel', function (delegate, args) {
    //delegate.apply(this, args);
    if (this.tree.enhancedBranchLabels.active) {
      drawLabel.apply(this);
    }
  });
}
