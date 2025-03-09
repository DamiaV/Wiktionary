/*
 * [[Catégorie:JavaScript du Wiktionnaire|IntersectionCategorie.js]]
 * Author: w:fr:Phe
 * Utilise http://www.mediawiki.org/wiki/Extension:DynamicPageList_(Wikimedia)
 * pour présenter l’intersection de catégorie aux utilisateurs. L’interface est
 * sur http://fr.wiktionary.org/wiki/Wiktionnaire:Recherche_dans_les_catégories
 * le nom de cette page peut varier, voir la variable special_pagename
 *
 * Localisation: add your lang code to special_pagename, this will be the base
 * pagename, the one where the interface is active. Add to possible_intersection_list
 * the name of the group of category you want, this name define the group name showed
 * in the interface and the subpagename (relative to your special_pagename) containing
 * the list of category available for intersection for this group.
 *
 * Page layout is built on special_pagename and must provide placeholder html
 * element with the following id:
 * root_cat_search: typically the id of a div around all the remaining element
 * input_cat : place of the dropdown menu selecting the cat group
 * input_listbox_cat: place of the category selection listbox
 * input_listbox_nocat: place of the not in category selection listbox
 * submit_button: place of the submit button
 * output_result: place of the query result.
 * next_link1, next_link2, prev_link1, prev_link2: place of previous/next link,
 *   the text of the html element of these fields are kept as it.
 * See the special_pagename for fr in edit mode.
 */
var intersection_categorie = {
  /*
   * TODO :
   *
   * 1) permettre de voir la date d’entrée de chaque page dans la première
   *  catégorie sélectionné ?
   *
   * 2) Suivi des pages liées ne fonctionne pas avec des liens ajoutés
   *  dynamiquement, mais c’est faisable. Mais dans ce cas suivi des pages
   *  liées ne montrera que le suivi des liens pour les liens visibles
   *  sur la page.
   */
  special_pagename: {
    "fr": "Wiktionnaire:Recherche_dans_les_catégories"
  },

  possible_intersection_list: {
    "fr": ["Intersection d’articles"]
  },

  get_special_pagename: function () {
    return this.special_pagename[mw.config.get('wgContentLanguage')];
  },

  get_possible_intersection_list: function () {
    return this.possible_intersection_list[mw.config.get('wgContentLanguage')];
  },

  get_cat_group: function () {
    return this.possible_intersection[$("#dropdown option:selected").text()];
  },

  default_query: function () {
    return {
      nocat: [],
      cat: [],
      count: 200,
      offset: 0
    };
  },

  add_dpl_result_to_page: function (datas) {
    var text = datas.parse.text["*"];
    $("#output_result").html(text);
    this.add_prev_next_link(text.split("<li>").length > 200);
  },

  build_url: function (query) {
    var url = mw.config.get('wgServer') + mw.config.get('wgScriptPath');
    url += "/index.php?title=" + this.get_special_pagename();
    for (var i = 0; i < query.cat.length; ++i)
      url += "&cat=" + encodeURIComponent(query.cat[i]);
    for (var i = 0; i < query.nocat.length; ++i)
      url += "&nocat=" + encodeURIComponent(query.nocat[i]);
    if (query.offset)
      url += "&offset=" + query.offset;
    if (query.count != 200)
      url += "&count=" + query.count;
    return url;
  },

  exec_user_query: function () {
    var query = this.default_query();
    $("#select_cat option:selected").each(function () {
      query.cat.push($(this).text());
    });
    $("#select_nocat option:selected").each(function () {
      query.nocat.push($(this).text());
    });

    if (query.cat.length || query.nocat.length)
      window.location.assign(this.build_url(query));
  },

  build_listbox: function (cat, id) {
    var text = "<select id='" + id + "' size='8' multiple='multiple'>\n";
    for (var i = 0; i < cat.length; ++i)
      text += "<option value='" + i + "'>" + cat[i] + "</option>";
    return text + "</select>";
  },

  build_dpl_query_str: function (query) {
    return "<DynamicPageList>\n"
        + "count = " + (query.count + 1) + "\n"
        + "offset = " + query.offset + "\n"
        + "order = sortkey\n"
        + "shownamespace = false\n"
        + "category = " + query.cat.join("\ncategory = ") + "\n"
        + "notcategory = " + query.nocat.join("\nnotcategory = ") + "\n"
        + "</DynamicPageList>";
  },

  dpl_query: function (query) {
    var query_str = this.build_dpl_query_str(query);
    var url = mw.config.get('wgServer') + mw.config.get('wgScriptPath')
        + "/api.php?action=parse&callback=intersection_categorie.add_dpl_result_to_page"
        + "&format=json&text=" + encodeURIComponent(query_str);
    this.create_script_obj(url)
  },

  create_script_obj: function (url) {
    var scriptObj = document.createElement("script");
    scriptObj.setAttribute("type", "text/javascript");
    scriptObj.setAttribute("src", url);
    document.body.appendChild(scriptObj);
  },

  set_selected: function (cat, possible_cat, id) {
    for (var i = 0; i < cat.length; ++i) {
      for (var j = 0; j < possible_cat.length; ++j) {
        if (cat[i].replace(/_/g, " ") == possible_cat[j])
          $("#" + id + " option[value=" + j + "]").attr("selected", "selected");
      }
    }
  },

  query_from_url: function () {
    var str = location.search;
    var query = this.default_query();

    if (str.charAt[0] = "?")
      str = str.slice(1);
    var params = str.split("&");
    for (var i = 0; i < params.length; ++i) {
      var key_value = params[i].split("=");
      if (key_value.length == 2) {
        if (key_value[0] == "cat")
          query.cat.push(decodeURIComponent(key_value[1]).replace(/_/g, " "));
        else if (key_value[0] == "nocat")
          query.nocat.push(decodeURIComponent(key_value[1]).replace(/_/g, " "));
        else if (key_value[0] == "offset")
          query.offset = Number(key_value[1]);
        else if (key_value[0] == "count")
          query.count = Number(key_value[1]);
      }
    }
    return query;
  },

  exec_query_from_url: function () {
    var query = this.query_from_url();
    if (query.cat.length || query.nocat.length)
      this.dpl_query(query);
  },

  guess_cat_group: function (cat) {
    for (var group in this.possible_intersection) {
      var possible_cat = this.possible_intersection[group];
      for (var i = 0; i < possible_cat.length; ++i) {
        if (cat[0] == possible_cat[i])
          return group;
      }
    }
    return null;
  },

  guess_cat_group_from_url: function () {
    var query = this.query_from_url();
    var result = this.guess_cat_group(query.cat);
    if (!result)
      result = this.guess_cat_group(query.nocat);
    return result ? result : this.get_possible_intersection_list()[0];
  },

  dropdown_change: function () {
    $("#input_listbox_cat").html(this.build_listbox(this.get_cat_group(), "select_cat"));
    $("#input_listbox_nocat").html(this.build_listbox(this.get_cat_group(), "select_nocat"));
    var query = this.query_from_url();
    this.set_selected(query.cat, this.get_cat_group(), "select_cat");
    this.set_selected(query.nocat, this.get_cat_group(), "select_nocat");

    if (query.cat.length || query.nocat.length) {
      var url = this.build_url(query);
      $("#ca-nstab-project > span > a").attr("href", url);
      $("#ca-view > span > a").attr("href", url);
    }
  },

  add_dropdown_list: function () {
    var html = "<select id='dropdown' onchange='intersection_categorie.dropdown_change()'>";
    for (var group in this.possible_intersection)
      html += "\n<option value='" + group + "'>" + group + "</option>";
    html += "\n</select><br />";
    $("#input_cat").html(html);
  },

  add_submit_button: function () {
    $("#submit_button").html("<button type='button' onclick='intersection_categorie.exec_user_query()'>" + $("#submit_button").text() + "</button>");
  },

  add_prev_next_link: function (next) {
    var query = this.query_from_url();
    if (query.offset) {
      var old_offset = query.offset;
      query.offset = Math.max(query.offset - 200, 0);
      var url = this.build_url(query);
      $("#prev_link1").html("<a href='" + url + "'>" + $("#prev_link1").text() + "</a>");
      $("#prev_link2").html("<a href='" + url + "'>" + $("#prev_link2").text() + "</a>");
      query.offset = old_offset;
    }
    if (next) {
      query.offset += 200;
      var url = this.build_url(query);
      $("#next_link1").html("<a href='" + url + "'>" + $("#next_link1").text() + "</a>");
      $("#next_link2").html("<a href='" + url + "'>" + $("#next_link2").text() + "</a>");
    }
  },

  parse_cat_links: function (content) {
    var patt = new RegExp("[[][[]:Category:(.*)]]", "g");
    var result = [];
    while (match = patt.exec(content))
      result.push(match[1]);
    return result;
  },

  fill_listbox: function (data) {
    if (!data.query.pages["-1"]) {
      for (var ids in data.query.pages) {
        var content = data.query.pages[ids].revisions[0]['*'];
        var sub_title = data.query.pages[ids].title.split("/")[1];
        this.possible_intersection[sub_title] = this.parse_cat_links(content);
      }
    }
    $("#dropdown").val(this.guess_cat_group_from_url());
    $("#dropdown").change();
    $("#root_cat_search").css("display", "block");
  },

  read_cat_pages: function (titles) {
    var titles_text = titles.join("|");
    var url = mw.config.get('wgServer') + mw.config.get('wgScriptPath')
        + "/api.php?action=query&prop=revisions"
        + "&callback=intersection_categorie.fill_listbox&rvprop=content"
        + "&format=json&titles=" + titles_text;
    this.create_script_obj(url);
  },

  get_category_data: function () {
    var titles = [];
    for (var idx in this.possible_intersection)
      titles.push(this.get_special_pagename().replace(/_/g, " ") + "/" + idx);

    this.read_cat_pages(titles);
  },

  setup: function () {
    $("#root_cat_search").css("display", "none");
    var list = this.get_possible_intersection_list();
    this.possible_intersection = {};
    for (var i = 0; i < list.length; ++i)
      this.possible_intersection[list[i]] = [];

    $("#output_result").html("");
    this.add_submit_button();
    this.add_dropdown_list();
    this.exec_query_from_url();
    this.get_category_data();
  }
}

if (mw.config.get('wgPageName') == intersection_categorie.get_special_pagename() && mw.config.get('wgAction') == "view")
  intersection_categorie.setup();
