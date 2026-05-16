---
title: Spanska
greeting: ¡Hola!
tagline: Spanska
deckId: spanish-v1
---

<!-- these are currently not used, kept for reference until app is more finished -->

# Kapitel 1 – Hej

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "god morgon"
  back: "Buenos días"
  prompt: "Buenos días"
  options:
    - "en stad som heter …"
    - "goda (om mat)"
    - "god morgon"
    - "Har han/hon syskon?"
  correct: 2

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "hej då (vi ses sen)"
  back: "hasta luego"
  prompt: "hasta luego"
  options:
    - "tjugo (20)"
    - "trettio (30)"
    - "Vad behöver vi?"
    - "hej då (vi ses sen)"
  correct: 3

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "fru"
  back: "señora"
  prompt: "fru"
  options:
    - "señora"
    - "la manzana"
    - "el nombre"
    - "el flamenco"
  correct: 0

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "Hej (informellt)"
    - "bra"
    - "Och du?"
    - "hej då (informellt)"
  right:
    - "¡Hola!"
    - "bien"
    - "¿Y tú?"
    - "chao"

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "hej (kortare hälsning)"
  back: "buenas"
  prompt: "buenas"
  options:
    - "sköldpadda"
    - "en dotter"
    - "jag tycker inte om"
    - "hej (kortare hälsning)"
  correct: 3

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "god kväll / god natt"
  back: "Buenas noches"
  prompt: "Buenas noches"
  options:
    - "barn (barnen)"
    - "en kanin"
    - "en syster"
    - "god kväll / god natt"
  correct: 3

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "herr"
    - "tack"
    - "hej då (adjö)"
    - "god eftermiddag"
  right:
    - "señor"
    - "gracias"
    - "adiós"
    - "Buenas tardes"

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "stackare"
  back: "pobrecito"
  prompt: "stackare"
  options:
    - "el arroz"
    - "señora"
    - "los habitantes"
    - "pobrecito"
  correct: 3

- type: assemble
  direction: es_sv
  task: "Översätt till svenska"
  prompt: "¿Qué tal?"
  answer: "Hur är det?"
  pool:
    - "Hur"
    - "är"
    - "det?"
    - "tack"
    - "herr"
    - "vi"

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "Hur mår du?"
    - "sådär"
    - "vi ses snart"
    - "dåligt"
  right:
    - "¿Cómo estás?"
    - "regular"
    - "hasta pronto"
    - "mal"

# Kapitel 2 - Presentation och länder

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "Hej!"
  back: "¡Hola!"
  prompt: "Hej!"
  options:
    - "¡Hola!"
    - "cinco"
    - "de"
    - "el árbol"
  correct: 0

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "Jag heter …"
  back: "Me llamo …"
  prompt: "Jag heter …"
  options:
    - "catorce"
    - "¿Cuánto es?"
    - "un gato"
    - "Me llamo …"
  correct: 3

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "Jag kommer från …"
  back: "Soy de …"
  prompt: "Jag kommer från …"
  options:
    - "tengo"
    - "el parque nacional"
    - "gracias"
    - "Soy de …"
  correct: 3

- type: assemble
  direction: es_sv
  task: "Översätt till svenska"
  prompt: "Hablo español."
  answer: "Jag pratar spanska."
  pool:
    - "Jag"
    - "pratar"
    - "spanska."
    - "Hej!"
    - "engelska."
    - "ligger"

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "Var ligger …?"
  back: "¿Dónde está …?"
  prompt: "Var ligger …?"
  options:
    - "una culebra"
    - "la guía"
    - "¿Dónde está …?"
    - "tu familia"
  correct: 2

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "Det ligger i …"
  back: "Está en …"
  prompt: "Det ligger i …"
  options:
    - "el águila"
    - "Está en …"
    - "Está en América del Norte."
    - "los aztecas"
  correct: 1

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "Det ligger i Sydamerika."
  back: "Está en América del Sur."
  prompt: "Está en América del Sur."
  options:
    - "han/hon/den/det är / ligger"
    - "Det ligger i Sydamerika."
    - "flaggans färger (Spanien): gul"
    - "11"
  correct: 1

- type: assemble
  direction: es_sv
  task: "Översätt till svenska"
  prompt: "Hablo inglés."
  answer: "Jag pratar engelska."
  pool:
    - "Jag"
    - "pratar"
    - "engelska."
    - "ligger"
    - "Hej!"
    - "spanska."

# Kapitel 4 – Vad heter du?

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "Jag heter …"
  back: "Me llamo …"
  prompt: "Jag heter …"
  options:
    - "Me llamo …"
    - "el monopatín"
    - "¿Cuál es tu color favorito?"
    - "sueco"
  correct: 0

- type: mc
  direction: es_sv
  task: "Översätt till svenska"
  front: "Jag är från …"
  back: "Soy de …"
  prompt: "Soy de …"
  options:
    - "min"
    - "Min favoritfärg är röd."
    - "Jag är från …"
    - "en bror"
  correct: 2

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "¿Cómo te llamas?"
  answer: "Vad heter du?"
  pool:
    - "Vad"
    - "heter"
    - "du?"
    - "Varifrån"
    - "Jag"
    - "är"

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "avgångar (flygplats)"
  back: "Salidas"
  prompt: "avgångar (flygplats)"
  options:
    - "veintinueve"
    - "Salidas"
    - "gracias"
    - "rojo"
  correct: 1

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "¿De dónde eres?"
  answer: "Varifrån är du?"
  pool:
    - "Varifrån"
    - "är"
    - "du?"
    - "från"
    - "avgångar"
    - "Jag"

# Kapitel 5 – Familj och husdjur

- type: mc
  direction: es_sv
  task: "Översätt till svenska"
  front: "en orm"
  back: "una culebra"
  prompt: "una culebra"
  options:
    - "Afrika"
    - "en orm"
    - "typiska rätter"
    - "jordgubbe"
  correct: 1

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "en kanin"
  back: "un conejo"
  prompt: "en kanin"
  options:
    - "la tienda de campaña"
    - "un conejo"
    - "Europa"
    - "la piña"
  correct: 1

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "en mamma"
  back: "una madre"
  prompt: "una madre"
  options:
    - "flicka"
    - "tjugonio (29)"
    - "jaguar"
    - "en mamma"
  correct: 3

- type: assemble
  direction: sv_es
  task: "Översätt till spanska"
  prompt: "ett marsvin"
  answer: "un conejillo de Indias"
  pool:
    - "un"
    - "conejillo"
    - "de"
    - "Indias"
    - "Tengo"
    - "padre"
    - "perro"

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "en dotter"
  back: "una hija"
  prompt: "en dotter"
  options:
    - "una hija"
    - "la capital"
    - "¡Qué interesante!"
    - "seis"
  correct: 0

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "en son"
  back: "un hijo"
  prompt: "en son"
  options:
    - "un hijo"
    - "una culebra"
    - "en total"
    - "una rata"
  correct: 0

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "Tengo dos hijos."
  answer: "Jag har två barn."
  pool:
    - "Jag"
    - "har"
    - "två"
    - "barn."
    - "son"
    - "orm"
    - "inte"

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "en syster"
    - "en fågel"
    - "en hund"
    - "en katt"
  right:
    - "una hermana"
    - "un pájaro"
    - "un perro"
    - "un gato"

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "Min son heter …"
  back: "Mi hijo se llama …"
  prompt: "Mi hijo se llama …"
  options:
    - "spanska (även: kastilianska)"
    - "avgångar (flygplats)"
    - "Min son heter …"
    - "1"
  correct: 2

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "No tengo mascotas."
  answer: "Jag har inga husdjur."
  pool:
    - "Jag"
    - "har"
    - "inga"
    - "husdjur."
    - "husdjur"
    - "heter"
    - "son"

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "en råtta"
    - "en bror"
    - "husdjur"
    - "en pappa"
  right:
    - "una rata"
    - "un hermano"
    - "mascotas"
    - "un padre"

# Kapitel 6 - Färger och djur

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "iguana"
  back: "la iguana"
  prompt: "la iguana"
  options:
    - "pojke"
    - "jag tycker om"
    - "jag har"
    - "iguana"
  correct: 3

- type: mc
  direction: es_sv
  task: "Översätt till svenska"
  front: "sköldpadda"
  back: "la tortuga"
  prompt: "la tortuga"
  options:
    - "sköldpadda"
    - "ett kilo"
    - "Vad?"
    - "huvudstad i Spanien"
  correct: 0

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "brun"
  back: "marrón"
  prompt: "marrón"
  options:
    - "Det ligger i …"
    - "brun"
    - "sexton (16)"
    - "Jag tror att vi redan har …"
  correct: 1

- type: assemble
  direction: es_sv
  task: "Översätt till svenska"
  prompt: "¿Cuál es tu color favorito?"
  answer: "Vilken är din favoritfärg?"
  pool:
    - "Vilken"
    - "är"
    - "din"
    - "favoritfärg?"
    - "favoritfärg"
    - "Min"
    - "flamingo"

- type: mc
  direction: es_sv
  task: "Översätt till svenska"
  front: "rosa (färg)"
  back: "rosa"
  prompt: "rosa"
  options:
    - "örn"
    - "jaguar"
    - "rosa (färg)"
    - "Sydamerika"
  correct: 2

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "röd"
  back: "rojo"
  prompt: "rojo"
  options:
    - "röd"
    - "billiga"
    - "jag bor"
    - "Min son heter …"
  correct: 0

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "Mi color favorito es el rojo."
  answer: "Min favoritfärg är röd."
  pool:
    - "Min"
    - "favoritfärg"
    - "är"
    - "röd."
    - "rosa"
    - "Vilken"
    - "brun"

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "apa"
    - "katt"
    - "hund"
    - "flamingo"
  right:
    - "el mono"
    - "el gato"
    - "el perro"
    - "el flamenco"

# Kapitel 1 – fler ord och platser

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "motorcykel / scooter"
  back: "la moto"
  prompt: "la moto"
  options:
    - "päron"
    - "motorcykel / scooter"
    - "Min favoritfärg är röd."
    - "Jag går. / Jag tar det."
  correct: 1

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "boll"
  back: "la pelota"
  prompt: "boll"
  options:
    - "Creo que ya tenemos …"
    - "¡Bienvenidos al mundo hispánico!"
    - "la flor"
    - "la pelota"
  correct: 3

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "frukt"
  back: "la fruta"
  prompt: "la fruta"
  options:
    - "Min favoritfärg är röd."
    - "tjugonio (29)"
    - "jaguar"
    - "frukt"
  correct: 3

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "flicka"
    - "pojke"
    - "cykel"
    - "skateboard"
  right:
    - "la chica"
    - "el chico"
    - "la bicicleta"
    - "el monopatín"

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "cafeteria"
  back: "la cafetería"
  prompt: "cafeteria"
  options:
    - "también"
    - "¿Dónde está Guinea Ecuatorial?"
    - "la cafetería"
    - "la flor"
  correct: 2

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "mataffär / stormarknad"
  back: "el supermercado"
  prompt: "el supermercado"
  options:
    - "nitton (19)"
    - "mycket (här: mycket billiga)"
    - "Var ligger …?"
    - "mataffär / stormarknad"
  correct: 3

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "kafé (lokal)"
  back: "el café"
  prompt: "kafé (lokal)"
  options:
    - "el café"
    - "los platos típicos"
    - "el fuego"
    - "nueve"
  correct: 0

# Kapitel 2 – Den spansktalande världen

- type: assemble
  direction: sv_es
  task: "Översätt till spanska"
  prompt: "Välkomna till den spansktalande världen!"
  answer: "¡Bienvenidos al mundo hispánico!"
  pool:
    - "¡Bienvenidos"
    - "al"
    - "mundo"
    - "hispánico!"
    - "Sur"
    - "México?"
    - "Está"

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "¿Dónde está Guinea Ecuatorial?"
  answer: "Var ligger Ekvatorialguinea?"
  pool:
    - "Var"
    - "ligger"
    - "Ekvatorialguinea?"
    - "jag"
    - "Den"
    - "Det"

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "Está en África."
  answer: "Det ligger i Afrika."
  pool:
    - "Det"
    - "ligger"
    - "i"
    - "Afrika."
    - "jag"
    - "Europa."
    - "Ekvatorialguinea?"

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "jag heter (presentera mig)"
  back: "me llamo"
  prompt: "me llamo"
  options:
    - "tack (på galiciska)"
    - "jag heter (presentera mig)"
    - "päron"
    - "träd"
  correct: 1

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "¿Dónde está España?"
  answer: "Var ligger Spanien?"
  pool:
    - "Var"
    - "ligger"
    - "Spanien?"
    - "också"
    - "från"
    - "Karibien"

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "också"
  back: "también"
  prompt: "också"
  options:
    - "también"
    - "la tienda de campaña"
    - "el Caribe"
    - "muy"
  correct: 0

- type: assemble
  direction: es_sv
  task: "Översätt till svenska"
  prompt: "Está en Europa."
  answer: "Det ligger i Europa."
  pool:
    - "Det"
    - "ligger"
    - "i"
    - "Europa."
    - "Afrika"
    - "Nordamerika"
    - "Nordamerika."

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "katalanska"
  back: "el catalán"
  prompt: "katalanska"
  options:
    - "gràcies"
    - "por favor"
    - "el catalán"
    - "¿Dónde está …?"
  correct: 2

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "¿Dónde está México?"
  answer: "Var ligger Mexiko?"
  pool:
    - "Var"
    - "ligger"
    - "Mexiko?"
    - "i"
    - "spansktalande"
    - "från"

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "Afrika"
  back: "África"
  prompt: "África"
  options:
    - "vi ses snart"
    - "ett land"
    - "Jag har inga husdjur."
    - "Afrika"
  correct: 3

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "Está en América del Norte."
  answer: "Det ligger i Nordamerika."
  pool:
    - "Det"
    - "ligger"
    - "i"
    - "Nordamerika."
    - "katalanska"
    - "spansktalande"
    - "Centralamerika"

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "jag är (identitet/ursprung)"
    - "från"
    - "och"
    - "jag"
  right:
    - "soy"
    - "de"
    - "y"
    - "yo"

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "Europa"
  back: "Europa"
  prompt: "Europa"
  options:
    - "vi ses snart"
    - "ett land"
    - "Jag har inga husdjur."
    - "Europa"
  correct: 3

- type: assemble
  direction: sv_es
  task: "Översätt till spanska"
  prompt: "Nordamerika (region)"
  answer: "América del Norte"
  pool:
    - "América"
    - "del"
    - "Norte"
    - "España?"
    - "Suecia"
    - "África."

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "Sverige (landet)"
    - "Centralamerika"
    - "Karibien"
    - "Sydamerika"
  right:
    - "Suecia"
    - "América Central"
    - "el Caribe"
    - "América del Sur"

# Kapitel 3 – Jag bor och ålder

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "en stad som heter …"
  back: "una ciudad que se llama …"
  prompt: "una ciudad que se llama …"
  options:
    - "en stad som heter …"
    - "Spanien"
    - "tack (på baskiska)"
    - "jag tycker om"
  correct: 0

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "femton (15)"
  back: "quince"
  prompt: "quince"
  options:
    - "Min favoritfärg är röd."
    - "tjugonio (29)"
    - "jaguar"
    - "femton (15)"
  correct: 3

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "tolv (12)"
  back: "doce"
  prompt: "tolv (12)"
  options:
    - "un pájaro"
    - "rosa"
    - "la leche"
    - "doce"
  correct: 3

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "jag bor"
    - "i (plats)"
    - "huvudstaden"
    - "fjorton (14)"
  right:
    - "vivo"
    - "en"
    - "la capital"
    - "catorce"

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "berg"
  back: "la montaña"
  prompt: "berg"
  options:
    - "soy"
    - "la montaña"
    - "Belice"
    - "una hermana"
  correct: 1

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "gitarr"
  back: "la guitarra"
  prompt: "gitarr"
  options:
    - "el baloncesto"
    - "dieciséis"
    - "la guitarra"
    - "el flamenco"
  correct: 2

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "eld"
  back: "el fuego"
  prompt: "eld"
  options:
    - "finalmente"
    - "por favor"
    - "el fuego"
    - "la manzana"
  correct: 2

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "tengo trece años"
  answer: "jag är tretton år"
  pool:
    - "jag"
    - "är"
    - "tretton"
    - "år"
    - "campingtält"
    - "stad"
    - "en"

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "blomma"
    - "träd"
    - "campingtält"
    - "sjö"
  right:
    - "la flor"
    - "el árbol"
    - "la tienda de campaña"
    - "el lago"

# Kapitel 3 – Tal 0–15

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "4"
  back: "cuatro"
  prompt: "4"
  options:
    - "cuatro"
    - "Salidas"
    - "una rata"
    - "el monopatín"
  correct: 0

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "9"
  back: "nueve"
  prompt: "nueve"
  options:
    - "tjugonio (29)"
    - "hej då (adjö)"
    - "Vad?"
    - "9"
  correct: 3

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "0"
    - "1"
    - "2"
    - "3"
  right:
    - "cero"
    - "uno"
    - "dos"
    - "tres"

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "14"
  back: "catorce"
  prompt: "14"
  options:
    - "¿Tienes mascotas?"
    - "¿Dónde vives?"
    - "catorce"
    - "el supermercado"
  correct: 2

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "5"
    - "6"
    - "7"
    - "8"
  right:
    - "cinco"
    - "seis"
    - "siete"
    - "ocho"

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "15"
  back: "quince"
  prompt: "quince"
  options:
    - "stackare"
    - "13"
    - "häst"
    - "15"
  correct: 3

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "10"
    - "11"
    - "12"
    - "13"
  right:
    - "diez"
    - "once"
    - "doce"
    - "trece"

# Kapitel 4 – På flygplatsen (frågor och svar)

- type: mc
  direction: es_sv
  task: "Översätt till svenska"
  front: "men"
  back: "pero"
  prompt: "pero"
  options:
    - "men"
    - "jag heter (presentera mig)"
    - "flicka"
    - "ris"
  correct: 0

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "svenska (språket)"
  back: "sueco"
  prompt: "sueco"
  options:
    - "Min son heter …"
    - "flicka"
    - "svenska (språket)"
    - "bokstavens namn: J"
  correct: 2

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "min mamma"
  back: "mi madre"
  prompt: "min mamma"
  options:
    - "Europa"
    - "marrón"
    - "la montaña"
    - "mi madre"
  correct: 3

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "No, no hablo español."
  answer: "Nej, jag pratar inte spanska."
  pool:
    - "Nej,"
    - "jag"
    - "pratar"
    - "inte"
    - "spanska."
    - "är"
    - "du"
    - "men"

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "han/hon/den/det är / ligger"
  back: "está"
  prompt: "está"
  options:
    - "han/hon/den/det är / ligger"
    - "arton (18)"
    - "10"
    - "(han/hon) bor"
  correct: 0

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "där"
  back: "allí"
  prompt: "allí"
  options:
    - "Var ligger Ekvatorialguinea?"
    - "där"
    - "en råtta"
    - "Kan du repetera?"
  correct: 1

- type: assemble
  direction: es_sv
  task: "Översätt till svenska"
  prompt: "¿Dónde vives?"
  answer: "Var bor du?"
  pool:
    - "Var"
    - "bor"
    - "du?"
    - "Hur"
    - "nej"
    - "du"

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "Trevlig resa!"
  back: "¡Buen viaje!"
  prompt: "Trevlig resa!"
  options:
    - "el arroz"
    - "señora"
    - "los habitantes"
    - "¡Buen viaje!"
  correct: 3

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "¿Cuántos años tienes?"
  answer: "Hur gammal är du?"
  pool:
    - "Hur"
    - "gammal"
    - "är"
    - "du?"
    - "men"
    - "min"
    - "där"

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "Pratar du spanska?"
    - "ja"
    - "nej"
    - "du"
  right:
    - "¿Hablas español?"
    - "sí"
    - "no"
    - "tú"

# Kapitel 4 – Verb jag / du

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "du är (ser)"
  back: "eres"
  prompt: "eres"
  options:
    - "du är (ser)"
    - "sexton (16)"
    - "Sydamerika"
    - "12"
  correct: 0

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "du har / du är … år (tener)"
  back: "tienes"
  prompt: "tienes"
  options:
    - "stackare"
    - "13"
    - "häst"
    - "du har / du är … år (tener)"
  correct: 3

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "jag bor (vivir)"
    - "du bor"
    - "du heter (llamarse)"
    - "du pratar"
  right:
    - "vivo"
    - "vives"
    - "te llamas"
    - "hablas"

# Kapitel 5 – Alfabet och uttal

- type: assemble
  direction: es_sv
  task: "Översätt till svenska"
  prompt: "Ñ"
  answer: "bokstaven efter N i spanska alfabetet"
  pool:
    - "bokstaven"
    - "efter"
    - "N"
    - "i"
    - "spanska"
    - "alfabetet"
    - "inte"
    - "tycker"
    - "jag"

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "uve"
  answer: "bokstavens namn: V"
  pool:
    - "bokstavens"
    - "namn:"
    - "V"
    - "inte"
    - "alfabetet"
    - "efter"

- type: assemble
  direction: es_sv
  task: "Översätt till svenska"
  prompt: "uve doble"
  answer: "bokstavens namn: W"
  pool:
    - "bokstavens"
    - "namn:"
    - "W"
    - "J"
    - "N"
    - "efter"

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "Spanien"
  back: "España"
  prompt: "Spanien"
  options:
    - "España"
    - "América Central"
    - "tienes"
    - "vivo"
  correct: 0

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "jota"
  answer: "bokstavens namn: J"
  pool:
    - "bokstavens"
    - "namn:"
    - "J"
    - "spanska"
    - "om"
    - "inte"

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "a mí me gusta"
  answer: "jag tycker om"
  pool:
    - "jag"
    - "tycker"
    - "om"
    - "Spanien"
    - "alfabetet"
    - "i"

- type: assemble
  direction: sv_es
  task: "Översätt till spanska"
  prompt: "jag tycker inte om"
  answer: "no me gusta"
  pool:
    - "no"
    - "me"
    - "gusta"
    - "España"
    - "doble"
    - "mí"

# Kapitel 5 – Spanien (geografi och språk)

- type: mc
  direction: es_sv
  task: "Översätt till svenska"
  front: "flaggans färger (Spanien): röd"
  back: "rojo"
  prompt: "rojo"
  options:
    - "pojke"
    - "flaggans färger (Spanien): röd"
    - "Nordamerika (region)"
    - "Sydamerika"
  correct: 1

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "spanska (även: kastilianska)"
  back: "el castellano"
  prompt: "el castellano"
  options:
    - "flicka"
    - "12"
    - "tapir"
    - "spanska (även: kastilianska)"
  correct: 3

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "fotboll"
  back: "el fútbol"
  prompt: "fotboll"
  options:
    - "jota"
    - "el fútbol"
    - "¿Puedes repetir?"
    - "hasta pronto"
  correct: 1

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "huvudstad i Spanien"
    - "gul"
    - "baskiska"
    - "galiciska"
  right:
    - "Madrid"
    - "amarillo"
    - "el euskera / el vasco"
    - "el gallego"

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "basket"
  back: "el baloncesto"
  prompt: "el baloncesto"
  options:
    - "mat / måltid"
    - "Min favoritfärg är röd."
    - "tapir"
    - "basket"
  correct: 3

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "tack (på galiciska)"
  back: "grazas"
  prompt: "tack (på galiciska)"
  options:
    - "ocho"
    - "grazas"
    - "el fuego"
    - "Hablo español."
  correct: 1

- type: mc
  direction: es_sv
  task: "Översätt till svenska"
  front: "tack (på baskiska)"
  back: "eskerrik asko"
  prompt: "eskerrik asko"
  options:
    - "bokstaven efter N i spanska alfabetet"
    - "trettio (30)"
    - "kafé (lokal)"
    - "tack (på baskiska)"
  correct: 3

- type: mc
  direction: es_sv
  task: "Översätt till svenska"
  front: "tack (på katalanska)"
  back: "gràcies"
  prompt: "gràcies"
  options:
    - "apelsin"
    - "häst"
    - "tack (på katalanska)"
    - "jag tycker om"
  correct: 2

# Kapitel 6 – Familj, fler fraser

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "¿Tienes mascotas?"
  answer: "Har du husdjur?"
  pool:
    - "Har"
    - "du"
    - "husdjur?"
    - "kanin"
    - "mamma?"
    - "en"

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "Hurdan är …? / Hurdan är din familj?"
  back: "¿Cómo es …? / ¿Cómo es tu familia?"
  prompt: "Hurdan är …? / Hurdan är din familj?"
  options:
    - "gracias"
    - "en total"
    - "¿Cómo es …? / ¿Cómo es tu familia?"
    - "mal"
  correct: 2

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "med"
  back: "con"
  prompt: "med"
  options:
    - "en total"
    - "el gato"
    - "trece"
    - "con"
  correct: 3

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "Hur är läget? (slang)"
  back: "¿Qué onda?"
  prompt: "¿Qué onda?"
  options:
    - "Hur är läget? (slang)"
    - "Hur gammal är du?"
    - "Välkommen till den spansktalande världen!"
    - "Jag pratar spanska."
  correct: 0

- type: assemble
  direction: sv_es
  task: "Översätt till spanska"
  prompt: "Vad heter din mamma?"
  answer: "¿Cómo se llama tu madre?"
  pool:
    - "¿Cómo"
    - "se"
    - "llama"
    - "tu"
    - "madre?"
    - "los"
    - "madres"
    - "hijos"

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "en kanin"
  back: "un conejo"
  prompt: "en kanin"
  options:
    - "veinticuatro"
    - "el hámster"
    - "la selva"
    - "un conejo"
  correct: 3

- type: mc
  direction: es_sv
  task: "Översätt till svenska"
  front: "två bröder (maskulint)"
  back: "dos hermanos"
  prompt: "dos hermanos"
  options:
    - "apelsin"
    - "namn"
    - "två bröder (maskulint)"
    - "jag tycker om"
  correct: 2

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "två mödrar"
  back: "dos madres"
  prompt: "två mödrar"
  options:
    - "ocho"
    - "dos madres"
    - "el fuego"
    - "Hablo español."
  correct: 1

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "din familj"
    - "jag har"
    - "barn (barnen)"
    - "min"
  right:
    - "tu familia"
    - "tengo"
    - "los hijos"
    - "mi"

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "tre hundar"
  back: "tres perros"
  prompt: "tres perros"
  options:
    - "tre hundar"
    - "Var ligger Spanien?"
    - "hej då (adjö)"
    - "Det ligger i Afrika."
  correct: 0

- type: assemble
  direction: es_sv
  task: "Vad betyder det här?"
  prompt: "¿Cómo se llama tu padre?"
  answer: "Vad heter din pappa?"
  pool:
    - "Vad"
    - "heter"
    - "din"
    - "pappa?"
    - "häst"
    - "hamster"
    - "två"

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "namn"
    - "häst"
    - "fiskar"
    - "hamster"
  right:
    - "el nombre"
    - "el caballo"
    - "los peces"
    - "el hámster"

# Kapitel 7 – I nationalparken

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "djur"
  back: "los animales"
  prompt: "los animales"
  options:
    - "ett kattdjur"
    - "mjölk"
    - "djur"
    - "plommon"
  correct: 2

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "Vad?"
  back: "¿Qué?"
  prompt: "Vad?"
  options:
    - "tienes"
    - "ocho"
    - "Buenas noches"
    - "¿Qué?"
  correct: 3

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "björn"
  back: "el oso"
  prompt: "björn"
  options:
    - "eskerrik asko"
    - "por favor"
    - "el oso"
    - "¿Dónde está …?"
  correct: 2

- type: assemble
  direction: sv_es
  task: "Välj rätt spanska"
  prompt: "nationalparken"
  answer: "el parque nacional"
  pool:
    - "el"
    - "parque"
    - "nacional"
    - "hay"
    - "muchos"
    - "tapir"

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "varg"
  back: "el lobo"
  prompt: "el lobo"
  options:
    - "varg"
    - "arton (18)"
    - "10"
    - "(han/hon) bor"
  correct: 0

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "ett kattdjur"
  back: "un felino"
  prompt: "ett kattdjur"
  options:
    - "dos madres"
    - "la piña"
    - "un felino"
    - "me llamo"
  correct: 2

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "Har han/hon syskon?"
  back: "¿Tiene hermanos?"
  prompt: "¿Tiene hermanos?"
  options:
    - "Har han/hon syskon?"
    - "arton (18)"
    - "10"
    - "djungeln"
  correct: 0

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "guiden (kvinnlig)"
    - "här"
    - "det finns / finns det"
    - "många"
  right:
    - "la guía"
    - "aquí"
    - "hay"
    - "muchos"

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "sexton (16)"
  back: "dieciséis"
  prompt: "sexton (16)"
  options:
    - "dieciséis"
    - "la bicicleta"
    - "rojo"
    - "pero"
  correct: 0

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "sjutton (17)"
  back: "diecisiete"
  prompt: "sjutton (17)"
  options:
    - "diecisiete"
    - "cero"
    - "Voy yo."
    - "Creo que ya tenemos …"
  correct: 0

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "arton (18)"
  back: "dieciocho"
  prompt: "arton (18)"
  options:
    - "jota"
    - "dieciocho"
    - "¿Puedes repetir?"
    - "hasta pronto"
  correct: 1

- type: assemble
  direction: sv_es
  task: "Översätt till spanska"
  prompt: "Han/hon är tjugo år."
  answer: "Tiene veinte años."
  pool:
    - "Tiene"
    - "veinte"
    - "años."
    - "lobo"
    - "tapir"
    - "veintidós"

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "tjugotre (23)"
  back: "veintitrés"
  prompt: "veintitrés"
  options:
    - "Min son heter …"
    - "flicka"
    - "tjugotre (23)"
    - "bokstavens namn: W"
  correct: 2

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "tjugofyra (24)"
  back: "veinticuatro"
  prompt: "tjugofyra (24)"
  options:
    - "un conejillo de Indias"
    - "el nombre"
    - "amarillo"
    - "veinticuatro"
  correct: 3

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "tjugofem (25)"
  back: "veinticinco"
  prompt: "veinticinco"
  options:
    - "tjugofem (25)"
    - "Var ligger Spanien?"
    - "hej då (adjö)"
    - "Det ligger i Afrika."
  correct: 0

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "jaguar"
    - "tapir"
    - "djungeln"
    - "(han/hon) bor"
  right:
    - "el jaguar"
    - "el tapir"
    - "la selva"
    - "vive"

- type: mc
  direction: es_sv
  task: "Översätt till svenska"
  front: "tjugosex (26)"
  back: "veintiséis"
  prompt: "veintiséis"
  options:
    - "jag har"
    - "i (plats)"
    - "tjugosex (26)"
    - "5"
  correct: 2

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "Vad intressant!"
  back: "¡Qué interesante!"
  prompt: "Vad intressant!"
  options:
    - "el fútbol"
    - "¿Tiene hermanos?"
    - "¡Qué interesante!"
    - "el flamenco"
  correct: 2

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "ursäkta / förlåt"
  back: "perdón"
  prompt: "ursäkta / förlåt"
  options:
    - "veintisiete"
    - "perdón"
    - "ocho"
    - "el tapir"
  correct: 1

- type: assemble
  direction: sv_es
  task: "Välj rätt spanska"
  prompt: "havssköldpadda"
  answer: "la tortuga marina"
  pool:
    - "la"
    - "tortuga"
    - "marina"
    - "guía"
    - "nacional"
    - "aquí"

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "en fråga"
  back: "una pregunta"
  prompt: "una pregunta"
  options:
    - "en fråga"
    - "Var ligger Spanien?"
    - "druvor"
    - "Har han/hon syskon?"
  correct: 0

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "till slut"
  back: "finalmente"
  prompt: "finalmente"
  options:
    - "nitton (19)"
    - "tjugonio (29)"
    - "Vad behöver vi?"
    - "till slut"
  correct: 3

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "nitton (19)"
    - "tjugo (20)"
    - "tjugoett (21)"
    - "tjugotvå (22)"
  right:
    - "diecinueve"
    - "veinte"
    - "veintiuno"
    - "veintidós"

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "vi har"
  back: "tenemos"
  prompt: "vi har"
  options:
    - "tenemos"
    - "la selva"
    - "No tengo mascotas."
    - "¡Qué bien!"
  correct: 0

- type: assemble
  direction: es_sv
  task: "Översätt till svenska"
  prompt: "¿Puedes repetir?"
  answer: "Kan du repetera?"
  pool:
    - "Kan"
    - "du"
    - "repetera?"
    - "ett"
    - "jaguar"
    - "tjugotvå"

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "tjugosju (27)"
    - "tjugoåtta (28)"
    - "tjugonio (29)"
    - "trettio (30)"
  right:
    - "veintisiete"
    - "veintiocho"
    - "veintinueve"
    - "treinta"

# Kapitel 8 – Färger (fler)

- type: assemble
  direction: es_sv
  task: "Översätt till svenska"
  prompt: "El verde es mi color favorito."
  answer: "Min favoritfärg är grön."
  pool:
    - "Min"
    - "favoritfärg"
    - "är"
    - "grön."
    - "du"
    - "vit,"
    - "svart"

- type: assemble
  direction: sv_es
  task: "Välj rätt spanska"
  prompt: "Gillar du karate?"
  answer: "¿Te gusta el karate?"
  pool:
    - "¿Te"
    - "gusta"
    - "el"
    - "karate?"
    - "negro"
    - "blanco"
    - "verde"

- type: mc
  direction: es_sv
  task: "Översätt till svenska"
  front: "svart"
  back: "negro"
  prompt: "negro"
  options:
    - "svart"
    - "Jag pratar engelska."
    - "Jag har två barn."
    - "mat / måltid"
  correct: 0

- type: assemble
  direction: sv_es
  task: "Översätt till spanska"
  prompt: "Min katt är vit, svart och fin."
  answer: "Mi gato es blanco, negro y bonito."
  pool:
    - "Mi"
    - "gato"
    - "es"
    - "blanco,"
    - "negro"
    - "y"
    - "bonito."
    - "¿Te"
    - "color"
    - "blanco"

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "grön"
    - "blå"
    - "gul"
    - "vit"
  right:
    - "verde"
    - "azul"
    - "amarillo"
    - "blanco"

# Kapitel 9 – Mexiko (ord ur texten)

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "mat / måltid"
  back: "la comida"
  prompt: "la comida"
  options:
    - "nitton (19)"
    - "tjugonio (29)"
    - "Vad behöver vi?"
    - "mat / måltid"
  correct: 3

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "örn"
  back: "el águila"
  prompt: "örn"
  options:
    - "tu familia"
    - "tres perros"
    - "gracias"
    - "el águila"
  correct: 3

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "aztekerna"
  back: "los aztecas"
  prompt: "los aztecas"
  options:
    - "mat / måltid"
    - "Hur är läget? (slang)"
    - "Vad intressant!"
    - "aztekerna"
  correct: 3

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "ett land"
    - "invånarna"
    - "Belize"
    - "typiska rätter"
  right:
    - "un país"
    - "los habitantes"
    - "Belice"
    - "los platos típicos"

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "mayaindianerna"
  back: "los mayas"
  prompt: "mayaindianerna"
  options:
    - "el chico"
    - "diecinueve"
    - "los mayas"
    - "rosa"
  correct: 2

# Kapitel 10 – På marknaden

- type: mc
  direction: es_sv
  task: "Översätt till svenska"
  front: "snälla / tack (vid beställning)"
  back: "por favor"
  prompt: "por favor"
  options:
    - "snälla / tack (vid beställning)"
    - "en kanin"
    - "Jag tror att vi redan har …"
    - "flamingo"
  correct: 0

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "kostar (det kostar)"
  back: "cuesta"
  prompt: "cuesta"
  options:
    - "Spanien"
    - "kostar (det kostar)"
    - "du har / du är … år (tener)"
    - "Vad blir det? / Hur mycket blir det?"
  correct: 1

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "marknaden"
    - "Något mer?"
    - "billiga"
    - "ett halvt kilo"
  right:
    - "el mercado"
    - "¿Algo más?"
    - "baratas"
    - "medio kilo"

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "inget mer"
  back: "nada más"
  prompt: "nada más"
  options:
    - "inget mer"
    - "god eftermiddag"
    - "Hurdan är …? / Hurdan är din familj?"
    - "fjorton (14)"
  correct: 0

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "ananas"
  back: "la piña"
  prompt: "ananas"
  options:
    - "el chico"
    - "diecinueve"
    - "la piña"
    - "rosa"
  correct: 2

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "citron"
  back: "el limón"
  prompt: "citron"
  options:
    - "una hija"
    - "eres"
    - "un pájaro"
    - "el limón"
  correct: 3

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "det är bra / okej"
    - "Vad blir det? / Hur mycket blir det?"
    - "totalt"
    - "ett kilo"
  right:
    - "está bien"
    - "¿Cuánto es?"
    - "en total"
    - "un kilo"

- type: mc
  direction: es_sv
  task: "Översätt till svenska"
  front: "clementin"
  back: "la clementina"
  prompt: "la clementina"
  options:
    - "clementin"
    - "katt"
    - "Vad heter du?"
    - "husdjur"
  correct: 0

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "mycket (här: mycket billiga)"
  back: "muy"
  prompt: "mycket (här: mycket billiga)"
  options:
    - "Buenas noches"
    - "una pregunta"
    - "muy"
    - "los aztecas"
  correct: 2

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "goda (om mat)"
  back: "ricas"
  prompt: "ricas"
  options:
    - "din familj"
    - "goda (om mat)"
    - "Karibien"
    - "Jag har inga husdjur."
  correct: 1

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "druvor"
    - "äpple"
    - "jordgubbe"
    - "apelsin"
  right:
    - "las uvas"
    - "la manzana"
    - "la fresa"
    - "la naranja"

- type: mc
  direction: es_sv
  task: "Vad betyder det här?"
  front: "Vad bra!"
  back: "¡Qué bien!"
  prompt: "¡Qué bien!"
  options:
    - "Vad bra!"
    - "berg"
    - "Hur är läget? (slang)"
    - "Vad blir det? / Hur mycket blir det?"
  correct: 0

- type: mc
  direction: es_sv
  task: "Översätt till svenska"
  front: "okej (vard.)"
  back: "vale"
  prompt: "vale"
  options:
    - "ja"
    - "okej (vard.)"
    - "bokstavens namn: V"
    - "1"
  correct: 1

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "melon"
    - "päron"
    - "banan"
    - "plommon"
  right:
    - "el melón"
    - "la pera"
    - "el plátano"
    - "la ciruela"

# Kapitel 11 – I mataffären

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "fisk (som mat)"
  back: "el pescado"
  prompt: "fisk (som mat)"
  options:
    - "¿Cuánto es?"
    - "el gato"
    - "trece"
    - "el pescado"
  correct: 3

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "Jag tror att vi redan har …"
  back: "Creo que ya tenemos …"
  prompt: "Jag tror att vi redan har …"
  options:
    - "Creo que ya tenemos …"
    - "América Central"
    - "tienes"
    - "vivo"
  correct: 0

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "Jag går. / Jag tar det."
  back: "Voy yo."
  prompt: "Jag går. / Jag tar det."
  options:
    - "Voy yo."
    - "los mayas"
    - "pobrecito"
    - "Buenos días"
  correct: 0

- type: assemble
  direction: es_sv
  task: "Översätt till svenska"
  prompt: "¿Qué necesitamos?"
  answer: "Vad behöver vi?"
  pool:
    - "Vad"
    - "behöver"
    - "vi?"
    - "tar"
    - "går."
    - "vi"

- type: pairs
  direction: sv_es
  task: "Para ihop orden"
  left:
    - "gurka"
    - "tomat"
    - "mjölk"
    - "ris"
  right:
    - "el pepino"
    - "el tomate"
    - "la leche"
    - "el arroz"
