import {
  NUMBER_FIELD_INPUTS,
  NUMBER_FIELD_OPERATORS,
  ALLOWED_KEYS,
  CALCULATION_SYSTEM_TYPES,
  PARENTHESIS,
} from "./constants.js";

class Calculator {
  root;
  expressionElement;
  numberElement;
  calcSystem = CALCULATION_SYSTEM_TYPES.dec.short;
  calcSystemButtonElementsList;
  currSymbol = "0";
  currNumber = "0";
  currExpression = "";
  oldNumber = 1;
  lastSign;
  wasEvaluated = false;
  nsButtonToHighlight = { current: null };
  currDecNumber = "0";
  hexDisplayElement = document.querySelector("#number-hex");
  binDisplayElement = document.querySelector("#number-bin");
  octDisplayElement = document.querySelector("#number-oct");
  decDisplayElement = document.querySelector("#number-dec");
  evaluationSubscribers = [];
  clearButtonRef = { current: null };
  randomSettingRef = { current: null };

  constructor(
    root_,
    expressionElement_,
    numberElement_,
    calcSystemButtonElementsList_ = null,
    clearButton
  ) {
    this.root = root_;
    this.expressionElement = expressionElement_;
    this.numberElement = numberElement_;
    this.calcSystemButtonElementsList = calcSystemButtonElementsList_;
    this.clearButtonRef.current = clearButton;
  }

  publishNewEvaluation(expression) {
    this.evaluationSubscribers.forEach((subscriber) => {
      subscriber(expression);
    });
  }

  subscribe(callback_) {
    this.evaluationSubscribers.push(callback_);
  }
  refreshCalcHTML() {
    this.expressionElement.innerText = this.currExpression;
    this.numberElement.innerText = this.currNumber;
    // TODO optimize
    const a = this.currDecNumber;
    this.decDisplayElement.innerText = Number(a).toString(10);
    this.hexDisplayElement.innerText = Number(a).toString(16);
    this.octDisplayElement.innerText = Number(a).toString(8);
    this.binDisplayElement.innerText = Number(a).toString(2);
  }
  logCalcState() {
    console.log("Was evaluated", this.wasEvaluated);
    console.log("Current expression", this.currExpression);
    console.log("Current number", this.currNumber);
    // console.log("Curr dec number", this.currDecNumber);
    console.log("Current symbol", this.currSymbol);
    // console.log("Old number", this.oldNumber);
    // console.log("Last sign", this.lastSign);
    console.log("");
  }

  init() {
    // any input handler
    const commonInputHandle = (inputKey) => {
      this.handleInput(inputKey);
      this.currDecNumber = parseInt(
          this.currNumber,
          CALCULATION_SYSTEM_TYPES[this.calcSystem].num
      );
      // HANDLE C and CE button as one
      if (this.currNumber === "0") {
        this.clearButtonRef.current.innerText = "C";
      } else {
        this.clearButtonRef.current.innerText = "CE";
      }
      this.logCalcState();
      this.refreshCalcHTML();
    };

    // keyboard buttons click handle
    window.addEventListener("keydown", (ev) => {
      commonInputHandle(ev.key);
    });

    // display buttons click handle
    document.querySelectorAll(".display-button").forEach((button) => {
      button.addEventListener("click", (ev) => {
        commonInputHandle(ev.target.dataset.value);
      });
    });

    // initial random setting highlight
    this.randomSettingRef.current = document.querySelector(".random-setting");
    this.randomSettingRef.current.style.borderBottom = "4px solid var(--blue)";

    // random settings click handle
    document.querySelectorAll(".random-setting").forEach((rs) => {
      rs.addEventListener("click", (ev) => {
        if (this.randomSettingRef.current !== null) {
          this.randomSettingRef.current.style.removeProperty("border-bottom");
        }
        this.randomSettingRef.current = ev.currentTarget;
        this.randomSettingRef.current.style.borderBottom =
          "4px var(--blue) solid";
      });
    });

    // initial numerical system choice
    this.nsButtonToHighlight.current =
      document.querySelector(".ns-select-choice");
    this.nsButtonToHighlight.current.style.borderLeft = "5px solid var(--blue)";

    // numerical system click handle
    this.calcSystemButtonElementsList.forEach((button) => {
      button.addEventListener("click", (ev) => {
        if (this.nsButtonToHighlight.current)
          this.nsButtonToHighlight.current.style.removeProperty("border");

        let target;
        if (ev.target.classList.contains("ns-select-choice") === false) {
          target = ev.target.parentElement;
        } else {
          target = ev.target;
        }

        this.calcSystem = target.dataset.ns;
        this.nsButtonToHighlight.current = target;
        this.nsButtonToHighlight.current.style.borderLeft =
          "5px var(--blue) solid";
        this.currNumber = Number(this.decDisplayElement.innerText).toString(
          CALCULATION_SYSTEM_TYPES[target.dataset.ns].num
        );
        this.refreshCalcHTML();
      });
    });

    // handle negate button
    // TODO problem
    // document.querySelector("#negate").addEventListener("click", (ev) => {
    //   this.currNumber = -this.currNumber;
    //   this.refreshCalcHTML();
    // });

    document
      .querySelector("#button-clear-input")
      .addEventListener("click", (ev) => {
        this.currNumber = "0";
        this.refreshCalcHTML();
      });

    this.refreshCalcHTML();
  }

  // refreshCurrentKey = (key_) => {
  //   document.querySelector("#current-key").innerText = key_;
  // };
  handleInput(key) {
    // this.refreshCurrentKey(key);

    // ----- FUNCTIONS -----
    const handleOld = () => {
      if (this.currExpression === "") {
        // '=' when expression is null means we only have a number inputted without a sign
        if (this.lastSign) {
          this.currExpression =
            this.currNumber + this.lastSign + this.oldNumber;
        } else {
          this.currExpression = this.currNumber;
        }

        // set the current expression to evaluate right after
      } else {
        this.oldNumber = parseInt(
          this.currNumber,
          CALCULATION_SYSTEM_TYPES[this.calcSystem].num
        );
        // if expression is not null, we just append to it, to evaluate right after
        this.currExpression += this.currNumber;
      }
    };
    const sanitizeExpression = () => {
      if (
        this.calcSystem === CALCULATION_SYSTEM_TYPES.hex.short &&
        this.currNumber.slice(1, 2) !== "0x"
      ) {
        this.currNumber = "0x" + this.currNumber;
      } else if (
        this.calcSystem === CALCULATION_SYSTEM_TYPES.bin.short &&
        this.currNumber.slice(1, 2) !== "0b"
      ) {
        this.currNumber = "0b" + this.currNumber;
      } else if (
        this.calcSystem === CALCULATION_SYSTEM_TYPES.oct.short &&
        this.currNumber.slice(1, 2) !== "0o"
      ) {
        this.currNumber = "0o" + this.currNumber;
      }
    };

    // evaluates whatever the expression and then returns translated to current numerical system
    const evaluateExpression = () => {
      console.log("Evaluating", this.currExpression);
      if (
        this.currExpression.indexOf("(") === 0 &&
        this.currExpression.indexOf(")") === -1
      ) {
        return eval(this.currExpression.slice(1)).toString(
          CALCULATION_SYSTEM_TYPES[this.calcSystem].num
        );
      }
      if (
        this.currExpression.lastIndexOf("(") >
        this.currExpression.lastIndexOf(")")
      ) {
        return eval(
          this.currExpression.slice(0, this.currExpression.lastIndexOf("(")) +
            this.currExpression.slice(this.currExpression.lastIndexOf("(") + 1)
        ).toString(CALCULATION_SYSTEM_TYPES[this.calcSystem].num);
      }
      return eval(this.currExpression).toString(
        CALCULATION_SYSTEM_TYPES[this.calcSystem].num
      );
    };
    const checkBP = () => {
      return (
        (this.currExpression.indexOf("(") !== -1 &&
          this.currExpression.indexOf(")") === -1) ||
        (this.currExpression.indexOf("(") !== -1 &&
          this.currExpression.indexOf(")") !== -1 &&
          this.currExpression.lastIndexOf("(") >
            this.currExpression.lastIndexOf(")"))
      );
    };

    // ------ DRIVER CODE ------

    // key is +-
    if (key === "negate") {
      this.currNumber = -this.currNumber;
      return;
    }

    // key is C or CE
    if (key === "c") {
      if (this.clearButtonRef.current.innerText === "CE") {
        this.currNumber = "0";
      } else if (this.clearButtonRef.current.innerText === "C") {
        this.currExpression = "";
        this.currNumber = "0";
      }
      return;
    }

    // key is backspace
    if (key === ALLOWED_KEYS.backspace) {
      if (this.currNumber.length > 1) {
        this.currNumber = this.currNumber.slice(0, -1);
      } else {
        this.currNumber = "0";
      }
      this.refreshCalcHTML();
      return;
    }

    // the key is not allowed for current numerical system
    if (
      !ALLOWED_KEYS[this.calcSystem].includes(key) &&
      key !== ALLOWED_KEYS.backspace
    ) {
      return;
    }

    if ("(".includes(key)) {
      if (
        this.currExpression.indexOf("(") === -1 ||
        (this.currExpression.indexOf("(") !== -1 &&
          this.currExpression.indexOf(")") !== -1 &&
          this.currExpression.lastIndexOf("(") <
            this.currExpression.lastIndexOf(")"))
      ) {
        this.currExpression += "(";
      }
      return;
    }

    // if LAST inputted symbol was a NUMBER (default from start is 0)
    if (NUMBER_FIELD_INPUTS.includes(this.currSymbol)) {
      console.log("Previous symbol was a number");
      this.currSymbol = key;

      // if current inputted key is number
      if (NUMBER_FIELD_INPUTS.includes(this.currSymbol)) {
        console.log("key is a number");
        if (this.wasEvaluated) {
          console.log("was evaluated");
          this.currNumber = key;
          this.wasEvaluated = false;
        } else {
          this.currNumber = this.currNumber += key;
        }
        if (this.currNumber.at(0) === "0")
          // TODO maybe handle with String(Number(number))
          this.currNumber = this.currNumber.slice(1, this.currNumber.length);
      }

      // if current inputted key is an allowed sign (except '='), we evaluate current number or expression
      else if (NUMBER_FIELD_OPERATORS.includes(key)) {
        console.log("Key is some operator");
        sanitizeExpression();
        this.lastSign = this.currSymbol;
        this.currExpression += this.currNumber;
        this.currNumber = evaluateExpression();
        this.currExpression += this.currSymbol;
        this.wasEvaluated = false;
      }

      // if current inputted key is '='
      else if (key === "=") {
        console.log("Key is =");
        sanitizeExpression();
        handleOld();
        const evaluated = evaluateExpression();
        this.currNumber = evaluated;
        this.publishNewEvaluation(this.currExpression + "=" + evaluated);
        this.currSymbol = this.currNumber.at(-1);

        this.currExpression = "";
        this.wasEvaluated = true;
      } else if (")".includes(key)) {
        if (checkBP() === false) return;
        this.wasEvaluated = true;
        this.currExpression += this.currNumber;
        this.currExpression += ")";
        this.currNumber = evaluateExpression();
      }
    }

    // if LAST inputted symbol was a symbol
    else if (NUMBER_FIELD_OPERATORS.includes(this.currSymbol)) {
      console.log("Previous symbol was a sign");
      this.currSymbol = key;

      // if current inputted key is number
      if (NUMBER_FIELD_INPUTS.includes(this.currSymbol)) {
        this.currNumber = key;
      }

      // if current inputted key is an allowed sign (except '=')
      else if (NUMBER_FIELD_OPERATORS.includes(this.currSymbol)) {
        this.lastSign = this.currSymbol;
        this.currExpression = this.currExpression.slice(0, -1) + key;
      }

      // if current inputted key is '='
      else if (key === "=") {
        this.wasEvaluated = true;
        sanitizeExpression();
        handleOld();
        this.currSymbol = this.currNumber.at(-1);
        const evaluated = evaluateExpression();
        this.currNumber = evaluated;
        this.publishNewEvaluation(this.currExpression + "=" + evaluated);
        this.currExpression = "";
      }
      // if LAST symbol was ()
    } else if ("()".includes(this.currSymbol)) {
      this.currSymbol = key;
      console.log("Last was parenthesis");

      // if current inputted key is an allowed sign (except '=')
      if (NUMBER_FIELD_OPERATORS.includes(this.currSymbol)) {
        console.log("a");
        this.lastSign = this.currSymbol;
        this.currExpression += this.currSymbol;
      } else if (key === "=") {
        this.currNumber = evaluateExpression();
        this.currExpression = "";
      }
    }

  }
}

class CalculationsHistory {
  historyElement;
  currentHistoryList = [];

  constructor(historyElement_, clearHistoryElement_) {
    this.historyElement = historyElement_;
    this.clearHistoryElement = clearHistoryElement_;
  }

  init() {
    this.clearHistoryElement.addEventListener("click", () => {
      this.clearHistory();
    });
  }
  renderHistoryElement() {
    this.currentHistoryList.forEach((listEl) => {
      const historyElement = document.createElement("div");
      historyElement.innerText = listEl;
      this.historyElement.appendChild(historyElement);
    });
  }

  appendToHistory(expression) {
    const child = document.createElement("div");
    child.innerText = expression;
    this.historyElement.appendChild(child);
  }

  addHistoryEntry = (expression) => {
    this.currentHistoryList.push(expression);
    this.appendToHistory(expression);
  };

  clearHistory() {
    this.currentHistoryList = [];
    this.historyElement.innerHTML = "";
  }
}

const root = document.querySelector("#root");
const expression = document.querySelector("#expression");
const number = document.querySelector("#number");
const nsButtons = document.querySelectorAll(".ns-select-choice");
const clearButton = document.querySelector("#button-clear-input");
const appHistory = document.querySelector("#history-list");
const clearHistory = document.querySelector("#clear-history");
let calc1 = new Calculator(root, expression, number, nsButtons, clearButton);
let hist1 = new CalculationsHistory(appHistory, clearHistory);
hist1.init();
calc1.subscribe(hist1.addHistoryEntry);
calc1.init();

document
  .querySelector("#history-toggle-button")
  .addEventListener("click", (ev) => {
    document
      .querySelector("#history-container")
      .classList.toggle("hc-invisible");
  });
