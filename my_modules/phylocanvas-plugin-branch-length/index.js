import { Tree, Branch, utils } from 'phylocanvas';

const { getPixelRatio } = utils.canvas;

const DEFAULTS = {
  active: true,
};

function drawBranchLength() {

  const { branchLength } = this;
  const ctx = this.canvas;
  const canvas = ctx.canvas;
  const pixelRatio = getPixelRatio(ctx);
  const textSize = this.textSize * this.zoom
  ctx.save();

  ctx.font = `${textSize}px ${this.font}`;
  ctx.fillStyle = this.branchColour;
  ctx.textBaseline = "bottom";
  ctx.textAlign = "left";

  for (let branch in this.branches) {
    if (this.branches[branch].branchLength == 0) {
      continue
    }
    branch = this.branches[branch]
    let centerX = (this.offsetx + (branch.startx + branch.centerx) / 2 * this.zoom / pixelRatio) * pixelRatio
    let centerY = (this.offsety + (branch.starty + branch.centery) / 2 * this.zoom / pixelRatio) * pixelRatio
    let startX = (this.offsetx + branch.startx * this.zoom / pixelRatio) * pixelRatio
    let startY = (this.offsety + branch.starty * this.zoom / pixelRatio) * pixelRatio
    let x = (this.offsetx + branch.centerx * this.zoom / pixelRatio) * pixelRatio
    let y = (this.offsety + branch.centery * this.zoom / pixelRatio) * pixelRatio

    // draw node arcs
    ctx.beginPath()
    ctx.arc(startX, startY, Math.min(this.lineWidth + 1, 8), 0, 2 * Math.PI)
    ctx.fill()

    // draw branch lengths
    if (this.treeType == "rectangular") {
      ctx.textAlign = "center"
      ctx.fillText(branch.branchLength, centerX, y)
    } else if (this.treeType == "hierarchical") {
      ctx.textBaseline = "middle"
      ctx.fillText(branch.branchLength, x, centerY)
    } else {
      if (centerY > y) {
        ctx.textAlign = "right"
        centerX = centerX - pixelRatio * this.zoom
      } else {
        ctx.textAlign = "left"
        centerX = centerX + pixelRatio * this.zoom
      }
      if (centerX > x) {
        ctx.textBaseline = "top"
        centerY = centerY + pixelRatio * this.zoom
      } else {
        ctx.textBaseline = "bottom"
        centerY = centerY - pixelRatio * this.zoom
      }
      ctx.fillText(branch.branchLength, centerX, centerY)
    }
  }

  ctx.restore();
}

export default function plugin(decorate) {
  decorate(this, 'createTree', (delegate, args) => {
    const tree = delegate(...args);
    const [ , config = {} ] = args;
    tree.branchLength = Object.assign({}, DEFAULTS, config.branchLength || {});
    return tree;
  });
  decorate(Tree, 'draw', function (delegate, args) {
      if (this && this.maxBranchLength > 0) {
        delegate.apply(this, args);
        if (this.branchLength.active) {
          drawBranchLength.apply(this);
        }
      }
  });
}
