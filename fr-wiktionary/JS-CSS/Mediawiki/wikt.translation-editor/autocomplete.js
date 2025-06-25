"use strict";

/**
 * @typedef {{
 *   source: (term: string) => string[],
 *   minLength: number,
 * }} AutoCompleteOptions
 */

/**
 * Hook an auto-complete feature to the given input.
 * @param input {HTMLInputElement}
 * @param options {AutoCompleteOptions}
 */
function autocomplete(input, options) {
  const minLength = options.minLength || 2;

  let internalUpdate = false;
  let index = -1;

  const list = document.createElement("ul");
  list.classList.add("autocomplete-popup");
  hideList();
  document.body.append(list);

  input.onblur = () => {
    hideList();
  };

  input.onkeydown = (e) => {
    if (list.style.display === "none") return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveListCursor(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveListCursor(-1);
        break;
      case "Enter":
        e.preventDefault();
        input.focus();
        hideList();
        break;
    }
  };

  input.oninput = () => {
    if (internalUpdate) return;

    const value = input.value;
    if (value.length < minLength) {
      hideList();
      return;
    }

    const suggestions = options.source(value);
    if (suggestions.length) {
      clearList();

      for (const suggestion of suggestions) {
        const item = document.createElement("li");
        item.textContent = suggestion;
        item.setAttribute("data-text", suggestion)
        item.onmousedown = () => {
          input.value = suggestion;
          input.focus();
          hideList();
        };
        list.appendChild(item);
      }
      list.style.display = "block";
      const { top, left, height } = getOffset(input);
      list.style.top = (top + height) + "px";
      list.style.left = left + "px";
    } else hideList();
  };

  function moveListCursor(dir) {
    const nextIndex = index + dir;
    if (dir === 0 || dir > 0 && nextIndex >= list.length || dir < 0 && nextIndex < 0) return;

    if (index !== -1) list.children[index].classList.remove("active");
    internalUpdate = true;
    input.value = list.children[nextIndex].getAttribute("data-text");
    internalUpdate = false;
    list.children[nextIndex].classList.add("active");
    index = nextIndex;
  }

  function hideList() {
    list.style.display = "none";
    index = -1;
    clearList();
  }

  function clearList() {
    while (list.firstChild) list.removeChild(list.firstChild);
  }

}

/**
 * @param element {HTMLElement}
 * @returns {{top: number, left: number, width: number, height: number}}
 */
function getOffset(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
  };
}

module.exports = { autocomplete };
