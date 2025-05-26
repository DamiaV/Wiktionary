/**
 * Tests whether the current user belongs to the given group.
 * @param groupname {string} The group’s name.
 * @return {boolean} True if the user belongs to the group.
 */
function isInUsergroup(groupname) {
  /** @type {string[]} */
  return mw.config.get("wgUserGroups").includes(groupname);
}

/**
 * This module defines functions to get information about the current user.
 * [[Catégorie:JavaScript du Wiktionnaire|core.user.js]]
 */
module.exports = {
  isInUsergroup,
};
