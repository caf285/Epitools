(this.webpackJsonpepitools=this.webpackJsonpepitools||[]).push([[0],{61:function(e,t,i){},62:function(e,t,i){},73:function(e,t,i){"use strict";i.r(t);var n=i(0),r=i.n(n),a=i(20),c=i.n(a),s=(i(61),i(62),i(63),i(84)),o=i(85),l=i(83),G=i.p+"static/media/tgen-coh.453f08b1.png",u=i(1);var h=function(){return Object(u.jsx)("div",{className:"Nav-header",children:Object(u.jsxs)(s.a,{sticky:"top",bg:"light",variant:"light",children:[Object(u.jsxs)(s.a.Brand,{href:"home",children:[Object(u.jsx)("img",{src:G,height:"60",className:"d-inline-block align-center mr-3",alt:"Epitools Logo"})," ","One Health Genomic Epi Tools"]}),Object(u.jsxs)(o.a,{className:"ml-auto",children:[Object(u.jsx)(o.a.Link,{href:"home",children:"Home"}),Object(u.jsx)(o.a.Link,{href:"gas",children:"GAS"}),Object(u.jsxs)(l.a,{title:"Component Demo",children:[Object(u.jsx)(l.a.Item,{href:"demo-phylocanvas",children:"Phylocanvas"}),Object(u.jsx)(l.a.Item,{href:"demo-leaflet",children:"Leaflet"}),Object(u.jsx)(l.a.Item,{href:"demo-plotly",children:"Plotly"})]})]})]})})},T=i(4),d=i(54),S=i(9),b=i(8),j=i.n(b),f=i(19),A=b.utils.canvas.getPixelRatio,p={active:!0,width:100,height:20,fillStyle:"black",strokeStyle:"black",lineWidth:1,fontFamily:"Sans-serif",fontSize:16,textBaseline:"bottom",textAlign:"center",digits:2,position:{bottom:10,left:10}},O=Math.log(10);function x(){var e=this.scalebar,t=this.zoom,i=this.branchScalar,n=e.position,r=this.canvas,a=r.canvas,c=A(r),s=c*e.width,o=c*e.height,l=c*e.lineWidth,G=c*e.fontSize;r.save();var u=0;"undefined"!==typeof n.left?u=e.lineWidth+n.left:"undefined"!==typeof n.centre?u=a.width/2-s/2+n.centre:"undefined"!==typeof n.right?u=a.width-s-e.lineWidth-n.right:this.loadError("Invalid horizontal position specifiedSupported values are `left`, `centre`, or `right`");var h=0;"undefined"!==typeof n.top?h=n.top:"undefined"!==typeof n.middle?h=a.height/2-o+n.middle:"undefined"!==typeof n.bottom?h=a.height-o-n.bottom:this.loadError("Invalid vertical position specifiedSupported values are `top`, `middle`, or `bottom`"),r.clearRect(u,h,s,o),r.font="".concat(G,"px ").concat(e.fontFamily),r.fillStyle=e.fillStyle,r.strokeStyle=e.strokeStyle,r.lineWidth=l*c/2,r.textBaseline=e.textBaseline,r.textAlign=e.textAlign,r.beginPath(),r.moveTo(u,h),r.lineTo(u+s,h),r.stroke(),r.moveTo(u,h),r.lineTo(u,h+o),r.stroke(),r.moveTo(u+s,h),r.lineTo(u+s,h+o),r.stroke(),r.closePath();var T=s/i/t,d=parseInt(Math.abs(Math.log(T)/O),10),S=T.toFixed(d+e.digits);r.fillText(S,u+s/2,h+o),r.restore()}var v=b.utils.canvas.getPixelRatio,m={active:!0};function g(){this.branchLength;var e=this.canvas,t=(e.canvas,v(e)),i=this.textSize*this.zoom;for(var n in e.save(),e.font="".concat(i,"px ").concat(this.font),e.fillStyle=this.branchColour,e.textBaseline="bottom",e.textAlign="left",this.branches)if(0!=this.branches[n].branchLength){n=this.branches[n];var r=(this.offsetx+(n.startx+n.centerx)/2*this.zoom/t)*t,a=(this.offsety+(n.starty+n.centery)/2*this.zoom/t)*t,c=(this.offsetx+n.centerx*this.zoom/t)*t,s=(this.offsety+n.centery*this.zoom/t)*t;"rectangular"==this.treeType?(e.textAlign="center",e.fillText(n.branchLength,r,s)):"hierarchical"==this.treeType?(e.textBaseline="middle",e.fillText(n.branchLength,c,a)):(a>s?(e.textAlign="right",r-=t*this.zoom):(e.textAlign="left",r+=t*this.zoom),r>c?(e.textBaseline="top",a+=t*this.zoom):(e.textBaseline="bottom",a-=t*this.zoom),e.fillText(n.branchLength,r,a))}e.restore()}var y=b.utils.canvas.getPixelRatio,w={active:!0};function C(){var e=this.canvas,t=y(e);e.save(),e.strokeStyle=this.branchColour,e.lineWidth=this.lineWidth;var i=(this.offsetx+this.root.centerx*this.zoom/t)*t,n=(this.offsety+this.root.centery*this.zoom/t)*t;e.beginPath(),e.moveTo(i,n),"rectangular"==this.treeType||"diagonal"==this.treeType?e.lineTo(i-100*this.zoom,n):"hierarchical"==this.treeType&&e.lineTo(i,n-100*this.zoom),e.stroke(),e.closePath(),e.restore()}var z=i(17),L=b.utils.canvas.getPixelRatio,k={active:!0,pairwiseMatrix:{},clusterActive:!0,clusterDraw:!0,clusterMatrix:[],clusterMaxDistance:20,clusterDistance:3,clusterSamples:3};function M(e,t,i,n){var r=Array.from(n),a=Array.from(i);if(r.push(t.branchLength),!1===t.leaf){a.push(t.id),e.pairwiseOps.pairwiseMatrix.internalNodes[t.id]=[];var c,s=Object(z.a)(t.children);try{for(s.s();!(c=s.n()).done;){M(e,c.value,a,r)}}catch(T){s.e(T)}finally{s.f()}}else for(var o in e.pairwiseOps.pairwiseMatrix.leaves[t.id]={},r.push(r.shift()),a){var l,G=r.slice(o).reduce((function(e,t){return e+t})),u=Object(z.a)(e.pairwiseOps.pairwiseMatrix.internalNodes[a[o]]);try{for(u.s();!(l=u.n()).done;){var h=l.value;Object.keys(e.pairwiseOps.pairwiseMatrix.leaves[t.id]).includes(h[0])?e.pairwiseOps.pairwiseMatrix.leaves[t.id][h[0]]>h[1]+G&&(e.pairwiseOps.pairwiseMatrix.leaves[t.id][h[0]]=h[1]+G):e.pairwiseOps.pairwiseMatrix.leaves[t.id][h[0]]=h[1]+G}}catch(T){u.e(T)}finally{u.f()}e.pairwiseOps.pairwiseMatrix.internalNodes[a[o]].push([t.id,G])}}function E(){for(var e in this.pairwiseOps.pairwiseMatrix={internalNodes:{},leaves:{}},M(this,this.root,[],[]),this.pairwiseOps.pairwiseMatrix.leaves)for(var t in this.pairwiseOps.pairwiseMatrix.leaves[e])this.pairwiseOps.pairwiseMatrix.leaves[t][e]=this.pairwiseOps.pairwiseMatrix.leaves[e][t];console.log(this.pairwiseOps.pairwiseMatrix.leaves)}function B(){for(var e in this.pairwiseOps.clusterMatrix=[],this.pairwiseOps.pairwiseMatrix.leaves){var t=[e];for(var i in this.pairwiseOps.pairwiseMatrix.leaves[e])this.pairwiseOps.pairwiseMatrix.leaves[e][i]<=this.pairwiseOps.clusterDistance&&t.push(i);t.length>=this.pairwiseOps.clusterSamples&&(t.sort(),t=JSON.stringify(t),this.pairwiseOps.clusterMatrix.includes(t)||this.pairwiseOps.clusterMatrix.push(t))}}function P(){var e,t=Object(z.a)(this.leaves);try{for(t.s();!(e=t.n()).done;){var i=e.value;i.setDisplay({colour:this.branchColour}),i.label=i.id}}catch(h){t.e(h)}finally{t.f()}var n,r=Object(z.a)(this.pairwiseOps.clusterMatrix);try{for(r.s();!(n=r.n()).done;){var a=n.value;a=JSON.parse(a);var c,s=Object(z.a)(a);try{for(s.s();!(c=s.n()).done;){var o,l=c.value,G=Object(z.a)(this.findLeaves(l));try{for(G.s();!(o=G.n()).done;){var u=o.value;u.label+="+",u.setDisplay({colour:"red"})}}catch(h){G.e(h)}finally{G.f()}}}catch(h){s.e(h)}finally{s.f()}}}catch(h){r.e(h)}finally{r.f()}this.draw()}function D(){var e="Cluster Size: "+String(this.pairwiseOps.clusterSamples)+"; Cluster Distance: "+String(this.pairwiseOps.clusterDistance),t=this.canvas,i=L(t);t.save(),t.font="".concat(30*i/2,"px Arial"),t.fillText(e,t.canvas.width-t.measureText(e).width-10,t.canvas.height-10),t.restore()}var Z=b.utils.canvas.getPixelRatio,N={active:!0,debug:!1,margin:20,fontFamily:"Sans-serif",fontSize:30,textBaseLine:"top",textAlign:"left"};function I(){var e=this,t=this,i=this.canvas,n=i.canvas,r=Z(i),a=this.treeStats;this.textSize;if(this.treeStats.active){var c,s=Object(z.a)(this.eventListeners.mousemove.filter((function(e){return"treeStatsListener"==e.listener.name})));try{for(s.s();!(c=s.n()).done;){var o=c.value;this.removeListener("mousemove",o.listener,n)}}catch(h){s.e(h)}finally{s.f()}console.log(this);var l,G=Object(z.a)(this.leaves);try{var u=function(){for(var c=l.value,s=[c.id],o=0;o<Math.max(Math.ceil(3*Math.random()),1);o++){var G=Math.random();G=G.toFixed(Math.ceil(Math.random()*String(G).length)),s.push(String(G))}e.addListener("mousemove",(function(e){var o=new Path2D;i.save(),i.font="".concat(4*t.textSize,"px ").concat(t.font);var l=i.measureText(c.label).width*t.zoom/t.zoomFactor,G=i.measureText("M").width*t.zoom/t.zoomFactor,u=(t.offsetx+(c.minx+c.maxx)*t.zoom/r/2)*r,T=(t.offsety+(c.miny+c.maxy)*t.zoom/r/2)*r,d=(t.baseNodeSize,t.zoom,Math.cos(c.angle),t.baseNodeSize,t.zoom,Math.sin(c.angle),u+(-t.baseNodeSize*t.zoom+c.getLabelStartX()*t.zoom+l)*Math.cos(c.angle)),S=T+(-t.baseNodeSize*t.zoom+c.getLabelStartX()*t.zoom+l)*Math.sin(c.angle);t.treeStats.debug?i.strokeStyle="rgba(0, 0, 255, 1)":i.strokeStyle="rgba(0, 0, 255, 0)";if(i.lineWidth=G,o.moveTo(u,T),o.lineTo(d,S),o.closePath(),i.stroke(o),i.isPointInStroke(o,e.offsetX*r,e.offsetY*r)){c.highlighted=!0;var b=e.offsetX*r,j=e.offsetY*r;i.save(),i.font="".concat(a.fontSize*r/2,"px ").concat(a.fontFamily),i.textBaseline=a.textBaseLine,i.textAlign=a.textAlign;var f,A=0,p=Object(z.a)(s);try{for(p.s();!(f=p.n()).done;){var O=f.value;A=Math.max(A,i.measureText(O).width+2*a.margin)}}catch(h){p.e(h)}finally{p.f()}var x=i.measureText("w").width+a.margin/2,v=x*s.length+2*a.margin;b+A>n.width&&(b-=A),j+v>n.height&&(j-=v),i.fillStyle="rgba(240, 240, 240, 0.9)",i.fillRect(b,j,A,v),i.fillStyle="rgb(0, 0, 0)";for(var m=0;m<s.length;m++)i.fillText(s[m],b+a.margin,j+a.margin+m*x);i.restore()}else c.highlighted=!1;i.restore()}),n)};for(G.s();!(l=G.n()).done;)u()}catch(h){G.e(h)}finally{G.f()}}}j.a.plugin((function(e){e(this,"createTree",(function(e,t){var i=e.apply(void 0,Object(f.a)(t)),n=Object(T.a)(t,2)[1],r=void 0===n?{}:n;return i.scalebar=Object.assign({},p,r.scalebar||{}),i})),e(b.Tree,"draw",(function(e,t){e.apply(this,t),this.scalebar.active&&x.apply(this)}))})),j.a.plugin((function(e){e(this,"createTree",(function(e,t){var i=e.apply(void 0,Object(f.a)(t)),n=Object(T.a)(t,2)[1],r=void 0===n?{}:n;return i.branchLength=Object.assign({},m,r.branchLength||{}),i})),e(b.Tree,"draw",(function(e,t){e.apply(this,t),this.branchLength.active&&g.apply(this)}))})),j.a.plugin((function(e){e(this,"createTree",(function(e,t){var i=e.apply(void 0,Object(f.a)(t)),n=Object(T.a)(t,2)[1],r=void 0===n?{}:n;return i.rootLine=Object.assign({},w,r.rootLine||{}),i})),e(b.Tree,"draw",(function(e,t){e.apply(this,t),this.rootLine.active&&C.apply(this)}))})),j.a.plugin((function(e){e(this,"createTree",(function(e,t){var i=e.apply(void 0,Object(f.a)(t)),n=Object(T.a)(t,2)[1],r=void 0===n?{}:n;return i.pairwiseOps=Object.assign({},k,r.pairwiseOps||{}),i})),e(b.Tree,"load",(function(e,t){e.apply(this,t),this.pairwiseOps.active&&(E.apply(this),this.pairwiseOps.clusterActive&&(this.pairwiseOps.clusterDraw=!0))})),e(b.Tree,"draw",(function(e,t){e.apply(this,t),this.pairwiseOps.clusterActive&&(this.pairwiseOps.clusterDraw&&(this.pairwiseOps.clusterDraw=!1,B.apply(this),P.apply(this)),D.apply(this))}))})),j.a.plugin((function(e){e(this,"createTree",(function(e,t){var i=e.apply(void 0,Object(f.a)(t)),n=Object(T.a)(t,2)[1],r=void 0===n?{}:n;return i.treeStats=Object.assign({},N,r.treeStats||{}),i})),e(b.Tree,"load",(function(e,t){var i=this;e.apply(this,t),I.apply(this);var n=this.canvas;this.addListener("mousemove",(function(e){if(i.treeStats.debug){var t=new Path2D;t.moveTo(0,0),t.lineTo(e.offsetX*Z(n),e.offsetY*Z(n)),t.closePath(),n.stroke(t)}}))}))}));var W=b.utils.canvas.getPixelRatio;var _=function(e){var t=Object(n.useRef)(),i=100,r=Object(n.useState)([100,i]),a=Object(T.a)(r,2),c=a[0],s=a[1],o=Object(n.useRef)(c[0]),l=Object(n.useRef)(c[1]),G=Object(n.useState)(1),h=Object(T.a)(G,2),d=h[0],S=h[1],b=Object(n.useRef)(d),f=Object(n.useState)(1),A=Object(T.a)(f,2),p=A[0],O=A[1],x=Object(n.useRef)(p),v=Object(n.useRef)(["radial","rectangular","circular","diagonal","hierarchical"]);return Object(n.useEffect)((function(){function e(){var e,n=Math.max(Math.max(document.documentElement.clientHeight||0,window.innerHeight||0)-2*document.getElementsByClassName("Nav-header")[0].clientHeight,100),r=Math.max(document.documentElement.clientWidth||i,window.innerWidth||i,i);o.current,l.current;e=[n,r],o.current=e[0],l.current=e[1],s(e),t.current.setTreeType(t.current.treeType),t.current.setNodeSize(x.current),t.current.setTextSize(b.current),t.current.treeType,t.current.treeType}function n(){window.dispatchEvent(new Event("resize")),t.current.setTreeType(t.current.treeType)}return window.addEventListener("resize",e),window.addEventListener("load",n),function(){window.removeEventListener("resize",e),window.removeEventListener("load",n)}}),[]),Object(n.useEffect)((function(){t.current=j.a.createTree("phylocanvas")}),[]),Object(n.useEffect)((function(){t.current.load(e.tree)}),[e.tree]),Object(n.useEffect)((function(){v.current.includes(e.type)?t.current.setTreeType(e.type):t.current.setTreeType("rectangular"),t.current.setNodeSize(x.current),t.current.setTextSize(b.current),t.current.lineWidth=e.lineWidth*W(t.current.canvas)/2}),[e.type]),Object(n.useEffect)((function(){var i;i=e.nodeSize*W(t.current.canvas)/2,x.current=i,O(i),t.current.setNodeSize(x.current)}),[e.nodeSize]),Object(n.useEffect)((function(){var i;i=e.textSize*W(t.current.canvas)/2,b.current=i,S(i),t.current.setTextSize(b.current)}),[e.textSize]),Object(n.useEffect)((function(){t.current.showLabels=e.labels,t.current.alignLabels=e.align,t.current.lineWidth=e.lineWidth*W(t.current.canvas)/2,t.current.draw()}),[e.labels,e.align,e.lineWidth]),Object(n.useEffect)((function(){t.current.pairwiseOps.clusterDistance=e.clusterDistance,t.current.pairwiseOps.clusterSamples=e.clusterSamples,console.log(t.current),t.current.pairwiseOps.clusterDraw=!0,t.current.draw()}),[e.clusterDistance,e.clusterSamples]),Object(u.jsx)("div",{id:"phylocanvas",style:{height:o.current+"px",width:"100%",minHeight:"100px",minWidth:"100px"}})};var R=function(){var e=Object(n.useState)("(A:1)B;"),t=Object(T.a)(e,2),i=t[0],r=t[1],a=Object(n.useState)("radial"),c=Object(T.a)(a,2),s=c[0],o=c[1],l=Object(n.useState)(!0),G=Object(T.a)(l,2),h=G[0],d=G[1],S=Object(n.useState)(!1),b=Object(T.a)(S,2),j=b[0],f=b[1],A=Object(n.useState)(10),p=Object(T.a)(A,2),O=p[0],x=p[1],v=Object(n.useState)(15),m=Object(T.a)(v,2),g=m[0],y=m[1],w=Object(n.useState)(2),C=Object(T.a)(w,2),z=C[0],L=C[1],k=Object(n.useState)(3),M=Object(T.a)(k,2),E=M[0],B=M[1],P=Object(n.useState)(3),D=Object(T.a)(P,2),Z=D[0],N=D[1];return Object(n.useEffect)((function(){r("(((((((((GAS-TG262730-095:6.5,TG78255:6.5):2,TG93342:4):0.5,((((TG77939:0,(GAS-TG93657:0,GAS_TG93657:0):1,GAS-TG262282-095:4):0.5,((GAS-TG265461-095:0,(AZ_GAS_TG93637:0,GAS-TG93661:0,GAS_TG93661:0):2):1,(TG92312:0,TG92296:0):1):1.5,TG92248:3,((TG77951:1.5,((GAS-TG114483-xx-CL-USA-2018-081-JB:0,GAS-TG133136-095:1,GAS-TG265457-095:1,GAS-AZ00097772-095:5):0.5,GAS-TG262724-095:2.5):2.5):1.5,TG78167:1.5):4):3,TG78091:6):0.5,(((GAS-TG264245-095:2,(GAS-TG263365-095:0,GAS-TG264943-095:0):4):2,TG78195:5):0.5,((GAS-AZ00096535-095:0.5,(GAS-TG262761-095:0,TG92324:0,GAS-AZ00104982-095:2,GAS-TG263373-095:2):0.5):0.5,((GAS-TG133036-095:0,(GAS-TG264144-095:0,GAS-AZ00099104-095:2):2):1.5,(GAS-AZ00098934-095:0,GAS-TG113124-xx-CL-USA-2018-081-JB:0,GAS-AZ00096587-095:1):1.5):0.5):1.5):3.5):1.5):8,(((((((TG93354:2,TG78207:5):0.5,GAS-AZ00097136-095:11.5):0.5,GAS-TG133056-095:7.5):0.5,((GAS-TG114463-xx-CL-USA-2018-081-JB:1,TG92352:1):1,TG92304:3):10.5):0.5,((TG78139:3,TG78135:5):0.5,TG77975:3.5):0.5):1,GAS-TG264961-095:4):4,GAS-TG264410-095:14):12):15.5,(GAS-TG263371-095:0,48-P:1,((GAS-TG133148-095:0,GAS-TG132944-095:0,GAS-TG132972-095:0):2,(GAS-TG133052-095:0,GAS-TG133168-095:0):2):1,GAS-TG133128-095:1,(71-P:0,GAS-TG133016-095:0,GAS-TG133024-095:0,GAS-TG133084-095:0,GAS-TG133140-095:0):2):27.5):542,(((TG78063:0,TG78143:0):3.5,06_283016:7.5):14,TG93378:25):601):294.5,(((((((((GAS-TG93649:0,GAS_TG93649:0):3,Streptococcus-Group-A-TG93461:5):1,(GAS-TG133888-095:0,GAS-TG264954-095:0,GAS-TG265455-095:0,TG92284:0,GAS-TG253210-095:1,GAS-TG262286-095:1,GAS-TG262720-095:1,GAS-FMCTG95165-xx-CL-USA-2017-040-JB:2,GAS-TG133996-095:3):6):0.5,GAS-AZ00097292-095:8.5):2,GAS-TG262728-095:12):0.5,(((TG93242:5,GAS-TG257140-095:9):4,TG93382:4,TG92970:5):0.5,TG92252:11.5):0.5):5,GAS-TG132920-095:15):25.5,((((06_286011:0,TG93442:0):4,06_284001:9):3.5,TG78099:3.5,TG93346:9):1,(TG78075:6,TG78051:7):3):66.5):16,TG78271:52):849.5):14,(((((((((68-P:1,GAS-TG132860-095:2,(GAS-TG134544-095:0,GAS-TG253208-081:0,GAS-TG257032-095:0,GAS-TG265449-095:0,GAS-TG263375-095:1,(GAS-TG264402-095:0,GAS-TG264413-095:0):1,GAS-TG134548-095:2):7):1,(TG93621:2,GAS-TG257136-095:6):2,(GAS-TG253216-095:4,GAS-TG133124-095:6):4,TG92712:5,(GAS-TG132888-095:0,GAS-TG133164-095:0):7):0.5,TG93210:8.5):0.5,(((GAS_TG93689:3,GAS-TG133132-095:7):0.5,GAS-TG133160-095:4.5):0.5,(GAS-AZ00097462-095:0,GAS-TG264251-095:0):6.5):1,(((31316:0,31315:0,31642:0):2,(TG92736:0,TG92748:0,TG92752:0,TG92744:1):2,GAS-TG114447-xx-CL-USA-2018-081-JB:5):0.5,((TG92340:3,TG128496:4):0.5,GAS-TG262284-095:3.5):1.5):1.5,(GAS-TG132852-095:0,GAS-TG132904-095:0):8):0.5,TG92280:8.5):0.5,(((TG92364:0,GAS-TG132924-095:2,TG92220:2):0.5,GAS-TG133968-095:6.5):0.5,(TG92140:1,GAS-TG133988-095:2):1.5):2.5):0.5,((((((R:0,GAS-TG133876-095:1):2,TG93993:2,TG93625:4):0.5,GAS-TG132844-095:1.5):0.5,GAS-TG264242-095:5.5):0.5,(((TG92212:1.5,TG92148:3.5):2.5,GAS-TG264236-095:4.5):0.5,(((GAS-AZ00105903-095:0,GAS-TG264953-095:1):2,(GAS_TG93701:0,GAS_TG93705:0):2,(GAS-TG132916-095:0,GAS-TG133064-095:0):3):2.5,((GAS-AZ00106486-095:0,GAS-TG265363-095:0,(GAS-TG264231-095:0,GAS-AZ00097422-095:0,GAS-AZ00098554-095:0):2):1,GAS-TG134368-095:1,GAS-TG253222-095:1,GAS-TG134032-095:2):7.5):1.5):1.5):0.5,((GAS-TG262751-095:2,TG92756:7):2,((GAS-TG134064-095:0,GAS-TG264408-095:2):1.5,GAS-FMCTG98539-xx-CL-USA-2017-040-JB:2.5):4):0.5):0.5):121.5,((TG78103:4.5,TG93370:10.5):2,(TG93290:1.5,TG77991:3.5):4):136.5):337.5,(TG93262:3,TG78175:4):544.5):695):11"),o("rectangular")}),[]),Object(u.jsxs)("div",{children:[Object(u.jsx)("h1",{children:"Phylocanvas Demo"}),Object(u.jsx)(_,{tree:i,type:s,labels:h,align:j,nodeSize:O,textSize:g,lineWidth:z,clusterDistance:E,clusterSamples:Z}),Object(u.jsx)("h5",{children:"Type:"}),Object(u.jsx)("button",{onClick:function(){return o("radial")},children:"Radial"}),Object(u.jsx)("button",{onClick:function(){return o("rectangular")},children:"Rectangular"}),Object(u.jsx)("button",{onClick:function(){return o("circular")},children:"Circular"}),Object(u.jsx)("button",{onClick:function(){return o("diagonal")},children:"Diagonal"}),Object(u.jsx)("button",{onClick:function(){return o("hierarchical")},children:"Hierarchical"}),Object(u.jsx)("h5",{children:"Cluster Detection:"}),Object(u.jsx)("button",{onClick:function(){return B(E+1)},children:"ClusterDistance + 1"}),Object(u.jsx)("button",{onClick:function(){return B(E-1)},children:"ClusterDistance - 1"}),Object(u.jsx)("button",{onClick:function(){return N(Z+1)},children:"ClusterSamples + 1"}),Object(u.jsx)("button",{onClick:function(){return N(Z-1)},children:"ClusterSamples - 1"}),Object(u.jsx)("h5",{children:"Toggle:"}),Object(u.jsx)("button",{onClick:function(){return d(!h)},children:"Labels"}),Object(u.jsx)("button",{onClick:function(){return f(!j)},children:"Align"}),Object(u.jsx)("h5",{children:"Style:"}),Object(u.jsx)("button",{onClick:function(){return x(O+1)},children:"Node Size + 1"}),Object(u.jsx)("button",{onClick:function(){return x(O-1)},children:"Node Size - 1"}),Object(u.jsx)("button",{onClick:function(){return y(g+1)},children:"Text Size + 1"}),Object(u.jsx)("button",{onClick:function(){return y(g-1)},children:"Text Size - 1"}),Object(u.jsx)("button",{onClick:function(){return L(z+1)},children:"Line Width + 1"}),Object(u.jsx)("button",{onClick:function(){return L(z-1)},children:"Line Width - 1"})]})},X=i(16),F=i.n(X),J=i(80),U=i(86),Y=i(81),H=i(82),V=(i(70),i(50)),q=i(51),K=i(52);var Q=function(e){return delete F.a.Icon.Default.prototype._getIconUrl,F.a.Icon.Default.mergeOptions({iconRetinaUrl:K.a,iconUrl:V.a,shadowUrl:q.a}),Object(n.useEffect)((function(){}),[e.center]),Object(u.jsxs)(J.a,{style:{height:"400px"},center:e.center,zoom:e.zoom,scrollWheelZoom:!1,children:[Object(u.jsx)(U.a,{url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),Object(u.jsx)(Y.a,{position:e.center,children:Object(u.jsxs)(H.a,{children:["A pretty CSS3 popup. ",Object(u.jsx)("br",{})," Easily customizable."]})})]})};var $=function(){var e=Object(n.useState)([35.2,-111.65]),t=Object(T.a)(e,2),i=t[0],r=t[1],a=Object(n.useState)(6),c=Object(T.a)(a,2),s=c[0];return c[1],Object(n.useEffect)((function(){document.getElementById("demoLeafletXCenter").value=i[0],document.getElementById("demoLeafletYCenter").value=i[1]}),[]),Object(u.jsxs)("div",{children:[Object(u.jsx)("h1",{children:"Leaflet Demo"}),Object(u.jsx)(Q,{center:i,zoom:s}),Object(u.jsx)("h5",{children:"Marker Position:"}),"X: ",Object(u.jsx)("input",{id:"demoLeafletXCenter",onChange:function(){r([document.getElementById("demoLeafletXCenter").value,i[1]])}}),"\u2003Y: ",Object(u.jsx)("input",{id:"demoLeafletYCenter",onChange:function(){r([i[0],document.getElementById("demoLeafletYCenter").value])}})]})},ee=i(53),te=i.n(ee);var ie=function(e){return Object(n.useEffect)((function(){te.a.react("plotly",e.data)}),[e.data]),Object(u.jsx)("div",{id:"plotly"})};var ne=function(){var e=Object(n.useState)(["data1","data2"]),t=Object(T.a)(e,2),i=t[0],r=t[1],a=Object(n.useState)([15,20]),c=Object(T.a)(a,2),s=c[0],o=c[1],l=Object(n.useState)("bar"),G=Object(T.a)(l,2),h=G[0],d=G[1];return Object(n.useEffect)((function(){document.getElementById("demoPlotlyXLabel").value=i[0],document.getElementById("demoPlotlyYLabel").value=i[1],document.getElementById("demoPlotlyXValue").value=s[0],document.getElementById("demoPlotlyYValue").value=s[1]}),[]),Object(u.jsxs)("div",{children:[Object(u.jsx)("h1",{children:"Plotly Demo"}),Object(u.jsx)(ie,{data:[{x:i,y:s,type:h}]}),Object(u.jsx)("h5",{children:"Labels:"}),"X: ",Object(u.jsx)("input",{id:"demoPlotlyXLabel",onChange:function(){return r([document.getElementById("demoPlotlyXLabel").value,i[1]])}}),"\u2003Y: ",Object(u.jsx)("input",{id:"demoPlotlyYLabel",onChange:function(){return r([i[0],document.getElementById("demoPlotlyYLabel").value])}}),Object(u.jsx)("h5",{children:"Data:"}),"X: ",Object(u.jsx)("input",{id:"demoPlotlyXValue",onChange:function(){return o([parseInt(document.getElementById("demoPlotlyXValue").value),s[1]])}}),"\u2003Y: ",Object(u.jsx)("input",{id:"demoPlotlyYValue",onChange:function(){return o([s[0],parseInt(document.getElementById("demoPlotlyYValue").value)])}}),Object(u.jsx)("h5",{children:"Type:"}),Object(u.jsx)("button",{onClick:function(){return d("bar")},children:"Bar"}),Object(u.jsx)("button",{onClick:function(){return d("scatter")},children:"Scatter"})]})};var re=function(){var e=Object(n.useState)("(A:1)B;"),t=Object(T.a)(e,2),i=t[0],r=t[1],a=Object(n.useState)("radial"),c=Object(T.a)(a,2),s=c[0],o=c[1],l=Object(n.useState)(!0),G=Object(T.a)(l,2),h=G[0],d=G[1],S=Object(n.useState)(!1),b=Object(T.a)(S,2),j=b[0],f=b[1],A=Object(n.useState)(10),p=Object(T.a)(A,2),O=p[0],x=p[1],v=Object(n.useState)(15),m=Object(T.a)(v,2),g=m[0],y=m[1],w=Object(n.useState)(2),C=Object(T.a)(w,2),z=C[0],L=C[1],k=Object(n.useState)(3),M=Object(T.a)(k,2),E=M[0],B=M[1],P=Object(n.useState)(3),D=Object(T.a)(P,2),Z=D[0],N=D[1];return Object(n.useEffect)((function(){r("((((((((GAS-TG262730-095:6.5,TG78255:6.5):2,TG93342:4):0.5,((((TG77939:0,(GAS-TG93657:0,GAS_TG93657:0):1,GAS-TG262282-095:4):0.5,((GAS-TG265461-095:0,(AZ_GAS_TG93637:0,GAS-TG93661:0,GAS_TG93661:0):2):1,(TG92312:0,TG92296:0):1):1.5,TG92248:3,((TG77951:1.5,((GAS-TG114483-xx-CL-USA-2018-081-JB:0,GAS-TG133136-095:1,GAS-TG265457-095:1,GAS-AZ00097772-095:5):0.5,GAS-TG262724-095:2.5):2.5):1.5,TG78167:1.5):4):3,TG78091:6):0.5,(((GAS-TG264245-095:2,(GAS-TG263365-095:0,GAS-TG264943-095:0):4):2,TG78195:5):0.5,((GAS-AZ00096535-095:0.5,(GAS-TG262761-095:0,TG92324:0,GAS-AZ00104982-095:2,GAS-TG263373-095:2):0.5):0.5,((GAS-TG133036-095:0,(GAS-TG264144-095:0,GAS-AZ00099104-095:2):2):1.5,(GAS-AZ00098934-095:0,GAS-TG113124-xx-CL-USA-2018-081-JB:0,GAS-AZ00096587-095:1):1.5):0.5):1.5):3.5):1.5):8,(((((((TG93354:2,TG78207:5):0.5,GAS-AZ00097136-095:11.5):0.5,GAS-TG133056-095:7.5):0.5,((GAS-TG114463-xx-CL-USA-2018-081-JB:1,TG92352:1):1,TG92304:3):10.5):0.5,((TG78139:3,TG78135:5):0.5,TG77975:3.5):0.5):1,GAS-TG264961-095:4):4,GAS-TG264410-095:14):12):15.5,(GAS-TG263371-095:0,48-P:1,((GAS-TG133148-095:0,GAS-TG132944-095:0,GAS-TG132972-095:0):2,(GAS-TG133052-095:0,GAS-TG133168-095:0):2):1,GAS-TG133128-095:1,(71-P:0,GAS-TG133016-095:0,GAS-TG133024-095:0,GAS-TG133084-095:0,GAS-TG133140-095:0):2):27.5):542,(((TG78063:0,TG78143:0):3.5,06_283016:7.5):14,TG93378:25):601):294.5,(((((((((GAS-TG93649:0,GAS_TG93649:0):3,Streptococcus-Group-A-TG93461:5):1,(GAS-TG133888-095:0,GAS-TG264954-095:0,GAS-TG265455-095:0,TG92284:0,GAS-TG253210-095:1,GAS-TG262286-095:1,GAS-TG262720-095:1,GAS-FMCTG95165-xx-CL-USA-2017-040-JB:2,GAS-TG133996-095:3):6):0.5,GAS-AZ00097292-095:8.5):2,GAS-TG262728-095:12):0.5,(((TG93242:5,GAS-TG257140-095:9):4,TG93382:4,TG92970:5):0.5,TG92252:11.5):0.5):5,GAS-TG132920-095:15):25.5,((((06_286011:0,TG93442:0):4,06_284001:9):3.5,TG78099:3.5,TG93346:9):1,(TG78075:6,TG78051:7):3):66.5):16,TG78271:52):849.5):14,(((((((((68-P:1,GAS-TG132860-095:2,(GAS-TG134544-095:0,GAS-TG253208-081:0,GAS-TG257032-095:0,GAS-TG265449-095:0,GAS-TG263375-095:1,(GAS-TG264402-095:0,GAS-TG264413-095:0):1,GAS-TG134548-095:2):7):1,(TG93621:2,GAS-TG257136-095:6):2,(GAS-TG253216-095:4,GAS-TG133124-095:6):4,TG92712:5,(GAS-TG132888-095:0,GAS-TG133164-095:0):7):0.5,TG93210:8.5):0.5,(((GAS_TG93689:3,GAS-TG133132-095:7):0.5,GAS-TG133160-095:4.5):0.5,(GAS-AZ00097462-095:0,GAS-TG264251-095:0):6.5):1,(((31316:0,31315:0,31642:0):2,(TG92736:0,TG92748:0,TG92752:0,TG92744:1):2,GAS-TG114447-xx-CL-USA-2018-081-JB:5):0.5,((TG92340:3,TG128496:4):0.5,GAS-TG262284-095:3.5):1.5):1.5,(GAS-TG132852-095:0,GAS-TG132904-095:0):8):0.5,TG92280:8.5):0.5,(((TG92364:0,GAS-TG132924-095:2,TG92220:2):0.5,GAS-TG133968-095:6.5):0.5,(TG92140:1,GAS-TG133988-095:2):1.5):2.5):0.5,((((((R:0,GAS-TG133876-095:1):2,TG93993:2,TG93625:4):0.5,GAS-TG132844-095:1.5):0.5,GAS-TG264242-095:5.5):0.5,(((TG92212:1.5,TG92148:3.5):2.5,GAS-TG264236-095:4.5):0.5,(((GAS-AZ00105903-095:0,GAS-TG264953-095:1):2,(GAS_TG93701:0,GAS_TG93705:0):2,(GAS-TG132916-095:0,GAS-TG133064-095:0):3):2.5,((GAS-AZ00106486-095:0,GAS-TG265363-095:0,(GAS-TG264231-095:0,GAS-AZ00097422-095:0,GAS-AZ00098554-095:0):2):1,GAS-TG134368-095:1,GAS-TG253222-095:1,GAS-TG134032-095:2):7.5):1.5):1.5):0.5,((GAS-TG262751-095:2,TG92756:7):2,((GAS-TG134064-095:0,GAS-TG264408-095:2):1.5,GAS-FMCTG98539-xx-CL-USA-2017-040-JB:2.5):4):0.5):0.5):121.5,((TG78103:4.5,TG93370:10.5):2,(TG93290:1.5,TG77991:3.5):4):136.5):337.5,(TG93262:3,TG78175:4):544.5):695):0;"),o("rectangular")}),[]),Object(u.jsxs)("div",{children:[Object(u.jsx)(_,{tree:i,type:s,labels:h,align:j,nodeSize:O,textSize:g,lineWidth:z,clusterDistance:E,clusterSamples:Z}),Object(u.jsx)("h5",{children:"Type:"}),Object(u.jsx)("button",{onClick:function(){return o("radial")},children:"Radial"}),Object(u.jsx)("button",{onClick:function(){return o("rectangular")},children:"Rectangular"}),Object(u.jsx)("button",{onClick:function(){return o("circular")},children:"Circular"}),Object(u.jsx)("button",{onClick:function(){return o("diagonal")},children:"Diagonal"}),Object(u.jsx)("button",{onClick:function(){return o("hierarchical")},children:"Hierarchical"}),Object(u.jsx)("h5",{children:"Cluster Detection:"}),Object(u.jsx)("button",{onClick:function(){return B(E+1)},children:"ClusterDistance + 1"}),Object(u.jsx)("button",{onClick:function(){return B(Math.max(E-1,1))},children:"ClusterDistance - 1"}),Object(u.jsx)("button",{onClick:function(){return N(Z+1)},children:"ClusterSamples + 1"}),Object(u.jsx)("button",{onClick:function(){return N(Math.max(Z-1,1))},children:"ClusterSamples - 1"}),Object(u.jsx)("h5",{children:"Toggle:"}),Object(u.jsx)("button",{onClick:function(){return d(!h)},children:"Labels"}),Object(u.jsx)("button",{onClick:function(){return f(!j)},children:"Align"}),Object(u.jsx)("h5",{children:"Style:"}),Object(u.jsx)("button",{onClick:function(){return x(O+1)},children:"Node Size + 1"}),Object(u.jsx)("button",{onClick:function(){return x(Math.max(O-1,1))},children:"Node Size - 1"}),Object(u.jsx)("button",{onClick:function(){return y(g+1)},children:"Text Size + 1"}),Object(u.jsx)("button",{onClick:function(){return y(Math.max(g-1,1))},children:"Text Size - 1"}),Object(u.jsx)("button",{onClick:function(){return L(z+1)},children:"Line Width + 1"}),Object(u.jsx)("button",{onClick:function(){return L(Math.max(z-1,1))},children:"Line Width - 1"})]})};var ae=function(){var e=Object(n.useState)(0),t=Object(T.a)(e,2),i=t[0],r=t[1],a=Object(n.useRef)();return Object(n.useEffect)((function(){function e(){r(a.current.clientHeight),console.log(a.current.clientHeight)}return r(a.current.clientHeight),window.addEventListener("resize",e),function(){return window.removeEventListener("resize",e)}}),[]),Object(u.jsxs)("div",{ref:a,className:"Nav-body",children:[i,Object(u.jsx)(d.a,{basename:"/epitools",children:Object(u.jsxs)(S.c,{children:[Object(u.jsx)(S.a,{exact:!0,path:"/",children:Object(u.jsx)("p",{children:"default"})}),Object(u.jsx)(S.a,{exact:!0,path:"/demo-phylocanvas",children:Object(u.jsx)(R,{})}),Object(u.jsx)(S.a,{exact:!0,path:"/demo-leaflet",children:Object(u.jsx)($,{})}),Object(u.jsx)(S.a,{exact:!0,path:"/demo-plotly",children:Object(u.jsx)(ne,{})}),Object(u.jsx)(S.a,{exact:!0,path:"/gas",children:Object(u.jsx)(re,{})})]})})]})};var ce=function(){return Object(u.jsx)("div",{className:"Nav-footer",children:"hello footer"})};var se=function(){return Object(u.jsxs)("div",{className:"App",children:[Object(u.jsx)(h,{}),Object(u.jsx)(ae,{}),Object(u.jsx)(ce,{})]})},oe=function(e){e&&e instanceof Function&&i.e(3).then(i.bind(null,87)).then((function(t){var i=t.getCLS,n=t.getFID,r=t.getFCP,a=t.getLCP,c=t.getTTFB;i(e),n(e),r(e),a(e),c(e)}))};c.a.render(Object(u.jsx)(r.a.StrictMode,{children:Object(u.jsx)(se,{})}),document.getElementById("root")),oe()}},[[73,1,2]]]);
//# sourceMappingURL=main.2bef28c8.chunk.js.map