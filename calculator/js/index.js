import {
  NUMBER_FIELD_INPUTS,
  NUMBER_FIELD_OPERATORS,
  ALLOWED_KEYS,
  CALCULATION_SYSTEM_TYPES,
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

  constructor(
    root_,
    expressionElement_,
    numberElement_,
    calcSystemButtonElementsList_ = null
  ) {
    this.root = root_;
    this.expressionElement = expressionElement_;
    this.numberElement = numberElement_;
    this.calcSystemButtonElementsList = calcSystemButtonElementsList_;
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
    console.log("Curr expr", this.currExpression);
    console.log("Curr number", this.currNumber);
    console.log("Curr dec number", this.currDecNumber);
    console.log("Curr symbol", this.currSymbol);
    console.log("Old number", this.oldNumber);
    console.log("Last sign", this.lastSign);
    console.log("");
  }

  init() {
    this.nsButtonToHighlight.current = document.querySelector("#button-dec");
    this.nsButtonToHighlight.current.style.backgroundColor = "green";

    document.querySelector("#negate").addEventListener("click", (ev) => {
      this.currNumber = -this.currNumber;
      this.refreshCalcHTML();
    });

    document.querySelector("#button-c").addEventListener("click", (ev) => {
      this.currExpression = "";
      this.currNumber = "0";
      this.refreshCalcHTML();
    });

    document.querySelector("#button-ce").addEventListener("click", (ev) => {
      this.currNumber = "0";
      this.refreshCalcHTML();
    });

    window.addEventListener("keydown", (ev) => {
      this.handleInput(ev.key);
      this.logCalcState();
      this.refreshCalcHTML();
    });

    this.calcSystemButtonElementsList.forEach((button) => {
      button.addEventListener("click", (ev) => {
        if (this.nsButtonToHighlight.current)
          this.nsButtonToHighlight.current.style.removeProperty(
            "background-color"
          );
        this.calcSystem = ev.target.dataset.ns;
        this.nsButtonToHighlight.current = ev.target;
        this.nsButtonToHighlight.current.style.backgroundColor = "green";
        this.currNumber = Number(this.decDisplayElement.innerText).toString(
          CALCULATION_SYSTEM_TYPES[ev.target.dataset.ns].num
        );
        this.refreshCalcHTML();
      });
    });
    this.refreshCalcHTML();
  }

  handleInput(key) {
    console.log("FFF");
    const handleOld = () => {
      // fires when '=' inputted,
      // const withOld = this.oldNumber;
      // if (!withOld) {

      console.log(this.oldNumber);
      // }
      if (this.currExpression === "") {
        // '=' when expression is null means we only have a number inputted without a sign
        if (this.lastSign) {
          console.log("HERE");
          this.currExpression =
            this.currNumber + this.lastSign + this.oldNumber;
        } else {
          console.log("HEREEEEEEEE");
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
        this.currNumber.slice(1, 2) !== "0x"
      ) {
        this.currNumber = "0b" + this.currNumber;
      } else if (
        this.calcSystem === CALCULATION_SYSTEM_TYPES.oct.short &&
        this.currNumber.slice(1, 2) !== "0o"
      ) {
        this.currNumber = "0o" + this.currNumber;
      }
    };
    const evaluateExpression = () => {
      return eval(this.currExpression).toString(
        CALCULATION_SYSTEM_TYPES[this.calcSystem].num
      );
    };

    // the key is not allowed for current numerical system
    if (
      !ALLOWED_KEYS[this.calcSystem].includes(key) &&
      key !== ALLOWED_KEYS.backspace
    ) {
      return;
    }

    document.querySelector("#current-key").innerText = key;

    // key was backspace
    if (key === ALLOWED_KEYS.backspace) {
      this.currNumber = this.currNumber.slice(0, -1);
      this.currDecNumber = this.currNumber;
      this.refreshCalcHTML();
      return;
    }

    // if LAST inputted symbol was a NUMBER (default is 0)
    if (NUMBER_FIELD_INPUTS.includes(this.currSymbol)) {
      console.log("Last is number");
      this.currSymbol = key;

      // if current inputted key is number
      if (NUMBER_FIELD_INPUTS.includes(this.currSymbol)) {
        console.log("Input is input");
        if (this.currExpression === "" && this.wasEvaluated) {
          this.currNumber = key;
          this.wasEvaluated = false;
        } else {
          this.currNumber = this.currNumber += key;
        }
        if (this.currNumber.at(0) === "0")
          // TODO maybe handle with String(Number(number))
          this.currNumber = this.currNumber.slice(1, this.currNumber.length);
      }

      // if current inputted key is an allowed sign (except '=')
      else if (NUMBER_FIELD_OPERATORS.includes(this.currSymbol)) {
        console.log("Input is operator");
        sanitizeExpression();
        this.lastSign = this.currSymbol;
        this.currExpression += this.currNumber;

        this.currNumber = evaluateExpression();
        this.currExpression += this.currSymbol;
        this.wasEvaluated = true;
      }

      // if current inputted key is '='
      else if (key === "=") {
        sanitizeExpression();
        handleOld();
        this.currNumber = evaluateExpression();
        console.log(this.currExpression, "EXPRRRR");
        this.currSymbol = this.currNumber.at(-1);
        this.currExpression = "";
        this.wasEvaluated = true;
      } else {
        console.log("Input is nothing");
      }
    }

    // if LAST inputted symbol was a symbol
    else if (NUMBER_FIELD_OPERATORS.includes(this.currSymbol)) {
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
        this.currNumber = evaluateExpression();
        this.currExpression = "";
      }
    }

    this.currDecNumber = parseInt(
      this.currNumber,
      CALCULATION_SYSTEM_TYPES[this.calcSystem].num
    );
  }
}

const root = document.querySelector("#root");
const expression = document.querySelector("#expression");
const number = document.querySelector("#number");
const nsButtons = document.querySelectorAll(".ns-button");
let calc1 = new Calculator(root, expression, number, nsButtons);
calc1.init();
