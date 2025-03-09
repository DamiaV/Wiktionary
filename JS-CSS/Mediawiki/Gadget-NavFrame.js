"use strict";

$(() => {
  /**
   * This function adds a button for collapsing divs with the class NavFrame.
   */
  function createShowHideToggle() {
    const hideText = "Enrouler ▲";
    const showText = "Dérouler ▼";
    const titleHide = "Cliquez ici pour enrouler le cadre";
    const titleShow = "Cliquez ici pour dérouler le cadre";

    if (typeof window.NavigationBarShowDefault === "undefined")
      window.NavigationBarShowDefault = true;

    const $header = $(".NavFrame > .NavContent").prev(".NavHead");
    if (!$header.length) return;

    $header.click(toggle)
        .css("cursor", "pointer")
        .prop("title", titleHide);

    $("<span>", {"class": "NavToggle"})
        .append("[", $("<a>", {
          href: "",
          text: window.NavigationBarShowDefault ? hideText : showText,
          click: toggle
        }), "]")
        .prependTo($header);

    if (!window.NavigationBarShowDefault) {
      $header.prop("title", titleShow)
          .next(".NavContent")
          .css("display", "none");
    }
    // Hide ".NavFrame.collapsed" by default
    $(".NavFrame.collapsed > .NavContent")
        .css("display", "none")
        .prev(".NavHead").prop("title", titleShow)
        .find(".NavToggle > a")
        .text(showText);

    function toggle(e) {
      // Prevent collapsing/expanding for clicks on a link in the header
      if (e.target !== this && e.target.nodeName.toUpperCase() === "A")
        return;
      e.preventDefault();
      e.stopPropagation();

      const $t = $(this);
      const $header = $t.is(".NavHead") ? $t : $t.parents(".NavHead");
      const $content = $header.next().toggle();

      $header.prop("title") === titleShow ? $header.prop("title", titleHide) : $header.prop("title", titleShow);
      $header.find(".NavToggle > a")
          .text($content.css("display") === "none" ? showText : hideText);
    }
  }

  function createSortToggle() {
    const $header = $(".boite.sortable .NavContent").prev(".NavHead");
    if (!$header.length) return;

    $("<span>", {"class": "NavToggle"})
        .append("[", $("<a>", {
          href: "",
          text: "Trier",
          title: "Cliquez ici pour trier la liste",
          click: toggleSort
        }), "]")
        .prependTo($header);

    function toggleSort(e) {
      e.preventDefault();
      e.stopPropagation();

      const $header = $(this).parents(".NavHead");
      const $ul = $header.next(".NavContent").find("ul");
      if (!$ul.length) return;

      const naturalOrder = (a, b) => $(a).text().localeCompare($(b).text());
      const reverseOrder = (a, b) => naturalOrder(b, a)

      $ul.each((_, list) => {
        const $list = $(list);
        if (!$list.data("sorted")) {
          $list.children("li").sort(naturalOrder).appendTo($list);
          $list.data("sorted", true);
        } else {
          $list.children("li").sort(reverseOrder).appendTo($list);
          $list.data("sorted", false);
        }
      });
    }
  }

  createShowHideToggle();
  createSortToggle();
});
