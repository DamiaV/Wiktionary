/**
 * Set a cookie’s value.
 * @param name {string} The cookie’s name.
 * @param value {string} The cookie’s value.
 * @param days {number} The cookies expiration time in days.
 */
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 86400000);
  document.cookie = `${name}=${value}; expires=${date.toGMTString()}; path=/`;
}

/**
 * Get a cookie’s value.
 * @param name {string} The cookie’s name.
 * @return {string|null} The cookie’s value, or `null` if it does not exist.
 */
function getCookie(name) {
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const valueIndex = cookie.indexOf(name + "=");
    if (valueIndex >= 0)
      return cookie.substring(valueIndex + name.length + 1);
  }

  return null;
}

/**
 * Delete a cookie.
 * @param name {string} The cookie’s name.
 */
function deleteCookie(name) {
  setCookie(name, "", -1);
}

/**
 * This module defines functions to manage cookies.
 * [[Catégorie:JavaScript du Wiktionnaire|core.cookies.js]]
 */
module.exports = {
  setCookie,
  getCookie,
  deleteCookie,
};
