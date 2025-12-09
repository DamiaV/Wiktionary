local m_params = require("Module:Paramètres")

local p = {}

local STATES = {
  acreer = -1,
  pointilles = -1,

  acorriger = 1,
  rouge = 1,

  aprobleme = 2,
  violet = 2,

  avalider = 3,
  jaune = 3,

  termine = 4,
  valide = 4,
  vert = 4,
}

--- Format the link to the given book.
--- @param bookName string The book’s name.
--- @param bookNumber string The book’s number.
--- @param state string The state of the least advanced page of the book.
--- @param comment? string An optional comment.
--- @return string #The formatted link.
local function formatLink(bookName, bookNumber, state, comment)
  local link = mw.ustring.format("[[%s|%s]]", bookName, bookNumber)
  local quality = STATES[state]
  local span = mw.html.create("span")
      :addClass("lien-tome")
      :addClass(quality >= 0 and ("quality" .. quality) or "à-créer")
      :wikitext(link)
  if comment then
    span:attr("title", comment)
  end
  return tostring(span)
end

--- @param frame frame
function p.tomeAvancement(frame)
  local states = {}
  for state, _ in pairs(STATES) do
    table.insert(states, state)
  end
  local argsOrError, success = m_params.process(frame:getParent().args, {
    [1] = { required = true, enum = states },
    [2] = { required = true },
    [3] = { required = true },
    [4] = {},
  }, true)

  if not success then
    local message = argsOrError[3]
    return mw.html.create("span")
        :css("color", "var(--color-error)")
        :wikitext(message .. ". Veuillez consulter la documentation de [[Modèle:Tome avancement]] pour plus de détails.")
  end

  local args = argsOrError
  return formatLink(args[2], args[3], args[1], args[4])
end

return p
