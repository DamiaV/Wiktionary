local m_table = require("Module:table")

local data = {
  ["absoudre"] = {
    ending = "soudre",
    endings = {
      participe = {
        present = { "solvant" },
        passe = { "sous" },
      },
      indicatif = {
        present = { "sous", "sous", "sout", "solvons", "solvez", "solvent" },
        imparfait = { "solvais", "solvais", "solvait", "solvions", "solviez", "solvaient" },
        passeSimple = { "solus", "solus", "solut", "solûmes", "solûtes", "solurent" },
        futur = { "soudrai", "soudras", "soudra", "soudrons", "soudrez", "soudront" },
      },
      subjonctif = {
        present = { "solve", "solves", "solve", "solvions", "solviez", "solvent" },
        imparfait = { "solusse", "solusses", "solût", "solussions", "solussiez", "solussent" },
      },
      conditionnel = {
        present = { "soudrais", "soudrais", "soudrait", "soudrions", "soudriez", "soudraient" },
      },
      imperatif = {
        present = { "sous", "solvons", "solvez" },
      },
    },
  },
  ["acquérir"] = {
    ending = "quérir",
    endings = {
      participe = {
        present = { "quérant" },
        passe = { "quis" },
      },
      indicatif = {
        present = { "quiers", "quiers", "quiert", "quérons", "quérez", "quièrent" },
        imparfait = { "quérais", "quérais", "quérait", "quérions", "quériez", "quéraient" },
        passeSimple = { "quis", "quis", "quit", "quîmes", "quîtes", "quirent" },
        futur = { "querrai", "querras", "querra", "querrons", "querrez", "querront" },
      },
      subjonctif = {
        present = { "quière", "quières", "quière", "quérions", "quériez", "quièrent" },
        imparfait = { "quisse", "quisses", "quît", "quissions", "quissiez", "quissent" },
      },
      conditionnel = {
        present = { "querrais", "querrais", "querrait", "querrions", "querriez", "querraient" },
      },
      imperatif = {
        present = { "quiers", "quérons", "quérez" },
      },
    },
  },
  ["aller"] = {
    ending = "aller",
    endings = {
      participe = {
        present = { "allant" },
        passe = { "allé" },
      },
      indicatif = {
        present = { "vais", "vas", "va", "allons", "allez", "vont" },
        imparfait = { "allais", "allais", "allait", "allions", "alliez", "allaient" },
        passeSimple = { "allai", "allas", "alla", "allâmes", "allâtes", "allèrent" },
        futur = { "irai", "iras", "ira", "irons", "irez", "iront" },
      },
      subjonctif = {
        present = { "aille", "ailles", "aille", "allions", "alliez", "aillent" },
        imparfait = { "allasse", "allasses", "allât", "allassions", "allassiez", "allassent" },
      },
      conditionnel = {
        present = { "irais", "irais", "irait", "irions", "iriez", "iraient" },
      },
      imperatif = {
        present = { "va", "allons", "allez" },
      },
    },
  },
  ["asseoir"] = {
    ending = "asseoir",
    endings = {
      participe = {
        present = { "asseyant" },
        passe = { "assis" },
      },
      indicatif = {
        present = { "assieds", "assieds", "assied", "asseyons", "asseyez", "asseyent" },
        imparfait = { "asseyais", "asseyais", "asseyait", "asseyions", "asseyiez", "asseyaient" },
        passeSimple = { "assis", "assis", "assit", "assîmes", "assîtes", "assirent" },
        futur = { "assiérai", "assiéras", "assiéra", "assiérons", "assiérez", "assiéront" },
      },
      subjonctif = {
        present = { "asseye", "asseyes", "asseye", "asseyions", "asseyiez", "asseyent" },
        imparfait = { "assisse", "assisses", "assît", "assissions", "assissiez", "assissent" },
      },
      conditionnel = {
        present = { "assiérais", "assiérais", "assiérait", "assiérions", "assiérions", "assiéraient" },
      },
      imperatif = {
        present = { "assieds", "asseyons", "asseyez" },
      },
    },
  },
  ["avoir"] = {
    ending = "avoir",
    endings = {
      participe = {
        present = { "ayant" },
        passe = { "eu" },
      },
      indicatif = {
        present = { "ai", "as", "a", "avons", "avez", "ont" },
        imparfait = { "avais", "avais", "avait", "avions", "aviez", "avaient" },
        passeSimple = { "eus", "eus", "eut", "eûmes", "eûtes", "eurent" },
        futur = { "aurai", "auras", "aura", "aurons", "aurez", "auront" },
      },
      subjonctif = {
        present = { "aie", "aies", "ait", "ayons", "ayez", "aient" },
        imparfait = { "eusse", "eusses", "eût", "eussions", "eussiez", "eussent" }
      },
      conditionnel = {
        present = { "aurais", "aurais", "aurait", "aurions", "auriez", "auraient" }
      },
      imperatif = {
        present = { "aie", "ayons", "ayez" }
      },
    },
  },
  ["battre"] = {
    ending = "battre",
    endings = {
      participe = {
        present = { "battant" },
        passe = { "battu" },
      },
      indicatif = {
        present = { "bats", "bats", "bat", "battons", "battez", "battent" },
        imparfait = { "battais", "battais", "battait", "battions", "battiez", "battaient" },
        passeSimple = { "battis", "battis", "battit", "battîmes", "battîtes", "battirent" },
        futur = { "battrai", "battras", "battra", "battrons", "battrez", "battront" },
      },
      subjonctif = {
        present = { "batte", "battes", "batte", "battions", "battiez", "battent" },
        imparfait = { "battisse", "battisses", "battît", "battissions", "battissiez", "battissent" },
      },
      conditionnel = {
        present = { "battrais", "battrais", "battrait", "battrions", "battriez", "battraient" },
      },
      imperatif = {
        present = { "bats", "battons", "battez" },
      },
    },
  },
  ["boire"] = {
    ending = "boire",
    endings = {
      participe = {
        present = { "buvant" },
        passe = { "bu" },
      },
      indicatif = {
        present = { "bois", "bois", "boit", "buvons", "buvez", "boivent" },
        imparfait = { "buvais", "buvais", "buvait", "buvions", "buviez", "buvaient" },
        passeSimple = { "bus", "bus", "but", "bûmes", "bûtes", "burent" },
        futur = { "boirai", "boiras", "boira", "boirons", "boirez", "boiront" },
      },
      subjonctif = {
        present = { "boive", "boives", "boive", "buvions", "buviez", "boivent" },
        imparfait = { "busse", "busses", "bût", "bussions", "bussiez", "bussent" },
      },
      conditionnel = {
        present = { "boirais", "boirais", "boirait", "boirions", "boiriez", "boiraient" },
      },
      imperatif = {
        present = { "bois", "buvons", "buvez" },
      }
    },
  },
  ["bouillir"] = {
    ending = "bouillir",
    endings = {
      participe = {
        present = { "bouillant" },
        passe = { "bouilli" },
      },
      indicatif = {
        present = { "bous", "bous", "bout", "bouillons", "bouillez", "bouillent" },
        imparfait = { "bouillais", "bouillais", "bouillait", "bouillions", "bouilliez", "bouillaient" },
        passeSimple = { "bouillis", "bouillis", "bouillit", "bouillîmes", "bouillîtes", "bouillirent" },
        futur = { "bouillirai", "bouilliras", "bouillira", "bouillirons", "bouillirez", "bouilliront" },
      },
      subjonctif = {
        present = { "bouille", "bouilles", "bouille", "bouillions", "bouilliez", "bouillent" },
        imparfait = { "bouillisse", "bouillisses", "bouillît", "bouillissions", "bouillissiez", "bouillissent" },
      },
      conditionnel = {
        present = { "bouillirais", "bouillirais", "bouillirait", "bouillirions", "bouilliriez", "bouilliraient" },
      },
      imperatif = {
        present = { "bous", "bouillons", "bouillez" },
      },
    },
  },
  ["clore"] = {
    ending = "clore",
    endings = {
      participe = {
        present = { "closant" },
        passe = { "clos" },
      },
      indicatif = {
        present = { "clos", "clos", "clôt", "closons", "closez", "closent" },
        imparfait = { "closais", "closais", "closait", "closions", "closiez", "closaient" },
        passeSimple = { "closis", "closis", "closit", "closîmes", "closîtes", "closirent" },
        futur = { "clorai", "cloras", "clora", "clorons", "clorez", "cloront" },
      },
      subjonctif = {
        present = { "close", "closes", "close", "closions", "closiez", "closent" },
        imparfait = { "closisse", "closisses", "closît", "closissions", "closissiez", "closissent" },
      },
      conditionnel = {
        present = { "clorais", "clorais", "clorait", "clorions", "cloriez", "cloraient" },
      },
      imperatif = {
        present = { "clos", "closons", "closez" },
      },
    },
  },
  ["confire"] = {
    ending = "ire",
    endings = {
      participe = {
        present = { "isant" },
        passe = { "it" },
      },
      indicatif = {
        present = { "is", "is", "it", "isons", "isez", "isent" },
        imparfait = { "isais", "isais", "isait", "isions", "isiez", "isaient" },
        passeSimple = { "is", "is", "it", "îmes", "îtes", "irent" },
        futur = { "irai", "iras", "ira", "irons", "irez", "iront" },
      },
      subjonctif = {
        present = { "ise", "ises", "ise", "ision", "isiez", "isent" },
        imparfait = { "isse", "isses", "ît", "issions", "issiez", "issent" },
      },
      conditionnel = {
        present = { "irais", "irais", "irait", "irions", "iriez", "iraient" },
      },
      imperatif = {
        present = { "is", "isons", "isez" },
      },
    },
  },
  ["coudre"] = {
    ending = "coudre",
    endings = {
      participe = {
        present = { "cousant" },
        passe = { "cousu" },
      },
      indicatif = {
        present = { "couds", "couds", "coud", "cousons", "cousez", "cousent" },
        imparfait = { "cousais", "cousais", "cousait", "cousions", "cousiez", "cousaient" },
        passeSimple = { "cousis", "cousis", "cousit", "cousîmes", "cousîtes", "cousirent" },
        futur = { "coudrai", "coudras", "coudra", "coudrons", "coudrez", "coudront" },
      },
      subjonctif = {
        present = { "couse", "couses", "couse", "cousions", "cousiez", "cousent" },
        imparfait = { "cousisses", "cousisses", "cousît", "cousissions", "cousissiez", "cousissent" },
      },
      conditionnel = {
        present = { "coudrais", "coudrais", "coudrait", "coudrions", "coudriez", "coudraient" },
      },
      imperatif = {
        present = { "couds", "cousons", "cousez" }
      },
    },
  },
  ["courir"] = {
    ending = "courir",
    endings = {
      participe = {
        present = { "courant" },
        passe = { "couru" },
      },
      indicatif = {
        present = { "cours", "cours", "court", "courons", "courez", "courent" },
        imparfait = { "courais", "courais", "courait", "courions", "couriez", "couraient" },
        passeSimple = { "courus", "courus", "courut", "courûmes", "courûtes", "coururent" },
        futur = { "courrai", "courras", "courra", "courrons", "courrez", "courront" },
      },
      subjonctif = {
        present = { "coure", "coures", "coure", "courions", "couriez", "courent" },
        imparfait = { "courusse", "courusses", "courût", "courussions", "courussiez", "courussent" },
      },
      conditionnel = {
        present = { "courrais", "courrais", "courrait", "courrions", "courriez", "courraient" },
      },
      imperatif = {
        present = { "cours", "courons", "courez" },
      },
    },
  },
  ["croire"] = {
    ending = "croire",
    endings = {
      participe = {
        present = { "croyant" },
        passe = { "cru" },
      },
      indicatif = {
        present = { "crois", "crois", "croit", "croyons", "croyez", "croient" },
        imparfait = { "croyais", "croyais", "croyait", "croyions", "croyiez", "croyaient" },
        passeSimple = { "crus", "crus", "crut", "crûmes", "crûtes", "crurent" },
        futur = { "croirai", "croiras", "croira", "croirons", "croirez", "croiront" },
      },
      subjonctif = {
        present = { "croie", "croies", "croie", "croyions", "croyiez", "croient" },
        imparfait = { "crusse", "crusses", "crût", "crussions", "crussiez", "crussent" },
      },
      conditionnel = {
        present = { "croirais", "croirais", "croirait", "croirions", "croiriez", "croiraient" },
      },
      imperatif = {
        present = { "crois", "croyons", "croyez" },
      }
    },
  },
  ["croître"] = {
    ending = "croître",
    endings = {
      participe = {
        present = { "croissant" },
        passe = { "crû" },
      },
      indicatif = {
        present = { "croîs", "croîs", "croît", "croissons", "croissez", "croissent" },
        imparfait = { "croissais", "croissais", "croissait", "croissions", "croissiez", "croissaient" },
        passeSimple = { "crûs", "crûs", "crût", "crûmes", "crûtes", "crûrent" },
        futur = { "croîtrai", "croîtrais", "croîtra", "croîtrons", "croîtrez", "croîtront" },
      },
      subjonctif = {
        present = { "croisse", "croisses", "croisse", "croissions", "croissiez", "croissent" },
        imparfait = { "crûsse", "crûsses", "crût", "crûssions", "crûssiez", "crûssent" },
      },
      conditionnel = {
        present = { "croîtrais", "croîtrais", "croîtrait", "croîtrions", "croîtriez", "croîtraient" },
      },
      imperatif = {
        present = { "croîs", "croissons", "croissez" },
      },
    },
  },
  ["cuire"] = {
    ending = "uire",
    endings = {
      participe = {
        present = { "uisant" },
        passe = { "uit" },
      },
      indicatif = {
        present = { "uis", "uis", "uit", "uisons", "uisez", "uisent" },
        imparfait = { "uisais", "uisais", "uisait", "uisions", "uisiez", "uisaient" },
        passeSimple = { "uisis", "uisis", "uisit", "uisîmes", "uisîtes", "uisirent" },
        futur = { "uirai", "uiras", "uira", "uirons", "uirez", "uiront" },
      },
      subjonctif = {
        present = { "uise", "uises", "uise", "uisions", "uisiez", "uisent" },
        imparfait = { "uisisse", "uisisses", "uisît", "uisissions", "uisissiez", "uisissent" },
      },
      conditionnel = {
        present = { "uirais", "uirais", "uirait", "uirions", "uiriez", "uiraient" },
      },
      imperatif = {
        present = { "uis", "uisons", "uisez" },
      },
    },
  },
  ["cueillir"] = {
    ending = "cueillir",
    endings = {
      participe = {
        present = { "cueillant" },
        passe = { "cueilli" },
      },
      indicatif = {
        present = { "cueille", "cueilles", "cueille", "cueillons", "cueillez", "cueillent" },
        imparfait = { "cueillais", "cueillais", "cueillait", "cueillions", "cueilliez", "cueillaient" },
        passeSimple = { "cueillis", "cueillis", "cueillit", "cueillîmes", "cueillîtes", "cueillirent" },
        futur = { "cueillerai", "cueilleras", "cueillera", "cueillerons", "cueillerez", "cueilleront" },
      },
      subjonctif = {
        present = { "cueille", "cueilles", "cueille", "cueillions", "cueilliez", "cueillent" },
        imparfait = { "cueillisse", "cueillisses", "cueillît", "cueillissions", "cueillissiez", "cueillissent" },
      },
      conditionnel = {
        present = { "cueillerais", "cueillerais", "cueillerait", "cueillerions", "cueilleriez", "cueilleraient" },
      },
      imperatif = {
        present = { "cueille", "cueillons", "cueillez" },
      },
    },
  },
  ["défaillir"] = {
    ending = "aillir",
    endings = {
      participe = {
        present = { "aillant" },
        passe = { "ailli" },
      },
      indicatif = {
        present = { "aille", "ailles", "aille", "aillons", "aillez", "aillent" },
        imparfait = { "aillais", "aillais", "aillait", "aillions", "ailliez", "aillaient" },
        passeSimple = { "aillis", "aillis", "aillit", "aillîmes", "aillîtes", "aillirent" },
        futur = { "aillirai", "ailliras", "aillira", "aillirons", "aillirez", "ailliront" },
      },
      subjonctif = {
        present = { "aille", "ailles", "aille", "aillions", "ailliez", "aillent" },
        imparfait = { "aillisse", "aillisses", "aillît", "aillissions", "aillissiez", "aillissent" },
      },
      conditionnel = {
        present = { "aillirais", "aillirais", "aillirait", "aillirions", "ailliriez", "ailliraient" },
      },
      imperatif = {
        present = { "aille", "aillons", "aillez" },
      },
    },
  },
  ["devoir"] = {
    ending = "devoir",
    endings = {
      participe = {
        present = { "devant" },
        passe = { "dû" },
      },
      indicatif = {
        present = { "dois", "dois", "doit", "devons", "devez", "doivent" },
        imparfait = { "devais", "devais", "devait", "devions", "deviez", "devaient" },
        passeSimple = { "dus", "dus", "dut", "dûmes", "dûtes", "durent" },
        futur = { "devrai", "devras", "devra", "devrons", "devrez", "devront" },
      },
      subjonctif = {
        present = { "doive", "doives", "doive", "devions", "deviez", "doivent" },
        imparfait = { "dusse", "dusses", "dût", "dussions", "dussiez", "dussent" },
      },
      conditionnel = {
        present = { "devrais", "devrais", "devrait", "devrions", "devriez", "devraient" },
      },
      imperatif = {
        present = { "dois", "devons", "devez" },
      },
    },
  },
  ["dormir"] = {
    ending = "dormir",
    endings = {
      participe = {
        present = { "dormant" },
        passe = { "dormi" },
      },
      indicatif = {
        present = { "dors", "dors", "dort", "dormons", "dormez", "dorment" },
        imparfait = { "dormais", "dormais", "dormait", "dormions", "dormiez", "dormaient" },
        passeSimple = { "dormis", "dormis", "dormit", "dormîmes", "dormîtes", "dormirent" },
        futur = { "dormirai", "dormiras", "dormirait", "dormirons", "dormirez", "dormiront" },
      },
      subjonctif = {
        present = { "dorme", "dormes", "dorme", "dormions", "dormiez", "dorment" },
        imparfait = { "dormisse", "dormisses", "dormît", "dormissions", "dormissiez", "dormissent" },
      },
      conditionnel = {
        present = { "dormirais", "dormirais", "dormirait", "dormirions", "dormiriez", "dormiraient" },
      },
      imperatif = {
        present = { "dors", "dormons", "dormez" },
      },
    },
  },
  ["éclore"] = {
    ending = "éclore",
    endings = {
      participe = {
        present = { "éclosant" },
        passe = { "éclos" },
      },
      indicatif = {
        present = { "éclos", "éclos", "éclôt", "éclosons", "éclosez", "éclosent" },
        imparfait = { "éclosais", "éclosais", "éclosait", "éclosions", "éclosiez", "éclosaient" },
        passeSimple = { "éclosis", "éclosis", "éclosit", "éclosîmes", "éclosîtes", "éclosirent" },
        futur = { "éclorai", "écloras", "éclora", "éclorons", "éclorez", "écloront" },
      },
      subjonctif = {
        present = { "éclose", "écloses", "éclose", "éclosions", "éclosiez", "éclosent" },
        imparfait = { "éclosisse", "éclosisses", "éclosît", "éclosissions", "éclosissiez", "éclosissent" },
      },
      conditionnel = {
        present = { "éclorais", "éclorais", "éclorait", "éclorions", "écloriez", "écloraient" },
      },
      imperatif = {
        present = { "éclos", "éclosons", "éclosez" },
      },
    },
  },
  ["écrire"] = {
    ending = "crire",
    endings = {
      participe = {
        present = { "crivant" },
        passe = { "crit" },
      },
      indicatif = {
        present = { "cris", "cris", "crit", "crivons", "crivez", "crivent" },
        imparfait = { "crivais", "crivais", "crivait", "crivions", "criviez", "crivaient" },
        passeSimple = { "crivis", "crivis", "crivit", "crivîmes", "crivîtes", "crivirent" },
        futur = { "crirai", "criras", "crira", "crirons", "crirez", "criront" },
      },
      subjonctif = {
        present = { "crive", "crives", "crive", "crivions", "criviez", "crivent" },
        imparfait = { "crivisse", "crivisses", "crivît", "crivissions", "crivissiez", "crivissent" },
      },
      conditionnel = {
        present = { "crirais", "crirais", "crirait", "cririons", "cririez", "criraient" },
      },
      imperatif = {
        present = { "cris", "crivons", "crivez" },
      },
    },
  },
  ["être"] = {
    ending = "être",
    endings = {
      participe = {
        present = { "étant" },
        passe = { "été" },
      },
      indicatif = {
        present = { "suis", "es", "est", "sommes", "êtes", "sont" },
        imparfait = { "étais", "étais", "était", "étions", "étiez", "étaient" },
        passeSimple = { "fus", "fus", "fut", "fûmes", "fûtes", "furent" },
        futur = { "serai", "seras", "sera", "serons", "serez", "seront" },
      },
      subjonctif = {
        present = { "sois", "sois", "soit", "soyons", "soyez", "soient" },
        imparfait = { "fusse", "fusses", "fût", "fussions", "fussiez", "fussent" }
      },
      conditionnel = {
        present = { "serais", "serais", "serait", "serions", "seriez", "seraient" }
      },
      imperatif = {
        present = { "sois", "soyons", "soyez" }
      },
    },
  },
  ["faire"] = {
    ending = "faire",
    endings = {
      participe = {
        present = { "faisant" },
        passe = { "fait" },
      },
      indicatif = {
        present = { "fais", "fais", "fait", "faisons", "faites", "font" },
        imparfait = { "faisais", "faisais", "faisait", "faisions", "faisiez", "faisaient" },
        passeSimple = { "fis", "fis", "fit", "fîmes", "fîtes", "firent" },
        futur = { "ferai", "feras", "fera", "ferons", "ferez", "feront" },
      },
      subjonctif = {
        present = { "fasse", "fasses", "fasse", "fassions", "fassiez", "fassent" },
        imparfait = { "fisse", "fisses", "fît", "fissions", "fissiez", "fissent" },
      },
      conditionnel = {
        present = { "ferais", "ferais", "ferait", "ferions", "feriez", "feraient" },
      },
      imperatif = {
        present = { "fais", "faisons", "faisez" },
      },
    },
  },
  ["fuir"] = {
    ending = "fuir",
    endings = {
      participe = {
        present = { "fuyant" },
        passe = { "fui" },
      },
      indicatif = {
        present = { "fuis", "fuis", "fuit", "fuyons", "fuyez", "fuient" },
        imparfait = { "fuyais", "fuyais", "fuyait", "fuyions", "fuyiez", "fuyaient" },
        passeSimple = { "fuis", "fuis", "fuit", "fuîmes", "fuîtes", "fuirent" },
        futur = { "fuirai", "fuiras", "fuira", "fuirons", "fuirez", "fuiront" },
      },
      subjonctif = {
        present = { "fuie", "fuies", "fuie", "fuyions", "fuyiez", "fuient" },
        imparfait = { "fuisse", "fuisses", "fuît", "fuissions", "fuissiez", "fuissent" },
      },
      conditionnel = {
        present = { "fuirais", "fuirais", "fuirait", "fuirions", "fuiriez", "fuiraient" },
      },
      imperatif = {
        present = { "fuis", "fuyons", "fuyez" },
      },
    },
  },
  ["inclure"] = {
    ending = "clure",
    endings = {
      participe = {
        present = { "cluant" },
        passe = { "clus" },
      },
      indicatif = {
        present = { "clus", "clus", "clut", "cluons", "cluez", "cluent" },
        imparfait = { "clais", "cluais", "clait", "cluions", "cluiez", "cluaient" },
        passeSimple = { "clus", "clus", "clut", "clûmes", "clûtes", "clurent" },
        futur = { "clurai", "cluras", "clura", "clurons", "clurez", "cluront" },
      },
      subjonctif = {
        present = { "clue", "clues", "clue", "cluions", "cluiez", "cluent" },
        imparfait = { "clusse", "clusses", "clût", "clussions", "clussiez", "clussent" },
      },
      conditionnel = {
        present = { "clurais", "clurais", "clurait", "clurions", "cluriez", "cluraient" },
      },
      imperatif = {
        present = { "clus", "cluons", "cluez" },
      },
    },
  },
  ["lire"] = {
    ending = "lire",
    endings = {
      participe = {
        present = { "lisant" },
        passe = { "lu" },
      },
      indicatif = {
        present = { "lis", "lis", "lit", "lisons", "lisez", "lisont" },
        imparfait = { "lisais", "lisais", "lisait", "lisions", "lisiez", "lisaient" },
        passeSimple = { "lus", "lus", "lut", "lûmes", "lûtes", "lurent" },
        futur = { "lirai", "liras", "lira", "lirons", "lirez", "liront" },
      },
      subjonctif = {
        present = { "lise", "lises", "lise", "lisions", "lisiez", "lisent" },
        imparfait = { "lusse", "lusses", "lût", "lussions", "lussiez", "lussent" },
      },
      conditionnel = {
        present = { "lirais", "lirais", "lirait", "lirions", "liriez", "liraient" },
      },
      imperatif = {
        present = { "lis", "lisons", "lisez" },
      },
    },
  },
  ["maudire"] = {
    ending = "maudire",
    endings = {
      participe = {
        present = { "maudissant" },
        passe = { "maudit" },
      },
      indicatif = {
        present = { "maudis", "maudis", "maudit", "maudissons", "maudissez", "maudissent" },
        imparfait = { "maudissais", "maudissais", "maudissait", "maudissions", "maudissiez", "maudissaient" },
        passeSimple = { "maudis", "maudis", "maudit", "maudîmes", "maudîtes", "maudirent" },
        futur = { "maudirai", "maudiras", "maudira", "maudiront", "maudirez", "maudiront" },
      },
      subjonctif = {
        present = { "maudisse", "maudisses", "maudisse", "maudissions", "maudissiez", "maudissent" },
        imparfait = { "maudisse", "maudisses", "maudît", "maudissions", "maudissiez", "maudissent" },
      },
      conditionnel = {
        present = { "maudirais", "maudirais", "maudirait", "maudirions", "maudiriez", "maudiraient" },
      },
      imperatif = {
        present = { "maudis", "maudissons", "maudissez" },
      },
    },
  },
  ["mettre"] = {
    ending = "mettre",
    endings = {
      participe = {
        present = { "mettant" },
        passe = { "mis" },
      },
      indicatif = {
        present = { "mets", "mets", "met", "mettons", "mettez", "mettent" },
        imparfait = { "mettais", "mettais", "mettait", "mettions", "mettiez", "mettaient" },
        passeSimple = { "mis", "mis", "mit", "mîmes", "mîtes", "mirent" },
        futur = { "mettrai", "mettras", "mettra", "mettrons", "mettez", "mettront" },
      },
      subjonctif = {
        present = { "mette", "mettes", "mette", "mettions", "mettiez", "mettent" },
        imparfait = { "misse", "misses", "mît", "missions", "missiez", "missent" },
      },
      conditionnel = {
        present = { "mettrais", "mettrais", "mettrait", "mettrions", "mettriez", "mettraient" },
      },
      imperatif = {
        present = { "mets", "mettons", "mettez" },
      },
    },
  },
  ["moudre"] = {
    ending = "moudre",
    endings = {
      participe = {
        present = { "moulant" },
        passe = { "moulu" },
      },
      indicatif = {
        present = { "mouds", "mouds", "moud", "moulons", "moulez", "moulent" },
        imparfait = { "moulais", "moulais", "moulait", "moulions", "mouliez", "moulaient" },
        passeSimple = { "moulus", "moulus", "moulut", "moulûmes", "moulûtes", "moulurent" },
        futur = { "moudrai", "moudras", "moudra", "moudrons", "moudrez", "moudront" },
      },
      subjonctif = {
        present = { "moule", "moules", "moule", "moulions", "mouliez", "moulent" },
        imparfait = { "moulusse", "moulusses", "moulût", "moulussions", "moulussiez", "moulussent" },
      },
      conditionnel = {
        present = { "moudrais", "moudrais", "moudrait", "moudrions", "moudriez", "moudraient" },
      },
      imperatif = {
        present = { "mouds", "moulons", "moulez" },
      },
    },
  },
  ["mourir"] = {
    ending = "mourir",
    endings = {
      participe = {
        present = { "mourant" },
        passe = { "mort" },
      },
      indicatif = {
        present = { "meurs", "meurs", "meurt", "mourons", "mourez", "meurent" },
        imparfait = { "mourais", "mourais", "mourait", "mourions", "mouriez", "mouraient" },
        passeSimple = { "mourus", "mourus", "mourut", "mourûmes", "mourûtes", "moururent" },
        futur = { "mourrai", "mourras", "mourra", "mourrons", "mourrez", "mourront" },
      },
      subjonctif = {
        present = { "meure", "meures", "meure", "mourions", "mouriez", "meurent" },
        imparfait = { "mourusse", "mourusses", "mourût", "mourussions", "mourussiez", "mourussent" },
      },
      conditionnel = {
        present = { "mourrais", "mourrais", "mourrait", "mourrions", "mourriez", "mourraient" },
      },
      imperatif = {
        present = { "meurs", "mourons", "mourez" },
      },
    },
  },
  ["mouvoir"] = {
    ending = "mouvoir",
    endings = {
      participe = {
        present = { "mouvant" },
        passe = { "mû" },
      },
      indicatif = {
        present = { "meus", "meus", "meut", "mouvons", "mouvez", "meuvent" },
        imparfait = { "mouvais", "mouvais", "mouvait", "mouvions", "mouviez", "mouvaient" },
        passeSimple = { "mus", "mus", "mut", "mûmes", "mûtes", "murent" },
        futur = { "mouvrai", "mouvras", "mouvra", "mouvrons", "mouvrez", "mouvront" },
      },
      subjonctif = {
        present = { "meuve", "meuves", "meuve", "mouvions", "mouviez", "meuvent" },
        imparfait = { "musse", "musses", "mût", "mussions", "mussiez", "mussent" },
      },
      conditionnel = {
        present = { "mouvrais", "mouvrais", "mouvrait", "mouvrions", "mouvriez", "mouvraient" },
      },
      imperatif = {
        present = { "meus", "mouvons", "mouvez" },
      },
    },
  },
  ["naître"] = {
    ending = "naître",
    endings = {
      participe = {
        present = { "naissant" },
        passe = { "né" },
      },
      indicatif = {
        present = { "nais", "nais", "naît", "naissons", "naissez", "naissent" },
        imparfait = { "naissais", "naissais", "naissait", "naissions", "naissiez", "naissent" },
        passeSimple = { "naquis", "naquis", "naquit", "naquîmes", "naquîtes", "naquirent" },
        futur = { "naîtrai", "naîtras", "naîtra", "naîtrons", "naîtrez", "naîtront" },
      },
      subjonctif = {
        present = { "naisse", "naisses", "naisse", "naissions", "naissiez", "naissent" },
        imparfait = { "naquisse", "naquisses", "naquît", "naquissions", "naquissiez", "naquissent" },
      },
      conditionnel = {
        present = { "naîtrais", "naîtrais", "naîtrait", "naîtrions", "naîtriez", "naîtraient" },
      },
      imperatif = {
        present = { "nais", "naissons", "naissez" },
      },
    },
  },
  ["ouïr"] = {
    ending = "ouïr",
    ignore_auto = true,
    endings = {
      participe = {
        present = { "oyant" },
        passe = { "ouï" },
      },
      indicatif = {
        present = { "ois", "ois", "oit", "oyons", "oyez", "oient" },
        imparfait = { "oyais", "oyais", "oyait", "oyions", "oyiez", "oyaient" },
        passeSimple = { "ouïs", "ouïs", "ouït", "ouïmes", "ouïtes", "ouïrent" },
        futur = { "oirai", "oiras", "oira", "oirons", "oirez", "oiront" },
      },
      subjonctif = {
        present = { "oie", "oies", "oie", "oyions", "oyiez", "oient" },
        imparfait = { "oye", "oyes", "ouït", "oyions", "oyiez", "oient" },
      },
      conditionnel = {
        present = { "oirais", "oirais", "oirait", "oirions", "oiriez", "oiraient" },
      },
      imperatif = {
        present = { "ois", "oyons", "oyez" },
      },
    },
  },
  ["ouvrir"] = {
    ending = "ouvrir",
    endings = {
      participe = {
        present = { "ouvrant" },
        passe = { "ouvert" },
      },
      indicatif = {
        present = { "ouvre", "ouvres", "ouvre", "ouvrons", "ouvrez", "ouvrent" },
        imparfait = { "ouvrais", "ouvrais", "ouvrait", "ouvrions", "ouvriez", "ouvraient" },
        passeSimple = { "ouvris", "ouvris", "ouvrit", "ouvrîmes", "ouvrîtes", "ouvrirent" },
        futur = { "ouvrirais", "ouvriras", "ouvrira", "ouvrirons", "ouvrirez", "ouvriront" },
      },
      subjonctif = {
        present = { "ouvre", "ouvres", "ouvre", "ouvrions", "ouvriez", "ouvrent" },
        imparfait = { "ouvrisse", "ouvrisses", "ouvrît", "ouvrissions", "ouvrissiez", "ouvrissent" },
      },
      conditionnel = {
        present = { "ouvrirais", "ouvrirais", "ouvrirait", "ouvririons", "ouvririez", "ouvriraient" },
      },
      imperatif = {
        present = { "ouvre", "ouvrons", "ouvrez" },
      },
    },
  },
  ["paître"] = {
    ending = "aître",
    endings = {
      participe = {
        present = { "aissant" },
        passe = { "u" },
      },
      indicatif = {
        present = { "arais", "arais", "araît", "aissons", "aissez", "araissent" },
        imparfait = { "aissais", "aissais", "aissait", "aissions", "aissiez", "aissaient" },
        passeSimple = { "us", "us", "ut", "ûmes", "ûtes", "urent" },
        futur = { "aîtrai", "aîtras", "aîtra", "aîtrons", "aîtrez", "aîtront" },
      },
      subjonctif = {
        present = { "aisse", "aisses", "aisses", "aissions", "aissiez", "aissent" },
        imparfait = { "usse", "usses", "usse", "ussions", "ussiez", "ussent" },
      },
      conditionnel = {
        present = { "aîtrais", "aîtrais", "aîtrait", "aîtrions", "aîtriez", "aîtraient" },
      },
      imperatif = {
        present = { "ais", "aissons", "aissez" },
      },
    },
  },
  ["peindre"] = {
    ending = "indre",
    endings = {
      participe = {
        present = { "ignant" },
        passe = { "int" },
      },
      indicatif = {
        present = { "ins", "ins", "int", "ignons", "ignez", "ignent" },
        imparfait = { "ignais", "ignais", "ignait", "ignions", "igniez", "ignaient" },
        passeSimple = { "ignis", "ignis", "ignit", "ignîmes", "ignîtes", "ignirent" },
        futur = { "indrai", "indras", "indra", "indrons", "indrez", "indront" },
      },
      subjonctif = {
        present = { "igne", "ignes", "igne", "ignions", "igniez", "ignent" },
        imparfait = { "ignisse", "ignisses", "ignît", "ignissions", "ignissiez", "ignissent" },
      },
      conditionnel = {
        present = { "indrais", "indrais", "indrait", "indrions", "indriez", "indraient" },
      },
      imperatif = {
        present = { "ins", "ignons", "ignez" },
      },
    },
  },
  ["plaire"] = {
    ending = "aire",
    endings = {
      participe = {
        present = { "aisant" },
        passe = { "u" },
      },
      indicatif = {
        present = { "ais", "ais", "aît", "aisons", "aisez", "aisent" },
        imparfait = { "aisais", "aisais", "aisait", "aisions", "aisiez", "aisaient" },
        passeSimple = { "us", "us", "ut", "ûmes", "ûtes", "urent" },
        futur = { "airai", "airas", "aira", "airons", "airez", "airont" },
      },
      subjonctif = {
        present = { "aise", "aises", "aise", "aisions", "aisiez", "aisent" },
        imparfait = { "usse", "usses", "ût", "ussions", "ussiez", "ussent" },
      },
      conditionnel = {
        present = { "airais", "airais", "airait", "airions", "airiez", "airaient" },
      },
      imperatif = {
        present = { "ais", "aisons", "aisez" },
      },
    },
  },
  ["pourvoir"] = {
    ending = "pourvoir",
    endings = {
      participe = {
        present = { "pourvoyant" },
        passe = { "pourvu" },
      },
      indicatif = {
        present = { "pourvois", "pourvois", "pourvoit", "pourvoyons", "pourvoyez", "pourvoient" },
        imparfait = { "pourvoyais", "pourvoyais", "pourvoyait", "pourvoyions", "pourvoyiez", "pourvoyaient" },
        passeSimple = { "pourvus", "pourvus", "pourvut", "pourvûmes", "pourvûtes", "pourvurent" },
        futur = { "pourvoirai", "pourvoiras", "pourvoira", "pourvoirons", "pourvoirez", "pourvoiront" },
      },
      subjonctif = {
        present = { "pourvoie", "pourvoies", "pourvoie", "pourvoyions", "pourvoyiez", "pourvoient" },
        imparfait = { "pourvusse", "pourvusses", "pourvût", "pourvussions", "pourvussiez", "pourvussent" },
      },
      conditionnel = {
        present = { "pourvoirais", "pourvoirais", "pourvoirait", "pourvoirions", "pourvoiriez", "pourvoiraient" },
      },
      imperatif = {
        present = { "pourvois", "pourvoyons", "pourvoyez" },
      },
    },
  },
  ["pouvoir"] = {
    ending = "pouvoir",
    endings = {
      participe = {
        present = { "pouvant" },
        passe = { "pu" },
      },
      indicatif = {
        present = { "peux", "peux", "peut", "pouvons", "pouvez", "peuvent" },
        imparfait = { "pouvais", "pouvais", "pouvait", "pouvions", "pouviez", "pouvaient" },
        passeSimple = { "pus", "pus", "put", "pûmes", "pûtes", "purent" },
        futur = { "pourrai", "pourras", "pourra", "pourrons", "pourrez", "pourront" },
      },
      subjonctif = {
        present = { "puisse", "puisses", "puisse", "puissions", "puissiez", "puissent" },
        imparfait = { "pusse", "pusses", "pût", "pussions", "pussiez", "pussent" },
      },
      conditionnel = {
        present = { "pourrais", "pourrais", "pourrait", "pourrions", "pourriez", "pourraient" },
      },
    },
  },
  ["prédire"] = {
    ending = "dire",
    endings = {
      participe = {
        present = { "disant" },
        passe = { "dit" },
      },
      indicatif = {
        present = { "dis", "dis", "dit", "disons", "disez", "disent" },
        imparfait = { "disais", "disais", "disait", "disions", "disiez", "disaient" },
        passeSimple = { "dis", "dis", "dit", "dîmes", "dîtes", "dirent" },
        futur = { "dirai", "diras", "dira", "dirons", "direz", "diront" },
      },
      subjonctif = {
        present = { "dise", "dises", "dise", "disions", "disiez", "disent" },
        imparfait = { "disse", "disses", "dît", "dissions", "dissiez", "dissent" },
      },
      conditionnel = {
        present = { "dirais", "dirais", "dirait", "dirions", "diriez", "diraient" },
      },
      imperatif = {
        present = { "dis", "disons", "disez" },
      },
    },
  },
  ["prendre"] = {
    ending = "prendre",
    endings = {
      participe = {
        present = { "prenant" },
        passe = { "pris" },
      },
      indicatif = {
        present = { "prends", "prends", "prend", "prenons", "prenez", "prennent" },
        imparfait = { "prenais", "prenais", "prenait", "prenions", "preniez", "prenaient" },
        passeSimple = { "pris", "pris", "prit", "prîmes", "prîtes", "prirent" },
        futur = { "prendrai", "prendras", "prendra", "prendrons", "prendrez", "prendront" },
      },
      subjonctif = {
        present = { "prenne", "prennes", "prenne", "prenions", "preniez", "prennent" },
        imparfait = { "prisse", "prisses", "prît", "prissions", "prissiez", "prissent" },
      },
      conditionnel = {
        present = { "prendrais", "prendrais", "prendrait", "prendrions", "prendriez", "prendraient" },
      },
      imperatif = {
        present = { "prends", "prenons", "prenez" },
      },
    },
  },
  ["prévaloir"] = {
    ending = "prévaloir",
    endings = {
      participe = {
        present = { "prévalant" },
        passe = { "prévalu" },
      },
      indicatif = {
        present = { "prévaux", "prévaux", "prévaut", "prévalons", "prévalez", "prévalent" },
        imparfait = { "prévalais", "prévalais", "prévalait", "prévalions", "prévaliez", "prévalaient" },
        passeSimple = { "prévalus", "prévalus", "prévalut", "prévalûmes", "prévalûtes", "prévalurent" },
        futur = { "prévaudrai", "prévaudras", "prévaudra", "prévaudrons", "prévaudrez", "prévaudront" },
      },
      subjonctif = {
        present = { "prévale", "prévales", "prévale", "prévalions", "prévaliez", "prévalent" },
        imparfait = { "prévalusse", "prévalusses", "prévalût", "prévalussions", "prévalussiez", "prévalussent" },
      },
      conditionnel = {
        present = { "prévaudrais", "prévaudrais", "prévaudrait", "prévaudrions", "prévaudriez", "prévaudraient" },
      },
      imperatif = {
        present = { "prévaux", "prévalons", "prévalez" },
      },
    },
  },
  ["prévoir"] = {
    ending = "prévoir",
    endings = {
      participe = {
        present = { "prévoyant" },
        passe = { "prévu" },
      },
      indicatif = {
        present = { "prévois", "prévois", "prévoit", "prévoyons", "prévoyez", "prévoient" },
        imparfait = { "prévoyais", "prévoyais", "prévoyait", "prévoyions", "prévoyiez", "prévoyaient" },
        passeSimple = { "prévis", "prévis", "prévit", "prévîmes", "prévîtes", "prévirent" },
        futur = { "prévoirai", "prévoiras", "prévoira", "prévoirons", "prévoirez", "prévoiront" },
      },
      subjonctif = {
        present = { "prévoie", "prévoies", "prévoie", "prévoyions", "prévoyiez", "prévoient" },
        imparfait = { "prévisse", "prévisses", "prévît", "prévissions", "prévissiez", "prévissent" },
      },
      conditionnel = {
        present = { "prévoirais", "prévoirais", "prévoirait", "prévoirions", "prévoiriez", "prévoiraient" },
      },
      imperatif = {
        present = { "prévois", "prévoyons", "prévoyez" },
      },
    },
  },
  ["recevoir"] = {
    ending = "cevoir",
    endings = {
      participe = {
        present = { "cevant" },
        passe = { "çu" },
      },
      indicatif = {
        present = { "çois", "çois", "çoit", "cevons", "cevez", "çoivent" },
        imparfait = { "cevais", "cevais", "cevait", "cevions", "ceviez", "cevaient" },
        passeSimple = { "çus", "çus", "çut", "çûmes", "çûtes", "çurent" },
        futur = { "cevrai", "cevras", "cevra", "cevrons", "cevrez", "cevront" },
      },
      subjonctif = {
        present = { "çoive", "çoives", "çoive", "cevions", "ceviez", "çoivent" },
        imparfait = { "çusse", "çusses", "çût", "çussions", "çussiez", "çussent" },
      },
      conditionnel = {
        present = { "cevrais", "cevrais", "cevrait", "cevrions", "cevriez", "cevraient" },
      },
      imperatif = {
        present = { "çois", "cevons", "cevez" },
      },
    },
  },
  ["résoudre"] = {
    ending = "résoudre",
    endings = {
      participe = {
        present = { "résolvant" },
        passe = { "résolu" },
      },
      indicatif = {
        present = { "résous", "résous", "résout", "résolvons", "résolvez", "résolvent" },
        imparfait = { "résolvais", "résolvais", "résolvait", "résolvions", "résolviez", "résolvaient" },
        passeSimple = { "résolus", "résolus", "résolut", "résolûmes", "résolûtes", "résolurent" },
        futur = { "résoudrai", "résoudras", "résoudra", "résoudrons", "résoudrez", "résoudront" },
      },
      subjonctif = {
        present = { "résolve", "résolves", "résolve", "résolvions", "résolviez", "résolvent" },
        imparfait = { "résolusse", "résolusses", "résolût", "résolussions", "résolussiez", "résolussent" },
      },
      conditionnel = {
        present = { "résoudrais", "résoudrais", "résoudrait", "résoudrions", "résoudriez", "résoudraient" },
      },
      imperatif = {
        present = { "résous", "résolvons", "résolvez" },
      },
    },
  },
  ["rire"] = {
    ending = "rire",
    endings = {
      participe = {
        present = { "riant" },
        passe = { "ri" },
      },
      indicatif = {
        present = { "ris", "ris", "rit", "rions", "riez", "rient" },
        imparfait = { "riais", "riais", "riait", "riions", "riiez", "riaient" },
        passeSimple = { "ris", "ris", "rit", "rîmes", "rîtes", "rirent" },
        futur = { "rirai", "riras", "rira", "rirons", "rirez", "riront" },
      },
      subjonctif = {
        present = { "rie", "ries", "rie", "riions", "riiez", "rient" },
        imparfait = { "risse", "risses", "rît", "rissions", "rissiez", "rissent" },
      },
      conditionnel = {
        present = { "rirais", "rirais", "rirait", "ririons", "ririez", "riraient" },
      },
      imperatif = {
        present = { "ris", "rions", "riez" },
      },
    },
  },
  ["savoir"] = {
    ending = "savoir",
    endings = {
      participe = {
        present = { "sachant" },
        passe = { "su" },
      },
      indicatif = {
        present = { "sais", "sais", "sait", "savons", "savez", "savent" },
        imparfait = { "savais", "savais", "savait", "savions", "saviez", "savaient" },
        passeSimple = { "sus", "sus", "sut", "sûmes", "sûtes", "surent" },
        futur = { "saurai", "sauras", "saura", "saurons", "saurez", "sauront" },
      },
      subjonctif = {
        present = { "sache", "saches", "sache", "sachions", "sachiez", "sachent" },
        imparfait = { "susse", "susses", "sût", "sussions", "sussiez", "sussent" },
      },
      conditionnel = {
        present = { "saurais", "saurais", "saurait", "saurions", "sauriez", "sauraient" },
      },
      imperatif = {
        present = { "sache", "sachons", "sachez" },
      },
    },
  },
  ["servir"] = {
    ending = "servir",
    endings = {
      participe = {
        present = { "servant" },
        passe = { "servi" },
      },
      indicatif = {
        present = { "sers", "sers", "sert", "servons", "servez", "servent" },
        imparfait = { "servais", "servais", "servait", "servions", "serviez", "servaient" },
        passeSimple = { "servis", "servis", "servit", "servîmes", "servîtes", "servirent" },
        futur = { "servirai", "serviras", "servira", "servirons", "servirez", "serviront" },
      },
      subjonctif = {
        present = { "serve", "serves", "serve", "servions", "serviez", "servent" },
        imparfait = { "servisse", "servisses", "servît", "servissions", "servissiez", "servissent" },
      },
      conditionnel = {
        present = { "servirais", "servirais", "servirait", "servirions", "serviriez", "serviraient" },
      },
      imperatif = {
        present = { "sers", "servons", "servez" },
      },
    },
  },
  ["sortir"] = {
    ending = "tir",
    endings = {
      participe = {
        present = { "tant" },
        passe = { "ti" },
      },
      indicatif = {
        present = { "s", "s", "t", "tons", "tez", "tent" },
        imparfait = { "tais", "tais", "tait", "tions", "tiez", "taient" },
        passeSimple = { "tis", "tis", "tit", "tîmes", "tîtes", "tirent" },
        futur = { "tirai", "tiras", "tira", "tirons", "tirez", "tiront" },
      },
      subjonctif = {
        present = { "te", "tes", "te", "tions", "tiez", "tent" },
        imparfait = { "tisse", "tisses", "tît", "tissions", "tissiez", "tissent" },
      },
      conditionnel = {
        present = { "tirais", "tirais", "tirait", "tirions", "tiriez", "tiraient" },
      },
      imperatif = {
        present = { "s", "tons", "tez" },
      },
    },
  },
  ["suivre"] = {
    ending = "suivre",
    endings = {
      participe = {
        present = { "suivant" },
        passe = { "suivi" },
      },
      indicatif = {
        present = { "suis", "suis", "suit", "suivons", "suivez", "suivent" },
        imparfait = { "suivais", "suivais", "suivait", "suivions", "suiviez", "suivaient" },
        passeSimple = { "suivis", "suivis", "suivit", "suivîmes", "suivîtes", "suivirent" },
        futur = { "suivrai", "suivras", "suivra", "suivrons", "suivrez", "suivront" },
      },
      subjonctif = {
        present = { "suive", "suives", "suive", "suivions", "suiviez", "suivent" },
        imparfait = { "suivisse", "suivisses", "suivît", "suivissions", "suivissiez", "suivissent" },
      },
      conditionnel = {
        present = { "suivrais", "suivrais", "suivrait", "suivrions", "suivriez", "suivraient" },
      },
      imperatif = {
        present = { "suis", "suivons", "suivez" },
      },
    },
  },
  ["surseoir"] = {
    ending = "seoir",
    endings = {
      participe = {
        present = { "soyant" },
        passe = { "sis" },
      },
      indicatif = {
        present = { "sois", "sois", "soit", "soyons", "soyez", "soient" },
        imparfait = { "soyais", "soyais", "soyait", "soyions", "soyiez", "soyaient" },
        passeSimple = { "sis", "sis", "sit", "sîmes", "sîtes", "sirent" },
        futur = { "soirai", "soiras", "soira", "soirons", "soirez", "soiront" },
      },
      subjonctif = {
        present = { "soie", "soies", "soie", "soyions", "soyiez", "soient" },
        imparfait = { "sisse", "sisses", "sît", "sissions", "sissiez", "sissent" },
      },
      conditionnel = {
        present = { "soirais", "soirais", "soirait", "soirions", "soirions", "soiraient" },
      },
      imperatif = {
        present = { "sois", "soyons", "soyez" },
      },
    },
  },
  ["tenir"] = {
    ending = "enir",
    endings = {
      participe = {
        present = { "enant" },
        passe = { "enu" },
      },
      indicatif = {
        present = { "iens", "iens", "ient", "enons", "enez", "iennent" },
        imparfait = { "enais", "enais", "enait", "enions", "eniez", "enaient" },
        passeSimple = { "ins", "ins", "int", "înmes", "întes", "inrent" },
        futur = { "iendrai", "iendras", "iendra", "iendrons", "iendrez", "iendront" },
      },
      subjonctif = {
        present = { "ienne", "iennes", "ienne", "enions", "eniez", "iennent" },
        imparfait = { "insse", "insses", "înt", "inssions", "inssiez", "inssent" },
      },
      conditionnel = {
        present = { "iendrais", "iendrais", "iendrait", "iendrions", "iendriez", "iendraient" },
      },
      imperatif = {
        present = { "iens", "enons", "enez" },
      },
    },
  },
  ["traire"] = {
    ending = "traire",
    endings = {
      participe = {
        present = { "trayant" },
        passe = { "trait" },
      },
      indicatif = {
        present = { "trais", "trais", "trait", "trayons", "trayez", "traient" },
        imparfait = { "trayais", "trayais", "trayait", "trayions", "trayiez", "trayaient" },
        passeSimple = { "trayai", "trayais", "traya", "trayâmes", "trayâtes", "trayèrent" },
        futur = { "trairai", "trairas", "traira", "trairons", "trairez", "trairont" },
      },
      subjonctif = {
        present = { "traie", "trais", "traie", "trayions", "trayiez", "traient" },
        imparfait = { "trayasse", "trayasses", "trayât", "trayassions", "trayassiez", "trayassent" },
      },
      conditionnel = {
        present = { "trairais", "trairais", "trairait", "trairions", "trairiez", "trairaient" },
      },
      imperatif = {
        present = { "trais", "trayons", "trayez" },
      },
    },
  },
  ["vaincre"] = {
    ending = "vaincre",
    endings = {
      participe = {
        present = { "vaiquant" },
        passe = { "vaincu" },
      },
      indicatif = {
        present = { "vaincs", "vaincs", "vainc", "vainquons", "vainquez", "vainquent" },
        imparfait = { "vainquais", "vainquais", "vainquait", "vainquions", "vainquiez", "vainquaient" },
        passeSimple = { "vainquis", "vainquis", "vainqui", "vainquîmes", "vainquîtes", "vainquirent" },
        futur = { "vaincrai", "vaincras", "vaincra", "vaincrons", "vaincrez", "vaincront" },
      },
      subjonctif = {
        present = { "vainque", "vainques", "vainque", "vainquions", "vainquiez", "vainquent" },
        imparfait = { "vainquisse", "vainquisses", "vainquît", "vainquissions", "vainquissiez", "vainquissent" },
      },
      conditionnel = {
        present = { "vaincrais", "vaincrais", "vaincrait", "vaincrions", "vaincriez", "vaincraient" },
      },
      imperatif = {
        present = { "vaincs", "vainquons", "vainquez" },
      },
    },
  },
  ["valoir"] = {
    ending = "valoir",
    endings = {
      participe = {
        present = { "valant" },
        passe = { "valu" },
      },
      indicatif = {
        present = { "vaux", "vaux", "vaut", "valons", "valez", "valent" },
        imparfait = { "valais", "valais", "valait", "valions", "valiez", "valaient" },
        passeSimple = { "valus", "valus", "valu", "valûmes", "valûtes", "valurent" },
        futur = { "vaudrai", "vaudras", "vaudra", "vaudrons", "vaudrez", "vaudront" },
      },
      subjonctif = {
        present = { "vaille", "vailles", "vaille", "valions", "valiez", "vaillent" },
        imparfait = { "valusse", "valusses", "valût", "valussions", "valussiez", "valussent" },
      },
      conditionnel = {
        present = { "vaudrais", "vaudrais", "vaudrait", "vaudrions", "vaudriez", "vaudraient" },
      },
      imperatif = {
        present = { "vaux", "valons", "valez" },
      },
    },
  },
  ["vendre"] = {
    ending = "re",
    endings = {
      participe = {
        present = { "ant" },
        passe = { "u" },
      },
      indicatif = {
        present = { "s", "s", "", "ons", "ez", "ent" },
        imparfait = { "ais", "ais", "ait", "ions", "iez", "aient" },
        passeSimple = { "is", "is", "it", "îmes", "îtes", "irent" },
        futur = { "rai", "ras", "ra", "rons", "rez", "ront" },
      },
      subjonctif = {
        present = { "e", "es", "e", "ions", "iez", "ent" },
        imparfait = { "isse", "isses", "ît", "issions", "issiez", "issent" },
      },
      conditionnel = {
        present = { "rais", "rais", "rait", "rions", "riez", "raient" },
      },
      imperatif = {
        present = { "s", "ons", "ez" },
      },
    },
  },
  ["vivre"] = {
    ending = "vivre",
    endings = {
      participe = {
        present = { "vivant" },
        passe = { "vécu" },
      },
      indicatif = {
        present = { "vis", "vis", "vit", "vivons", "vivez", "vivent" },
        imparfait = { "vivais", "vivais", "vivait", "vivions", "viviez", "vivaient" },
        passeSimple = { "vécus", "vécus", "vécut", "vécûmes", "vécûtes", "vécurent" },
        futur = { "vivrai", "vivras", "vivra", "vivrons", "vivrez", "vivront" },
      },
      subjonctif = {
        present = { "vive", "vives", "vive", "vivions", "viviez", "vivent" },
        imparfait = { "vécusse", "vécusses", "vécût", "vécussions", "vécussiez", "vécussent" },
      },
      conditionnel = {
        present = { "vivrais", "vivrais", "vivrait", "vivrions", "vivriez", "vivraient" },
      },
      imperatif = {
        present = { "vis", "vivons", "vivez" },
      },
    },
  },
  ["voir"] = {
    ending = "voir",
    endings = {
      participe = {
        present = { "voyant" },
        passe = { "vu" },
      },
      indicatif = {
        present = { "vois", "vois", "voit", "voyons", "voyez", "voient" },
        imparfait = { "voyais", "voyais", "voyait", "voyions", "voyiez", "voyaient" },
        passeSimple = { "vis", "vis", "vit", "vîmes", "vîtes", "virent" },
        futur = { "verrai", "verras", "verra", "verrons", "verrez", "verront" },
      },
      subjonctif = {
        present = { "voie", "voies", "voie", "voyions", "voyiez", "voient" },
        imparfait = { "visse", "visses", "vît", "vissions", "vissiez", "vissent" },
      },
      conditionnel = {
        present = { "verrais", "verrais", "verrait", "verrions", "verriez", "verraient" },
      },
      imperatif = {
        present = { "vois", "voyons", "voyez" },
      },
    },
  },
  ["vouloir"] = {
    ending = "vouloir",
    endings = {
      participe = {
        present = { "voulant" },
        passe = { "voulu" },
      },
      indicatif = {
        present = { "veux", "veux", "veut", "voulons", "voulez", "veulent" },
        imparfait = { "voulais", "voulais", "voulait", "voulions", "vouliez", "voulaient" },
        passeSimple = { "voulus", "voulus", "voulut", "voulûmes", "voulûtes", "voulurent" },
        futur = { "voudrai", "voudras", "voudra", "voudrons", "voudrez", "voudront" },
      },
      subjonctif = {
        present = { "veuille", "veuilles", "veuille", "voulions", "vouliez", "veuillent" },
        imparfait = { "voulusse", "voulusses", "voulût", "voulussions", "voulussiez", "voulussent" },
      },
      conditionnel = {
        present = { "voudrais", "voudrais", "voudrait", "voudrions", "voudriez", "voudraient" },
      },
      imperatif = {
        present = { "veux", "voulons", "voulez" },
      },
    },
  },
}

data["assoir"] = m_table.deepcopy(data["asseoir"])
data["assoir"].ending = "assoir"

data["asseoir-assois"] = m_table.deepcopy(data["surseoir"])
data["asseoir-assois"].ignore_auto = true

data["assoir-assois"] = m_table.deepcopy(data["surseoir"])
data["assoir-assois"].ignore_auto = true
data["assoir-assois"].ending = "soir"

data["vêtir"] = m_table.deepcopy(data["vendre"])
data["vêtir"].ending = "ir"

-- Infinitive is always the same as the "ending" property, generate it
for _, template in pairs(data) do
  template.endings.infinitif = { present = { template.ending } }
end

--- Replace all "î" with "i" in the given template table.
--- Will erroneously modify the following endings if they feature an "î":
--- * first and second plural persons of the "indicatif passé simple"
--- * third singular person of the "subjonctif imparfait"
--- @param template table The template table to update.
--- @return table A new table.
local function stripICirc(template)
  local function subst(s)
    return mw.ustring.gsub(s, "î", "i")
  end

  local newTemplate = m_table.deepcopy(template)
  newTemplate.ending = subst(newTemplate.ending)
  for mode, tenses in pairs(newTemplate.endings) do
    for tense, tenseEndings in pairs(tenses) do
      if type(tenseEndings) == "string" then
        newTemplate.endings[mode][tense] = subst(tenseEndings)
      else
        newTemplate.endings[mode][tense] = {}
        for i, ending in ipairs(tenseEndings) do
          newTemplate.endings[mode][tense][i] = subst(ending)
        end
      end
    end
  end
  return newTemplate
end

data["absoudre-absout"] = m_table.deepcopy(data["absoudre"])
data["absoudre-absout"].ignore_auto = true
data["absoudre-absout"].endings.participe.passe = { "sout" }

data["croître-cru"] = m_table.deepcopy(data["croître"])
data["croître-cru"].ignore_auto = true
data["croître-cru"].endings.participe.passe = { "cru" }

data["croitre"] = stripICirc(data["croître"])
-- Correct forms that were incorrectly modified
data["croitre"].endings.indicatif.present[1] = "croîs"
data["croitre"].endings.indicatif.present[2] = "croîs"
data["croitre"].endings.indicatif.present[3] = "croît"
data["croitre"].endings.imperatif.present[1] = "croîs"

data["croitre-cru"] = m_table.deepcopy(data["croitre"])
data["croitre-cru"].ignore_auto = true
data["croitre-cru"].endings.participe.passe = { "cru" }

data["cuire-uîmes"] = m_table.deepcopy(data["cuire"])
data["cuire-uîmes"].ignore_auto = true
data["cuire-uîmes"].endings.indicatif.passeSimple = { "uis", "uis", "uit", "uîmes", "uîtes", "uirent" }
data["cuire-uîmes"].endings.subjonctif.imparfait = { "uisse", "uisses", "uît", "uissions", "uissiez", "uissent" }

data["devoir-du"] = m_table.deepcopy(data["devoir"])
data["devoir-du"].ignore_auto = true
data["devoir-du"].endings.participe.passe = { "du" }

data["dire"] = m_table.deepcopy(data["prédire"])
data["dire"].ignore_auto = true
data["dire"].endings.indicatif.present[5] = "dites"
data["dire"].endings.imperatif.present[3] = "dites"

data["mouvoir-mu"] = m_table.deepcopy(data["mouvoir"])
data["mouvoir-mu"].ignore_auto = true
data["mouvoir-mu"].endings.participe.passe = { "mu" }

data["naitre"] = stripICirc(data["naître"])
-- Correct forms that were incorrectly modified
data["naitre"].endings.indicatif.passeSimple[4] = "naquîmes"
data["naitre"].endings.indicatif.passeSimple[5] = "naquîtes"
data["naitre"].endings.subjonctif.imparfait[3] = "naquît"

data["ouïr-orrai"] = m_table.deepcopy(data["ouïr"])
data["ouïr-orrai"].ignore_auto = true
data["ouïr-orrai"].endings.indicatif.futur = { "orrai", "orras", "orra", "orrons", "orrez", "orront" }
data["ouïr-orrai"].endings.conditionnel.present = { "orrais", "orrais", "orrait", "orrions", "orriez", "orraient" }

data["paitre"] = stripICirc(data["paître"])

data["plaire-plait"] = stripICirc(data["plaire"])
data["plaire-plait"].ignore_auto = true

data["résoudre-résous"] = m_table.deepcopy(data["résoudre"])
data["résoudre-résous"].ignore_auto = true
data["résoudre-résous"].endings.participe.passe = { "résous" }

data["résoudre-résout"] = m_table.deepcopy(data["résoudre-résous"])
data["résoudre-résout"].ignore_auto = true
data["résoudre-résout"].endings.participe.passe = { "résout" }

data["taire"] = m_table.deepcopy(data["plaire"])
data["taire"].ignore_auto = true
data["taire"].endings.indicatif.present[3] = "ait"

data["vouloir-veuille"] = m_table.deepcopy(data["vouloir"])
data["vouloir-veuille"].ignore_auto = true
data["vouloir-veuille"].endings.imperatif.present = { "veuille", "veuillons", "veuillez" }

return data
