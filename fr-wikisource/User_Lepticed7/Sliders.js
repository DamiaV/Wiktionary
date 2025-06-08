const observer = new MutationObserver(() => {
  waitForCanvas();
});
observer.observe(document.getElementById("bodyContent"), { childList: true, subtree: true });

waitForCanvas();

function waitForCanvas() {
  const canvas = document.querySelector("canvas");
  if (canvas) {
    observer.disconnect();
    init(canvas);
  }
}

/**
 * @param canvas {HTMLCanvasElement}
 */
function init(canvas) {
  /** @type {Record<string, [number, number, number]>} */
  const slidersValues = {
    // min, max, default value
    brightness: [0, 200, 100],
    contrast: [0, 200, 100],
    grayscale: [0, 100, 0],
    invert: [0, 100, 0],
    saturate: [0, 500, 100],
    sepia: [0, 100, 0]
  };

  /** @type {Record<string, [JQuery<HTMLInputElement>, JQuery<HTMLInputElement>]>} */
  const sliders = {};
  const $table = $("<table style='text-align: center; margin: 0.5em auto'>");
  const $nameRow = $("<tr>");
  const $sliderRow = $("<tr>");
  const $valueRow = $("<tr>");
  const $resetButton = $("<button type='button'>Reset</button>");

  $table.append($nameRow, $sliderRow, $valueRow);
  $("#editform").before($table);
  $table.after($("<div style='text-align: center'>").append($resetButton));

  for (const [name, [min, max, defaultValue]] of Object.entries(slidersValues)) {
    const $slider = $(`<input type="range" id="slider_${name}" min="${min}" max="${max}" value="${defaultValue}">`);
    const $input = $(`<input type="number" name="${name}" min="${min}" max="${max}">`);
    $slider.on("input", updateFilters);
    $input.on("change", onNumberUpdate);
    $nameRow.append(`<th style="padding: 0 0.8em"><label for="slider_${name}">${name}</label></th>`);
    $sliderRow.append($("<td style='padding: 0 0.8em'>").append($slider));
    $valueRow.append($("<td style='padding: 0 0.8em'>").append($input));
    sliders[name] = [$slider, $input];
  }

  $resetButton.on("click", resetFilters);

  const context2d = canvas.getContext("2d");

  function updateFilters() {
    let filter = "";

    for (const [name, [$slider, $input]] of Object.entries(sliders)) {
      const value = $slider.val();
      filter += `${name}(${value / 100}) `;
      $input.val(value);
    }
    context2d.filter = filter;
    mw.proofreadpage.openseadragon.viewer.forceRedraw();
  }

  /**
   * @param e {JQuery.ChangeEvent<HTMLInputElement, any, HTMLInputElement, HTMLInputElement>}
   */
  function onNumberUpdate(e) {
    const target = e.target;
    sliders[target.name][0].val(target.value);
    updateFilters();
  }

  function resetFilters() {
    for (const [name, [$slider, $input]] of Object.entries(sliders)) {
      const value = slidersValues[name][2];
      $slider.val(value);
      $input.val(value);
    }
    updateFilters();
  }

  updateFilters();
}
