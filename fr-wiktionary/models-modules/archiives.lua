local m_params = require("Module:paramètres")
local m_date = require('Module:Date')

local p = {}

--- Generate the table or list for the given start and end years.
--- @param pageName string The name of the bage page for each link.
--- @param startYear number The starting year.
--- @param endYear number The ending year.
--- @param separator string The separator to use.
--- @return string The generated wikicode.
local function generateYearTable(pageName, startYear, endYear, separator)
  local result = ""
  if separator == "||" then
    result = '{| class="wikitable" style="margin: 0.5em auto"\n|'
  elseif separator == "image" then
    result = "<div>"
  end

  local items = {}
  for year = startYear, endYear do
    local targetPage = pageName .. "/" .. year
    local text = separator == "<br>" and targetPage or tostring(year)
    if separator == "image" then
      table.insert(items, mw.ustring.format(
          '<span style="margin: 0.5em; display: inline-block">' ..
              '[[Image:Breathe-document-save.svg|30px|link=%s]]<br>[[%s|%s]]</span>',
          targetPage,
          targetPage,
          text
      ))
    else
      table.insert(items, mw.ustring.format("[[%s|%s]]", targetPage, text))
    end
  end

  result = result .. table.concat(items, separator == "image" and "" or (separator .. " "))
  if separator == "||" then
    result = result .. "\n|}\n"
  elseif separator == "image" then
    result = result .. "</div>\n"
    separator = ""
  end

  return result
end

--- Generate the table or list for the given start and end dates.
--- @param timeUnit string Either "mois" for months or "semaine" for weeks
--- @param pageName string The name of the bage page for each link.
--- @param startDate number The starting date.
--- @param endDate number The ending date.
--- @param separator string The separator to use.
--- @param format string Either "nom" for month names, "abréviation" for abbreviated month names, or "numéro" for month numbers.
--- @return string The generated wikicode.
local function generatePeriodTable(timeUnit, pageName, startDate, endDate, separator, format)
  local startYear, periodStart
  if mw.ustring.find(startDate, "%-") then
    local y = mw.ustring.gsub(startDate, "(%d+)%-(%d+)", "%1")
    startYear = tonumber(y)
    local m = mw.ustring.gsub(startDate, "(%d+)%-(%d+)", "%2")
    periodStart = tonumber(m)
  else
    startYear = tonumber(startDate)
    periodStart = 1
  end

  local endYear, periodEnd
  if mw.ustring.find(endDate, "%-") then
    local y = mw.ustring.gsub(endDate, "(%d+)%-(%d+)", "%1")
    endYear = tonumber(y)
    local m = mw.ustring.gsub(endDate, "(%d+)%-(%d+)", "%2")
    periodEnd = tonumber(m)
  else
    endYear = tonumber(endDate)
    if timeUnit == "week" then
      periodEnd = tonumber(os.date("%W"))
    else
      periodEnd = tonumber(os.date("%m"))
    end
  end

  local periodYearLimit = timeUnit == "week" and 52 or 12

  local result = ""
  if separator == "||" then
    result = result .. '{| class="wikitable" style="margin: 0.5em auto"\n! scope="row" | ' .. startYear .. "\n|"
    if periodStart >= 2 then
      result = result .. 'colspan="' .. (periodStart - 1) .. '"| ||'
    end
  elseif separator == "image" then
    result = result .. "<div>"
  end

  for year = startYear, endYear do
    for period = periodStart, periodYearLimit do
      local targetPage, text

      if timeUnit == "week" then
        targetPage = pageName .. "/semaine " .. period .. " " .. year
        if separator == "||" then
          text = period
        else
          text = period .. " " .. year
        end

      elseif format == "nom" then
        targetPage = pageName .. "/" .. m_date.nomDuMois(period) .. " " .. year
        if separator == "||" then
          text = m_date.nomDuMois(period)
        else
          text = m_date.nomDuMois(period) .. " " .. year
        end

      elseif format == "abréviation" then
        targetPage = pageName .. "/" .. m_date.nomDuMois(period) .. " " .. year
        if separator == "||" then
          text = m_date.abrevDuMois(period)
        else
          text = m_date.abrevDuMois(period) .. " " .. year
        end

      else
        targetPage = pageName .. "/" .. year .. "/" .. period
        text = year .. "/" .. period
      end

      if separator == "<br>" then
        text = targetPage
      end

      if separator == "image" then
        result = result .. mw.ustring.format(
            '<span style="margin: 0.5em; display: inline-block">' ..
                '[[Image:Breathe-document-save.svg|30px|link=%s]]<br>[[%s|%s]]</span>',
            targetPage,
            targetPage,
            text
        )
      else
        result = result .. mw.ustring.format("[[%s|%s]]", targetPage, text)
      end

      if year == endYear and period == periodEnd then
        break
      elseif period < periodYearLimit then
        if separator ~= "image" then
          result = result .. separator .. " "
        end
      end
    end

    if year < endYear then
      if separator == "||" then
        result = result .. "\n|-\n! scope=\"row\" | " .. (year + 1) .. "\n|"
      else
        result = result .. "\n\n"
      end
    end
    periodStart = 1
  end

  if separator == "||" then
    result = result .. "\n|}\n"
  elseif separator == "image" then
    result = result .. "</div>\n"
  end

  return result
end

function p.generateTable(frame)
  local args = m_params.process(frame.args, {
    [1] = { enum = { "an", "mois", "semaine" } },
    [2] = { required = true },
    [3] = { default = "2004", checker = function(v)
      return mw.ustring.gmatch(v, "%d+(%-%d+)?")
    end },
    [4] = { default = os.date("%Y"), checker = function(v)
      return mw.ustring.gmatch(v, "%d+(%-%d+)?")
    end },
    [5] = {},
    [6] = { enum = { "nom", "abréviation", "numéro" }, default = "nom" },
  })

  local unit = args[1]
  local pageName = args[2]
  local start = args[3]
  local end_ = args[4]
  local separator = args[5] or ""
  local format = args[6]

  if separator == "grille" then
    separator = "||"
  end

  if unit == "an" then
    return generateYearTable(pageName, tonumber(start), tonumber(end_), separator)
  elseif unit == "mois" then
    return generatePeriodTable("month", pageName, start, end_, separator, format)
  elseif unit == "semaine" then
    return generatePeriodTable("week", pageName, start, end_, separator, format)
  end
end

return p
