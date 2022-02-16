import React, {useEffect, useState} from "react";

import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';

import SvgButton from "../svgButton/SvgButton.js";

import Phylocanvas from "../phylocanvas/Phylocanvas.js";

function PhylocanvasView() {
  const [tree, setTree] = useState("(A:1)B;");
  const [type, setType] = useState("radial");
  const [labels, setLabels] = useState(true);
  const [align, setAlign] = useState(false);
  const [nodeSize, setNodeSize] = useState(10);
  const [textSize, setTextSize] = useState(15);
  const [lineWidth, setLineWidth] = useState(2);
  const [clusterDistance, setClusterDistance] = useState(3);
  const [clusterSamples, setClusterSamples] = useState(3);

  useEffect(() => {
    setTree("((((((((GAS-TG262730-095:6.5,TG78255:6.5):2,TG93342:4):0.5,((((TG77939:0,(GAS-TG93657:0,GAS_TG93657:0):1,GAS-TG262282-095:4):0.5,((GAS-TG265461-095:0,(AZ_GAS_TG93637:0,GAS-TG93661:0,GAS_TG93661:0):2):1,(TG92312:0,TG92296:0):1):1.5,TG92248:3,((TG77951:1.5,((GAS-TG114483-xx-CL-USA-2018-081-JB:0,GAS-TG133136-095:1,GAS-TG265457-095:1,GAS-AZ00097772-095:5):0.5,GAS-TG262724-095:2.5):2.5):1.5,TG78167:1.5):4):3,TG78091:6):0.5,(((GAS-TG264245-095:2,(GAS-TG263365-095:0,GAS-TG264943-095:0):4):2,TG78195:5):0.5,((GAS-AZ00096535-095:0.5,(GAS-TG262761-095:0,TG92324:0,GAS-AZ00104982-095:2,GAS-TG263373-095:2):0.5):0.5,((GAS-TG133036-095:0,(GAS-TG264144-095:0,GAS-AZ00099104-095:2):2):1.5,(GAS-AZ00098934-095:0,GAS-TG113124-xx-CL-USA-2018-081-JB:0,GAS-AZ00096587-095:1):1.5):0.5):1.5):3.5):1.5):8,(((((((TG93354:2,TG78207:5):0.5,GAS-AZ00097136-095:11.5):0.5,GAS-TG133056-095:7.5):0.5,((GAS-TG114463-xx-CL-USA-2018-081-JB:1,TG92352:1):1,TG92304:3):10.5):0.5,((TG78139:3,TG78135:5):0.5,TG77975:3.5):0.5):1,GAS-TG264961-095:4):4,GAS-TG264410-095:14):12):15.5,(GAS-TG263371-095:0,48-P:1,((GAS-TG133148-095:0,GAS-TG132944-095:0,GAS-TG132972-095:0):2,(GAS-TG133052-095:0,GAS-TG133168-095:0):2):1,GAS-TG133128-095:1,(71-P:0,GAS-TG133016-095:0,GAS-TG133024-095:0,GAS-TG133084-095:0,GAS-TG133140-095:0):2):27.5):542,(((TG78063:0,TG78143:0):3.5,06_283016:7.5):14,TG93378:25):601):294.5,(((((((((GAS-TG93649:0,GAS_TG93649:0):3,Streptococcus-Group-A-TG93461:5):1,(GAS-TG133888-095:0,GAS-TG264954-095:0,GAS-TG265455-095:0,TG92284:0,GAS-TG253210-095:1,GAS-TG262286-095:1,GAS-TG262720-095:1,GAS-FMCTG95165-xx-CL-USA-2017-040-JB:2,GAS-TG133996-095:3):6):0.5,GAS-AZ00097292-095:8.5):2,GAS-TG262728-095:12):0.5,(((TG93242:5,GAS-TG257140-095:9):4,TG93382:4,TG92970:5):0.5,TG92252:11.5):0.5):5,GAS-TG132920-095:15):25.5,((((06_286011:0,TG93442:0):4,06_284001:9):3.5,TG78099:3.5,TG93346:9):1,(TG78075:6,TG78051:7):3):66.5):16,TG78271:52):849.5):14,(((((((((68-P:1,GAS-TG132860-095:2,(GAS-TG134544-095:0,GAS-TG253208-081:0,GAS-TG257032-095:0,GAS-TG265449-095:0,GAS-TG263375-095:1,(GAS-TG264402-095:0,GAS-TG264413-095:0):1,GAS-TG134548-095:2):7):1,(TG93621:2,GAS-TG257136-095:6):2,(GAS-TG253216-095:4,GAS-TG133124-095:6):4,TG92712:5,(GAS-TG132888-095:0,GAS-TG133164-095:0):7):0.5,TG93210:8.5):0.5,(((GAS_TG93689:3,GAS-TG133132-095:7):0.5,GAS-TG133160-095:4.5):0.5,(GAS-AZ00097462-095:0,GAS-TG264251-095:0):6.5):1,(((31316:0,31315:0,31642:0):2,(TG92736:0,TG92748:0,TG92752:0,TG92744:1):2,GAS-TG114447-xx-CL-USA-2018-081-JB:5):0.5,((TG92340:3,TG128496:4):0.5,GAS-TG262284-095:3.5):1.5):1.5,(GAS-TG132852-095:0,GAS-TG132904-095:0):8):0.5,TG92280:8.5):0.5,(((TG92364:0,GAS-TG132924-095:2,TG92220:2):0.5,GAS-TG133968-095:6.5):0.5,(TG92140:1,GAS-TG133988-095:2):1.5):2.5):0.5,((((((R:0,GAS-TG133876-095:1):2,TG93993:2,TG93625:4):0.5,GAS-TG132844-095:1.5):0.5,GAS-TG264242-095:5.5):0.5,(((TG92212:1.5,TG92148:3.5):2.5,GAS-TG264236-095:4.5):0.5,(((GAS-AZ00105903-095:0,GAS-TG264953-095:1):2,(GAS_TG93701:0,GAS_TG93705:0):2,(GAS-TG132916-095:0,GAS-TG133064-095:0):3):2.5,((GAS-AZ00106486-095:0,GAS-TG265363-095:0,(GAS-TG264231-095:0,GAS-AZ00097422-095:0,GAS-AZ00098554-095:0):2):1,GAS-TG134368-095:1,GAS-TG253222-095:1,GAS-TG134032-095:2):7.5):1.5):1.5):0.5,((GAS-TG262751-095:2,TG92756:7):2,((GAS-TG134064-095:0,GAS-TG264408-095:2):1.5,GAS-FMCTG98539-xx-CL-USA-2017-040-JB:2.5):4):0.5):0.5):121.5,((TG78103:4.5,TG93370:10.5):2,(TG93290:1.5,TG77991:3.5):4):136.5):337.5,(TG93262:3,TG78175:4):544.5):695):0;");
    setType("rectangular");
  }, [])

  return (
    <div>
      <Phylocanvas
        tree = {tree}
        type = {type}
        labels = {labels}
        align = {align}
        nodeSize = {nodeSize}
        textSize = {textSize}
        lineWidth = {lineWidth}
        clusterDistance = {clusterDistance}
        clusterSamples = {clusterSamples}
      />
      <h5>SVG:</h5>
        <SvgButton onClick={() => setType("radial")} svg="treeRadial" />
        <SvgButton onClick={() => setType("rectangular")} svg="treeRectangular" />
        <SvgButton onClick={() => setType("circular")} svg="treeCircular" />
        <SvgButton onClick={() => setType("diagonal")} svg="treeDiagonal" />
        <SvgButton onClick={() => setType("hierarchical")} svg="treeHierarchical" />
        <SvgButton svg="menuSettings" />
        <SvgButton svg="menuContext" />
      <h5>SVG With Label:</h5>
        <SvgButton onClick={() => setType("radial")} svg="treeRadial" label="Radial" />
        <SvgButton onClick={() => setType("rectangular")} svg="treeRectangular" label="Rectangular" />
        <SvgButton onClick={() => setType("circular")} svg="treeCircular" label="Circular" />
        <SvgButton onClick={() => setType("diagonal")} svg="treeDiagonal" label="Diagonal" />
        <SvgButton onClick={() => setType("hierarchical")} svg="treeHierarchical" label="Hierarchical" />
        <SvgButton svg="menuSettings" label="Settings Menu" />
        <SvgButton svg="menuContext" label="Context Menu" />
      <h5>SVG With Drop:</h5>
        <SvgButton onClick={() => setType("radial")} svg="treeRadial" drop={true} />
        <SvgButton onClick={() => setType("rectangular")} svg="treeRectangular" drop={true} />
        <SvgButton onClick={() => setType("circular")} svg="treeCircular" drop={true} />
        <SvgButton onClick={() => setType("diagonal")} svg="treeDiagonal" drop={true} />
        <SvgButton onClick={() => setType("hierarchical")} svg="treeHierarchical" drop={true} />
        <SvgButton svg="menuSettings" drop={true} />
        <SvgButton svg="menuContext" drop={true} />
      <h5>SVG With Both:</h5>
        <SvgButton onClick={() => setType("radial")} svg="treeRadial" label="Radial" drop={true} />
        <SvgButton onClick={() => setType("rectangular")} svg="treeRectangular" label="Rectangular" drop={true} />
        <SvgButton onClick={() => setType("circular")} svg="treeCircular" label="Circular" drop={true} />
        <SvgButton onClick={() => setType("diagonal")} svg="treeDiagonal" label="Diagonal" drop={true} />
        <SvgButton onClick={() => setType("hierarchical")} svg="treeHierarchical" label="Hierarchical" drop={true} />
        <SvgButton svg="menuSettings" label="Settings Menu" drop={true} />
        <SvgButton svg="menuContext" label="Context Menu" drop={true} />
      <h5>No SVG:</h5>
        <SvgButton onClick={() => setType("radial")} label="Radial" drop={true} />
        <SvgButton onClick={() => setType("rectangular")} label="Rectangular" drop={true} />
        <SvgButton onClick={() => setType("circular")} label="Circular" drop={true} />
        <SvgButton onClick={() => setType("diagonal")} label="Diagonal" drop={true} />
        <SvgButton onClick={() => setType("hierarchical")} label="Hierarchical" drop={true} />
        <SvgButton label="Settings Menu" drop={true} />
        <SvgButton label="Context Menu" drop={true} />


      <h5>Cluster Detection:</h5>
        <button onClick={() => setClusterDistance(clusterDistance + 1)}>ClusterDistance + 1</button>
        <button onClick={() => setClusterDistance(Math.max(clusterDistance - 1, 1))}>ClusterDistance - 1</button>
        <button onClick={() => setClusterSamples(clusterSamples + 1)}>ClusterSamples + 1</button>
        <button onClick={() => setClusterSamples(Math.max(clusterSamples - 1, 1))}>ClusterSamples - 1</button>
      <h5>Toggle:</h5>
        <button onClick={() => setLabels(!labels)}>Labels</button>
        <button onClick={() => setAlign(!align)}>Align</button>
      <h5>Style:</h5>
        <button onClick={() => setNodeSize(nodeSize + 1)}>Node Size + 1</button>
        <button onClick={() => setNodeSize(Math.max(nodeSize - 1, 1))}>Node Size - 1</button>
        <button onClick={() => setTextSize(textSize + 1)}>Text Size + 1</button>
        <button onClick={() => setTextSize(Math.max(textSize - 1, 1))}>Text Size - 1</button>
        <button onClick={() => setLineWidth(lineWidth + 1)}>Line Width + 1</button>
        <button onClick={() => setLineWidth(Math.max(lineWidth - 1, 1))}>Line Width - 1</button>
    </div>
  )
}

export default PhylocanvasView;
