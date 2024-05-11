import { HuffmanTreeEncoding } from "./huffmanTree.js";
import { drawTree } from "./d3TreeLayout.js";

fetch("https://d3js.org/d3.v7.min.js").then((response) => {
  response.text().then((text) => {
    eval(text);
  });
});

document.querySelector("#input-str").addEventListener("input", (ev) => {
  if (ev.target.value === "") {
    document.querySelector('svg .links').innerHTML = ''
    document.querySelector('svg .nodes').innerHTML = ''
    document.querySelectorAll('svg .label').forEach((label) => label.remove())
    return;
  }
  const hte1 = new HuffmanTreeEncoding(ev.target.value);
  hte1.generateFrequencyMap();
  hte1.generatePriorityQueue();
  hte1.generateTree();
  hte1.encodeInputString();
  drawTree(hte1.treeToDict());
  document.querySelector('#encoded-string').innerText = hte1.encodedString
  document.querySelector('#decoded-string').innerText = hte1.decodeEncodedString()
});
