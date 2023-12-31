import { Tree, utils } from 'phylocanvas';

const { getPixelRatio } = utils.canvas;

const DEFAULTS = {
  active: true,
};

function drawRoot() {

  const cxt = this.canvas;
  const pixelRatio = getPixelRatio(cxt);

  cxt.save();

  cxt.strokeStyle = this.branchColour;
  cxt.lineWidth = this.lineWidth;

  let x = (this.offsetx + this.root.centerx * this.zoom / pixelRatio) * pixelRatio
  let y = (this.offsety + this.root.centery * this.zoom / pixelRatio) * pixelRatio

  cxt.beginPath();
  cxt.moveTo(x, y);
  if (this.treeType == "rectangular" || this.treeType == "diagonal") {
    cxt.lineTo(x - 100 * this.zoom, y);
  } else if (this.treeType == "hierarchical") {
    cxt.lineTo(x, y - 100 * this.zoom);
  }
  cxt.stroke();
  cxt.closePath();

  cxt.restore();
}

export default function plugin(decorate) {
  decorate(this, 'createTree', (delegate, args) => {
    const tree = delegate(...args);
    const [ , config = {} ] = args;
    tree.rootLine = Object.assign({}, DEFAULTS, config.rootLine || {});
    return tree;
  });
  decorate(Tree, 'draw', function (delegate, args) {
    delegate.apply(this, args);
    if (this.rootLine.active) {
      drawRoot.apply(this);
    }
  });
}
