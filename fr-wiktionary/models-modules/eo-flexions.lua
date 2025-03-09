local m_bases = require('Module:bases')
local m_pron = require('Module:prononciation')

local p = {}

-- Calcule la forme nominative singulière d'un nom ou d'un adjectif
function p.get_ns(word)
  return mw.ustring.match(word, '^(.+[oau])j?n?$')
end

-- Ajoute la terminaison au radical.
-- Prend en charge les locutions
function p.conjugator(word, term, args)
  local t = {}
  if args['dern'] then
    return word .. term
  end
  for str in mw.ustring.gmatch(word, '([^ ]+)') do
    t[#t + 1] = str .. term
  end
  return table.concat(t, ' ')
end

-- Calcule les flexions, puis retourne un tableau
function p.get_forms(name, args)
  local forms = {
    ['sing_nom'] = '',
    ['plur_nom'] = '',
    ['sing_acc'] = '',
    ['plur_acc'] = ''
  }

  if name == nil or name == '' then
    return forms
  end

  name = p.get_ns(name) or args['name'] or args['ns'] or mw.title.getCurrentTitle().text
  forms.sing_nom = name
  forms.plur_nom = args[2] or p.conjugator(name, 'j', args)
  forms.sing_acc = args[3] or p.conjugator(name, 'n', args)
  forms.plur_acc = args[4] or p.conjugator(name, 'jn', args)

  return forms
end

-- Calcule les prononciations, puis retourne un tableau
function p.get_pronunciations(args)
  local prons = {
    ['sing_nom'] = '',
    ['plur_nom'] = '',
    ['sing_acc'] = '',
    ['plur_acc'] = ''
  }
  local pron = args[1] or args['pron'] or args['pron1'] or ''

  if pron == nil or pron == '' then
    return prons
  end

  pron = p.get_ns(pron)
  prons.sing_nom = args['pron1'] or pron
  prons.plur_nom = args['pron2'] or p.conjugator(pron, 'j', args)
  prons.sing_acc = args['pron3'] or p.conjugator(pron, 'n', args)
  prons.plur_acc = args['pron4'] or p.conjugator(pron, 'jn', args)

  return prons
end

function p.make_table(name, forms, pron_forms, args)
  local t = {}
  local last_letter = mw.ustring.sub(name, -1)

  local categories = ""

  table.insert(t, "{| class=\"flextable flextable-eo\"\n" ..
      "! Cas\n")
  if not args['plur'] then
    table.insert(t, "! Singulier\n")
  end
  if not args['sing'] then
    table.insert(t, "! Pluriel\n")
  end
  table.insert(t, "|-\n" ..
      "! Nominatif\n")
  if not args['plur'] then
    table.insert(t, "| class=\"sing_nom\" | " .. m_bases.lien_modele(forms.sing_nom, 'eo') .. "<br>" .. m_pron.lua_pron({ pron_forms.sing_nom }, 'eo') .. "\n")
  end
  if not args['sing'] then
    table.insert(t, "| class=\"plur_nom\" | " .. m_bases.lien_modele(forms.plur_nom, 'eo') .. "<br>" .. m_pron.lua_pron({ pron_forms.plur_nom }, 'eo') .. "\n")
    if not m_bases.page_existe(forms.plur_nom) and (last_letter == "a" or last_letter == "o") then
      categories = categories .. "[[Catégorie:Wiktionnaire:Nominatifs pluriels manquants en espéranto]]"
    end
  end
  table.insert(t, "|-\n")
  if args['dir'] then
    table.insert(t, "! Accusatif<br>(''direction'')\n")
  elseif args['dir+'] then
    table.insert(t, "! Accusatif<br>(''+ direction'')\n")
  else
    table.insert(t, "! Accusatif\n")
  end
  if not args['plur'] then
    table.insert(t, "| class=\"sing_acc\" | " .. m_bases.lien_modele(forms.sing_acc, 'eo') .. "<br>" .. m_pron.lua_pron({ pron_forms.sing_acc }, 'eo') .. "\n")
    if not m_bases.page_existe(forms.sing_acc) and (last_letter == "a" or last_letter == "o") then
      categories = categories .. "[[Catégorie:Wiktionnaire:Accusatifs singuliers manquants en espéranto]]"
    end
  end
  if not args['sing'] then
    table.insert(t, "| class=\"plur_acc\" | " .. m_bases.lien_modele(forms.plur_acc, 'eo') .. "<br>" .. m_pron.lua_pron({ pron_forms.plur_acc }, 'eo') .. "\n")
    if not m_bases.page_existe(forms.plur_acc) and (last_letter == "a" or last_letter == "o") then
      categories = categories .. "[[Catégorie:Wiktionnaire:Accusatifs pluriels manquants en espéranto]]"
    end
  end
  table.insert(t, "|}")

  return table.concat(t) .. categories
end

function p.declinaison(frame)
  local args = frame:getParent().args
  local name = args['name'] or args['ns'] or args['n'] or mw.title.getCurrentTitle().text

  local forms = p.get_forms(name, args)
  local pron_forms = p.get_pronunciations(args)

  return p.make_table(name, forms, pron_forms, args)
end

function p.getTenseAndRoot(verb)
  if verb:sub(-mw.ustring.len("i")) == "i" then
    return verb, "Infinitif"
  elseif verb:sub(-mw.ustring.len("as")) == "as" then
    return mw.ustring.match(verb, '^(.+)as$') .. "i", "Présent de l’indicatif"
  elseif verb:sub(-mw.ustring.len("is")) == "is" then
    return mw.ustring.match(verb, '^(.+)is$') .. "i", "Passé de l’indicatif"
  elseif verb:sub(-mw.ustring.len("os")) == "os" then
    return mw.ustring.match(verb, '^(.+)os$') .. "i", "Futur de l’indicatif"
  elseif verb:sub(-mw.ustring.len("us")) == "us" then
    return mw.ustring.match(verb, '^(.+)us$') .. "i", "Conditionnel"
  elseif verb:sub(-mw.ustring.len("u")) == "u" then
    return mw.ustring.match(verb, '^(.+)u$') .. "i", "Volitif"
  elseif verb:sub(-mw.ustring.len("inta")) == "inta" then
    return mw.ustring.match(verb, '^(.+)inta$') .. "i", "Participe actif passé"
  elseif verb:sub(-mw.ustring.len("anta")) == "anta" then
    return mw.ustring.match(verb, '^(.+)anta$') .. "i", "Participe actif présent"
  elseif verb:sub(-mw.ustring.len("onta")) == "onta" then
    return mw.ustring.match(verb, '^(.+)onta$') .. "i", "Participe actif futur"
  elseif verb:sub(-mw.ustring.len("ita")) == "ita" then
    return mw.ustring.match(verb, '^(.+)ita$') .. "i", "Participe passif passé"
  elseif verb:sub(-mw.ustring.len("ata")) == "ata" then
    return mw.ustring.match(verb, '^(.+)ata$') .. "i", "Participe passif présent"
  elseif verb:sub(-mw.ustring.len("ota")) == "ota" then
    return mw.ustring.match(verb, '^(.+)ota$') .. "i", "Participe passif futur"
  else
    error("Unknown verb tense")
  end
end

function p.verbe(frame)
  local args = frame:getParent().args
  local verb = args['verb'] or mw.title.getCurrentTitle().text
  local label = args['label'] or mw.title.getCurrentTitle().text
  local root, tense = p.getTenseAndRoot(verb)

  local cat = ""

  if not m_bases.page_existe("Conjugaison:espéranto/" .. root) and mw.ustring.sub(verb, -1) == "i" then
    cat = "[[Catégorie:Wiktionnaire:Conjugaisons manquantes en espéranto]]"
  end

  return "{| class=\"flextable\"\n" ..
      "! colspan=\"2\"|<small>[[Conjugaison:espéranto/" .. root .. "|Voir la conjugaison du verbe ''" .. root .. "'']]</small>\n" ..
      "|-\n" ..
      "| style=\"font-variant:small-caps;text-align:center;vertical-align:top\"|" .. tense .. "\n" ..
      "| " .. label .. "\n" ..
      "|}" .. cat
end

return p
