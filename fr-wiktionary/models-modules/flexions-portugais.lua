local m_params = require("Module:paramètres")
local m_bases = require("Module:bases")

local p = {}

local function pronunciation(pron)
  return mw.getCurrentFrame():expandTemplate { title = "pron", args = { pron, "pt" } }
end

local function formatPron(pron, ref, showOr)
  local res = "<br>"
  if showOr then
    res = res .. "<small>ou</small> "
  end
  res = res .. pronunciation(pron)
  if ref then
    res = res .. mw.getCurrentFrame():expandTemplate { title = "réf", args = { ref } }
  end
  return res .. "\n"
end

local function flexionsTable(title)
  return ""
end

local function invariableTable(
    title, invTitle,
    word, wordVariant,
    sp, mf,
    wordPron1, wordPron2, wordPron3,
    wordPron1Ref, wordPron2Ref, wordPron3Ref,
    wordVariantPron1, wordVariantPron2, wordVariantPron3,
    wordVariantPron1Ref, wordVariantPron2Ref, wordVariantPron3Ref
)
  local res = '{| class="flextable"\n'

  if title then
    res = res .. mw.ustring.format("|+ %s\n", title)
  end

  res = res .. "! "

  if invTitle then
    res = res .. invTitle
  else
    res = res .. (sp and "Singulier et pluriel" or "Invariable")
  end

  if mf then
    res = res .. "<br>masculin et féminin"
  end

  res = res .. mw.ustring.format("\n|-\n| %s\n", m_bases.lien_modele(word))
  if wordPron1 then
    res = res .. formatPron(wordPron1, wordPron1Ref, false)
    if wordPron2 then
      res = res .. formatPron(wordPron2, wordPron2Ref, true)
      if wordPron3 then
        res = res .. formatPron(wordPron3, wordPron3Ref, true)
      end
    end
  end

  if wordVariant then
    res = res .. mw.ustring.format("|-\n| %s\n", m_bases.lien_modele(wordVariant))
    if wordVariantPron1 then
      res = res .. formatPron(wordVariantPron1, wordVariantPron1Ref, false)
      if wordVariantPron2 then
        res = res .. formatPron(wordVariantPron2, wordVariantPron2Ref, true)
        if wordVariantPron3 then
          res = res .. formatPron(wordVariantPron3, wordVariantPron3Ref, true)
        end
      end
    end
  end

  return res .. "|}"
end

function p.flexions(frame)
  return ""
end

function p.inv(frame)
  local args = m_params.process(frame:getParent().args, {
    ["titre"] = {},
    ["inv_titre"] = {},
    ["s"] = { default = mw.title.getCurrentTitle().text },
    ["s2"] = {},
    ["sp"] = {},
    ["mf"] = {},
    [1] = { alias_of = "pron" },
    ["pron"] = {},
    ["pron2"] = {},
    ["pron3"] = {},
    ["réfps"] = {},
    ["réfp2s"] = {},
    ["réfp3s"] = {},
    ["p2s"] = {},
    ["p2s2"] = {},
    ["p2s3"] = {},
    ["réfps2"] = {},
    ["réfp2s2"] = {},
    ["réfp3s2"] = {},
  })

  return invariableTable(
      args.titre, args.inv_titre,
      args.s, args.s2,
      args.sp, args.mf,
      args.pron, args.pron2, args.pron3,
      args["réfps"], args["réfp2s"], args["réfp3s"],
      args.p2s or args.pron, args.p2s2 or args.pron2, args.p2s3 or args.pron3,
      args["réfps2"], args["réfp2s2"], args["réfp3s2"]
  )
end

return p
