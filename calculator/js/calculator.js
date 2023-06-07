import {
  ALLOWED_KEYS,
  CALCULATION_SYSTEM_TYPES,
  NUMBER_FIELD_INPUTS,
  NUMBER_FIELD_OPERATORS,
} from "./constants.js";

export class Calculator {
  root;
  expressionElement;
  numberElement;
  calcSystem = CALCULATION_SYSTEM_TYPES.dec.short;
  calcSystemButtonElementsList;
  currSymbol = "0"; // to determine what symbol type the last input was
  currNumber = "0";
  currExpression = "";
  lastNumber = 1; // to save a coefficient after an evaluation for later usage
  lastSign;
  wasEvaluated = true;
  nsButtonToHighlight = null;
  currDecNumber = "0";
  hexDisplayElement = document.querySelector("#number-hex");
  binDisplayElement = document.querySelector("#number-bin");
  octDisplayElement = document.querySelector("#number-oct");
  decDisplayElement = document.querySelector("#number-dec");
  evaluationSubscribers = [];
  clearButtonRef = { current: null };
  randomSettingRef = null;

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
    const currentDecNumber = this.currDecNumber;
    this.decDisplayElement.innerText = Number(currentDecNumber).toString(
      CALCULATION_SYSTEM_TYPES.dec.num
    );
    this.hexDisplayElement.innerText = Number(currentDecNumber).toString(
      CALCULATION_SYSTEM_TYPES.hex.num
    );
    this.octDisplayElement.innerText = Number(currentDecNumber).toString(
      CALCULATION_SYSTEM_TYPES.oct.num
    );
    this.binDisplayElement.innerText = Number(currentDecNumber).toString(
      CALCULATION_SYSTEM_TYPES.bin.num
    );
  }
  logCalcState() {
    console.log("Was evaluated", this.wasEvaluated);
    console.log("Current expression", this.currExpression);
    console.log("Current number", this.currNumber);
    // console.log("Curr dec number", this.currDecNumber);
    console.log("Current symbol", this.currSymbol);
    // console.log("Old number", this.lastNumber);
    // console.log("Last sign", this.lastSign);
    console.log("");
  }

  init() {
    const renderDisplayButtonsNS = () => {
      document.querySelectorAll(".display-button").forEach((button) => {
        if (!button.classList.contains("com")) {
          if (button.classList.contains(this.calcSystem)) {
            button.classList.remove("dp-disabled");
          } else {
            button.classList.add("dp-disabled");
          }
        }
      });
    };

    renderDisplayButtonsNS();

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

    // adds blink on click for small screen devices
    if (window.innerWidth < 800) {
      const keyframes = [
        { backgroundColor: "var(--blue)" },
        { backgroundColor: "transparent" },
      ];
      const timing = {
        duration: 50,
        iterations: 1,
      };
      document.querySelectorAll(".display-button").forEach((button) => {
        button.addEventListener("click", (ev) => {
          button.animate(keyframes, timing);
        });
      });
    }

    // initial random setting highlight
    this.randomSettingRef = document.querySelector(".random-setting");
    this.randomSettingRef.style.borderBottom = "4px solid var(--blue)";

    // random settings click handle
    document.querySelectorAll(".random-setting").forEach((rs) => {
      rs.addEventListener("click", (ev) => {
        if (this.randomSettingRef !== null) {
          this.randomSettingRef.style.removeProperty("border-bottom");
        }
        this.randomSettingRef = ev.currentTarget;
        this.randomSettingRef.style.borderBottom = "4px var(--blue) solid";
      });
    });

    // initial numerical system choice
    this.nsButtonToHighlight = document.querySelector(".ns-select-choice");
    this.nsButtonToHighlight.style.borderLeft = "5px solid var(--blue)";

    // numerical system click handle
    this.calcSystemButtonElementsList.forEach((button) => {
      button.addEventListener("click", (ev) => {
        if (this.nsButtonToHighlight)
          this.nsButtonToHighlight.style.removeProperty("border");

        let target;
        if (ev.target.classList.contains("ns-select-choice") === false) {
          target = ev.target.parentElement;
        } else {
          target = ev.target;
        }

        this.calcSystem = target.dataset.ns;
        this.nsButtonToHighlight = target;
        this.nsButtonToHighlight.style.borderLeft = "5px var(--blue) solid";
        this.currNumber = Number(this.decDisplayElement.innerText).toString(
          CALCULATION_SYSTEM_TYPES[target.dataset.ns].num
        );

        renderDisplayButtonsNS();
        this.refreshCalcHTML();
      });
    });

    this.refreshCalcHTML();
  }

  handleInput(key) {
    // TODO bug, for equal sign -x--y gives error
    // TODO more constants

    // ----- FUNCTIONS -----

    // Fires when the input is '=' (equal sign) and builds an expression for evaluating based on lastNumber and lastSign
    //  if there is no current expression, else just appends current number to expression
    const handleOld = () => {
      if (!this.currExpression) {
        if (this.lastSign) {
          this.currExpression =
            this.currNumber +
            this.lastSign +
            Number(this.lastNumber).toString(
              CALCULATION_SYSTEM_TYPES[this.calcSystem].num
            );
        } else {
          this.currExpression = this.currNumber;
        }
      } else {
        this.lastNumber = parseInt(
          this.currNumber,
          CALCULATION_SYSTEM_TYPES[this.calcSystem].num
        );
        this.currExpression += this.currNumber;
      }
    };

    // Fires whenever we need to evaluate something (both on '=' or '+-*/' input). Checks current number for presence of
    // a prefix related to current numerical system. If it is not there, it will be appended to current number.
    const checkNSPrefixForCurrNumber = () => {
      if (
        this.calcSystem === CALCULATION_SYSTEM_TYPES.hex.short &&
        this.currNumber.slice(1, 2) !== CALCULATION_SYSTEM_TYPES.hex.prefix
      ) {
        this.currNumber = CALCULATION_SYSTEM_TYPES.hex.prefix + this.currNumber;
      } else if (
        this.calcSystem === CALCULATION_SYSTEM_TYPES.bin.short &&
        this.currNumber.slice(1, 2) !== CALCULATION_SYSTEM_TYPES.bin.prefix &&
        this.currNumber.indexOf(">>") === -1 &&
        this.currNumber.indexOf("<<") === -1
      ) {
        this.currNumber = CALCULATION_SYSTEM_TYPES.bin.prefix + this.currNumber;
      } else if (
        this.calcSystem === CALCULATION_SYSTEM_TYPES.oct.short &&
        this.currNumber.slice(1, 2) !== CALCULATION_SYSTEM_TYPES.oct.prefix
      ) {
        this.currNumber = CALCULATION_SYSTEM_TYPES.oct.prefix + this.currNumber;
      }
    };

    // evaluates whatever the current expression and then returns the result based on current numerical system
    const evaluateExpression = () => {
      // TODO complex parenthesis analysis
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
      if (
        this.calcSystem === CALCULATION_SYSTEM_TYPES.bin.short &&
        this.currNumber.indexOf(">") !== -1 &&
        this.currNumber.indexOf("<") !== -1
      ) {
        // TODO rework this cringe
        let expression = this.currExpression
          .split("<<")
          .map((ex) => {
            return "0b" + ex;
          })
          .join("<<");
        console.log("A", expression);
        if (expression.split(">>").length > 1) {
          expression = expression
            .split(">>")
            .map((ex) => {
              return "0b" + ex;
            })
            .join(">>");
        }
        console.log(expression);
        this.currExpression = expression;
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
    if (key === "Enter") {
      key = "=";
    }

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
    console.log(key);
    // key is backspace
    if (key === ALLOWED_KEYS.backspace) {
      if (this.currNumber.length > 1) {
        this.currNumber = this.currNumber.slice(0, -1);
      } else {
        this.currSymbol = "0";
        this.currNumber = "0";
      }
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
        if (
          this.currNumber.at(0) === "0" &&
          this.calcSystem !== CALCULATION_SYSTEM_TYPES.bin.short
        )
          // TODO maybe handle with String(Number(number))
          this.currNumber = this.currNumber.slice(1, this.currNumber.length);
      }

      // if current inputted key is an allowed sign (except '='), we evaluate current number or expression
      else if (NUMBER_FIELD_OPERATORS.includes(key)) {
        console.log("Key is some operator");
        checkNSPrefixForCurrNumber();
        this.lastSign = this.currSymbol;
        this.currExpression += this.currNumber;
        this.currNumber = evaluateExpression();
        this.currExpression += this.currSymbol;
        this.wasEvaluated = false;
      }

      // if current inputted key is '='
      else if (key === "=") {
        console.log("Key is =");
        checkNSPrefixForCurrNumber();
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
      if (
          this.currNumber.at(0) === "0" &&
          this.calcSystem !== CALCULATION_SYSTEM_TYPES.bin.short
      )
          // TODO maybe handle with String(Number(number))
        this.currNumber = this.currNumber.slice(1, this.currNumber.length);
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
        checkNSPrefixForCurrNumber();
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
        const evaluated = evaluateExpression();
        this.currNumber = evaluated;
        this.publishNewEvaluation(this.currExpression + "=" + evaluated);
        this.currExpression = "";
      }
    }
  }
}
