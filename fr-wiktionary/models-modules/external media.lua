local m_params = require("Module:paramètres")

local p = {}

local MAX_ARGS_NB = 5
local IMAGE_ARG = "image"
local VIDEO_ARG = "vidéo"
local AUDIO_ARG = "audio"

local ICONS = {
  [IMAGE_ARG] = "Codex icon image color-base.svg",
  [VIDEO_ARG] = "Codex icon play color-base.svg",
  [AUDIO_ARG] = "Codex icon volumeUp color-base.svg",
}

--- Format a media item.
--- @param type string The media type: one of IMAGE_ARG, VIDEO_ARG, or AUDIO_ARG.
--- @param text string The item’s text.
--- @return string The formatted item.
local function formatItem(type, text)
  return mw.ustring.format(
      "\n* [[File:%s|16px|class=skin-invert|alt=image|link=]] <span>%s</span>",
      ICONS[type],
      text
  )
end

--- Generate the external media box.
--- @param args table<string, string> The template’s arguments.
--- @return string The rendered box.
--- @see p.externalMedia_t
local function generateMediaList(args)
  local res = "<div class='external-media-container'>"

  res = res .. "<div class='external-media-title'>'''Médias externes'''</div>"

  if args["définition"] then
    res = res .. mw.ustring.format(
        "<div class='external-media-definition'>''%s''</div>",
        args["définition"]
    )
  end

  local imagesList = ""
  local videosList = ""
  local audiosList = ""
  for i = 1, MAX_ARGS_NB do
    if args[IMAGE_ARG .. i] then
      imagesList = imagesList .. formatItem(IMAGE_ARG, args[IMAGE_ARG .. i])
    end
    if args[VIDEO_ARG .. i] then
      videosList = videosList .. formatItem(VIDEO_ARG, args[VIDEO_ARG .. i])
    end
    if args[AUDIO_ARG .. i] then
      audiosList = audiosList .. formatItem(AUDIO_ARG, args[AUDIO_ARG .. i])
    end
  end
  local list = imagesList .. videosList .. audiosList
  res = res .. list

  if list == "" then
    res = res .. "<span style='color: red'>'''Veuillez ajouter au moins un lien ou retirer ce modèle.'''</span>" ..
        "[[Catégorie:Appels de modèles incorrects:média externe]]"
  end

  res = res .. "</div>"

  return res
end

--- Generate the external media box. If no media is specified,
--- an error message is shown in red and the page is added to
--- [[:Catégorie:Appels de modèles incorrects:média externe]].
--- @param frame frame
---  frame.parent_args["définition"] (string): The number of the associated definition.
---  frame.parent_args["image1" through "image5"] (string): A link to an image.
---  frame.parent_args["vidéo1" through "vidéo5"] (string): A link to a vidéo.
---  frame.parent_args["audio1" through "audio5"] (string): A link to an audio.
--- @return string The rendered box.
function p.externalMedia_t(frame)
  local argDefs = {
    ["définition"] = {},
  }

  for i = 1, MAX_ARGS_NB do
    argDefs[IMAGE_ARG .. i] = {}
    argDefs[VIDEO_ARG .. i] = {}
    argDefs[AUDIO_ARG .. i] = {}
  end

  local args = m_params.process(frame:getParent().args, argDefs)

  return generateMediaList(args)
end

return p
