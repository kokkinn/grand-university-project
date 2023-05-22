/**
 *
 * @param {Object} jsonData A dictionary where Eolymp data is stored
 * @param {Node} contestsListNode A reference to e-olymp contests node, where child nodes would be appended
 * @return {null}
 */
function renderEolympData(jsonData, contestsListNode) {
  for (const property in jsonData.data) {
    const contestNode = document.createElement("div");
    contestNode.classList.add("eolymp-contest");
    const buttonNode = document.createElement("button");
    buttonNode.classList.add("ec-button");
    buttonNode.textContent = property;
    contestNode.appendChild(buttonNode);
    const contestInnerNode = document.createElement("div");
    contestInnerNode.classList.add("eolymp-contest-inner");
    jsonData.data[property].forEach((problem) => {
      const problemNode = document.createElement("a");
      problemNode.classList.add("ec-contest-problem");
      problemNode.href = problem.url;
      problemNode.setAttribute("target", "_blank");
      problemNode.innerText = problem.name;
      contestInnerNode.appendChild(problemNode);
    });
    contestNode.appendChild(contestInnerNode);
    contestsListNode.appendChild(contestNode);
  }
}

export { renderEolympData };
