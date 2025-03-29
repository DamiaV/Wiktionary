import pywikibot as pwb

site = pwb.Site()
pages = pwb.Page(site, title='Modèle:syllabaire cherokee').embeddedin()

for page in pages:
    page.text = page.text.replace("""\
{|width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;margin-bottom:0.5em;background:transparent"
|-valign="top"
|style="padding-right:0.5em"|
__TOC__
|
{{syllabaire cherokee}}
|}

""", '')
    page.text = page.text.replace('* {{WP|Syllabaire cherokee}}',
                                  '* {{WP|Syllabaire cherokee}}\n{{syllabaire cherokee}}')
    page.save(summary='Déplacement du modèle {{syllabaire cherokee}}')
