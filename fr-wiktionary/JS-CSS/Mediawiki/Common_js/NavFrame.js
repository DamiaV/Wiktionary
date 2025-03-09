/*[[Catégorie:JavaScript du Wiktionnaire|{{SUBPAGENAME}}]]
 <source lang="javascript"> */

/*******************************/
/*   Boîtes déroulantes        */
/*******************************/
// set up the words in your language
var NavigationBarHide = 'Enrouler';
var NavigationBarShow = 'Dérouler';

// hide or show by default
// NavigationBarShowDefault = 0; // all bars will be hidden
// NavigationBarShowDefault = 1; // all bars will be shown
var NavigationBarShowDefault = 1;

// shows and hides content and picture (if available) of navigation bars
// Parameters:
//     indexNavigationBar: the index of navigation bar to be toggled
function toggleNavigationBar(indexNavigationBar) {
  var NavToggle = document.getElementById("NavToggle" + indexNavigationBar);
  var NavFrame = document.getElementById("NavFrame" + indexNavigationBar);

  if (!NavFrame || !NavToggle) {
    return false;
  }

  // if shown now
  if (NavToggle.firstChild.data == NavigationBarHide) {
    for (
        var NavChild = NavFrame.firstChild;
        NavChild != null;
        NavChild = NavChild.nextSibling
    ) {
      if (NavChild.className == 'NavPic') {
        NavChild.style.display = 'none';
      }
      if (NavChild.className == 'NavContent') {
        NavChild.style.display = 'none';
      }
      if (NavChild.className == 'NavToggle') {
        NavChild.firstChild.data = NavigationBarShow;
      }
    }

    // if hidden now
  }
  else if (NavToggle.firstChild.data == NavigationBarShow) {
    for (
        var NavChild = NavFrame.firstChild;
        NavChild != null;
        NavChild = NavChild.nextSibling
    ) {
      if (NavChild.className == 'NavPic') {
        NavChild.style.display = 'block';
      }
      if (NavChild.className == 'NavContent') {
        NavChild.style.display = 'block';
      }
      if (NavChild.className == 'NavToggle') {
        NavChild.firstChild.data = NavigationBarHide;
      }
    }
  }
}

// adds show/hide-button to navigation bars
jQuery(function createNavigationBarToggleButton() {
  var indexNavigationBar = 0;
  // iterate over all <div>-elements
  for (
      var i = 0;
      NavFrame = $(".NavFrame").get(i);
      i++
  ) {
    indexNavigationBar++;
    var NavToggle = document.createElement("a");
    NavToggle.className = 'NavToggle';
    NavToggle.setAttribute('id', 'NavToggle' + indexNavigationBar);
    NavToggle.setAttribute('href', 'javascript:toggleNavigationBar(' + indexNavigationBar + ');');
    var NavToggleText = document.createTextNode(NavigationBarHide);
    NavToggle.appendChild(NavToggleText);

    // add NavToggle-Button as first div-element
    // in <div class="NavFrame">
    NavFrame.insertBefore(
        NavToggle,
        NavFrame.firstChild
    );
    NavFrame.setAttribute('id', 'NavFrame' + indexNavigationBar);

    // Hide in these cases
    if (NavigationBarShowDefault == 0 || NavFrame.hasClass('collapsed')) {
      toggleNavigationBar(i + 1);
    }
  }
});

/*</source>*/
