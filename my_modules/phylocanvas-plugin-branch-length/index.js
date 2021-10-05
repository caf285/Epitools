import { Tree, utils } from 'phylocanvas';

const { getPixelRatio } = utils.canvas;

const DEFAULTS = {
  active: true,
};

function drawBranchLength() {

  const { branchLength } = this;
  const cxt = this.canvas;
  const canvas = cxt.canvas;
  const pixelRatio = getPixelRatio(cxt);
  const pi = 3.141592653589793
  const textSize = this.textSize * this.zoom / 2

  cxt.save();

  cxt.font = `${textSize * pixelRatio}px ${this.font}`;
  cxt.fillStyle = this.branchColour;
  cxt.textBaseline = "bottom";
  cxt.textAlign = "center";

  for (let branch in this.branches) {
    if (this.branches[branch].branchLength == 0) {
      continue
    }
    branch = this.branches[branch]
    let x = (this.offsetx + (branch.startx + (branch.centerx - branch.startx) / 2) * this.zoom / 2) * pixelRatio
    let y = (this.offsety + (branch.starty + (branch.centery - branch.starty) / 2) * this.zoom / 2) * pixelRatio
    if (this.treeType == "rectangular") {
      y = (this.offsety + branch.centery * this.zoom / 2) * pixelRatio
    } else if (pi * 1 / 4 < branch.angle && branch.angle < pi * 3 / 4 || pi + pi * 1 / 4 < branch.angle && branch.angle < pi + pi * 3 / 4) {
      x = (this.offsetx + textSize + branch.centerx * this.zoom / 2) * pixelRatio
      y += textSize * pixelRatio
    }
    cxt.fillText(branch.branchLength, x, y)
  }

  cxt.restore();
}

export default function plugin(decorate) {
  decorate(this, 'createTree', (delegate, args) => {
    const tree = delegate(...args);
    const [ , config = {} ] = args;
    tree.branchLength = Object.assign({}, DEFAULTS, config.branchLength || {});
    return tree;
  });
  decorate(Tree, 'draw', function (delegate, args) {
    delegate.apply(this, args);
    if (this.branchLength.active) {
      drawBranchLength.apply(this);
    }
  });
}
