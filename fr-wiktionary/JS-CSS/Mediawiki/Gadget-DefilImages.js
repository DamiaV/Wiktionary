/**
 [[Catégorie:JavaScript du Wiktionnaire|DefilImages.js]]
 * Utilisation du modèle Modèle:Images
 */
function toggleImage(group, remindex, shwindex) {
  document.getElementById("ImageGroupsGr" + group + "Im" + remindex).style.display = "none";
  document.getElementById("ImageGroupsGr" + group + "Im" + shwindex).style.display = "inline";
}

function imageGroup() {
  if (document.URL.match(/printable/g)) return;
  var bc = document.getElementById("bodyContent");
  if (!bc) bc = document.getElementById("mw_contentholder");
  if (!bc) return;
  var divs = bc.getElementsByTagName("div");
  var i = 0, j = 0;
  var units, search;
  var currentimage;
  var UnitNode;
  for (i = 0; i < divs.length; i++) {
    if (divs[i].className != "ImageGroup") continue;
    UnitNode = undefined;
    search = divs[i].getElementsByTagName("div");
    for (j = 0; j < search.length; j++) {
      if (search[j].className != "ImageGroupUnits") continue;
      UnitNode = search[j];
      break;
    }
    if (UnitNode == undefined) continue;
    units = Array();
    for (j = 0; j < UnitNode.childNodes.length; j++) {
      var temp = UnitNode.childNodes[j];
      if (temp.className == "center") units.push(temp);
    }
    for (j = 0; j < units.length; j++) {
      currentimage = units[j];
      currentimage.id = "ImageGroupsGr" + i + "Im" + j;
      var imghead = document.createElement("div");
      var leftlink;
      var rightlink;
      if (j != 0) {
        leftlink = document.createElement("a");
        leftlink.href = "javascript:toggleImage(" + i + "," + j + "," + (j - 1) + ");";
        leftlink.innerHTML = "◀";
      }
      else {
        leftlink = document.createElement("span");
        leftlink.innerHTML = " ";
      }
      if (j != units.length - 1) {
        rightlink = document.createElement("a");
        rightlink.href = "javascript:toggleImage(" + i + "," + j + "," + (j + 1) + ");";
        rightlink.innerHTML = "▶";
      }
      else {
        rightlink = document.createElement("span");
        rightlink.innerHTML = " ";
      }
      var comment = document.createElement("tt");
      comment.innerHTML = "(" + (j + 1) + "/" + units.length + ")";
      with (imghead) {
        style.fontSize = "110%";
        style.fontweight = "bold";
        appendChild(leftlink);
        appendChild(comment);
        appendChild(rightlink);
      }
      currentimage.insertBefore(imghead, currentimage.childNodes[0]);
      if (j != 0) currentimage.style.display = "none";
    }
  }
}

jQuery(document).ready(imageGroup);
