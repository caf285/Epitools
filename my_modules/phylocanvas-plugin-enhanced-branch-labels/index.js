import { Branch, utils } from 'phylocanvas';

const { getPixelRatio } = utils.canvas;
const { Angles } = utils.constants;

const DEFAULTS = {
  active: true,
};

function drawPreLabel() {
  if (this.selected) {
    let ctx = this.canvas
    ctx.save()
    ctx.fillStyle = "black"
    ctx.font = this.getFontString()
    let radius = this.getTextSize() * 0.75
    let label = this.getLabel();
    this.labelWidth = ctx.measureText(label).width;
    let labelWidth = this.labelWidth * 1

    // finding the maximum label length && tx
    if (this.tree.maxLabelLength[this.tree.treeType] === undefined) {
      this.tree.maxLabelLength[this.tree.treeType] = 0;
    }
    if (this.labelWidth > this.tree.maxLabelLength[this.tree.treeType]) {
      this.tree.maxLabelLength[this.tree.treeType] = this.labelWidth;
    }


    let x = (this.tree.baseNodeSize * 2) - 2 + radius / 2
    if (this.tree.alignLabels) {
      x += Math.abs(this.tree.labelAlign.getLabelOffset(this));
    } else if (this.isHighlighted) {
      x += this.getHighlightSize() / 2
    }
    if (this.angle > Angles.QUARTER && this.angle < Angles.HALF + Angles.QUARTER) {
      this.canvas.rotate(Angles.HALF);
      x = -x - labelWidth
    }
    let fx = x + labelWidth
    x += radius / 2
    fx = Math.max(x, fx - radius / 2)

    // stroke && fill
    ctx.strokeStyle = this.tree.selectedColour
    ctx.beginPath()
    ctx.arc(x, 0, radius, 1/2 * Math.PI, 3/2 *Math.PI)
    ctx.arc(fx, 0, radius, 3/2 * Math.PI, 1/2 * Math.PI)
    ctx.closePath()
    ctx.stroke()

    // Rotate canvas back to original position
    if (this.angle > Angles.QUARTER && this.angle < Angles.HALF + Angles.QUARTER) {
      ctx.rotate(Angles.HALF);
    }
    ctx.restore()
  }
}

function drawLabel() {
  if (this.colour) {
    console.log(this)
  }
  let ctx = this.canvas
  ctx.save()
  ctx.fillStyle = this.labelStyle.colour || "black"
  ctx.font = this.getFontString();
  let radius = this.getTextSize()
  let label = this.getLabel();
  this.labelWidth = ctx.measureText(label).width;
  let labelWidth = this.labelWidth * 1

  // finding the maximum label length && tx
  if (this.tree.maxLabelLength[this.tree.treeType] === undefined) {
    this.tree.maxLabelLength[this.tree.treeType] = 0;
  }
  if (this.labelWidth > this.tree.maxLabelLength[this.tree.treeType]) {
    this.tree.maxLabelLength[this.tree.treeType] = this.labelWidth;
  }

  let x = (this.tree.baseNodeSize * 2) - 2 + radius / 2
  if (this.tree.alignLabels) {
    x += Math.abs(this.tree.labelAlign.getLabelOffset(this));
  } else if (this.isHighlighted) {
    x += this.getHighlightSize() / 2
  }
  if (this.angle > Angles.QUARTER && this.angle < Angles.HALF + Angles.QUARTER) {
    ctx.rotate(Angles.HALF);
    x = -x - labelWidth
  }
  if (this.angle > Angles.QUARTER && this.angle < Angles.HALF + Angles.QUARTER) {
    x += radius / 2 * 0.25
  } else {
    x -= radius / 2 * 0.25
  }

  // stroke && fill
  ctx.fillText(label, x, radius / 2);

  // Rotate canvas back to original position
  if (this.angle > Angles.QUARTER && this.angle < Angles.HALF + Angles.QUARTER) {
    ctx.rotate(Angles.HALF);
  }
  ctx.restore()
}

function getColour(specifiedColour) {
          if (this.selected) {
          return this.tree.selectedColour;
        }    
        return specifiedColour || this.colour || this.tree.branchColour;
}

export default function plugin(decorate) {
  decorate(this, 'createTree', (delegate, args) => {
    const tree = delegate(...args);
    console.log(this, tree)
    const [ , config = {} ] = args;
    tree.enhancedBranchLabels = Object.assign({}, DEFAULTS, config.enhancedBranchLabels || {});
    return tree;
  });
  // completes after drawLabelConnector and nodeRender
  decorate(Branch, 'drawLabel', function (delegate, args) {
    if (this.tree.enhancedBranchLabels.active) {
      drawPreLabel.apply(this);
      drawLabel.apply(this);
    } else {
      delegate.apply(this, args);
    }
  });
  decorate(Branch, 'getColour', function (delegate, args) {
    if (this.tree.enhancedBranchLabels.active) {
      return getColour.apply(this, args)
    } else {
      return delegate.apply(this, args);
    }
  })
}
