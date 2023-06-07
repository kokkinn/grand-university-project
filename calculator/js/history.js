import { LS_HISTORY_ITEM_NAME } from "./constants.js";

export class CalculationsHistory {
  currentHistoryList = [];
  historyContainerElement;
  toggleHistoryButtonElement;
  calculatorObject;

  constructor(
    historyElement_,
    clearHistoryElement_,
    historyContainerElement_,
    toggleHistoryButtonElement_,
    calcObject_
  ) {
    this.historyList = historyElement_;
    this.clearHistoryElement = clearHistoryElement_;
    this.historyContainerElement = historyContainerElement_;
    this.toggleHistoryButtonElement = toggleHistoryButtonElement_;
    this.calculatorObject = calcObject_;
  }

  init() {
    if (window.innerWidth > 800){
      console.log('MORE')
      this.historyContainerElement.classList.add("hc-visible")
    }


    if (localStorage.getItem(LS_HISTORY_ITEM_NAME)) {
      this.currentHistoryList = JSON.parse(
        localStorage.getItem(LS_HISTORY_ITEM_NAME)
      );
      this.renderHistoryElement();
    }

    this.clearHistoryElement.addEventListener("click", () => {
      this.clearHistory();
    });

    this.toggleHistoryButtonElement.addEventListener("click", () => {
      this.toggleHistory();
    });
  }
  openHistory() {
    this.historyContainerElement.classList.add("hc-visible");
  }
  closeHistory() {
    this.historyContainerElement.classList.remove("hc-visible");
  }
  toggleHistory() {
    this.historyContainerElement.classList.toggle("hc-visible");
  }
  htmlElementFromExpression(element) {
    const historyElement = document.createElement("div");
    historyElement.classList.add("history-entry");
    historyElement.innerText = element;
    historyElement.addEventListener("click", () => {

      this.handleHistoryEntryClick(
        historyElement.innerText,
        this.calculatorObject
      );
    });
    return historyElement;
  }
  renderHistoryElement() {
    this.currentHistoryList.forEach((listEl) => {
      this.historyList.appendChild(this.htmlElementFromExpression(listEl));
    });
  }
  clearLocalStorage() {
    localStorage.removeItem(LS_HISTORY_ITEM_NAME);
  }
  pushListToLocalStorage() {
    window.localStorage.setItem(
      LS_HISTORY_ITEM_NAME,
      JSON.stringify(this.currentHistoryList)
    );
  }

  appendToHistoryElement(expression) {
    this.historyList.appendChild(this.htmlElementFromExpression(expression));
  }
  handleHistoryEntryClick = (historyEntry, calcObj) => {
    calcObj.currNumber = historyEntry.split("=").at(1);
    calcObj.currDecNumber = historyEntry.split("=").at(1);
    calcObj.refreshCalcHTML();
  };
  addHistoryEntry = (expression) => {
    this.currentHistoryList.push(expression);
    this.appendToHistoryElement(expression);
    this.pushListToLocalStorage();
  };

  clearHistory() {
    this.currentHistoryList = [];
    this.historyList.innerHTML = "";
    this.clearLocalStorage();
  }
}
