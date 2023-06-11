export function drawTree(dataMap) {
  const treeWidth = (window.innerWidth / 100) * 90;

  const treeHeight =
    window.innerHeight - document.querySelector("header").clientHeight  - 32;

  document.querySelector("svg").setAttribute("width", treeWidth + "px");
  document.querySelector("svg").setAttribute("height", treeHeight + "px");
  const treeLayout = d3.tree().size([treeWidth, treeHeight - 90 ]);

  const root = d3.hierarchy(dataMap);

  treeLayout(root);

  // Nodes
  d3.select("svg g.nodes")
    .selectAll("circle.node")
    .data(root.descendants())
    .join("circle")
    .classed("node", true)
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    .attr("r", 5);

  d3.select("svg g")
    .selectAll("text.label")
    .data(root.descendants())
    .join("text")
    .classed("label", true)
    .attr("x", function (d) {
      return d.x - 15;
    })
    .attr("y", function (d) {
      return !d.data.value ? d.y + 20 : d.y + 50;
    })
    .text(function (d) {
      return `${"freq: " + d.data.frequency}`;
    });
  d3.select("svg g")
    .selectAll("text.count-label")
    .data(root.descendants())
    .join("text")
    .classed("label", true)
    .attr("x", function (d) {
      return d.x - 15;
    })
    .attr("y", function (d) {
      return d.y + 20;
    })
    .text(function (d) {
      return `${d.data.value ? "val: " + d.data.value : ""}`;
    });

  d3.select("svg g")
    .selectAll("text.count-label")
    .data(root.descendants())
    .join("text")
    .classed("label", true)
    .attr("x", function (d) {
      return d.x - 15;
    })
    .attr("y", function (d) {
      return d.y + 35;
    })
    .text(function (d) {
      return `${d.data.children === undefined ? "bin: " + d.data.binCode : ""}`;
    });

  // Links
  d3.select("svg g.links")
    .selectAll("line.link")
    .data(root.links())
    .join("line")
    .classed("link", true)
    .attr("x1", function (d) {
      return d.source.x;
    })
    .attr("y1", function (d) {
      return d.source.y;
    })
    .attr("x2", function (d) {
      return d.target.x;
    })
    .attr("y2", function (d) {
      return d.target.y;
    });
}
