# hsma-html-game
spieltitel: >kumpelfreund chat<

konzept
da ich eine passion für indie games und pixelart, sowie 
retro games habe, musste es ein monocromes, textbasiertes game geben. 
die vollendete idee kam durch das spiel >Buddy Simulator 1984<.
es sollte also ein chatbot sein, mit dem man interagieren kann. 

dafür hat mir sehr das tutorial geholfen:
https://dev.to/sylviapap/make-a-simple-chatbot-with-javascript-1gc

da die zeit doch echt schnell voranschritt, entwickelte sich die 
idee zu einem art kampf gegen den chatbot, indem man nach der reihe 
durch drei spiele spielen muss. wenn man gewinnt, wird der bot 
sauer. verliert man, drückt er seinen triumpf aus. die drei kleinen
spiele innerhalb des gesamten spiels, sind recht einfach ausgefallen.

// das erste spiel ist >schere, stein, papier<. 
ein simpler randomizer, wie im kurs gezeigt.
die gifs sind auch selbst erstellt, keine assets.

// das zweite spiel ist >vier gewinnt<. 
es hat einige schwächen, denn auch hier ist es doch 
nur zufall, wo der bot den stein platziert. 
ist mir zu diesem zeitpunkt der entwicklung doch zu viel zeit, da ich lieber
ein gesamtes game möchte und nicht das risiko eingehen will, etwas raus streichen zu müssen.

um programmieren allgemein besser zu verstehen hat mir der kurs geholfen:
// https://stanford.edu/~cpiech/karel/learn.html

// zum letzten spiel ist die inspo natürlich das 
google game >jumping dino< gemischt mit >goose game<
die ente ist auch selbst gemacht. 
hinweis: bei diesen spiel kamen keine echten enten zu schaden. 

für den side scroller hat mit das tutorial geholfen:
// https://levelup.gitconnected.com/creating-a-simple-2d-game-with-html5-javascript-889aa06035ef

der plot ist, dass man das game nicht gewinnen kann, denn der bot 
ist so wütend, dass er das spiel zum >absturz< bringt und der 
browser geschlossen bzw. das spiel neu geladen werden muss. 


fazit
im ganzen, hat das spiel größere ausmaße angenommen als gedacht, es hat immens zeit gekostet
bin mir über optimierungen bewusst, aber für den start in die welt des JS bin ich sehr zufrieden :)

bei allen problemen und JS-knowledge, die nicht direkt im 
kurs HTML gezeigt wurden hatte ich auch unterstützungen von meinem partner dennis.

sound referenzen:
freesound.org

entensound: alisa *quack*


funktionen:
in den chat schreiben:

smalltalk am anfang möglich:
(aus dem tutorial übernmommen)

// "hi", "hey", "hello"
// "how are you", "how are things"
// "what is going on", "what is up"
// "happy", "good", "well", "fantastic", "cool"
// "bad", "bored", "tired", "sad"
// "tell me story", "tell me joke"
// "thanks", "thank you"
// "bye", "good bye", "goodbye"

"game" 
startet das erste spiel

spielfunktionen trigger:
"paper"
"scissors"
"rock"

// >vier gewinnt< 
mausklick an die reihe, wo der stein gesetzt werden möchte

// >side scroller<
pfeiltasten zum steuern
leertaste zum springen


*quack* ende.
