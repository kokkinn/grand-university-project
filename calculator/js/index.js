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
  calc1.currSymbol = '0'
  calc1.currNumber = '0'
  calc1.currExpression=''
  calc1.refreshCalcHTML()
  alert("Error occured: " + errorMsg); //or any message
  return false;
};
// window.addEventListener("click", (ev) => {
//   console.log(ev.target.id)
//   if (
//
//     document
//       .querySelector("#history-container")
//       .classList.contains("hc-visible") &&
//     !document.querySelector("#history-container").contains(ev.target) &&
//     ev.target.id !== "icon-clock"
//   ) {
//     console.log("AAAA");
//     hist1.closeHistory();
//   }
// });
document.querySelector("#x22rs").addEventListener("click", (ev) => {
  document.querySelector("#binary-op").classList.toggle("active");
  document.querySelector("#binary-op").style.left =
    document.querySelector("#x22rs").getBoundingClientRect().left + "px";
  document.querySelector("#binary-op").style.top =
    document.querySelector("#x22rs").getBoundingClientRect().bottom + "px";
});

window.addEventListener("click", (ev) => {
  if (
    ev.target.classList.contains("display-button") === false &&
    ev.target.id !== "x22rs"
  ) {
    if (document.querySelector("#binary-op").classList.contains("active")) {
      document.querySelector("#binary-op").classList.remove("active");
    }
  }
});
