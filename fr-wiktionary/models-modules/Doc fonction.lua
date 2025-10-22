local m_params = require("Module:paramètres")

local p = {}

--- @class Param
--- @field tagType string
--- @field name string
--- @field type string
--- @field optional boolean
--- @field doc string

--- @class Alias
--- @field tagType string
--- @field name string
--- @field of string

--- Parse the @param tags present in the given string.
--- @param paramsString string The string to parse.
--- @return table<string, Param | Alias> # A table mapping parameter names to their respective data.
function p.parseParams(paramsString)
    --- @type table<string, Param | Alias>
    local parsedParams = {}

    --- @type string[]
    local lines = mw.text.split(paramsString, "\n", true)

    local currentParamName = ""
    local currentParamOpt = false
    local currentParamType = ""
    local currentParamDoc = ""

    local function newParam()
        if currentParamName ~= "" then
            table.insert(parsedParams, {
                tagType = "param",
                name = currentParamName,
                type = currentParamType,
                optional = currentParamOpt,
                doc = currentParamDoc,
            })
        end
        currentParamName = ""
        currentParamOpt = false
        currentParamType = ""
        currentParamDoc = ""
    end

    for _, line in ipairs(lines) do
        local parts = mw.text.split(line, " +")
        if #parts >= 4 and parts[1] == "@param" then
            newParam()
            currentParamName = parts[2]
            if mw.ustring.sub(currentParamName, -1) == "?" then
                currentParamName = mw.ustring.sub(currentParamName, 1, -2)
                currentParamOpt = true
            end
            currentParamType = parts[3]
            currentParamDoc = table.concat({ unpack(parts, 4) }, " ")
        elseif #parts == 3 and parts[1] == "@alias" then
            newParam()
            table.insert(parsedParams, {
                tagType = "alias",
                name = parts[2],
                of = parts[3]
            })
        elseif currentParamName ~= "" then
            currentParamDoc = currentParamDoc .. " " .. line
        end
    end
    newParam()

    return parsedParams
end

--- Wrap the given Lua code between `<syntaxhighlight>` tags.
--- @param frame frame The current frame object.
--- @param luaCode string The Lua code to highlight.
local function syntaxHighlight(frame, luaCode)
    return frame:extensionTag(
        "syntaxhighlight",
        luaCode,
        { lang = "lua", inline = true }
    )
end

--- Format a parameter’s data into a single string.
--- @param frame frame The current frame object.
--- @param paramData Param | Alias The parameter data to format.
--- @param allowSpaces? boolean If true, underscores in the parameter name will be replaced by spaces.
local function formatParam(frame, paramData, allowSpaces)
    local function t(name)
        return allowSpaces and mw.ustring.gsub(name, "_", " ") or name
    end

    if paramData.tagType == "param" then
        return mw.ustring.format(
            "* <code>%s</code> (%s%s)&nbsp;: %s",
            t(paramData.name),
            syntaxHighlight(frame, paramData.type),
            paramData.optional and ", optionnel" or "",
            paramData.doc
        )
    elseif paramData.tagType == "alias" then
        return mw.ustring.format(
            "* <code>%s</code>&nbsp;: Alias de <code>%s</code>.",
            t(paramData.name),
            t(paramData.of)
        )
    end
end

--- @param frame frame
function p.functionDoc(frame)
    local args = m_params.process(frame:getParent().args, {
        nom = { required = true },
        doc = { required = true },
        params = {},
        ["params-frame"] = {},
        ["params-frame-parente"] = {},
        ["type-retour"] = {},
    })

    if args.params and (args["params-frame"] or args["params-frame-parente"]) then
        error("Les paramètres normaux et de frame ou frame parente sont mutuellement exclusifs")
    end

    local forTemplates = args["params-frame"] or args["params-frame-parente"]
    local paramsData = args.params and p.parseParams(args.params) or {}
    local frameParamsData = args["params-frame"] and p.parseParams(args["params-frame"]) or {}
    local parentFrameParamsData = args["params-frame-parente"] and p.parseParams(args["params-frame-parente"]) or {}
    local formattedParams = {}
    local formattedFrameParams = {}
    local formattedParentFrameParams = {}
    local paramsList = {}
    for _, paramData in pairs(paramsData) do
        table.insert(paramsList, paramData.name)
        table.insert(formattedParams, formatParam(frame, paramData))
    end
    for _, paramData in pairs(frameParamsData) do
        table.insert(formattedFrameParams, formatParam(frame, paramData, true))
    end
    for _, paramData in pairs(parentFrameParamsData) do
        table.insert(formattedParentFrameParams, formatParam(frame, paramData, true))
    end

    -- Title
    local doc = "=== "
    if forTemplates then
        doc = doc .. mw.ustring.format("<code>%s</code>", args.nom)
    else
        doc = doc .. syntaxHighlight(frame, mw.ustring.format("%s(%s)", args.nom, table.concat(paramsList, ", ")))
    end
    doc = doc .. " ==="

    doc = doc .. "\n" .. args.doc

    -- Params
    if forTemplates then
        local hasFrameParams = #formattedFrameParams ~= 0
        local hasParentFrameParams = #formattedParentFrameParams ~= 0
        if hasFrameParams then
            doc = doc .. "\n; Paramètres de " .. syntaxHighlight(frame, "frame.args") .. "\n"
            doc = doc .. table.concat(formattedFrameParams, "\n")
        end
        if hasParentFrameParams then
            doc = doc .. "\n; Paramètres de " .. syntaxHighlight(frame, "frame:getParent().args") .. "\n"
            doc = doc .. table.concat(formattedParentFrameParams, "\n")
        end
        if not hasFrameParams and not hasParentFrameParams then
            doc = doc .. "; Paramètres\n: ''Cette fonction ne comporte aucun paramètre.''"
        end
    else
        doc = doc .. "\n; Paramètres\n"
        if #formattedParams ~= 0 then
            doc = doc .. table.concat(formattedParams, "\n")
        else
            doc = doc .. ": ''Cette fonction ne comporte aucun paramètre.''"
        end
    end

    -- Return type
    if not forTemplates and args["type-retour"] then
        doc = doc .. mw.ustring.format("\n; Type de retour\n: %s", syntaxHighlight(frame, args["type-retour"]))
    end

    return doc
end

return p
