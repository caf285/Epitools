import { Tree, utils } from 'phylocanvas';

const { getPixelRatio } = utils.canvas;

const DEFAULTS = {
  active: true,
  width: 100,
  height: 20,
  fillStyle: 'black',
  strokeStyle: 'black',
  lineWidth: 1,
  fontFamily: 'Sans-serif',
  fontSize: 16,
  textBaseline: 'bottom',
  textAlign: 'center',
  digits: 2,
  position: {
    bottom: 10,
    left: 10,
  },
};

const INVALID_HORIZONTAL_POSITION = 'Invalid horizontal position specified' +
  'Supported values are `left`, `centre`, or `right`';
const INVALID_VERTICAL_POSITION = 'Invalid vertical position specified' +
  'Supported values are `top`, `middle`, or `bottom`';

const LOG10 = Math.log(10);

function drawBranchLength() {

  const { branchLength, zoom, branchScalar } = this;
  const { position } = branchLength;
  const cxt = this.canvas;
  const canvas = cxt.canvas;
  const pixelRatio = getPixelRatio(cxt);
  const width = pixelRatio * branchLength.width;
  const height = pixelRatio * branchLength.height;
  const lineWidth = pixelRatio * branchLength.lineWidth;
  const fontSize = pixelRatio * branchLength.fontSize;
  const pi = 3.141592653589793

  cxt.save();

  //console.log(this)
  //console.log(this.branches["A"])
  //console.log(this.offsetx, this.offsety)

  cxt.font = `${fontSize}px ${branchLength.fontFamily}`;
  cxt.fillStyle = branchLength.fillStyle;
  cxt.strokeStyle = branchLength.strokeStyle;
  cxt.lineWidth = lineWidth;
  cxt.textBaseline = branchLength.textBaseline;
  cxt.textAlign = branchLength.textAlign;

  for (let branch in this.branches) {
    branch = this.branches[branch]
    if (branch.selected == true) {
      console.log(branch)
      console.log(pi * 1 / 4, branch.angle, pi * 3 / 4)
    }
    //let x = (this.offsetx + branch.centerx * this.zoom / 2) * pixelRatio
    let x = (this.offsetx + (branch.startx + (branch.centerx - branch.startx) / 2) * this.zoom / 2) * pixelRatio
    //let y = (this.offsety + branch.centery * this.zoom / 2) * pixelRatio
    let y = (this.offsety + (branch.starty + (branch.centery - branch.starty) / 2) * this.zoom / 2) * pixelRatio
    if (this.treeType == "rectangular") {
      y = (this.offsety + branch.centery * this.zoom / 2) * pixelRatio
    } else if (pi * 1 / 4 < branch.angle && branch.angle < pi * 3 / 4 || pi + pi * 1 / 4 < branch.angle && branch.angle < pi + pi * 3 / 4) {
      x = (this.offsetx + branchLength.fontSize + branch.centerx * this.zoom / 2) * pixelRatio
      y += branchLength.fontSize
    }
    cxt.fillText(branch.branchLength, x, y)
  }

  /*cxt.clearRect(x, y, width, height);


  cxt.beginPath();
  cxt.moveTo(x, y);
  cxt.lineTo(x + width, y);
  cxt.stroke();
  cxt.moveTo(x, y);
  cxt.lineTo(x, y + height);
  cxt.stroke();
  cxt.moveTo(x + width, y);
  cxt.lineTo(x + width, y + height);
  cxt.stroke();
  cxt.closePath();

  const scale = width / branchScalar / zoom;
  const minDigitis = parseInt(Math.abs(Math.log(scale) / LOG10), 10);
  const label = scale.toFixed(minDigitis + branchLength.digits);
  cxt.fillText(label, x + width / 2, y + height);*/

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
