// <nowiki>
"use strict";

/**
 * Tests whether the current user belongs to the given group.
 * @param groupname {string} The group’s name.
 * @return {boolean} True if the user belongs to the group.
 */
function isInUsergroup(groupname) {
  return mw.config.get("wgUserGroups").includes(groupname);
}

/**
 * Get the gender of the given user. This function makes a call to the MediaWiki API.
 * @param {mw.Api} api The MediaWiki API instance to use.
 * @param {string?} username The user’s username. If null, the current user’s username will be used.
 * @return {JQuery.Promise<"female" | "male" | "unknown">} A Promise object returning the gender as a string.
 * The string "unknown" will also be returned if the username is invalid.
 */
async function getGender(api, username) {
  const params = {
    action: "query",
    list: "users",
    ususers: username || mw.config.get("wgUserName"),
    usprop: "gender",
    format: "json"
  };

  return api.get(params).then((data) => {
    return data.query.users[0].gender || "unknown";
  });
}

// </nowiki>
/**
 * This module defines functions to get information about the current user.
 * [[Catégorie:JavaScript du Wiktionnaire|!wikt.core.user.js]]
 */
module.exports = {
  isInUsergroup,
  getGender,
};
