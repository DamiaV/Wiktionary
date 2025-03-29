import pywikibot as pwb
import re

site = pwb.Site()
for page in pwb.Page(site, title='Modèle:titre mis en forme').embeddedin():
    if page.namespace() in ['Category', 'Annexe', '']:
        previous = page.text
        page.text = re.sub(r'{{\s*(?:titre mis en forme|tmef)\s*\|\s*(1=)?',
                           r'{{titre incorrect|\1',
                           page.text)
        page.save(summary='Remplacement modèle "titre mis en forme" par "titre incorrect" '
                          '(voir [[Wiktionnaire:Gestion des modèles/2020#Remplacement de &#123;&#123;titre mis en '
                          'forme&#125;&#125; par &#123;&#123;titre incorrect&#125;&#125;]])')
