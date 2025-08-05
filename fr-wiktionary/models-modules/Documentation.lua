-- Ce module implémente le modèle {{Méta documentation de modèle}}.

local p = {}

local function existePage(page)
	return page and page.exists
end

local function textPagebase(page)
	--On n'est pas dans une sous-page
	if not page.isSubpage then
		return page.text
	end

	--On est dans une sous-page
	local sousPage = page.subpageText
	if sousPage == 'Documentation'
	or sousPage == 'Bac à sable'
	or sousPage == 'Test' then
		return page.baseText
	else
		return page.text
	end
end

local function nomSouspage(page, souspage)
	return page.subjectNsText .. ':' .. textPagebase(page) .. '/' .. souspage
end

local function lienUrl(nomPage, texteLien, action, pagePreload)
	local arguments = {}

	if action then
		arguments['action'] = action
	end

	if pagePreload then
		arguments['preload'] = 'Modèle:Documentation/' .. pagePreload
	end

	if arguments['action'] or arguments['preload'] then
		return mw.ustring.format('[%s %s]', nomPage:fullUrl(arguments), texteLien)
	else
		return mw.ustring.format('[[%s|%s]]', nomPage.fullText, texteLien)
	end
end

local function entete(args, page, doc, existeDoc)
	local res = mw.html.create('div')

	-- Titre
	res
		:css('margin-bottom', '1em')
		:css('border-bottom', '1px solid #aaa')
		:css('padding-bottom', '3px')
		:wikitext('[[Fichier:OOjs UI icon-inspired wikiTemplateInfo.svg|50px|alt=|link=]]')
		:tag('span')
			:css('font-weight', 'bold')
			:css('font-size', '125%')
			:css('vertical-align', 'middle')
			:wikitext('&nbsp;')
			:wikitext(args.titre or 'Documentation')
			:done()

	-- Liens
	local editionLien = res:tag('span')
		:addClass('mw-editsection-like plainlinks')
		:css('vertical-align', 'middle')

	if args['aucun contenu additionnel'] == nil then
		if not args.contenu then
			if existeDoc then
				editionLien
					:wikitext('&#91;')
					:wikitext(lienUrl(doc, 'voir'))
					:wikitext('&#93; ')

					:wikitext('&#91;')
					:wikitext(lienUrl(doc, 'modifier', 'edit'))
					:wikitext('&#93; ')

					:wikitext('&#91;')
					:wikitext(lienUrl(doc, 'historique', 'history'))
					:wikitext('&#93; ')
			else
				local pagePreload = 'Preload'
				if page.namespace == 828 then
					pagePreload = 'PreloadModule'
				end

				editionLien
					:wikitext('&#91;')
					:wikitext(lienUrl(doc, 'créer', 'edit', pagePreload))
					:wikitext('&#93; ')
			end
		end
	end

	editionLien
		:wikitext('&#91;')
		:wikitext(lienUrl(page, 'purger', 'purge'))
		:wikitext('&#93;')

	return res
end

local function protection(page, doc, existeDoc, message)
	-- Insertion automatique du modèle de protection.
	local niveauProtection = page.protectionLevels.edit

	if niveauProtection and niveauProtection[1] then
		local tableProtection = {
			autoconfirmed = {'semiProtection', '{{%s*[Ss]emi%-protection%s*[|}]', '{{%s*[Ss]emi%-protection +longue%s*[|}]'},
			editextendedsemiprotected = {'semiProtectionEtendue', '{{%s*[Ss]emi%-protection +étendue%s*[|}]'},
			sysop = {'protection', '{{%s*[Pp]rotection%s*[|}]'},
		}
		local protection = tableProtection[niveauProtection[1]]
		if not protection then
			return ''
		end

		local alreadyShown = false
		if existeDoc then
			-- Vérification qu'il n'y a pas déjà un modèle de
			-- protection dans la documentation du modèle.
			local contenuDoc = doc:getContent()
			if contenuDoc:match(protection[2]) or (protection[3] and contenuDoc:match(protection[3])) then
				alreadyShown = true
			end
		end

		if not alreadyShown then
			if message == '' then
				message = nil
			end
			return '' --require('Module:Protection').main({message}, protection[1], page) -- module inexistant
		end
	end
end

-- pour les bacs à sable, on retire les balises de catégories
-- habituellement situées en "includeonly" à la fin de la documentation
local function retireBalisesCategories(contenuDoc)
	local count
	repeat
		contenuDoc, count = mw.ustring.gsub(contenuDoc, '%[%[Catégorie:[^%]]+%]%][\t\r\n\f ]*$', '')
	until count == 0

	contenuDoc, count = mw.ustring.gsub(contenuDoc, '[\t\r\n\f ]*$', '')

	return contenuDoc
end

local function contenu(args, doc, existeDoc)
	local page = mw.title.getCurrentTitle()
	local res = mw.html.create():newline()

	-- Contenu auto haut
	if args['contenu auto haut'] then
		res:wikitext(args['contenu auto haut'])
		   :newline()
	end

	-- Contenu ou sous-page de doc
	if args['aucun contenu additionnel'] == nil then
		if args['page doc'] then
			res:newline()
			   :wikitext(args['page doc'])
			   :newline()

		elseif existeDoc then
			local contenuDoc = mw.getCurrentFrame():expandTemplate{title = doc.prefixedText}
			if page.subpageText == 'Bac à sable' or page.subpageText == 'Test' then
				contenuDoc = retireBalisesCategories(contenuDoc)
			end
			res:newline()
			   :wikitext(contenuDoc)
			   :newline()

		elseif page.subpageText ~= 'Bac à sable' and page.subpageText ~= 'Test' and args['contenu facultatif'] == nil then
			local texteBandeau = '<b>Ce %s ne possède aucune [[Aide:Documentation de modèle|documentation]] '
				..'explicative en sous-page</b>, pas même une description succincte.<br> '
				..'Vous pouvez %s afin de documenter ce %s adéquatement.'
			if page.namespace == 828 then -- Module
				texteBandeau = texteBandeau:format(
					'module',
					lienUrl(doc, 'créer cette sous-page', 'edit', 'PreloadModule'),
					'module'
				)
			else -- Modèle
				texteBandeau = texteBandeau:format(
					'modèle',
					lienUrl(doc, 'créer cette sous-page', 'edit', 'Preload'),
					'modèle'
				)
			end
			if page.namespace == 10 then -- Modèle
				texteBandeau = texteBandeau .. '[[Catégorie:Modèle sans documentation]]'
			elseif page.namespace == 828 then -- Module
				if page.text:sub(1, 12) == 'Utilisateur:' then
					-- Pas de catégorisation pour le pseudo-namespace "Module:Utilisateur:Toto/Nom du module"
				elseif existeDoc == false then
					texteBandeau = texteBandeau .. '[[Catégorie:Module sans documentation]]'
				end
			end
			local param = {
				['icône'] = 'OOjs_UI_icon_book-ltr.svg',
				alt = 'MIT',
				class = 'plainlinks',
				style = 'width:80%;',
				texte = texteBandeau,
			}
			res:wikitext(require('Module:Bandeau')._bandeau(param))
		end
	end

	-- Contenu auto bas
	if args['contenu auto bas'] then
		res:newline()
		   :wikitext(args['contenu auto bas'])
	end

	res
		:tag('div')
			:css('clear', 'both')

	return res
end

local function lienWstat(nomPage, texteLien)
	local nomPageEncoded = mw.text.encode(nomPage)
	local nomPageNoSpaces = mw.ustring.gsub(nomPageEncoded, ' ', '_')
	local url = 'https://wstat.fr/template/info/' .. nomPageNoSpaces
	return mw.ustring.format('[%s %s]', url, texteLien)
end

local function lienRechercheModule(nomModule, texteLien)
	local nomModuleEncoded = mw.text.encode(nomModule)
	local nomModuleNoSpaces = mw.ustring.gsub(nomModuleEncoded, ' ', '+')
	local quote = mw.text.encode('"')
	local url = 'https://fr.wikipedia.org/w/index.php?title=Spécial:Recherche&ns828=1&search=insource:' .. quote .. nomModuleNoSpaces .. quote
	return mw.ustring.format('[%s %s]', url, texteLien)
end

local function notice(args, page, doc, existeDoc)
	local res = mw.html.create('div')
		:css('border-top', '1px solid #aaa')
		:css('margin', '1.5em 0 0')

	local contenuParagraphe = res
		:tag('p')
			:addClass('plainlinks')
			:css('margin-bottom', '0')
			:css('padding-left', '1em')
			:css('font-style', 'italic')

	-- Phrase "la documentation est générée par ..."
	if args['nom modèle'] then
		local lienAide = '[[Aide:Modèle|modèle]]'
		if page.namespace == 828 then
			lienAide = '[[Aide:Module|module]]'
		end

		contenuParagraphe
			:wikitext('La [[Aide:Modèles/Comment documenter un modèle ?|documentation]] de ce ')
			:wikitext(lienAide)
			:wikitext(' est générée par le modèle ')
			:wikitext(mw.getCurrentFrame():expandTemplate{title = 'M', args = {args['nom modèle']} })
			:wikitext('.<br>')
	else
		contenuParagraphe
		:tag('span')
			:addClass('error')
			:wikitext('Erreur : le paramètre <code>nom modèle</code> n\'est pas renseigné.<br>')
	end

	-- Phrase indiquant la provenance du contenu (dans le corps ou en sous-page)
	if args['aucun contenu additionnel'] == nil then
		if args.contenu then
			contenuParagraphe
				:wikitext('Elle est directement [[Aide:Inclusion|incluse]] dans l\'appel de ce dernier. ')
				:wikitext('Si cette page est protégée, veuillez ')
				:wikitext('transférer le contenu de la documentation vers sa ')
				:wikitext(lienUrl(doc, 'sous-page dédiée', 'edit', 'Preload'))
				:wikitext('.<br>')
		elseif existeDoc then
			contenuParagraphe
				:wikitext('Elle est [[Aide:Inclusion|incluse]] depuis ')

			if args['page doc'] then
				contenuParagraphe
					:wikitext('la page [[')
					:wikitext(tostring(doc))
					:wikitext(']]. ')
			else
				contenuParagraphe
					:wikitext('sa [[')
					:wikitext(tostring(doc))
					:wikitext('|sous-page de documentation]]. ')
			end

			contenuParagraphe
				:wikitext('Veuillez placer les catégories sur cette page-là.<br>')
		end
	end

	-- Phrase indiquant les liens vers le bac à sable et la page de test
	contenuParagraphe
		:wikitext('Les éditeurs peuvent travailler dans le ')

	local titrePageBacasable = nomSouspage(page, 'Bac à sable')
	local pageBacasable = mw.title.new(titrePageBacasable)

	if existePage(pageBacasable) then
		contenuParagraphe
			:wikitext('[[' .. titrePageBacasable .. '|bac à sable]]&nbsp;')
			:tag('span')
				:css('font-size', '89%')
				:css('font-style', 'normal')
				:wikitext('(')
				:wikitext(lienUrl(pageBacasable, 'modifier', 'edit'))
				:wikitext(')')
	else
		local pagePreload = 'Preload2'
		if page.namespace == 828 then
			pagePreload = nil
		end
		contenuParagraphe
			:wikitext('bac à sable&nbsp;')
			:tag('span')
				:css('font-size', '89%')
				:css('font-style', 'normal')
				:wikitext('(')
				:wikitext(lienUrl(pageBacasable, 'créer', 'edit', pagePreload))
				:wikitext(')')
	end

	if page.namespace ~= 828 then
		contenuParagraphe:wikitext(' et la page de ')

		local titrePageTest = nomSouspage(page, 'Test')
		local pageTest = mw.title.new(titrePageTest)

		if existePage(pageTest) then
			contenuParagraphe
				:wikitext('[[' .. titrePageTest .. '|test]]&nbsp;')
				:tag('span')
					:css('font-size', '89%')
					:css('font-style', 'normal')
					:wikitext('(')
					:wikitext(lienUrl(pageTest, 'modifier', 'edit'))
					:wikitext(')')
		else
			contenuParagraphe
				:wikitext('test&nbsp;')
				:tag('span')
					:css('font-size', '89%')
					:css('font-style', 'normal')
					:wikitext('(')
					:wikitext(lienUrl(pageTest, 'créer', 'edit', 'Preload3'))
					:wikitext(')')
		end
	end
	contenuParagraphe:wikitext('.<br>')

	-- Phrase indiquant les liens vers les statistiques
	local nomStat, texteWstat
	if page.namespace == 828 then
		nomStat = 'Module:' .. textPagebase(page)
		texteWstat = "statistiques d'appel depuis le wikicode"
	else
		nomStat = textPagebase(page)
		texteWstat = "statistiques d'utilisation du modèle"
	end

	contenuParagraphe
		:wikitext('Voir les ')
		:wikitext(lienWstat(nomStat, texteWstat))
		:wikitext(" sur l'outil [[Aide:Wstat|wstat]]")

	if page.namespace == 828 then --pour les modules, recherche de "Module:..." dans l'espace de noms Module:
		contenuParagraphe
			:wikitext(' et les ')
			:wikitext(lienRechercheModule(nomStat, "appels depuis d'autres modules"))
	end

	contenuParagraphe:wikitext(".")

	return res
end

function p._documentation(args)
	local page = mw.title.getCurrentTitle()
	local titrePageDoc = nomSouspage(page, 'Documentation')
	local doc = mw.title.new(titrePageDoc)
	local existeDoc = existePage(doc)
	local res = mw.html.create()

	--Bandeau pour les sous-pages /Bac à sable
	if page.subpageText == 'Bac à sable' then
		res
			:tag('div')
				:css('clear', 'both')
				:done()
			:wikitext(mw.getCurrentFrame():expandTemplate{title = 'Sous-page de bac à sable'})
	end

	--Génération de la documentation
	local couleur = '#ecfcf4'
	if page.namespace == 828 then
		couleur = '#ecf0fc'
	end

	res
		:tag('div')
			:addClass('documentation')
			:css('clear', 'both')
			:css('margin', '1em 0 0 0')
			:css('padding', '0.5em 1em 0.8em')
			:node(entete(args, page, doc, existeDoc))
			:wikitext(protection(page, doc, existeDoc, args['message protection']))
			:node(contenu(args, doc, existeDoc))
			:node(notice(args, page, doc, existeDoc))

	-- Catégorisation par défaut pour les modules sans documentation
	if page.namespace == 828 and page.subpageText ~= 'Bac à sable' and page.subpageText ~= 'Test' then
		if existeDoc == false then
			res:wikitext("[[Catégorie:Module en langage Lua]]")
		end
	end

	return tostring(res)
end

function p.documentation(frame)
	local args = {}
	local argsParent = frame:getParent().args

	--Paramètres vides interprétés par Lua
	for cle, val in pairs(argsParent) do
		val = mw.text.trim(val)
		if val ~= '' then
			args[cle] = val
		end
	end

	return p._documentation(args)
end

return p
