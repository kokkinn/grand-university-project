const NUMBER_FIELD_INPUTS = "1234567890abcdefABCDEF";
const NUMBER_FIELD_OPERATORS = "+-/*%";
const PARENTHESIS = "()"
const COMMON_ALLOWED_KEYS = "+-*/%=()10Cc";
const CALCULATION_SYSTEM_TYPES = {
  hex: { short: "hex", full: "Hexadecimal", num: 16 },
  dec: { short: "dec", full: "Decimal", num: 10 },
  bin: { short: "bin", full: "Binary", num: 2 },
  oct: { short: "oct", full: "Octal", num: 8 },
};
const ALLOWED_KEYS = {
  [CALCULATION_SYSTEM_TYPES.dec.short]: COMMON_ALLOWED_KEYS + "23456789",
  [CALCULATION_SYSTEM_TYPES.hex.short]:
    COMMON_ALLOWED_KEYS + "23456789AaBbCcDdEeFf",
  [CALCULATION_SYSTEM_TYPES.oct.short]: COMMON_ALLOWED_KEYS + "234567",
  [CALCULATION_SYSTEM_TYPES.bin.short]: COMMON_ALLOWED_KEYS,
  backspace: "Backspace",
};
export {
  NUMBER_FIELD_INPUTS,
  NUMBER_FIELD_OPERATORS,
  ALLOWED_KEYS,
  CALCULATION_SYSTEM_TYPES,
    PARENTHESIS
};
