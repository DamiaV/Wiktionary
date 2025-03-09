--- Stubs definitions for Mediawiki’s Lua types and functions.

--- @class frame
frame = {}

--- @return frame
function frame:new()
  local o = {}
  setmetatable(o, self)
  --- A table for accessing the arguments passed to the frame. For example, if a module is called from wikitext with
  --- `{{#invoke:module|function|arg1|arg2|name=arg3}}` then `frame.args[1]` will return `"arg1"`,
  --- `frame.args[2]` will return `"arg2"`, and `frame.args['name']` (or `frame.args.name`) will return `"arg3"`.
  --- It is also possible to iterate over arguments using `pairs(frame.args)` or `ipairs(frame.args)`.
  --- However, due to how Lua implements table iterators, iterating over arguments will return them in an
  --- unspecified order, and there's no way to know the original order as they appear in wikitext.
  ---
  --- Note that values in this table are always strings; `tonumber()` may be used to convert them to numbers,
  --- if necessary. Keys, however, are numbers even if explicitly supplied in the invocation:
  --- `{{#invoke:module|function|1|2=2}}` gives string values `"1"` and `"2"` indexed by numeric keys `1` and `2`.
  ---
  --- As in MediaWiki template invocations, named arguments will have leading and trailing whitespace removed
  --- from both the name and the value before they are passed to Lua, whereas unnamed arguments will not have
  --- whitespace stripped.
  ---
  --- For performance reasons, `frame.args` uses a metatable, rather than directly containing the arguments.
  --- Argument values are requested from MediaWiki on demand. This means that most other table methods will
  --- not work correctly, including `#frame.args`, `next(frame.args)`, and the functions in the Table library.
  ---
  --- If preprocessor syntax such as template invocations and triple-brace arguments are included within
  --- an argument to `#invoke`, they will not be expanded, after being passed to Lua, until their values are being
  --- requested in Lua. If certain special tags written in XML notation, such as `<pre>`, `<nowiki>`, `<gallery>`
  --- and `<ref>`, are included as arguments to #invoke, then these tags will be converted to "strip markers"
  --- — special strings which begin with a delete character (ASCII 127), to be replaced with HTML after
  --- they are returned from `#invoke`.
  self.args = {}
  return o
end

--- Call a parser function, returning an appropriate string. This is preferable to `frame:preprocess`,
--- but whenever possible, native Lua functions or Scribunto library functions should be preferred to this interface.
--- @param name string
--- @param args table
--- @return string
function frame:callParserFunction(name, args)
  return ""
end

--- This is transclusion. The call `frame:expandTemplate{title = 'template', args = {'arg1', 'arg2', name = 'arg3'}}`
--- does roughly the same thing from Lua that `{{template|arg1|arg2|name=arg3}}` does in wikitext.
--- As in transclusion, if the passed title does not contain a namespace prefix it will be assumed to be
--- in the Template: namespace.
---
--- Note that the title and arguments are not preprocessed before being passed into the template.
--- @param title string
--- @param args table
--- @return string
function frame:expandTemplate(title, args)
  return ""
end

--- This is equivalent to a call to `frame:callParserFunction()`
--- with function name `'#tag:' .. name` and with content prepended to args.
--- @param name string
--- @param content string
--- @param args table|string
--- @return string
function frame:extensionTag(name, content, args)
  return ""
end

--- Called on the frame created by `{{#invoke:}}`, returns the frame for the page that called `{{#invoke:}}`.
--- Called on that frame, returns nil.
---
--- For instance, if the template `{{Example}}` contains the code `{{#invoke:ModuleName|FunctionName|A|B}}`,
--- and a page transcludes that template with the code `{{Example|C|D}}`, then in Module:ModuleName,
--- calling `frame.args[1]` and `frame.args[2]` returns `"A"` and `"B"`, and calling `frame:getParent().args[1]`
--- and `frame:getParent().args[2]` returns `"C"` and `"D"`, with frame being the first argument in the function call.
--- @return frame
function frame:getParent()
  return frame:new()
end

--- Returns the title associated with the frame as a string. For the frame created by `{{#invoke:}}`,
--- this is the title of the module invoked.
--- @return string
function frame:getTitle()
  return ""
end

--- Create a new Frame object that is a child of the current frame, with optional arguments and title.
---
--- This is mainly intended for use in the debug console for testing functions that would normally be called
--- by `{{#invoke:}}`. The number of frames that may be created at any one time is limited.
--- @param title string
--- @param args table
--- @return frame
function frame:newChild(title, args)
  return frame:new()
end

--- This expands wikitext in the context of the frame, i.e. templates, parser functions, and parameters
--- such as `{{{1}}}` are expanded. Certain special tags written in XML-style notation, such as `<pre>`, `<nowiki>`,
--- `<gallery>` and `<ref>`, will be replaced with "strip markers" — special strings which begin with a delete character
--- (ASCII 127), to be replaced with HTML after they are returned from `#invoke`.
---
--- If you are expanding a single template, use frame:expandTemplate instead of trying to construct a wikitext
--- string to pass to this method. It's faster and less prone to error if the arguments contain pipe characters
--- or other wikimarkup.
---
--- If you are expanding a single parser function, use `frame:callParserFunction` for the same reasons.
--- @param string string
--- @return string
function frame:preprocess(string)
  return ""
end

--- Dummy class for the frame methods.
--- @class object
object = {}

--- @return object
function object:new()
  local o = {}
  setmetatable(o, self)
  return o
end

--- @return string
function object:expand()
  return ""
end

--- Gets an object for the specified argument, or nil if the argument is not provided.
---
--- The returned object has one method, `object:expand()`, that returns the expanded wikitext for the argument.
--- @param arg
--- @return object
function frame:getArgument(arg)
  return object:new()
end

--- Returns an object with one method, `object:expand()`, that returns the result of `frame:preprocess(text)`.
--- @param text string
--- @return object
function frame:newParserValue(text)
  return object:new()
end

--- Returns an object with one method, `object:expand()`, that returns the result of `frame:expandTemplate`
--- called with the given arguments.
--- @param title string
--- @param args table
--- @return object
function frame:newTemplateParserValue(title, args)
  return object:new()
end

--- Same as `pairs(frame.args)`. Included for backwards compatibility.
--- @return fun(table: table): (string, any)
function frame:argumentPairs()
  return pairs(self.args)
end

--- @class html
html = {}

function html:new()
  local o = {}
  setmetatable(o, self)
  return o
end

--- Appends a child mw.html `builder` node to the current mw.html instance. If a nil parameter is passed,
--- this is a no-op. A `builder` node is a string representation of an HTML element.
--- @param builder string
--- @return html
function html:node(builder)
  return self
end

--- Appends an undetermined number of wikitext strings to the mw.html object.
--- Note that this stops at the first nil item.
--- @vararg string
--- @return html
function html:wikitext(...)
  return self
end

--- Appends a newline to the mw.html object.
--- @return html
function html:newline()
  return self
end

--- Appends a new child node with the given `tagName` to the builder, and returns a mw.html instance representing
--- that new node. The `args` parameter is identical to that of `mw.html.create`.
---
--- Note that contrarily to other methods such as `html:node()`, this method doesn't return the current mw.html
--- instance, but the mw.html instance of the newly inserted tag. Make sure to use `html:done()` to go up to the parent
--- mw.html instance, or `html:allDone()` if you have nested tags on several levels.
--- @return html
function html:tag(tagName, args)
  return html:new()
end

--- Set an HTML attribute with the given `name` and `value` on the node. Alternatively a table holding name/value pairs
--- of attributes to set can be passed. In the first form, a value of nil causes any attribute with the given name
--- to be unset if it was previously set.
--- @param nameOrTable string|table
--- @param value any optional
--- @return html
function html:attr(nameOrTable, value)
  return self
end

--- Get the value of a html attribute previously set using `html:attr()` with the given name.
--- @param name string
--- @return any
function html:getAttr(name)
  return
end

--- Adds a class name to the node's class attribute. If a nil parameter is passed, this is a no-op.
--- @param class string
--- @return html
function html:addClass(class)
  return self
end

--- Set a CSS property with the given `name` and `value` on the node. Alternatively a table holding name/value pairs
--- of properties to set can be passed. In the first form, a value of nil causes any property with the given name
--- to be unset if it was previously set.
--- @param nameOrTable string|table
--- @param value any optional
--- @return html
function html:css(nameOrTable, value)
  return self
end

--- Add some raw css to the node's style attribute. If a nil parameter is passed, this is a no-op.
--- @param css string
--- @return html
function html:cssText(css)
  return self
end

--- Returns the parent node under which the current node was created. Like jQuery.end, this is a convenience function
--- to allow the construction of several child nodes to be chained together into a single statement.
--- @return html
function html:done()
  return self
end

--- Like `html:done()`, but traverses all the way to the root node of the tree and returns it.
--- @return html
function html:allDone()
  return self
end

--- @class language
language = {}

--- @return language
function language:new()
  local o = {}
  setmetatable(o, self)
  return o
end

--- Returns the language code for this language object.
--- @return string
function language:getCode()
  return ""
end

--- Returns a list of MediaWiki's fallback language codes for this language object.
--- Equivalent to `mw.language.getFallbacksFor(lang:getCode())`.
--- @return table
function language:getFallbackLanguages()
  return {}
end

--- Returns true if the language is written right-to-left, false if it is written left-to-right.
--- @return boolean
function language:isRTL()
  return false
end

--- Converts the string to lowercase, honoring any special rules for the given language.
---
--- When the Ustring library is loaded, the `mw.ustring.lower()` function is implemented as a call
--- to `mw.language.getContentLanguage():lc(s)`.
--- @param s string
--- @return string
function language:lc(s)
  return ""
end

--- Converts the first character of the string to lowercase, as with `lang:lc()`.
--- @param s string
--- @return string
function language:lcfirst(s)
  return ""
end

--- Converts the string to uppercase, honoring any special rules for the given language.
---
--- When the Ustring library is loaded, the `mw.ustring.upper()` function is implemented as a call
--- to `mw.language.getContentLanguage():uc(s)`.
--- @param s string
--- @return string
function language:uc(s)
  return ""
end

--- Converts the first character of the string to uppercase, as with `lang:uc()`.
--- @param s string
--- @return string
function language:ucfirst(s)
  return ""
end

--- Converts the string to a representation appropriate for case-insensitive comparison.
--- Note that the result may not make any sense when displayed.
--- @param s string
--- @return string
function language:caseFold(s)
  return ""
end

--- Formats a number with grouping and decimal separators appropriate for the given language. Given 123456.78,
--- this may produce "123,456.78", "123.456,78", or even something like "١٢٣٬٤٥٦٫٧٨" depending on the language
--- and wiki configuration.
---
--- The `options` is a table of options, which can be:
--- - `noCommafy`: Set true to omit grouping separators and use a dot (`.`) as the decimal separator.
---  Digit transformation may still occur, which may include transforming the decimal separator.
--- @param n number
--- @param options table
--- @return string
function language:formatNum(n, options)
  return ""
end

--- Formats a date according to the given format string.
--- If `timestamp` is omitted, the default is the current time.
--- The value for `local_` must be a boolean or nil; if true,
--- the time is formatted in the wiki's local time rather than in UTC.
---
--- The format string and supported values for timestamp are identical to those for the #time parser function
--- from Extension:ParserFunctions. Note however that backslashes may need to be doubled in a Lua string literal,
--- since Lua also uses backslash as an escape character while wikitext does not.
--- @param format string
--- @param timestamp number optional
--- @param local_ boolean optional
--- @return string
function language:formatDate(format, timestamp, local_)
  return ""
end

--- Breaks a duration in seconds into more human-readable units, e.g. 12345 to 3 hours, 25 minutes and 45 seconds,
--- returning the result as a string.
---
--- `chosenIntervals`, if given, is a table with values naming the interval units to use in the response.
--- These include 'millennia', 'centuries', 'decades', 'years', 'weeks', 'days', 'hours', 'minutes', and 'seconds'.
--- @param seconds number
--- @param chosenIntervals table optional
--- @return string
function language:formatDuration(seconds, chosenIntervals)
  return ""
end

--- This takes a number as formatted by `lang:formatNum()` and returns the actual number.
--- In other words, this is basically a language-aware version of `tonumber()`.
--- @param s string
--- @return number
function language:parseFormattedNumber(s)
  return 0
end

--- This chooses the appropriate grammatical form from `forms` (which must be a sequence table)
--- or `...` based on the number `n`. For example, in English you might use `n .. ' ' .. lang:plural(n, 'sock', 'socks')`
--- or `n .. ' ' .. lang:plural(n, {'sock', 'socks'})` to generate grammatically-correct text whether there is
--- only 1 sock or 200 socks.
---
--- The necessary values for the sequence are language-dependent, see localization of magic words and translatewiki's
--- FAQ on PLURAL for some details.
--- @param n number
--- @vararg string
function language:convertPlural(n, ...)
  return ""
end

--- This chooses the appropriate inflected form of `word` for the given inflection code `case`.
---
--- The possible values for `word` and `case` are language-dependent.
--- @param word string
--- @param case string
--- @return string
function language:convertGrammar(word, case)
  return ""
end

--- Chooses the string corresponding to the gender of `what`, which may be "male", "female", or a registered user name.
--- @param what string
--- @param masculine string
--- @param feminine string
--- @param neutral string
--- @return string
function language:gender(what, masculine, feminine, neutral)
  return ""
end

--- Returns a Unicode arrow character corresponding to direction:
--- - forwards: Either "→" or "←" depending on the directionality of the language.
--- - backwards: Either "←" or "→" depending on the directionality of the language.
--- - left: "←"
--- - right: "→"
--- - up: "↑"
--- - down: "↓"
--- @param direction string
--- @return string
function language:getArrow(direction)
  return ""
end

--- Returns "ltr" or "rtl", depending on the directionality of the language.
--- @return string
function language:getDir()
  return ""
end

--- Returns a string containing either U+200E (the left-to-right mark) or U+200F (the right-to-left mark),
--- depending on the directionality of the language and whether `opposite` is a true or false value.
--- @param opposite boolean
--- @return string
function language:getDirMark(opposite)
  return ""
end

--- Returns "&lrm;" or "&rlm;", depending on the directionality of the language
--- and whether `opposite` is a true or false value.
--- @param opposite boolean
--- @return string
function language:getDirMarkEntity(opposite)
  return ""
end

--- Breaks a duration in seconds into more human-readable units, e.g. 12345 to 3 hours, 25 minutes and 45 seconds,
--- returning the result as a table mapping unit names to numbers.
---
--- `chosenIntervals`, if given, is a table with values naming the interval units to use in the response.
--- These include 'millennia', 'centuries', 'decades', 'years', 'weeks', 'days', 'hours', 'minutes', and 'seconds'.
---
--- Those unit keywords are also the keys used in the response table. Only units with a non-zero value are set
--- in the response, unless the response would be empty in which case the smallest unit is returned with a value of 0.
--- @param seconds number
--- @param chosenIntervals table optional
--- @return table
function language:getDurationIntervals(seconds, chosenIntervals)
  return {}
end

--- @class message
message = {}

--- @return message
function message:new()
  local o = {}
  setmetatable(o, self)
  return o
end

--- Add parameters to the message, which may be passed as individual arguments or as a sequence table.
--- Parameters must be numbers, strings, or the special values returned by `mw.message.numParam()`
--- or `mw.message.rawParam()`. If a sequence table is used, parameters must be directly present in the table;
--- references using the `__index` metamethod will not work.
---
--- Returns the messageg object, to allow for call chaining.
--- @vararg any
--- @return message
function message:params(...)
  return self
end

--- Like `:params()`, but has the effect of passing all the parameters through `mw.message.rawParam()` first.
---
--- Returns the message object, to allow for call chaining.
--- @vararg any
--- @return message
function message:rawParams(...)
  return self
end

--- Like `:params()`, but has the effect of passing all the parameters through `mw.message.numParam()` first.
---
--- Returns the message object, to allow for call chaining.
--- @vararg any
--- @return message
function message:numParams(...)
  return self
end

--- Specifies the language to use when processing the message. `lang` may be a string or a table with a `getCode()`
--- method (i.e. a Language object).
---
--- The default language is the one returned by `mw.message.getDefaultLanguage()`.
---
--- Returns the message object, to allow for call chaining.
--- @param lang string|language
--- @return message
function message:inLanguage(lang)
  return self
end

--- Specifies whether to look up messages in the MediaWiki: namespace (i.e. look in the database),
--- or just use the default messages distributed with MediaWiki.
---
--- The default is true.
---
--- Returns the message object, to allow for call chaining.
--- @param bool boolean
--- @return message
function message:useDatabase(bool)
  return self
end

--- Substitutes the parameters and returns the message wikitext as-is. Template calls and parser functions are intact.
--- @return message
function message:plain()
  return self
end

--- Returns a boolean indicating whether the message key exists.
--- @return message
function message:exists()
  return self
end

--- Returns a boolean indicating whether the message key has content. Returns true if the message key does not exist
--- or the message is the empty string.
--- @return message
function message:isBlank()
  return self
end

--- Returns a boolean indicating whether the message key is disabled. Returns true if the message key does not exist
--- or if the message is the empty string or the string "-".
--- @return message
function message:isDisabled()
  return self
end

--- @class title
title = {}

--- @return title
function title:new()
  local o = {}
  setmetatable(o, self)
  --- The page_id. `0` if the page does not exist. **This may be expensive.**
  self.id = 0
  --- The interwiki prefix, or the empty string if none.
  self.interwiki = ""
  --- The namespace number.
  self.namespace = 0
  --- The fragment (aka section/anchor linking), or the empty string. May be assigned.
  self.fragment = ""
  --- The text of the namespace for the page.
  self.nsText = ""
  --- The text of the subject namespace for the page.
  self.subjectNsText = ""
  --- The title of the page, without the namespace or interwiki prefixes.
  self.text = ""
  --- The title of the page, with the namespace and interwiki prefixes and the fragment.
  --- Interwiki is not returned if equal to the current.
  self.fullText = ""
  --- If this is a subpage, the title of the root page without prefixes.
  --- Otherwise, the same as `title.text`.
  self.rootText = ""
  --- If this is a subpage, the title of the page it is a subpage of without prefixes.
  --- Otherwise, the same as `title.text`.
  self.baseText = ""
  --- If this is a subpage, just the subpage name. Otherwise, the same as `title.text`.
  self.subpageText = ""
  --- Whether the page for this title could have a talk page.
  self.canTalk = ""
  --- Whether the page exists. Alias for `file.exists` for Media-namespace titles.
  --- For File-namespace titles this checks the existence of the file description page, not the file itself.
  --- **This may be expensive.**
  self.exists = false
  --- File metadata
  self.file = {
    exists = false,
    width = 0,
    height = 0,
    pages = {},
    size = 0,
    mimeType = "",
    length = 0,
  }
  --- Whether the file exists.
  self.fileExists = false
  --- Whether this title is in a content namespace.
  self.isContentPage = false
  --- Whether this title has an interwiki prefix.
  self.isExternal = false
  --- Whether this title is in this project. For example, on the English Wikipedia,
  --- any other Wikipedia is considered "local" while Wiktionary and such are not.
  self.isLocal = false
  --- Whether this is the title for a page that is a redirect. **This may be expensive.**
  self.isRedirect = false
  --- Whether this is the title for a possible special page (i.e. a page in the Special: namespace).
  self.isSpecialPage = false
  --- Whether this title is a subpage of some other title.
  self.isSubpage = false
  --- Whether this is a title for a talk page.
  self.isTalkPage = false
  --- The content model for this title, as a string. **This may be expensive.**
  self.contentModel = ""
  --- The same as `mw.title.makeTitle(title.namespace, title.baseText)`.
  self.basePageTitle = ""
  --- The same as `mw.title.makeTitle(title.namespace, title.rootText)`.
  self.rootPageTitle = ""
  --- The same as `mw.title.makeTitle(mw.site.namespaces[title.namespace].talk.id, title.text)`,
  --- or `nil` if this title cannot have a talk page.
  self.talkPageTitle = ""
  ---  The same as `mw.title.makeTitle(mw.site.namespaces[title.namespace].subject.id, title.text)`.
  self.subjectPageTitle = ""
  --- Returns a title object of the target of the redirect page if the page is a redirect and the page exists,
  --- returns `false` otherwise.
  self.redirectTarget = title:new()
  --- The page's protection levels. This is a table with keys corresponding to each action
  --- (e.g., `"edit"` and `"move"`). The table values are arrays, the first item of which is a string containing
  --- the protection level. If the page is unprotected, either the table values or the array items will be nil.
  --- **This is expensive.**
  self.protectionLevels = {}
  --- The cascading protections applicable to the page. This is a table with keys `"restrictions"`
  --- (itself a table with keys like `protectionLevels` has) and `"sources"` (an array listing titles where the
  --- protections cascade from). If no protections cascade to the page, `"restrictions"` and `"sources"` will be empty.
  --- **This is expensive.**
  self.cascadingProtection = {}
  return o
end

--- Whether this title is in the given namespace.
--- Namespaces may be specified by anything that is a key found in `mw.site.namespaces`.
--- @param title title
--- @return boolean
function title:isSubpageOf(title)
  return false
end

--- Whether this title is in any of the given namespaces.
--- Namespaces may be specified by anything that is a key found in `mw.site.namespaces`.
--- @vararg string
--- @return boolean
function title:inNamespaces(...)
  return false
end

--- Whether this title's subject namespace is in the given namespace.
--- Namespaces may be specified by anything that is a key found in `mw.site.namespaces`.
--- @param ns string
--- @return boolean
function title:hasSubjectNamespace(ns)
  return false
end

--- The same as `mw.title.makeTitle(title.namespace, title.text .. '/' .. text)`.
--- @param text string
--- @return title
function title:subPageTitle(text)
  return title:new()
end

--- Returns `title.text` encoded as it would be in a URL.
--- @return string
function title:partialUrl()
  return ""
end

--- Returns the full URL (with optional query table/string) for this title.
--- `proto` may be specified to control the scheme of the resulting url:
--- "http", "https", "relative" (the default), or "canonical".
--- @param query table|string
--- @param proto string optional
--- @return string
function title:fullUrl(query, proto)
  return ""
end

--- Returns the local URL (with optional query table/string) for this title.
--- @param query table|string
--- @return string
function title:localUrl(query)
  return ""
end

--- Returns the canonical URL (with optional query table/string) for this title.
--- @param query table|string
--- @return string
function title:canonicalUrl(query)
  return ""
end

--- Returns the (unparsed) content of the page, or `nil` if there is no page.
--- The page will be recorded as a transclusion.
--- @return string
function title:getContent()
  return ""
end

--- @class uri
uri = {}

--- @return uri
function uri:new()
  local o = {}
  setmetatable(o, self)
  self.protocole = ""
  self.user = ""
  self.password = ""
  self.host = ""
  self.port = 0
  self.path = ""
  --- A table, as from `mw.uri.parseQueryString`.
  self.query = {}
  self.fragment = ""
  --- User and password.
  self.userInfo = ""
  --- Host and port.
  self.hostPort = ""
  --- User, password, host and port.
  self.authority = ""
  --- Version of the query table.
  self.queryString = ""
  --- Path, query string and fragment.
  self.relativePath = ""
  return o
end

--- Parses a string into the current URI object. Any fields specified in the string will be replaced in
--- the current object; fields not specified will keep their old values.
--- @param s string
function uri:parse(s)
end

--- Makes a copy of the URI object.
--- @return uri
function uri:clone()
  return uri:new()
end

--- Merges the parameters table into the object's query table.
--- @param parameters table
function uri:extend(parameters)
end

--- Stubs for mw functions
mw = {
  --- Adds a warning which is displayed above the preview when previewing an edit. `text` is parsed as wikitext.
  --- @param text string
  addWarning = function(text)
  end,
  --- Calls `tostring()` on all arguments, then concatenates them with tabs as separators.
  --- @return string
  allToString = function(...)
    return ""
  end,
  --- Creates a deep copy of a value. All tables (and their metatables) are reconstructed from scratch.
  --- Functions are still shared, however.
  --- @param value any
  --- @return any
  clone = function(value)
    return value
  end,
  --- Returns the current frame object, typically the frame object from the most recent `#invoke`.
  --- @return table
  getCurrentFrame = function()
    return {}
  end,
  --- Adds one to the "expensive parser function" count, and throws an exception
  --- if it exceeds the limit (see `$wgExpensiveParserFunctionLimit`).
  incrementExpensiveFunctionCount = function()
  end,
  --- Returns true if the current `#invoke` is being substed, false otherwise.
  --- See Returning text above for discussion on differences when substing versus not substing.
  --- @return boolean
  isSubsting = function()
    return false
  end,
  --- Sometimes a module needs large tables of data; for example, a general-purpose module to convert units of measure
  --- might need a large table of recognized units and their conversion factors. And sometimes these modules will be
  --- used many times in one page. Parsing the large data table for every `{{#invoke:}}` can use a significant amount
  --- of time. To avoid this issue, `mw.loadData()` is provided.
  --- @param module string
  --- @return table
  loadData = function(module)
    return {}
  end,
  --- This is the same as `mw.loadData()` above, except it loads data from JSON pages rather than Lua tables.
  --- The JSON content must be an array or object. See also `mw.text.jsonDecode()`.
  --- @param page string
  --- @return table
  loadJsonData = function(page)
    return {}
  end,
  --- Serializes `object` to a human-readable representation, then returns the resulting string.
  --- @param object any
  --- @return string
  dumpObject = function(object)
    return ""
  end,
  --- Passes the arguments to `mw.allToString()`, then appends the resulting string to the log buffer.
  --- In the debug console, the function `print()` is an alias for this function.
  log = function(...)
  end,
  --- Calls `mw.dumpObject()` and appends the resulting string to the log buffer. If `prefix` is given,
  --- it will be added to the log buffer followed by an equals sign before the serialized string is appended
  --- (i.e. the logged text will be "prefix = object-string").
  --- @param object any
  --- @param prefix string optional
  logObject = function(object, prefix)
  end,

  hash = {
    --- Hashes a string value with the specified algorithm.
    --- Valid algorithms may be fetched using `mw.hash.listAlgorithms()`.
    --- @param algo string
    --- @param value string
    --- @return string
    hashValue = function(algo, value)
      return ""
    end,
    --- Returns a list of supported hashing algorithms, for use in `mw.hash.hashValue()`.
    --- @return table
    listAlgorithms = function()
      return {}
    end,
  },

  html = {
    --- Creates a new mw.html object containing a tagName html element.
    --- You can also pass an empty string or nil as tagName in order to create an empty mw.html object.
    --- @param tagName string
    --- @param args table
    --- @return html
    create = function(tagName, args)
      return html:new()
    end,
  },

  language = {
    --- The full name of the language for the given language code: native name (language autonym) by default,
    --- name translated in target language if a value is given for `inLanguage`.
    --- @param code string
    --- @param inLanguage string optional
    --- @return string
    fetchLanguageName = function(code, inLanguage)
      return ""
    end,
    --- Fetch the list of languages known to MediaWiki, returning a table mapping language code to language name.
    ---
    --- By default the name returned is the language autonym; passing a language code for `inLanguage` returns
    --- all names in that language.
    ---
    --- By default, only language names known to MediaWiki are returned; passing 'all' for `include` will return
    --- all available languages (e.g. from Extension:CLDR), while passing 'mwfile' will include only languages
    --- having customized messages included with MediaWiki core or enabled extensions. To explicitly select the default,
    --- 'mw' may be passed.
    --- @param inLanguage string optional
    --- @param include string optional
    --- @return table
    fetchLanguageNames = function(inLanguage, include)
      return {}
    end,
    --- Returns a new language object for the wiki's default content language.
    --- @return language
    getContentLanguage = function()
      return language:new()
    end,
    --- Returns a list of MediaWiki's fallback language codes for the specified code.
    --- @return table
    getFallbacksFor = function(code)
      return {}
    end,
    --- Returns true if a language code is known to MediaWiki.
    --- A language code is "known" if it is a "valid built-in code" (i.e. it returns true
    --- for `mw.language.isValidBuiltInCode`) and returns a non-empty string for `mw.language.fetchLanguageName`.
    --- @param code string
    --- @return boolean
    isKnownLanguageTag = function(code)
      return false
    end,
    --- Checks whether any localisation is available for that language code in MediaWiki.
    ---
    --- A language code is "supported" if it is a "valid" code (returns true for `mw.language.isValidCode`),
    --- contains no uppercase letters, and has a message file in the currently-running version of MediaWiki.
    ---
    --- It is possible for a language code to be "supported" but not "known" (i.e. returning true
    --- for `mw.language.isKnownLanguageTag`). Also note that certain codes are "supported" despite
    --- `mw.language.isValidBuiltInCode` returning false.
    --- @param code string
    --- @return boolean
    isSupportedLanguage = function(code)
      return false
    end,
    --- Returns true if a language code is of a valid form for the purposes of internal customisation of MediaWiki.
    ---
    --- The code may not actually correspond to any known language.
    ---
    --- A language code is a "valid built-in code" if it is a "valid" code (i.e. it returns true
    --- for `mw.language.isValidCode`); consists of only ASCII letters, numbers, and hyphens; and is at least
    --- two characters long.
    ---
    --- Note that some codes are "supported" (i.e. returning true from `mw.language.isSupportedLanguage`) even
    --- though this function returns false.
    --- @param code string
    --- @return boolean
    isValidBuiltInCode = function(code)
      return false
    end,
    --- Returns true if a language code string is of a valid form, whether or not it exists. This includes codes which
    --- are used solely for customisation via the MediaWiki namespace.
    ---
    --- The code may not actually correspond to any known language.
    ---
    --- A language code is valid if it does not contain certain unsafe characters (colons, single- or double-quotes,
    --- slashs, backslashs, angle brackets, ampersands, or ASCII NULs) and is otherwise allowed in a page title.
    --- @param code string
    --- @return boolean
    isValidCode = function(code)
      return false
    end,
    --- Creates a new language object. Language objects do not have any publicly accessible properties,
    --- but they do have several methods, which are documented below.
    ---
    --- There is a limit on the number of distinct language codes that may be used on a page.
    --- Exceeding this limit will result in errors.
    --- @param code string
    --- @return language
    new = function(code)
      return language:new()
    end,
  },

  message = {
    --- Creates a new message object for the given message `key`.
    --- The remaining parameters are passed to the new object's `params()` method.
    ---
    --- The message object has no properties, but has several methods documented below.
    --- @param key string
    --- @vararg any
    --- @return message
    new = function(key, ...)
      return message:new()
    end,
    --- Creates a new message object for the given messages (the first one that exists will be used).
    --- The message object has no properties, but has several methods documented below.
    --- @vararg message
    --- @return message
    newFallbackSequence = function(...)
      return message:new()
    end,
    --- Creates a new message object, using the given text directly rather than looking up an internationalized message.
    --- The remaining parameters are passed to the new object's `params()` method.
    ---
    --- The message object has no properties, but has several methods documented below.
    --- @param msg string
    --- @vararg any
    --- @return message
    newRawMessage = function(msg, ...)
      return message:new()
    end,
    --- Wraps the value so that it will not be parsed as wikitext by `msg:parse()`.
    --- @param value T
    --- @return T
    --- @generic T
    rawParam = function(value)
      return value
    end,
    --- Wraps the value so that it will automatically be formatted as by `lang:formatNum()`.
    --- Note this does not depend on the Language library actually being available.
    --- @param value T
    --- @return T
    --- @generic T
    numParam = function(value)
      return value
    end,
    --- Returns a Language object for the default language.
    --- @return language
    getDefaultLanguage = function()
      return language:new()
    end,
  },

  site = {
    --- A string holding the current version of MediaWiki.
    currentVersion = "",
    --- The value of `$wgScriptPath`.
    scriptPath = "",
    --- The value of `$wgStylePath`.
    server = "",
    --- Table holding data for all namespaces, indexed by number.
    namespaces = {
      {
        --- Namespace number.
        id = 0,
        --- Local namespace name.
        name = "",
        --- Canonical namespace name.
        canonicalName = "",
        --- Set on namespace 0, the name to be used for display (since the name is often the empty string).
        displayName = "",
        --- Whether subpages are enabled for the namespace.
        hasSubpages = false,
        --- Whether the namespace has different aliases for different genders.
        hasGenderDistinction = false,
        --- Whether the first letter of pages in the namespace is capitalized.
        isCapitalized = false,
        --- Whether this is a content namespace.
        isContent = false,
        --- Whether pages in the namespace can be transcluded.
        isIncludable = false,
        --- Whether pages in the namespace can be moved.
        isMovable = false,
        --- Whether this is a subject namespace.
        isSubject = false,
        --- Whether this is a talk namespace.
        isTalk = false,
        --- The default content model for the namespace, as a string.
        defaultContentModel = "",
        --- List of aliases for the namespace.
        aliases = {},
        --- Reference to the corresponding subject namespace's data.
        subject = {},
        --- Reference to the corresponding talk namespace's data.
        talk = {},
        --- Reference to the associated namespace's data.
        associated = {},
      },
    },
    --- Table holding just the content namespaces, indexed by number. See `mw.site.namespaces` for details.
    contentNamespaces = {},
    --- Table holding just the subject namespaces, indexed by number. See `mw.site.namespaces` for details.
    subjectNamespaces = {},
    --- Table holding just the talk namespaces, indexed by number. See `mw.site.namespaces` for details.
    talkNamespaces = {},
    --- Table holding site statistics.
    stats = {
      --- Number of pages in the wiki.
      pages = 0,
      --- Number of articles in the wiki.
      articles = 0,
      --- Number of files in the wiki.
      files = 0,
      --- Number of edits in the wiki.
      edits = 0,
      --- Number of users in the wiki.
      users = 0,
      --- Number of active users in the wiki.
      activeUsers = 0,
      --- Number of users in group 'sysop' in the wiki.
      admins = 0,
      --- **This function is expensive**
      ---
      --- Gets statistics about the category.
      --- If `which` is one of "all", "subcats", "files" or "pages",
      --- the result is a number with the corresponding value.
      --- If `which` has the special value "*", the result is a table with the above properties.
      --- Each new category queried will increment the expensive function count.
      --- @param category string
      --- @param which string
      --- @return number|table
      pagesInCategory = function(category, which)
        return 0 or {
          all = 0,
          subcats = 0,
          files = 0,
          pages = 0,
        }
      end,
      --- Returns the number of pages in the given namespace (specify by number).
      --- @param ns number
      --- @return number
      pagesInNamespace = function(ns)
        return 0
      end,
      --- Returns the number of users in the given group.
      --- @param group string
      usersInGroup = function(group)
      end,
    },
    --- Returns a table holding data about available interwiki prefixes.
    --- If `filter` is the string `"local"`, then only data for local interwiki prefixes is returned.
    --- If filter is the string `"!local"`, then only data for non-local prefixes is returned.
    --- If no filter is specified, data for all prefixes is returned.
    --- A `"local"` prefix in this context is one that is for the same project.
    --- For example, on the English Wikipedia, other-language Wikipedias are considered local,
    --- while Wiktionary and such are not.
    --- @param filter string optional
    --- @return table
    interwikiMap = function(filter)
      return {
        ["w"] = {
          --- The interwiki prefix.
          prefix = "",
          --- The URL that the interwiki points to. The page name is represented by the parameter $1.
          url = "",
          --- A boolean showing whether the URL is protocol-relative.
          isProtocolRelative = false,
          --- Whether the URL is for a site in the current project.
          isLocal = false,
          --- Whether the URL is for the current wiki.
          isCurrentWiki = false,
          --- Whether pages using this interwiki prefix are transcludable.
          --- This requires scary transclusion, which is disabled on Wikimedia wikis.
          isTranscludable = false,
          --- Whether the interwiki is listed in `$wgExtraInterlanguageLinkPrefixes`.
          isExtraLanguageLink = false,
          --- For links listed in `$wgExtraInterlanguageLinkPrefixes`, this is the display text shown
          --- for the interlanguage link. Nil if not specified.
          displayText = "",
          --- For links listed in `$wgExtraInterlanguageLinkPrefixes`, this is the tooltip text shown
          --- when users hover over the interlanguage link. Nil if not specified.
          tooltip = "",
        },
      }
    end
  },

  text = {
    JSON_PRESERVE_KEYS = 1,
    JSON_TRY_FIXING = 2,
    JSON_PRETTY = 4,
    --- Replaces HTML entities in the string with the corresponding characters.
    --- If boolean `decodeNamedEntities` is omitted or false, the only named entities recognized
    --- are '&lt;', '&gt;', '&amp;', '&quot;', and '&nbsp;'. Otherwise, the list of HTML5 named entities
    --- to recognize is loaded from PHP's `get_html_translation_table` function.
    --- @param s string
    --- @param decodeNamedEntities boolean
    --- @return string
    decode = function(s, decodeNamedEntities)
      return ""
    end,
    --- Replaces characters in a string with HTML entities. Characters '<', '>', '&', '"', and the non-breaking space
    --- are replaced with the appropriate named entities; all others are replaced with numeric entities.
    --- If charset is supplied, it should be a string as appropriate to go inside brackets in a Ustring pattern,
    --- i.e. the "set" in `[set]`. The default charset is `'<>&"\' '`
    --- (the space at the end is the non-breaking space, U+00A0).
    --- @param s string
    --- @param charset string optional
    --- @return string
    encode = function(s, charset)
      return ""
    end,
    --- Decodes a JSON string. `flags` is 0 or a combination (use `+`) of the flags `mw.text.JSON_PRESERVE_KEYS`
    --- and `mw.text.JSON_TRY_FIXING`.
    ---
    --- Normally JSON's zero-based arrays are renumbered to Lua one-based sequence tables;
    --- to prevent this, pass `mw.text.JSON_PRESERVE_KEYS`.
    ---
    --- To relax certain requirements in JSON, such as no terminal comma in arrays or objects,
    --- pass `mw.text.JSON_TRY_FIXING`. This is not recommended.
    --- @param s string
    --- @param flags number optional
    --- @return table|number|boolean|string|nil
    jsonDecode = function(s, flags)
      return {} or 0 or false or "" or nil
    end,
    --- Encode a JSON string. Errors are raised if the passed value cannot be encoded in JSON.
    --- `flags` is 0 or a combination (use `+`) of the flags `mw.text.JSON_PRESERVE_KEYS`
    --- and `mw.text.JSON_PRETTY`.
    ---
    --- Normally Lua one-based sequence tables are encoded as JSON zero-based arrays;
    --- when `mw.text.JSON_PRESERVE_KEYS` is set in `flags`, zero-based sequence tables are encoded as JSON arrays.
    --- @param value table|number|boolean|string|nil
    --- @param flags number optional
    --- @return string
    jsonEncode = function(value, flags)
      return ""
    end,
    --- Removes all MediaWiki strip markers from a string.
    killMarkers = function(s)
      return ""
    end,
    --- Joins a list, prose-style. In other words, it's like `table.concat()` but with a different
    --- separator before the final item.
    ---
    --- The default separator is taken from MediaWiki:comma-separator in the wiki's content language,
    --- and the default conjunction is MediaWiki:and concatenated with MediaWiki:word-separator.
    --- @param list table
    --- @param separator string optional
    --- @param conjunction string optional
    --- @return string
    listToText = function(list, separator, conjunction)
      return ""
    end,
    --- Replaces various characters in the string with HTML entities to prevent their interpretation as wikitext.
    nowiki = function(s)
      return s
    end,
    --- Splits the string into substrings at boundaries matching the Ustring pattern `pattern`.
    --- If plain is specified and true, `pattern` will be interpreted as a literal string rather
    --- than as a Lua pattern (just as with the parameter of the same name for `mw.ustring.find()`).
    --- Returns a table containing the substrings.
    ---
    --- For example, `mw.text.split('a b\tc\nd', '%s')` would return a table `{'a', 'b', 'c', 'd'}`.
    ---
    --- If `pattern` matches the empty string, `i` will be split into individual characters.
    --- @param s string
    --- @param pattern string
    --- @param plain boolean
    split = function(s, pattern, plain)
      return {}
    end,
    --- Returns an iterator function that will iterate over the substrings that would be returned
    --- by the equivalent call to `mw.text.split()`.
    --- @param s string
    --- @param pattern string
    --- @param plain boolean
    --- @return fun(s: string): void
    gsplit = function(s, pattern, plain)
      --- @param str string
      return function(str)
      end
    end,
    --- Generates an HTML-style tag for `name`.
    ---
    --- If `attrs` is given, it must be a table with string keys. String and number values are used
    --- as the value of the attribute; boolean true results in the key being output as an HTML5 valueless parameter;
    --- boolean false skips the key entirely; and anything else is an error.
    ---
    --- If `content` is not given (or is nil), only the opening tag is returned. If `content` is boolean false,
    --- a self-closed tag is returned. Otherwise it must be a string or number, in which case that content
    --- is enclosed in the constructed opening and closing tag. Note the content is not automatically HTML-encoded;
    --- use `mw.text.encode()` if needed.
    ---
    --- For properly returning extension tags such as `<ref>`, use `frame:extensionTag()` instead.
    --- @param name string
    --- @param attrs table optional
    --- @param content string|boolean optional
    --- @return string
    tag = function(name, attrs, content)
      return ""
    end,
    --- Remove whitespace or other characters from the beginning and end of a string.
    ---
    --- If `charset` is supplied, it should be a string as appropriate to go inside brackets in a Ustring pattern,
    --- i.e. the "set" in `[set]`. The default charset is ASCII whitespace, `"\t\r\n\f "`.
    --- @param s string
    --- @param charset string optional
    --- @return string
    trim = function(s, charset)
      return ""
    end,
    --- Truncates `text` to the specified length in code points, adding `ellipsis` if truncation was performed.
    --- If length is positive, the end of the string will be truncated; if negative, the beginning will be removed.
    --- If `adjustLength` is given and true, the resulting string including ellipsis will not be longer than
    --- the specified length.
    ---
    --- The default value for `ellipsis` is taken from MediaWiki:ellipsis in the wiki's content language.
    --- @param text string
    --- @param length number
    --- @param ellipsis string optional
    --- @param adjustLength boolean optional
    --- @return string
    truncate = function(text, length, ellipsis, adjustLength)
      return ""
    end,
    --- Replaces MediaWiki `<nowiki>` strip markers with the corresponding text.
    --- Other types of strip markers are not changed.
    --- @param s string
    --- @return string
    unstripNoWiki = function(s)
      return ""
    end,
    --- Equivalent to `mw.text.killMarkers(mw.text.unstripNoWiki(s))`.
    --- This no longer reveals the HTML behind special page transclusion, `<ref>` tags, and so on as it did
    --- in earlier versions of Scribunto.
    --- @param s string
    --- @return string
    unstrip = function(s)
      return ""
    end,
  },

  title = {
    --- Test for whether two titles are equal. Note that fragments are ignored in the comparison.
    --- @param a title
    --- @param b title
    --- @return boolean
    equals = function(a, b)
      return false
    end,
    --- Returns -1, 0, or 1 to indicate whether the title `a` is less than, equal to, or greater than title `b`.
    ---
    --- This compares titles by interwiki prefix (if any) as strings, then by namespace number,
    --- then by the unprefixed title text as a string. These string comparisons use Lua's standard `<` operator.
    --- @param a title
    --- @param b title
    --- @return number
    compare = function(a, b)
      return -1 or 0 or 1
    end,
    --- Returns the title object for the current page.
    --- @return title
    getCurrentTitle = function()
      return title:new()
    end,
    --- **This function is expensive**
    ---
    --- Creates a new title object.
    ---
    --- If a number `id` is given, an object is created for the title with that page_id.
    --- The title referenced will be counted as linked from the current page.
    --- If the page_id does not exist, returns nil. The expensive function count will be incremented
    --- if the title object created is not for a title that has already been loaded.
    ---
    --- If a string `text` is given instead, an object is created for that title (even if the page does not exist).
    --- If the text string does not specify a namespace, namespace (which may be any key found in `mw.site.namespaces`)
    --- will be used. If the text is not a valid title, nil is returned.
    --- @param textOrId string|number
    --- @param namespace string optional
    --- @return title
    new = function(textOrId, namespace)
      return title:new()
    end,
    --- Creates a title object with title `title` in namespace namespace, optionally with the specified
    --- `fragment` and `interwiki` prefix. namespace may be any key found in `mw.site.namespaces`.
    --- If the resulting title is not valid, returns nil.
    ---
    --- Note that, unlike `mw.title.new()`, this method will always apply the specified namespace.
    --- For example, `mw.title.makeTitle('Template', 'Module:Foo')` will create an object for the page
    --- Template:Module:Foo, while `mw.title.new('Module:Foo', 'Template')` will create an object for
    --- the page Module:Foo.
    --- @param namespace string
    --- @param title string
    --- @param fragment string
    --- @param interwiki string
    --- @return title
    makeTitle = function(namespace, title, fragment, interwiki)
      return title:new()
    end
  },

  uri = {
    --- Percent-encodes the string. The default type, "QUERY", encodes spaces using '+' for use in query strings;
    --- "PATH" encodes spaces as %20; and "WIKI" encodes spaces as '_'.
    ---
    --- Note that the "WIKI" format is not entirely reversible, as both spaces and underscores are encoded as '_'.
    --- @param s string
    --- @param enctype string
    --- @return string
    encode = function(s, enctype)
      return ""
    end,
    --- Percent-decodes the string. The default type, "QUERY", decodes '+' to space;
    --- "PATH" does not perform any extra decoding; and "WIKI" decodes '_' to space.
    --- @param s string
    --- @param enctype string
    --- @return string
    decode = function(s, enctype)
      return ""
    end,
    --- Encodes a string for use in a MediaWiki URI fragment.
    --- @param s string
    --- @return string
    anchorEncode = function(s)
      return ""
    end,
    ---Encodes a table as a URI query string. Keys should be strings; values may be strings or numbers,
    --- sequence tables, or boolean false.
    --- @param table table
    --- @return string
    buildQueryString = function(table)
      return ""
    end,
    --- Decodes the query string `s` to a table. Keys in the string without values will have a value of false;
    --- keys repeated multiple times will have sequence tables as values; and others will have strings as values.
    ---
    --- The optional numerical arguments `i` and `j` can be used to specify a substring of `s` to be parsed,
    --- rather than the entire string. `i` is the position of the first character of the substring,
    --- and defaults to 1. `j` is the position of the last character of the substring, and defaults to the length
    --- of the string. Both `i` and `j` can be negative, as in `string.sub`.
    --- @param s string
    --- @param i number optional
    --- @param j number optional
    --- @return table
    parseQueryString = function(s, i, j)
      return {}
    end,
    --- Returns a URI object for the canonical URL for a page, with optional query string/table.
    --- @param page string
    --- @param query table|string
    --- @return uri
    canonicalUrl = function(page, query)
      return uri:new()
    end,
    --- Returns a URI object for the full URL for a page, with optional query string/table.
    --- @param page string
    --- @param query table|string
    --- @return uri
    fullUrl = function(page, query)
      return uri:new()
    end,
    --- Returns a URI object for the local URL for a page, with optional query string/table.
    --- @param page string
    --- @param query table|string
    --- @return uri
    localUrl = function(page, query)
      return uri:new()
    end,
    --- Constructs a new URI object for the passed string or table. See the description of URI objects for
    --- the possible fields for the table.
    --- @param s string
    --- @return uri
    new = function(s)
      return uri:new()
    end,
    --- Validates the passed table (or URI object). Returns a boolean indicating whether the table was valid,
    --- and on failure a string explaining what problems were found.
    --- @param table table
    --- @return boolean
    validate = function(table)
      return false
    end,
  },

  ustring = {
    --- The maximum allowed length of a pattern, in bytes.
    maxPatternLength = 10000,
    --- The maximum allowed length of a string, in bytes.
    maxStringLength = 2097152,
    --- If the string is considered as an array of bytes, returns the byte values for s[i], s[i+1], …, s[j].
    --- The default value for i is 1; the default value for j is i.
    --- @param s string
    --- @param i number optional
    --- @param j number optional
    --- @return table
    byte = function(s, i, j)
      return {}
    end,
    --- Returns the byte offset of a character in the string. The default for both `l` and `i` is 1.
    --- `i` may be negative, in which case it counts from the end of the string.
    ---
    --- The character at `l == 1` is the first character starting at or after byte `i`;
    --- the character at `l == 0` is the first character starting at or before byte `i`.
    --- Note this may be the same character. Greater or lesser values of `l` are calculated relative to these.
    --- @param s string
    --- @param l number optional
    --- @param i number optional
    --- @return number
    byteoffset = function(s, l, i)
      return 0
    end,
    --- Receives zero or more integers. Returns a string with length equal to the number of arguments,
    --- in which each character has the Unicode codepoint value equal to its corresponding argument.
    --- @vararg number
    --- @return string
    char = function(...)
      return ""
    end,
    --- Much like mw.ustring.byte(), except that the return values are codepoints
    --- and the offsets are characters rather than bytes.
    --- @param s string
    --- @param i number optional
    --- @param j number optional
    --- @return number
    codepoint = function(s, i, j)
      return 0
    end,
    --- Looks for the first match of `pattern` in the string s. If it finds a match, then `find` returns the offsets
    --- in `s` where this occurrence starts and ends; otherwise, it returns nil. If the pattern has captures,
    --- then in a successful match the captured values are also returned after the two indices.
    ---
    --- A third, optional numerical argument `init` specifies where to start the search; its default value is 1
    --- and can be negative. A value of true as a fourth, optional argument `plain` turns off the pattern matching
    --- facilities, so the function does a plain "find substring" operation, with no characters in pattern
    --- being considered "magic".
    ---
    --- Note that if `plain` is given, then `init` must be given as well.
    --- @param s string
    --- @param pattern string
    --- @param init number optional
    --- @param plain boolean optional
    --- @return string
    find = function(s, pattern, init, plain)
      return ""
    end,
    --- Returns a formatted version of its variable number of arguments following the description given
    --- in its first argument (which must be a string).
    ---
    --- The format string uses a limited subset of the `printf` format specifiers:
    --- - Recognized flags are '-', '+', ' ', '#', and '0'.
    --- - Integer field widths up to 99 are supported. '*' is not supported.
    --- - Integer precisions up to 99 are supported. '*' is not supported.
    --- - Length modifiers are not supported.
    --- - Recognized conversion specifiers are 'c', 'd', 'i', 'o', 'u', 'x', 'X', 'e', 'E', 'f', 'g', 'G', 's', '%',
    ---   and the non-standard 'q'.
    --- - Positional specifiers (e.g. "%2$s") are not supported.
    ---
    --- The conversion specifier 'q' is like 's', but formats the string in a form suitable to be safely read back
    --- by the Lua interpreter: the string is written between double quotes, and all double quotes, newlines,
    --- embedded zeros, and backslashes in the string are correctly escaped when written.
    ---
    --- Conversion between strings and numbers is performed as specified in Data types;
    --- other types are not automatically converted to strings. Strings containing NUL characters (byte value 0)
    --- are not properly handled.
    --- @param format string
    --- @vararg any
    --- @return string
    format = function(format, ...)
      return ""
    end,
    --- Returns three values for iterating over the codepoints in the string. `i` defaults to `1`, and j to -1.
    --- This is intended for use in the iterator form of `for`.
    --- @param s string
    --- @param i number optional
    --- @param j number optional
    --- @return fun(): number
    gcodepoint = function(s, i, j)
      return function()
        return 0
      end
    end,
    --- Returns an iterator function that, each time it is called, returns the next captures from `pattern`
    --- over string `s`. If `pattern` specifies no captures, then the whole match is produced in each call.
    ---
    --- For this function, a `'^'` at the start of a pattern is not magic, as this would prevent the iteration.
    --- It is treated as a literal character.
    --- @param s string
    --- @param pattern string
    --- @return fun(): string
    gmatch = function(s, pattern)
      return function()
        return ""
      end
    end,
    --- Returns a copy of `s` in which all (or the first `n`, if given) occurrences of the `pattern` have been replaced
    --- by a replacement string specified by `repl`, which can be a string, a table, or a function.
    --- `gsub` also returns, as its second value, the total number of matches that occurred.
    ---
    --- If `repl` is a string, then its value is used for replacement. The character `%` works as an escape character:
    --- any sequence in repl of the form `%d`, with d between 1 and 9, stands for the value of the d-th captured
    --- substring. The sequence `%0` stands for the whole match, and the sequence `%%` stands for a single `%`.
    ---
    --- If `repl` is a table, then the table is queried for every match, using the first capture as the key;
    --- if the pattern specifies no captures, then the whole match is used as the key.
    ---
    --- If `repl` is a function, then this function is called every time a match occurs, with all captured
    --- substrings passed as arguments, in order; if the pattern specifies no captures, then the whole match
    --- is passed as a sole argument.
    ---
    --- If the value returned by the table query or by the function call is a string or a number,
    --- then it is used as the replacement string; otherwise, if it is false or nil, then there is
    --- no replacement (that is, the original match is kept in the string).
    --- @param s string
    --- @param pattern string
    --- @param repl string|table|fun(s: string): string
    --- @param n number optional
    --- @return (string, number)
    gsub = function(s, pattern, repl, n)
      return "", 0
    end,
    --- Returns true if the string is valid UTF-8, false if not.
    --- @param s string
    --- @return boolean
    isutf8 = function(s)
      return false
    end,
    --- Returns the length of the string in codepoints, or nil if the string is not valid UTF-8.
    --- @return number|nil
    len = function(s)
      return 0 or nil
    end,
    --- Returns a copy of this string with all uppercase letters changed to lowercase.
    --- All other characters are left unchanged.
    ---
    --- If the Language library is also loaded, this will instead call `lc()` on the default language object.
    --- @param s string
    --- @return string
    lower = function(s)
      return ""
    end,
    --- Looks for the first match of pattern in the string. If it finds one, then `match` returns the captures
    --- from the pattern; otherwise it returns nil. If `pattern` specifies no captures, then the whole match
    --- is returned.
    ---
    --- A third, optional numerical argument `init` specifies where to start the search; its default value is 1
    --- and can be negative.
    --- @param s string
    --- @param pattern string
    --- @param init number optional
    --- @return string
    match = function(s, pattern, init)
      return ""
    end,
    --- Returns a string that is the concatenation of `n` copies of the string `s`.
    --- @param s string
    --- @param n number
    --- @return string
    rep = function(s, n)
      return ""
    end,
    --- Returns the substring of `s` that starts at `i` and continues until `j`; `i` and `j` can be negative.
    --- If `j` is nil or omitted, it will continue until the end of the string.
    ---
    --- In particular, the call `mw.ustring.sub(s, 1, j)` returns a prefix of `s` with length `j`,
    --- and `mw.ustring.sub(s, -i)` returns a suffix of `s` with length `i`.
    --- @param s string
    --- @param i number
    --- @param j number optional
    --- @return string
    sub = function(s, i, j)
      return ""
    end,
    --- Converts the string to Normalization Form C. Returns nil if the string is not valid UTF-8.
    --- @param s string
    --- @return string
    toNFC = function(s)
      return ""
    end,
    --- Converts the string to Normalization Form D. Returns nil if the string is not valid UTF-8.
    --- @param s string
    --- @return string
    toNFD = function(s)
      return ""
    end,
    --- Returns a copy of this string with all lowercase letters changed to uppercase.
    --- All other characters are left unchanged.
    ---
    --- If the Language library is also loaded, this will instead call `uc()` on the default language object.
    --- @param s string
    --- @return string
    upper = function(s)
      return ""
    end,
  },
}
