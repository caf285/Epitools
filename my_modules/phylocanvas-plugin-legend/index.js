import { Tree, utils } from 'phylocanvas';

const { getPixelRatio } = utils.canvas;

const DEFAULTS = {
  active: true,
  fontSize: 10,
  colorScheme: [],
  colorContext: [],
  label: "",
};

function drawLegend() {
  const { legend, zoom, branchScalar } = this;
  const ctx = this.canvas;
  const canvas = ctx.canvas;
  const pixelRatio = getPixelRatio(ctx);
  const fontSize = legend.fontSize * pixelRatio
  const margin = pixelRatio * 10
  const strokeSize = pixelRatio * 1

  // calculate lineHeight
  ctx.save();
  ctx.font = `${fontSize}px Sans-serif`;
  let lineHeight = ctx.measureText('W').width
  // calculate height
  let height = (lineHeight + margin / 2) * (Math.min(legend.colorContext.length + 1, 17)) + margin / 2
  // calculate width
  let width = legend.colorContext.reduce((acc, cur) => {return Math.max(acc, ctx.measureText(cur).width + lineHeight + margin / 2)}, 10)
  ctx.font = `bold ${fontSize + 2}px Sans-serif`;
  width = Math.max(ctx.measureText(legend.label).width, width) + margin
  // draw legend box
  ctx.lineWidth = strokeSize
  let x = canvas.width - width - margin;
  let y = canvas.height - height - margin;
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, width, height)
  ctx.fillStyle = "black";
  ctx.strokeRect(x, y, width, height)
  // draw label
  ctx.fillStyle = "black"
  ctx.textBaseline = "top"
  ctx.fillText(legend.label, x + margin / 2, y + margin / 2);
  ctx.font = `${fontSize}px Sans-serif`;
  // draw colorContext
  for (let entry of Object.entries(legend.colorContext)) {
    if (entry[0] === "15") {
      ctx.font = `bold ${fontSize + 2}px Sans-serif`;
      ctx.fillStyle = "black";
      ctx.fillText(". . .", x + lineHeight + margin, y + margin / 2 + (lineHeight + margin / 2) * (parseInt(entry[0]) + 1))
      break
    }
    ctx.fillStyle = `#${legend.colorScheme[parseInt(entry[0]) % legend.colorScheme.length].rgb}`
    ctx.fillRect(x + margin / 2, y + margin / 2 + (lineHeight + margin / 2) * (parseInt(entry[0]) + 1), lineHeight, lineHeight)
    ctx.strokeRect(x + margin / 2, y + margin / 2 + (lineHeight + margin / 2) * (parseInt(entry[0]) + 1), lineHeight, lineHeight)
    ctx.fillStyle = "black";
    ctx.fillText(entry[1], x + lineHeight + margin, y + margin / 2 + (lineHeight + margin / 2) * (parseInt(entry[0]) + 1))
  }
  ctx.restore();
}

export default function plugin(decorate) {
  decorate(this, 'createTree', (delegate, args) => {
    const tree = delegate(...args);
    const [ , config = {} ] = args;
    tree.legend = Object.assign({}, DEFAULTS, config.legend || {});
    return tree;
  });
  decorate(Tree, 'draw', function (delegate, args) {
    delegate.apply(this, args);
    if (this.legend.active && this.legend.colorContext && this.legend.colorContext.length && this.legend.colorScheme && this.legend.colorScheme.length) {
      drawLegend.apply(this);
    }
  });
}
