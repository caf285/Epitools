import { Tree, Branch, utils } from 'phylocanvas';

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

function addMetadata() {
  for (let leaf of this.leaves) {
    leaf.metadata = []
    leaf.getMetadata = () => {return leaf.metadata}
    leaf.clearMetadata = () => {leaf.metadata = []}
    leaf.appendMetadata = (e) => {leaf.metadata.push(e)}
  }
}

function appendClicked(x, y) {
  if (this.dragging || this.hasCollapsedAncestor()) {
    return null;
  }

  if (this.tree.showLabels && this.leaf) {
    const tree = this.tree
    const ctx = this.canvas;
    const canvas = ctx.canvas;
    const pixelRatio = getPixelRatio(ctx);
 
    let path = new Path2D()
    ctx.save()
    ctx.font = `${tree.textSize * 4}px ${tree.font}`;
    let lineLength = ctx.measureText(this.label).width * tree.zoom / tree.zoomFactor
    let lineWidth = ctx.measureText("M").width * tree.zoom / tree.zoomFactor

    // get X and Y values
    let startX = (tree.offsetx + (this.minx + this.maxx) * tree.zoom / pixelRatio / 2) * pixelRatio
    let startY = (tree.offsety + (this.miny + this.maxy) * tree.zoom / pixelRatio / 2) * pixelRatio
    let endX = startX + (-tree.baseNodeSize * tree.zoom + this.getLabelStartX() * tree.zoom + lineLength) * Math.cos(this.angle)
    let endY = startY + (-tree.baseNodeSize * tree.zoom + this.getLabelStartX() * tree.zoom + lineLength) * Math.sin(this.angle)
    if (tree.alignLabels) {
      endX += (tree.labelAlign.getLabelOffset(this) * tree.zoom) * Math.cos(this.angle)
      endY += (tree.labelAlign.getLabelOffset(this) * tree.zoom) * Math.sin(this.angle)
    }

    // stroke line for mouseover detection
    ctx.strokeStyle = "rgba(0, 0, 0, 0)"
    ctx.lineWidth = lineWidth
    path.moveTo(startX, startY)
    path.lineTo(endX, endY)
    path.closePath()
    ctx.stroke(path)

    if (ctx.isPointInStroke(path, event.offsetX * pixelRatio, event.offsetY * pixelRatio)) {
      ctx.restore()
      return this;
    }
    ctx.restore()
  }

  if (x < this.maxx && x > this.minx && y < this.maxy && y > this.miny) {
    return this;
  }

  for (var i = this.children.length - 1; i >= 0; i--) {
    var child = this.children[i].clicked(x, y);
    if (child) {
      return child;
    }    
  }      
}

function drag(event) {
  const ctx = this.canvas;
  const canvas = ctx.canvas;
  const pixelRatio = getPixelRatio(ctx);
  const { treeStats, textSize } = this
  var ratio = getPixelRatio(this.canvas);

  if (!this.drawn) return false;

  if (this.pickedup) {
    var xmove = (event.clientX - this.startx) * ratio;
    var ymove = (event.clientY - this.starty) * ratio;
    if (Math.abs(xmove) + Math.abs(ymove) > 5) { 
      this.dragging = true;
      this.offsetx = this.origx + xmove;
      this.offsety = this.origy + ymove;
      this.draw();
    }    
  } else {
    // hover
    var e = event;
    var nd = this.getNodeAtMousePosition(e);

    if (nd && nd.interactive && (this.internalNodesSelectable || nd.leaf)) {
      this.root.cascadeFlag('hovered', false);
      nd.hovered = true;
      this.containerElement.style.cursor = 'pointer';
      this.draw()
      if (nd.leaf) {
        let windowText = [nd.id]
        for (let data of nd.getMetadata()) {
          windowText.push(data)
        }
        let x = e.offsetX * pixelRatio
        let y = e.offsetY * pixelRatio
        ctx.save()
        ctx.font = `${treeStats.fontSize * pixelRatio / 2}px ${treeStats.fontFamily}`;
        ctx.textBaseline = treeStats.textBaseLine
        ctx.textAlign = treeStats.textAlign

        let boxWidth = 0
        for (let text of windowText) {
          boxWidth = Math.max(boxWidth, ctx.measureText(text).width + treeStats.margin * 2)
        }
        let lineHeight = ctx.measureText("w").width + treeStats.margin / 2
        let boxHeight = lineHeight * windowText.length + treeStats.margin * 2

        // fill box
        if (x + boxWidth > canvas.width) {
          x -= boxWidth
        }
        if (y + boxHeight > canvas.height) {
          y -= boxHeight
        }
        ctx.fillStyle = "rgba(240, 240, 240, 0.9)"
        ctx.fillRect(x, y, boxWidth, boxHeight)

        // fill text
        ctx.fillStyle = "rgb(0, 0, 0)"
        for (let i = 0; i < windowText.length; i++) {
          ctx.fillText(windowText[i], x + treeStats.margin, y + treeStats.margin + i * lineHeight)
        }
        ctx.restore()
      }    
    } else {
      this.root.cascadeFlag('hovered', false);
      if (this.shiftKeyDrag && e.shiftKey) {
        setCursorDrag(this.containerElement);
      } else {
        this.containerElement.style.cursor = 'auto';
      }
      this.draw()
    }    
    //this.draw();
  }
}

export default function plugin(decorate) {
  decorate(this, 'createTree', (delegate, args) => {
    const tree = delegate(...args);
    const [ , config = {} ] = args;
    tree.treeStats = Object.assign({}, DEFAULTS, config.treeStats || {});
    return tree;
  });
  decorate(Branch, 'clicked', function (delegate, args) {
    //delegate.apply(this, args);
    return appendClicked.apply(this, args);
  })
  decorate(Tree, 'drag', function (delegate, args) {
    drag.apply(this, args)
  })
  decorate(Tree, 'load', function (delegate, args) {
    delegate.apply(this, args);
    addMetadata.apply(this, args)
    let ctx = this.canvas
    if (this.treeStats.debug) {
      this.addListener('mousemove', (e) => {
        let path = new Path2D()
        path.moveTo(0, 0)
        path.lineTo(e.offsetX * getPixelRatio(ctx), e.offsetY * getPixelRatio(ctx))
        path.closePath()
        ctx.stroke(path)
      })
    }
    //console.log(this)
  });
}
