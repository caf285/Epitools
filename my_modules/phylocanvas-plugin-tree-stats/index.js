import { Tree, utils } from 'phylocanvas';

const { getPixelRatio } = utils.canvas;

const DEFAULTS = {
  active: true,
  debug: false,
  margin: 20,
  fontFamily: "Sans-serif",
  fontSize: 30,
  textBaseLine: "top",
  textAlign: "left",
};

function addListeners() {
  const tree = this
  const ctx = this.canvas;
  const canvas = ctx.canvas;
  const pixelRatio = getPixelRatio(ctx);
  const { treeStats, textSize } = this
  if (this.treeStats.active) {
      //cleanup old event listeners
      for (let eventListener of this.eventListeners.mousemove.filter(eventListener => eventListener.listener.name == "treeStatsListener")) {
        this.removeListener('mousemove', eventListener.listener, canvas)
      }
      console.log(this)
      for (let leaf of this.leaves) {
        this.addListener('mousemove', treeStatsListener, canvas)
        function treeStatsListener(e) {
          let path = new Path2D()
          ctx.save()
          ctx.font = `${tree.textSize * 4}px ${tree.font}`;
          let lineLength = ctx.measureText(leaf.label).width * tree.zoom / tree.zoomFactor
          let lineWidth = ctx.measureText("M").width * tree.zoom / tree.zoomFactor

          // get X and Y values
          let centerX = (tree.offsetx + (leaf.minx + leaf.maxx) * tree.zoom / pixelRatio / 2) * pixelRatio
          let centerY = (tree.offsety + (leaf.miny + leaf.maxy) * tree.zoom / pixelRatio / 2) * pixelRatio
          let startX = centerX - (tree.baseNodeSize * tree.zoom * Math.cos(leaf.angle))
          let startY = centerY - (tree.baseNodeSize * tree.zoom * Math.sin(leaf.angle))
          let endX = centerX + ((-tree.baseNodeSize * tree.zoom + leaf.getLabelStartX() * tree.zoom + lineLength) * Math.cos(leaf.angle))
          let endY = centerY + ((-tree.baseNodeSize * tree.zoom + leaf.getLabelStartX() * tree.zoom + lineLength) * Math.sin(leaf.angle))

          // stroke line for mouseover detection
          if (tree.treeStats.debug) {
            ctx.strokeStyle = "rgba(0, 0, 255, 1)"
          } else {
            ctx.strokeStyle = "rgba(0, 0, 255, 0)"
          }
          ctx.lineWidth = lineWidth
          path.moveTo(centerX, centerY)
          path.lineTo(endX, endY)
          path.closePath()
          ctx.stroke(path)

          // draw treeStats window
          if (ctx.isPointInStroke(path, e.offsetX * pixelRatio, e.offsetY * pixelRatio)) {
            leaf.highlighted = true
            let x = e.offsetX * pixelRatio
            let y = e.offsetY * pixelRatio
            ctx.save()
            ctx.font = `${treeStats.fontSize * pixelRatio / 2}px ${treeStats.fontFamily}`;
            ctx.textBaseline = treeStats.textBaseLine
            ctx.textAlign = treeStats.textAlign
            let boxWidth = ctx.measureText(leaf.id).width + treeStats.margin * 2
            let boxHeight = ctx.measureText("W").width + treeStats.margin * 2
            // TODO: for loop for writing multiple lines and getting the proper box size
            // fill box
            ctx.fillStyle = "rgba(240, 240, 240, 0.9)"
            ctx.fillRect(x, y, boxWidth, boxHeight)

            // fill text
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillText(leaf.id, x + treeStats.margin, y + treeStats.margin)
            ctx.restore()
          } else {
            leaf.highlighted = false
          }
          ctx.restore()
        }
      }
  }
}

export default function plugin(decorate) {
  decorate(this, 'createTree', (delegate, args) => {
    const tree = delegate(...args);
    const [ , config = {} ] = args;
    tree.treeStats = Object.assign({}, DEFAULTS, config.treeStats || {});
    return tree;
  });
  decorate(Tree, 'load', function (delegate, args) {
    delegate.apply(this, args);
    addListeners.apply(this)
    let ctx = this.canvas
    this.addListener('mousemove', (e) => {
      if (this.treeStats.debug) {
      let path = new Path2D()
      path.moveTo(0, 0)
      path.lineTo(e.offsetX * getPixelRatio(ctx), e.offsetY * getPixelRatio(ctx))
      path.closePath()
      ctx.stroke(path)
      }
    })

  });
}
