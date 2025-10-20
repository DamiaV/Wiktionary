local m_params = require("Module:paramètres")

local p = {}

local LANGS = {
  ["arabe"] = "arabic",
  ["allemand"] = "deutsch",
  ["anglais"] = "english",
  ["catalan"] = "catalan",
  ["espagnol"] = "espanol",
  ["finnois"] = "suomi",
  ["flamand"] = "vlaams",
  ["italien"] = "italiano",
  ["néerlandais"] = "nederlands",
  ["norvégien"] = "norsk",
  ["portugais"] = "portugues",
  ["suédois"] = "svenska",
}

--- @param frame frame
function p.musicalIllustration(frame)
  local langs = {}
  for k, _ in pairs(LANGS) do
    table.insert(langs, k)
  end

  local args = m_params.process(frame:getParent().args, {
    [1] = { required = true },
    [2] = {},
    lang = { enum = { "lilypond", "ABC" }, default = "lilypond" },
    ["lang-notes"] = { enum = langs, default = "italien" },
    brut = { type = m_params.BOOLEAN },
  })

  local tagArgs = {
    lang = args.lang,
    sound = true,
  }
  if args.brut then
    tagArgs.raw = true
  else
    -- "note-language" is incompatible with "raw"
    tagArgs["note-language"] = LANGS[args["lang-notes"]]
  end
  local score = frame:extensionTag("score", args[1], tagArgs)

  return mw.ustring.format([=[
<div class="thumb tright">
<div class="thumbinner">
<div class="illustration-musique">
%s
</div>
<div class="thumbcaption">%s</div>
</div>
</div>
]=], score, args[2])
end

return p
