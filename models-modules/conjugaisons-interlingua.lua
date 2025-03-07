local m_bases = require("Module:bases")
local m_params = require("Module:paramètres")

local p = {}

local function link(word)
  return m_bases.lien_modele(word, "ia")
end

--- @param infinitive string
--- @param presentForm string
--- @param presentPluralForm string
--- @param pastForm string
--- @return string
local function generateTable(infinitive, presentForm, presentPluralForm, pastForm)
  local root = mw.ustring.sub(infinitive, 1, -3)
  local root2 = mw.ustring.sub(infinitive, 1, -2)
  local vowel = mw.ustring.sub(infinitive, -2, -2)
  local presentParticiple = root .. ({ a = "a", e = "e", i = "ie" })[vowel] .. "nte"
  local pastParticiple = root .. ({ a = "a", e = "i", i = "i" })[vowel] .. "te"

  return mw.ustring.format([=[
{| class="wikitable" style="width: 100%%"
! Infinitif !! Participe présent !! Participe passé
|-
| %s || %s || %s
|}
{|class="wikitable" style="width: 100%%"
|+ Actif
! colspan="5" | Temps simples
|-
! Présent !! Passé !! Futur !! Conditionnel !! Impératif
|-
| %s || %s || %s<br><small>ou</small> va %s || %s<br><small>ou</small> velle %s || %s
|-
! colspan="5" | Temps composés
|-
! Passé composé !! Plus que parfait !! Futur antérieur !! Conditionnel passé !! —
|-
| ha %s || habeva %s || habera %s || haberea %s || —
|}
{|class="wikitable" style="width: 100%%"
|+ Passif
! colspan="5" | Temps simples
|-
! Présent !! Passé !! Futur !! Conditionnel
|-
| es %s || esseva %s || essera %s || esserea %s
|-
! colspan="5" | Temps composés
|-
! Passé composé !! Plus que parfait !! Futur antérieur !! Conditionnel passé
|-
| ha essite %s || habeva essite %s || habera essite %s || haberea essite %s
|}
]=],
      link(infinitive),
      link(presentParticiple),
      link(pastParticiple),
  -- Active simple tenses
      link(presentForm or root2)
          .. (presentPluralForm and ("<br>'''Note&nbsp;:''' Au pluriel, on peut employer " .. link(presentPluralForm)) or ""),
      link(root2 .. "va") .. (pastForm and ("<br><small>ou</small> " .. link(pastForm)) or ""),
      link(root2 .. "ra"),
      link(infinitive),
      link(root2 .. "rea"),
      link(infinitive),
      link(root2),
  -- Active compound tenses
      link(pastParticiple),
      link(pastParticiple),
      link(pastParticiple),
      link(pastParticiple),
  -- Passive simple tenses
      link(pastParticiple),
      link(pastParticiple),
      link(pastParticiple),
      link(pastParticiple),
  -- Passive compound tenses
      link(pastParticiple),
      link(pastParticiple),
      link(pastParticiple),
      link(pastParticiple)
  ) .. m_bases.fait_categorie_contenu("Conjugaison en interlingua")
end

--- Generate the conjugation table for an Interlingua verb.
--- Parameters:
---  parent frame.args[1] (string, optional): Infinitive form, if empty the page’s title will be used.
---  parent frame.args["pr"] (string, optional): Present form, if different from default one.
---  parent frame.args["prp"] (string, optional): Present plural form, if it exists.
---  parent frame.args["ps"] (string, optional): Alternative past tense form, if it exists.
--- @return string The generated table.
function p.conjugaison(frame)
  local args = m_params.process(frame:getParent().args, {
    [1] = {},
    ["pr"] = {},
    ["prp"] = {},
    ["ps"] = {},
  })
  local title = mw.title.getCurrentTitle()
  local verb
  if not args[1] and title.namespace == m_bases.NS_CONJUGAISON.id then
    -- Keep text after first "/"
    verb = mw.ustring.sub(title.text, mw.ustring.find(title.text, "/", 1, true) + 1)
  else
    verb = args[1] or title.text
  end
  if not mw.ustring.find(verb, "[aei]r$") then
    return "<span style='color: red'>Erreur&nbsp;: Le mot ne se termine pas par -ar, -er ou -ir.</span>"
        .. m_bases.fait_categorie_contenu("Appels de modèles incorrects:ia-conj")
  end
  return generateTable(
      verb,
      args["pr"],
      args["prp"],
      args["ps"]
  )
end

return p
