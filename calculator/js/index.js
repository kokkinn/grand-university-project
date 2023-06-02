import { Calculator } from "./calculator.js";
import { CalculationsHistory } from "./history.js";

const root = document.querySelector("#root");
const expression = document.querySelector("#expression");
const number = document.querySelector("#number");
const nsButtons = document.querySelectorAll(".ns-select-choice");
const clearButton = document.querySelector("#button-clear-input");
const historyList = document.querySelector("#history-list");
const clearHistory = document.querySelector("#clear-history");
const historyContainer = document.querySelector("#history-container");
const toggleHistoryButton = document.querySelector("#history-toggle-button");
let calc1 = new Calculator(root, expression, number, nsButtons, clearButton);
let hist1 = new CalculationsHistory(
  historyList,
  clearHistory,
  historyContainer,
  toggleHistoryButton,
  calc1
);
hist1.init();
calc1.subscribe(hist1.addHistoryEntry);
calc1.init();


window.onerror = function myErrorHandler(errorMsg) {
  alert("Error occured: " + errorMsg); //or any message
  return false;
};
