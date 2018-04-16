import d3Wrap from 'react-d3-wrap'
import * as d3 from 'd3'
import CRUDTree from './CRUDTree'


const CRUDTreeElement = d3Wrap ({

  initialize (svg, data, options) {
    // Initial behaviour goes here
  },

  update (svg, data, options) {
    // Cleanup any existing graphs
    var selectSVG = d3.select(svg);
    selectSVG.selectAll("*").remove();

    var levelWidth = [1];
    var levelDepth = [1];

    // Function to get the child depth level
    var childCount = function(level, n) {
      if(n.children && n.children.length > 0) {
        if(levelWidth.length <= level + 1) levelWidth.push(0);
        
        levelWidth[level+1] += n.children.length;
        n.children.forEach(function(d) {
          levelDepth.push(d.depth);
          childCount(level + 1, d);
        });
      }
    };
    
    const treeData = data[0];
    const root = d3.hierarchy(treeData);
    childCount(0, root);
    
    var treeWidth = ((d3.max(levelDepth) + 1) * CRUDTree.resourceBoxWidth()); 
    var treeHeight = ((d3.max(levelWidth) * 2) * CRUDTree.resourceBoxHeight() ) + 100; 
    
    // initialize method called once when component mounts
    const g = d3.select(svg)
      .append('g')
      .attr('ref', 'sketch')
      .attr('transform', 'translate(0,0)');

    var tree = d3.tree()
      .size([treeHeight,treeWidth])

    this.state = {
      g: g,
      tree: tree
    };

    // setup the container, root svg element passed in along with data and options
    const graphEl = this.state.g;
    const handler = data[1];
    var nodes = this.state.tree(root);
    // draw link paths between the nodes in the tree
    var link = graphEl.selectAll(".tree-link")
    .data( nodes.descendants().slice(1), function(d) { return d.data.id; })
    .enter().append("path")
    .attr("class", "tree-link")
    .attr("d", function(d) {
        return "M" + (d.y) + "," + (d.x + CRUDTree.halfBoxHeight())
            + " " + (d.parent.y + CRUDTree.resourceBoxWidth()) + "," + (d.parent.x + CRUDTree.halfBoxHeight());
      });

    let node = CRUDTree.drawNodes(graphEl, nodes, handler);
    d3.select(svg).attr('width',treeWidth + 350);
    d3.select(svg).attr('height',treeHeight + 100);
    
    node.exit().remove();
    // Move the position of the tree graph based on x and y parameters
    let offsetX = data[2].x;
    let offsetY = data[2].y;
    graphEl.attr("transform", "translate(" + offsetX + "," + offsetY + ")");
  },

  destroy () {
    // Optional clean up when a component is being unmounted...
  }

});

export default CRUDTreeElement;