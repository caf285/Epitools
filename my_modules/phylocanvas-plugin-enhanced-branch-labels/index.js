import { Branch, utils } from 'phylocanvas';

const { getPixelRatio } = utils.canvas;
const { Angles } = utils.constants;

const DEFAULTS = {
  active: true,
};

function getLeafStyle() {
  let leafStyle2 = this.leafStyle,
    strokeStyle = leafStyle2.strokeStyle,
    fillStyle = leafStyle2.fillStyle;
  let zoom = this.tree.zoom;

  // uses a caching object to reduce garbage
  let leafStyle = {}
  leafStyle.strokeStyle = this.getColour(strokeStyle);
  leafStyle.fillStyle = fillStyle || this.colour || "black";
  leafStyle.lineWidth = leafStyle2.lineWidth || this.tree.lineWidth
  leafStyle.lineWidth /= zoom

  return leafStyle;
}

function drawPreLabel() {
  if (this.selected) {
    let ctx = this.canvas
    ctx.save()
    ctx.font = this.getFontString()
    ctx.fillStyle = "black"
    ctx.strokeStyle = this.tree.selectedColour

    let labelRadius = this.getTextSize() * 0.65
    let scaledRadius = Math.sqrt(Math.pow(this.getRadius() * Math.sqrt(2), 2) / Math.PI)
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

    let x = this.getRadius() + scaledRadius + labelRadius
    if (this.tree.alignLabels) {
      x += Math.abs(this.tree.labelAlign.getLabelOffset(this));
    } else if (this.isHighlighted) {
      x += -scaledRadius + this.getHighlightRadius()
    }


    if (this.angle > Angles.QUARTER && this.angle < Angles.HALF + Angles.QUARTER) {
      ctx.rotate(Angles.HALF);
      x = -x - labelWidth
    }
    let fx = x + labelWidth
    //x += labelRadius
    //fx = Math.max(x, fx - labelRadius)

    // stroke && fill
    ctx.beginPath()
    ctx.arc(x, 0, labelRadius, 1/2 * Math.PI, 3/2 *Math.PI)
    ctx.arc(fx, 0, labelRadius, 3/2 * Math.PI, 1/2 * Math.PI)
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
  ctx.font = this.getFontString();
  ctx.strokeStyle = this.labelStyle.strokeStyle || "black"

  let labelRadius = this.getTextSize() * 0.65
  let scaledRadius = Math.sqrt(Math.pow(this.getRadius() * Math.sqrt(2), 2) / Math.PI)
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

  let x = this.getRadius() + scaledRadius + labelRadius
  if (this.tree.alignLabels) {
    x += Math.abs(this.tree.labelAlign.getLabelOffset(this));
  } else if (this.isHighlighted) {
    x += -scaledRadius + this.getHighlightRadius()
  }


  if (this.angle > Angles.QUARTER && this.angle < Angles.HALF + Angles.QUARTER) {
    ctx.rotate(Angles.HALF);
    x = -x - labelWidth
  }

  // stroke && fill
  if (this.labelStyle.textShadow) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
    ctx.fillText(label, x - 1, labelRadius / 0.65 / 2 - 1);
    ctx.fillText(label, x - 1, labelRadius / 0.65 / 2);
    ctx.fillText(label, x, labelRadius / 0.65 / 2);
  }
  ctx.fillStyle = this.labelStyle.fillStyle || "black"
  ctx.fillText(label, x, labelRadius / 0.65 / 2 - 1);

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
  decorate(Branch, 'getLeafStyle', function (delegate, args) {
    if (this.tree.enhancedBranchLabels.active) {
      return getLeafStyle.apply(this);
    } else {
      return delegate.apply(this, args);
    }
  });
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
