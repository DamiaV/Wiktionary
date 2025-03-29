import pywikibot as pwb

pwb.config.put_throttle = 0
site = pwb.Site()

for page in pwb.Page(site, 'Modèle:lien').embeddedin():
    pass
