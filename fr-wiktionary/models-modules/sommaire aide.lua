local m_params = require("Module:paramètres")
local m_table = require("Module:table")

local p = {}

local NOT_SELECTED = "normal"
local SELECTED = "selected"
local BG_SELECTED = "itemActive"

--- Generates a tab or item.
--- @param pageTitle string Title of the page to link to.
--- @param label string Label of the tab/item.
--- @param icon string File name of the icon to display alongside the label. May be nil.
--- @param selectionType string Either NOT_SELECTED, SELECTED or BG_SELECTED.
--- @param colors string A table containing the background and text colors for each selection state.
--- @param flex string CSS flex rules for the tab/item.
--- @return string The wikicode for the tab/item.
local function _tab(pageTitle, label, icon, selectionType, colors, flex)
  local color = colors[selectionType]
  local template = mw.getCurrentFrame():expandTemplate {
    title = "barre colorée",
    args = {
      ["titre-couleur"] = color.fg,
      ["titre-couleur-fond"] = color.bg,
      ["icone"] = icon,
      ["titre"] = label,
      ["lien"] = selectionType ~= SELECTED and pageTitle or "",
      ["centrer"] = "oui",
    }
  }

  return mw.ustring.format('<div style="%s">%s</div>', flex, template)
end

--- Generates the help menu for the given page.
--- @param currentPageTitle string Full page title of the page.
--- @return string The wikicode for the menu.
function p._menu(currentPageTitle)
  local data = mw.loadData("Module:sommaire aide/data")
  local homePage = data.homePage
  local tabs = m_table.items(data.tabs)
  local htmlTabs = {}
  local htmlItems = {}

  local homeLink = _tab(
      homePage.page,
      homePage.title,
      homePage.icon,
      NOT_SELECTED,
      homePage.colors,
      "flex-grow: 1; flex: 1 8 6em;"
  )
  table.insert(htmlTabs, homeLink)

  -- Sort tabs based on index
  table.sort(tabs, function(a, b)
    return a[2].index < b[2].index
  end)

  -- Generate tabs
  for _, tab in ipairs(tabs) do
    local tabPage, tabValue = unpack(tab)
    local tabSelected = currentPageTitle == tabPage
    local oneItemSelected = false

    -- Render items if:
    -- * current page title is same as tab’s
    -- * tabs table has a key for the current page title
    if tabSelected or tabValue.items[currentPageTitle] then
      local items = m_table.items(tabValue.items)
      local subGroups = tabValue.subGroups or {}
      local htmlSubGroups = {}
      local currentSubGroup

      for subGroupTitle, _ in pairs(subGroups) do
        htmlSubGroups[subGroupTitle] = {}
      end

      -- Sort items based on index
      table.sort(items, function(a, b)
        return a[2].index < b[2].index
      end)

      -- Generate items for the current tab
      for _, item in ipairs(items) do
        local itemPage, itemValue = unpack(item)
        local itemSelected = currentPageTitle == itemPage

        local itemHtml = _tab(
            itemPage,
            itemValue.title,
            nil,
            itemSelected and SELECTED or NOT_SELECTED,
            tabValue.colors,
            "flex-basis: 16em; flex-grow: 1;"
        )

        -- No sub-group selected or current item is not in the currently active sub-group
        -- -> fetch the one it belongs to
        if not currentSubGroup or itemValue.index > currentSubGroup[2].to then
          currentSubGroup = nil
          for subGroupTitle, subGroup in pairs(subGroups) do
            if subGroup.from <= itemValue.index and itemValue.index <= subGroup.to then
              currentSubGroup = { subGroupTitle, subGroup }
              break
            end
          end
        end

        if currentSubGroup then
          table.insert(htmlSubGroups[currentSubGroup[1]], itemHtml)
        else
          table.insert(htmlItems, itemHtml)
        end

        if itemSelected then
          oneItemSelected = true
        end
      end

      -- Insert flex clear if item sub-groups are present to display
      -- them below eventual non-grouped items
      if next(htmlSubGroups) then
        table.insert(htmlItems, '<div style="flex-basis: 100%"></div>')
      end
      -- Generate item sub-groups
      for subGroupTitle, subGroupItems in pairs(htmlSubGroups) do
        local subGroupTemplate = [=[
<div style="display: flex; flex-direction: column; flex: 1 1 25em;"><!-- DÉBUT DU CADRE GAUCHE -->
<div style="box-shadow: 0 0 .2em #999999; border-radius: .2em; margin: .5em .5em 1em .5em; padding: .5em 1em .5em 1em; background: #FCFCFC; border-radius: 0 0 .2em .2em; flex: auto;">
'''%s'''
<div style="display: flex; flex-wrap: wrap; flex-direction: row; justify-content: space-between; align-items: flex-start;">
%s
</div>
</div>
</div>]=]
        table.insert(htmlItems, mw.ustring.format(subGroupTemplate, subGroupTitle, table.concat(subGroupItems)))
      end

      -- Insert flex clear after all items for the current tab, in case the current page is in several
      -- tabs at the same time, to clearly separate items from different tabs
      table.insert(htmlItems, '<div style="flex-basis: 100%"></div>')
    end

    local selectionType = NOT_SELECTED
    if oneItemSelected then
      selectionType = BG_SELECTED
    elseif tabSelected then
      selectionType = SELECTED
    end

    local tabHtml = _tab(
        tabPage,
        tabValue.title,
        tabValue.icon,
        selectionType,
        tabValue.colors,
        "flex-grow: 1; flex: 8 1 15em;"
    )
    table.insert(htmlTabs, tabHtml)
  end

  local template = [=[
<div style="display: flex; flex-wrap: wrap; flex-direction: row; justify-content: space-between; align-items: flex-start;">
%s
</div>
<hr/>
<div style="display: flex; flex-wrap: wrap; flex-direction: row; justify-content: space-between; align-items: flex-start;">
%s
</div>
]=]
  return mw.ustring.format(template, table.concat(htmlTabs), table.concat(htmlItems))
end

--- Generates the help menu for the given page.
---  frame.args[1] (string): Full page title of the page.
--- @return string The wikicode for the menu.
function p.menu(frame)
  local currentPageTitle = m_params.process(frame.args, {
    [1] = { required = true }
  })[1]
  return p._menu(currentPageTitle)
end

return p
