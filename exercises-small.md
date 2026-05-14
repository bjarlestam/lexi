
# Kapitel 1 – Hej

- type: assemble
  direction: es_sv
  task: "Traduce esta frase"
  prompt: "Yo como una manzana"
  answer: "Jag äter ett äpple"
  pool:
    - "Jag"
    - "äter"
    - "ett"
    - "äpple"
    - "apelsin"
    - "röd"
    - "springer"

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "Hej (informellt)"
  back: "¡Hola!"
  prompt: "Hej (informellt)"
  options:
    - "la chica"
    - "¡Hola!"
    - "los peces"
    - "uve"
  correct: 1

- type: mc
  direction: es_sv
  task: "Översätt till svenska"
  front: "Hur är det?"
  back: "¿Qué tal?"
  prompt: "¿Qué tal?"
  options:
    - "apelsin"
    - "häst"
    - "Hur är det?"
    - "jag tycker inte om"
  correct: 2

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "bra"
  back: "bien"
  prompt: "bra"
  options:
    - "hasta pronto"
    - "África"
    - "bien"
    - "diecisiete"
  correct: 2

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "Och du?"
  back: "¿Y tú?"
  prompt: "Och du?"
  options:
    - "el fútbol"
    - "¿Y tú?"
    - "la selva"
    - "grazas"
  correct: 1

- type: mc
  direction: sv_es
  task: "Översätt till spanska"
  front: "hej då (informellt)"
  back: "chao"
  prompt: "hej då (informellt)"
  options:
    - "Creo que ya tenemos …"
    - "hasta pronto"
    - "chao"
    - "tengo trece años"
  correct: 2

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
  direction: sv_es
  task: "Översätt till spanska"
  front: "herr"
  back: "señor"
  prompt: "herr"
  options:
    - "Buenos días"
    - "sí"
    - "veintiuno"
    - "señor"
  correct: 3

- type: mc
  direction: sv_es
  task: "Välj rätt spanska"
  front: "tack"
  back: "gracias"
  prompt: "tack"
  options:
    - "la montaña"
    - "doce"
    - "gracias"
    - "hasta luego"
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
  task: "Översätt till spanska"
  front: "hej då (adjö)"
  back: "adiós"
  prompt: "hej då (adjö)"
  options:
    - "adiós"
    - "eres"
    - "la montaña"
    - "eskerrik asko"
  correct: 0
