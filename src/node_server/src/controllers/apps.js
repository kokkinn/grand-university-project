const path = require("path");
const getCalculator = (req, res) => {
  return res.sendFile(path.resolve("protected/calculator/index.html"));
};

module.exports.getCalculator = getCalculator;
