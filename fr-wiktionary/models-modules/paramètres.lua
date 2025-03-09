local m_table = require("Module:table")

local p = {}

-- Types
p.NUMBER = "number"
p.INT = "int"
p.FLOAT = "float"
p.BOOLEAN = "boolean"

-- Constantes d’erreur
p.UNKNOWN_PARAM = "unknown parameter"
p.MISSING_PARAM = "missing required parameter"
p.EMPTY_PARAM = "empty required parameter"
p.INVALID_VALUE = "invalid value"
p.VALUE_NOT_IN_ENUM = "value not in enum"
p.INVALID_TYPE = "invalid type"
p.ALIAS_TO_UNKNOWN = "alias to undefined parameter"
p.ALIAS_TO_ALIAS = "alias to alias parameter"
p.ALIAS_TO_ITSELF = "alias to itself"
p.ENUM_WITH_CHECKER = "enum with checker"
p.ENUM_INVALID_VALUE = "invalid enum values"

--- Liste des erreurs non masquées par le mode silencieux.
local UNCATCHABLE_ERRORS = {
  p.INVALID_TYPE,
  p.ALIAS_TO_UNKNOWN,
  p.ALIAS_TO_ALIAS,
  p.ALIAS_TO_ITSELF,
  p.ENUM_WITH_CHECKER,
  p.ENUM_INVALID_VALUE,
}

--- Liste des templates de messages d’erreur.
local ERROR_MESSAGES = {
  [p.UNKNOWN_PARAM] = "Paramètre « %s » inconnu",
  [p.MISSING_PARAM] = "Paramètre requis « %s » absent",
  [p.EMPTY_PARAM] = "Paramètre requis « %s » vide",
  [p.INVALID_VALUE] = 'Valeur invalide pour le paramètre « %s » ("%s") de type %s',
  [p.VALUE_NOT_IN_ENUM] = 'Valeur invalide pour le paramètre « %s » ("%s")',
  [p.INVALID_TYPE] = 'Type inconnu pour le paramètre « %s » ("%s")',
  [p.ALIAS_TO_UNKNOWN] = 'Paramètre « %s », alias vers un paramètre non défini « %s »',
  [p.ALIAS_TO_ALIAS] = 'Paramètre « %s », alias vers un autre alias (« %s »)',
  [p.ALIAS_TO_ITSELF] = 'Paramètre « %s », alias vers lui-même',
  [p.ENUM_WITH_CHECKER] = "Le paramètre « %s » est une énumération avec une précondition",
  [p.ENUM_INVALID_VALUE] = 'Valeur énumérée invalide pour le paramètre « %s » ("%s") de type %s',
}

--- Construit l’objet d’erreur.
--- @param errorType string Le type de l’erreur.
--- @vararg any Les données pour formater le message d’erreur.
--- @return table Un objet contenant le type d’erreur à l’indice "error_type" et les autres données à l’indice "error_data".
local function buildErrorMessage(errorType, ...)
  return {
    errorType = errorType,
    errorData = { ... }
  }
end

--- Convertit une chaine en booléen.
--- true = "1", "oui" ou "vrai"
--- false = "0", "non" ou "faux"
--- @param argValue string La valeur à convertir.
--- @param argName string Le nom de l’argument correspondant à la valeur.
--- @param frTypeName string Le type attendu en français.
--- @return boolean La valeur booléenne du premier argument.
local function toBoolean(argValue, argName, frTypeName, errorType)
  if m_table.contains({ "1", "oui", "vrai" }, argValue) then
    return true
  elseif m_table.contains({ "0", "non", "faux" }, argValue) then
    return false
  else
    error(buildErrorMessage(errorType, argName, argValue, frTypeName))
  end
end

--- Convertit une chaine en nombre.
--- @param argValue string La valeur à convertir.
--- @param argName string Le nom de l’argument correspondant à la valeur.
--- @param toInt boolean Indique si le nombre doit être un entier.
--- @param frTypeName string Le type attendu en français.
--- @return number La valeur numérique du premier argument.
local function toNumber(argValue, argName, toInt, frTypeName, errorType)
  local val = tonumber(argValue)

  if val ~= nil then
    if not toInt or toInt and val == math.floor(val) then
      return val
    end
  end

  error(buildErrorMessage(errorType, argName, argValue, frTypeName))
end

local function getValue(expectedType, rawValue, argName, errorType)
  local value, frTypeName

  -- Vérification des types des arguments.
  if expectedType == nil then
    frTypeName = "chaine"
    if type(rawValue) ~= "string" then
      error(buildErrorMessage(errorType, argName, rawValue, frTypeName))
    end
    value = rawValue
  elseif expectedType == p.NUMBER then
    frTypeName = "nombre"
    value = toNumber(rawValue, argName, false, frTypeName, errorType)
  elseif expectedType == p.INT then
    frTypeName = "entier"
    value = toNumber(rawValue, argName, true, frTypeName, errorType)
  elseif expectedType == p.FLOAT then
    frTypeName = "flottant"
    value = toNumber(rawValue, argName, false, frTypeName, errorType)
  elseif expectedType == p.BOOLEAN then
    frTypeName = "booléen"
    value = toBoolean(rawValue, argName, frTypeName, errorType)
  end

  return value, frTypeName
end

--- Vérifie la validité des définitions des paramètres.
--- @param definedParameters table La définition des paramètres.
local function checkParametersDefinitions(definedParameters)
  local validTypes = { p.BOOLEAN, p.NUMBER, p.INT, p.FLOAT }

  for paramName, paramValue in pairs(definedParameters) do
    if paramValue.type and not m_table.contains(validTypes, paramValue.type) then
      error(buildErrorMessage(p.INVALID_TYPE, paramName, paramValue.type))
    end
    if paramValue.enum then
      if paramValue.checker then
        error(buildErrorMessage(p.ENUM_WITH_CHECKER, paramName))
      else
        for _, enumValue in ipairs(paramValue.enum) do
          -- Vérification du type de la valeur.
          getValue(paramValue.type, enumValue, paramName, p.ENUM_INVALID_VALUE)
        end
      end
    end

    if paramValue.alias_of then
      local alias = paramValue.alias_of

      if not definedParameters[alias] then
        error(buildErrorMessage(p.ALIAS_TO_UNKNOWN, paramName, paramValue.alias_of))
      elseif alias == paramName then
        error(buildErrorMessage(p.ALIAS_TO_ITSELF, paramName))
      elseif definedParameters[alias].alias_of then
        error(buildErrorMessage(p.ALIAS_TO_ALIAS, paramName, paramValue.alias_of))
      end
    end
  end
end

--- Extrait la clé de l’argument donné après avoir résolu l’alias éventuel.
--- @param param table La définition du paramètre.
--- @param processedArgs table Les paramètres en cours de traitement.
--- @param argName string Le nom du paramètre.
--- @param processedArgs table La définition des paramètres.
--- @return string|nil,table|nil Le nom du paramètre à utiliser et le paramètre réel ou nil si le paramètre
---                              est un alias dont l’argument de base a déjà une valeur.
local function extractArgumentKey(param, processedArgs, argName, definedParameters)
  local key
  local outParam

  if param.alias_of then
    -- L’alias n’écrase pas la valeur du paramètre de base.
    if not processedArgs[param.alias_of] then
      key = param.alias_of
      outParam = definedParameters[param.alias_of]
    end
  else
    key = argName
    outParam = param
  end

  return key, outParam
end

--- Extrait la valeur de l’argument donné.
--- @param param table La définition du paramètre.
--- @param key string Le nom de l’argument après résolution de l’alias.
--- @param argName string Le nom de l’argument de base.
--- @param processedArgs table Les arguments en cours de traitement.
local function extractArgumentValue(param, key, argName, argValue, processedArgs)
  if argValue then
    argValue = mw.text.trim(argValue)
  end

  if argValue == "" then
    -- Un paramètre requis vide doit avoir la propriété allow_empty à true
    -- pour ne pas lancer d’erreur.
    if param.required and param.allow_empty or not param.required then
      argValue = nil
      processedArgs[key] = nil
    else
      error(buildErrorMessage(p.EMPTY_PARAM, argName))
    end
  end

  if argValue then
    -- Récupération de la valeur après transtypage éventuel.
    local value, frTypeName = getValue(param.type, argValue, argName, p.INVALID_VALUE)
    -- Vérification des contraintes d’énumération ou de la précondition.
    if type(param.enum) == "table" and not m_table.contains(param.enum, value) then
      error(buildErrorMessage(p.VALUE_NOT_IN_ENUM, argName, value))
    elseif type(param.checker) == "function" and not param.checker(value) then
      error(buildErrorMessage(p.INVALID_VALUE, argName, value, frTypeName))
    end
    processedArgs[key] = value
  end
end

--- Traite les arguments.
--- @param args table Les arguments à traiter.
--- @param definedParameters table La définition des paramètres.
--- @return table Les arguments traités.
local function parseArguments(args, definedParameters)
  local processedArgs = {}

  for argName, argValue in pairs(args) do
    local param = definedParameters[argName]

    if param then
      local key, actualParam = extractArgumentKey(param, processedArgs, argName, definedParameters)
      if key then
        extractArgumentValue(actualParam, key, argName, argValue, processedArgs)
      end
    else
      -- Les paramètres non définis lancent une erreur.
      error(buildErrorMessage(p.UNKNOWN_PARAM, argName))
    end
  end

  return processedArgs
end

--- Vérifie que les paramètre requis sont effectivement renseignés.
--- @param processedArgs table Les arguments retournés par la fonction parse_args.
--- @param definedParameters table La définition des paramètres.
local function checkRequiredParameters(processedArgs, definedParameters)
  for paramName, paramValue in pairs(definedParameters) do
    if processedArgs[paramName] == nil and paramValue.alias_of == nil then
      if paramValue.required and not paramValue.allow_empty then
        error(buildErrorMessage(p.MISSING_PARAM, paramName))
      elseif paramValue.default ~= nil then
        processedArgs[paramName] = paramValue.default
      end
    end
  end
end

--- Fonction permettant de traiter les arguments du module appelant.
--- Pour plus de détails, voir la documentation du module.
--- @param args table Les arguments du module appelant.
--- @param definedParameters table Les paramètres définis.
--- @param silentErrors boolean Si true, les paramètres problématiques sont retournés au lieu de lancer une erreur ; ne devrait être utilisé que dans le cas où un comportement précis est nécessaire.
--- @return table|string|number,boolean Une table contenant les paramètres traités ou le nom du paramètre ayant déclanché une erreur et un booléen indiquant le statut.
function p.process(args, definedParameters, silentErrors)
  local success, result = pcall(function()
    checkParametersDefinitions(definedParameters)
    local processedArgs = parseArguments(args, definedParameters)
    checkRequiredParameters(processedArgs, definedParameters)
    return processedArgs
  end)

  if not success then
    local errorType = result.errorType
    local errorData = result.errorData
    local errorMessage = mw.ustring.format(ERROR_MESSAGES[errorType], unpack(errorData))

    if silentErrors and not m_table.contains(UNCATCHABLE_ERRORS, errorType) then
      local argName = errorData[1]
      local argValue = type(argName) == "number" and tonumber(argName) or argName

      return { argValue, errorType, errorMessage }, false

      -- Ajout d’une mention pour les erreurs internes.
    elseif m_table.contains(UNCATCHABLE_ERRORS, errorType) then
      errorMessage = "Erreur interne : " .. errorMessage
    end
    -- Suppression de la trace de l’erreur, on garde juste le message.
    error(errorMessage, 0)
  end

  return result, true
end

return p
