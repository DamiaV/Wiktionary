/**
 * Converts the first character in the given string to lower case.
 * @param string {string} The string to convert.
 * @return {string} The converted string.
 */
function toLowerCaseFirst(string) {
  return string.length > 0
      ? string.substring(0, 1).toLowerCase() + string.substring(1, string.length)
      : "";
}

/**
 * Converts the first character in the given string to upper case.
 * @param string {string} The string to convert.
 * @return {string} The converted string.
 */
function toUpperCaseFirst(string) {
  return string.length > 0
      ? string.substring(0, 1).toUpperCase() + string.substring(1, string.length)
      : "";
}

/**
 * Converts an strictly positive (> 0) integer to a Roman numeral.
 * @param n {number} The number to convert.
 * @return {string|null} The Roman numeral for the number
 * or null if the argument is not a strictly positive integer.
 */
function intToRomanNumeral(n) {
  if (n <= 0 || n > 399999) return null;

  n = Math.floor(n);
  const symbols = [
    "I", "V",
    "X", "L",
    "C", "D",
    "M", "ↁ",
    "ↂ", "ↇ",
    "ↈ",
  ];
  let exponent = 0;
  let romanNumeral = "";

  while (n > 0) {
    const digit = n % 10;
    const unit1 = symbols[exponent * 2];
    const unit5 = symbols[exponent * 2 + 1];
    const unit10 = symbols[(exponent + 1) * 2];
    let s = "";

    if (digit !== 0) {
      if (digit <= 3)
        for (let i = 0; i < digit; i++)
          s += unit1;
      else if (digit === 4) s += unit1 + unit5;
      else if (digit === 5) s += unit5;
      else if (5 < digit && digit < 9) {
        s += unit5;
        for (let i = 0; i < digit - 5; i++)
          s += unit1;
      } else s += unit1 + unit10;
    }
    romanNumeral = s + romanNumeral;
    n = Math.floor(n / 10);
    exponent++;
  }

  return romanNumeral;
}

/**
 * Converts a Roman numeral to an integer.
 * @param romanNumeral {string} The Roman numeral to convert.
 * @return {number} The corresponding integer or NaN if the argument is not a Roman numeral.
 */
function romanNumeralToInt(romanNumeral) {
  romanNumeral = romanNumeral.toUpperCase();
  // Check arg is a valid roman numeral
  const regex = /^ↈ{0,3}(ↇ?ↂ{1,3}|ↂ?ↇ|ↂↈ)?(ↁ?M{1,3}|M?ↁ|Mↂ)?(D?C{1,3}|C?D|CM)?(L?X{1,3}|X?L|XC)?(V?I{1,3}|I?V|IX)?$/;
  if (!romanNumeral || !regex.test(romanNumeral)) return NaN;

  const symbolToValue = {
    "I": 1,
    "V": 5,
    "X": 10,
    "L": 50,
    "C": 100,
    "D": 500,
    "M": 1000,
    "ↁ": 5000,
    "ↂ": 10000,
    "ↇ": 50000,
    "ↈ": 100000,
  };

  let n = 0;
  let prevDigit = 0;
  for (let i = 0; i < romanNumeral.length; i++) {
    const digit = symbolToValue[romanNumeral[i]];
    n += digit;
    // Cases: IV, IX, XL, XC, etc.
    if (digit === 5 * prevDigit || digit === 10 * prevDigit)
      n -= 2 * prevDigit;
    prevDigit = digit;
  }

  return n;
}

/**
 * This module defines function to transform text.
 * [[Catégorie:JavaScript du Wiktionnaire|core.text.js]]
 */
module.exports = {
  toLowerCaseFirst,
  toUpperCaseFirst,
  intToRomanNumeral,
  romanNumeralToInt,
};
