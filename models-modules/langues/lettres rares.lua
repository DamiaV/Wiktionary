local t = {}
-- Langues (attention ï̂ est décomposé en ï + ^ et ẖ en h + ̱ )
t["fr"] = {
  rare = "[" ..
      "æÆœŒ" ..
      "àÀìÌÒòùÙỳỲ" ..
      "áÁćĆíÍóÓúÚýÝźŹ" ..
      "ĉĈêÊîÎŝŜôÔûÛŵŴ" ..
      "äÄëËïÏöÖüÜÿŸ" ..
      "ãÃñÑõÕũŨ" ..
      "āĀēĒīĪōŌūŪ" ..
      "Ḕḕ" ..
      "åÅ" ..
      "çÇĢģĻļŅņŖŗȘșȚț" ..
      "ąĄęĘįĮǫǪųŲ" ..
      "čČďĎŘřǰŠšŽž" ..
      "ăĂĕĔğĞ" ..
      "Ằằ" ..
      "ıİ" ..
      "ĠġŻż" ..
      "ŐőŰű" ..
      "ḌḍḤḥḲḳḷḶṂṃṆṇṢṣṬṭ" ..
      "ꞓꞒÐðĦħƗɨłŁɬꞭⱠⱡƟɵØøŦŧɄʉ" ..
      "Ḫḫ" ..
      "ḎḏṮṯ" ..
      "Ľľ" ..
      "ꭒ" ..
      "ɓƁ" ..
      "ɑⱭꞵꞴɛƐɣƔɩƖĸꟚꟛꟜƛθΘꞷꞶꭓꞳχΧ" ..
      "ʃƩßẞþÞʊƱʋƲʒƷƹƸɂɁʔʕ" ..
      "ΑαΒβΓγΔδΕεΖζΗηΘθΙιΚκΛλΜμΝνΞξΟοΠπΡρΣςσΤτΥυΦφΧχΨψΩω" ..
      "ʌɅəƏǝƎɥꞍɔƆɯƜ" ..
      "ꜧꜦŋŊɲƝ" ..
      "ǀǁǂǃʘ" ..
      "·ʻʼʽʾʿꞌꞋꜣꜢꜥꜤ" ..
      "ʰⁿᵘᵛʷʸᶻᶿ" ..
      "ȝȜȣȢ" ..
      "ඞ" ..
      "]+" }
t["af"] = { rare = "[" ..
    "àÀäÄâÂòÒ" ..
    "]+" }
t["de"] = { rare = "[" ..
    "æÆœŒ" ..
    "àÀèÈìÌùÙ" ..
    "áÁéÉíÍóÓúÚźŹ" ..
    "âÂêÊîÎŝŜûÛŵŴ" ..
    "ëËïÏÿŸ" ..
    "ãÃõÕũŨ" ..
    "āĀēĒīĪōŌūŪ" ..
    "åÅ" ..
    "ąĄęĘįĮǫǪųŲ" ..
    "ɑⱭʌɅꞵꞴ" ..
    "çÇəƏǝƎɛƐğĞɣƔɩƖ" ..
    "ḷḶⱠⱡłŁɬꞭñÑŋŊɲƝɔƆ" ..
    "ÐðþÞØø" ..
    "ɑⱭꞵꞴɛƐɣƔɩƖĸλƛθΘꞷꞶꭓꞳχΧ" ..
    "ʃƩʊƱʋƲʒƷƹƸɂɁʔʕǀǁǂǃʘ" ..
    "ʌɅəƏǝƎɥꞍɔƆɯƜ" ..
    "ꜧꜦŋŊɲƝ" ..
    "·ʻʼʽʾʿꞌꞋꜣꜢꜥꜤʰⁿᵘᵛʷʸᶻᶿ" ..
    "ȝȜȣȢ" ..
    "]+" }
t["en"] = { rare = "[" ..
    "æÆœŒ" ..
    "àÀèÈìÌùÙ" ..
    "áÁéÉíÍóÓúÚźŹ" ..
    "âÂêÊîÎŝŜûÛŵŴ" ..
    "äÄëËïÏöÖüÜÿŸ" ..
    "ãÃõÕũŨ" ..
    "āĀēĒīĪōŌūŪ" ..
    "åÅ" ..
    "ąĄęĘįĮǫǪųŲ" ..
    "ɑⱭʌɅꞵꞴ" ..
    "çÇəƏǝƎɛƐğĞɣƔɩƖ" ..
    "ḷḶⱠⱡłŁɬꞭñÑŋŊɲƝɔƆ" ..
    "ÐðßẞþÞ" ..
    "ɑⱭꞵꞴɛƐɣƔɩƖĸλƛθΘꞷꞶꭓꞳχΧ" ..
    "ʃƩʊƱʋƲʒƷƹƸɂɁʔʕǀǁǂǃʘ" ..
    "ʌɅəƏǝƎɥꞍɔƆɯƜ" ..
    "ꜧꜦŋŊɲƝ" ..
    "·ʻʼʽʾʿꞌꞋꜣꜢꜥꜤʰⁿᵘᵛʷʸᶻᶿ" ..
    "ȝȜȣȢ" ..
    "ඞ" ..
    "]+" }
t["da"] = { rare = "[" .. "QqáÁéÉíÍóÓúÚýÝǽǼǿǾ" .. "]+" }
t["ca"] = { rare = "[" .. "·" .. "]+" }
t["ast"] = { rare = "[" .. "ḤḥḶḷ" .. "]+" }
t["frp"] = { rare = "[" .. "·" .. "]+" }
t["cy"] = { rare = "[" .. "ẄẅẂẃ" .. "]+" }
t["eo"] = { rare = "[" .. "ĈĉĜĝĤĥĴĵŜŝŬŭ" .. "]+" }
t["it"] = {
  rare = "[" ..
      "JjKkWwXxYy" ..
      "àÀèÈìÌòÒùÙ" ..
      "ÁáĆćéÉíÍŃńóÓúÚ" ..
      "ÂâÊêÎîÔôÛû" ..
      "äÄëËÏïÖöüÜ" ..
      "ÃãÑñ" ..
      "ČčĚěǦǧŘřŠšŽž" ..
      "ĖėĠġŻż" ..
      "ĀāĪīŌōŪū" ..
      "ḎḏṮṯ" ..
      "ḌḍḤḥṢṣṬṭ" ..
      "ÇçḨḩŞşŢţ" ..
      "ĐđĦħ" ..
      "Ḫḫ" ..
      "ƏəꞫɜ" ..
      "·ʿʾ" ..
      "]+"
}
t["fy"] = { rare = "[" .. "æÆœŒàÀáÁâÂäÄãÃāĀåÅ" .. "ꞵꞴçÇèÈéÉêÊëËēĒəƏǝƎɛƐğĞɣƔìÌíÍîÎïÏīĪɩƖ" .. "ḷḶłŁñÑŋŊɲƝòÒóÓöÖõÕōŌɔƆ" .. "ùÙúÚûÛüÜũŨūŪʋƲźŹɂɁʔ" .. "]+" }
t["nl"] = { rare = "[" .. "æÆœŒàÀâÂäÄãÃāĀåÅ" .. "ꞵꞴçÇèÈêÊëËēĒəƏǝƎɛƐğĞɣƔìÌîÎïÏīĪɩƖ" .. "ḷḶłŁñÑŋŊɲƝöÖõÕōŌɔƆ" .. "ùÙûÛüÜũŨūŪʋƲÝýźŹɂɁʔ" .. "]+" }
t["ar"] = { rare = "[" .. "ڤچ" .. "]+" }
t["aeb"] = { rare = "[" .. "ڥڨ" .. "]+" }
t["arq"] = { rare = "[" .. "ڥݣڨ" .. "]+" }
t["ary"] = { rare = "[" .. "ڤڥݣژظپ" .. "]+" }
t["arz"] = { rare = "[" .. "ڤچ" .. "]+" }
t["kl"] = { rare = "[" .. "BbCcDdWwXxYyZzÆæØøÅåĸ" .. "]+" }
t["rom"] = { rare = "[" .. "ÇçΘθWwƟɵ" .. "]+" }
t["scn"] = { rare = "[" .. "ḌḍKkWwÇçXxYyWwḤḥẒẓÜüÏïÌìÙùÂâÊêÎîÔôÛûÀàÈèÒòŠšÍíŞşĐđ" .. "]+" }
t["salentin"] = { rare = "[" .. "Δδẟ" .. "]+" }
t["gallo"] = { rare = "[" .. "·" .. "]+" }
t["shi"] = { rare = "[" .. "ⴴⴿⴸⵝⴵḴḵḎḏ" .. "]+" }
t["fi"] = { rare = "[" ..
    "Éé" ..
    "Èè" ..
    "ÔôÛû" ..
    "Õõ" ..
    "Īī" ..
    "ŠšŽž" ..
    "İı" ..
    "ËëÏïÜü" ..
    "Őő" ..
    "Ǧǧ" ..
    "Ůů" ..
    "Ąą" ..
    "Çç" ..
    "ŁłØø" ..
    "Ðð" ..
    "ßÞþ" ..
    "]+"
}
t["mg"] = { rare = "[" ..
    "Ôô" ..
    "Ỳỳ" ..
    "]+"
}
t["gallo-italique de Sicile"] = { rare = "[" .. "ẸẹỌọ" .. "]+" }
t["grc"] = { rare = "[" .. "Ϙϙ" .. "]+" }

return t
