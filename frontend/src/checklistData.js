// Checklist tab structure (sections/titles/subtitles/tags/lines) ported from
// https://app.subjectivepersonality.com/analyzer (Checklist tab).
// `interpretation`/`example` are grounded in the OPS source PDF ("OPS
// traducido"): the Elimination Tool, Human Needs, Letras/Funciones
// específicas and Animales sections, reusing its own quotes and "biggest
// fear" phrasing wherever the PDF covers that exact coin.
// `test` describes how to decide whether this row is checked, evaluated
// against the app's current selections/extraSelections/saviorFunctions.
// `opposite` names the sibling item (its "other coin face") used by the
// Interpretation tab to build a contrasting counter-example.

export const CHECKLIST_SECTIONS = [
  {
    title: "Human Needs",
    items: [
      {
        title: "Single Observer",
        subtitle: "IxxJ or ExxP",
        tag: "O/DD",
        lines: [
          "Stuck on info & pathways, not stuck on others point of view.",
          "Relatively balanced with self and tribe, but feels stuck when it comes to control and chaos.",
          "Worries about things, people are safe.",
        ],
        test: { kind: "main", index: 0, side: "left" },
        opposite: "Single Decider",
        interpretation:
          "Se deduce porque sus funciones de Sensación e Intuición están \"en los polos\": siempre está atrapado procesando control, caos, hechos faltantes o comprensión sobre cosas — no sobre personas. Aun con más dificultad personal que un Decisor, entiende con facilidad el punto de vista del otro (puede \"doble-decidir\"). Su ola de vida se acumula por información faltante sobre cosas, no personas.",
        example:
          "\"Sí, sé que fueron muy malos, pero yo también lo sería si estuviera en su lugar... De todos modos, tengo montones de papeleo de la escuela y no puedo entenderlo. Me causó demasiada ansiedad, así que simplemente lo tiré.\"",
      },
      {
        title: "Single Decider",
        subtitle: "IxxP or ExxJ",
        tag: "D/OO",
        lines: [
          "Stuck on people, judgment, fairness, not stuck on missing info.",
          "Relatively balanced with control and chaos, but feels stuck when it comes to self and tribe.",
          "Nervous about people, things are safe",
        ],
        test: { kind: "main", index: 0, side: "right" },
        opposite: "Single Observer",
        interpretation:
          "Se deduce porque sus funciones de Sentimiento y Pensamiento están \"en los polos\": siempre está atrapado procesando personas, justicia, trato recibido o vergüenza. Aunque el control/caos también lo frustra, no se siente permanentemente atrapado por eso — no es su mayor drama. Le cuesta ver con facilidad lo que otros están atravesando. Su ola de vida surge por falta de equilibrio entre personas, no entre cosas.",
        example:
          "\"Sí, realmente apesta que hayas chocado el auto, lo arreglaremos... De todos modos, ¿por qué fuiste a conducir sin mí? ¿Me odias? ¿Te gusta más esa otra persona que yo?\"",
      },
      {
        title: "Di - Identity",
        subtitle: "Fi or Ti",
        tag: "Decider Introverted",
        lines: [
          "Me-story, what I want, I'm allowed, leaves the tribe behind.",
          "Prioritizes their personal values/reasons first, then seeks the spectrum of the tribe's values/reasons.",
          "Knows more about self vs others, me-story.",
          "Seeks Significance before Connection",
        ],
        test: { kind: "main", index: 1, side: "left" },
        opposite: "De - Tribe",
        interpretation:
          "Se deduce porque su De es un demonio: como esa función le genera vacío, va directo a lo que quiere sin consultar antes a la tribu, sintiendo que \"está permitido\". Al hablar, casi no menciona a otros — y cuando lo hace, es con desdén. Con el tiempo esto le acumula un vacío entre él y la tribu.",
        example:
          "\"Realmente quiero esto, algún día voy a hacer aquello, siempre he querido... De todos modos, el tonto de Johnny dice que nunca lo haré. ¿Qué sabe él? Es un idiota.\"",
      },
      {
        title: "De - Tribe",
        subtitle: "Fe or Te",
        tag: "Decider Extroverted",
        lines: [
          "We-story, drags in others, void in what they want, not allowed.",
          "Prioritizes the spectrum of the tribe's values/reasons, then seeks their personal values/reasons.",
          'Knows more about others vs self, "frog in pocket".',
          "Seeks Connection before Significance",
        ],
        test: { kind: "main", index: 1, side: "right" },
        opposite: "Di - Identity",
        interpretation:
          "Se deduce porque su Di es un demonio: necesita primero pedir permiso y consultar con la tribu antes de \"permitirse\" hacer lo que en el fondo quiere (que también es un Di, solo que con ese paso extra). Constantemente integra a otros en su relato — lo cual lo hace parecer generoso — pero culpa a los demás cuando algo sale mal. Con el tiempo acumula un vacío interior por no permitirse hacer lo que realmente quiere.",
        example:
          "\"Bueno, ¿qué quieres? ¿Qué crees que debería hacer? Bueno, Johnny dijo que debería hacer esto; él sabría mejor que yo, que soy insignificante.\"",
      },
      {
        title: "Oi - Organize",
        subtitle: "Ni or Si",
        tag: "Observer Introverted",
        lines: [
          "Has a way, same story, concludes, narrows, shoves away new.",
          "Answers are found by going over known facts/concepts, then gathering in new facts/concepts later.",
          "Keeps circling back to the same known story, conclusions.",
          "Seeks Certainty before Variety",
        ],
        test: { kind: "main", index: 2, side: "left" },
        opposite: "Oe - Gather",
        interpretation:
          "Se deduce porque su Oe es un demonio: aparta la información nueva que necesitaría, y sin saberlo eso termina forzando el caos sobre él. Habla en capítulos — tiene un camino, reduce opciones y concluye — y encuentra tranquilidad en eliminar lo irrelevante en cada conversación. Con el tiempo se le acumula una ola de información nueva descuidada que termina arrasando con sus rutinas ya obsoletas.",
        example:
          "\"Y luego hicimos esto, y luego pasó aquello, y luego esta cosa aleatoria... En fin, así terminó y esto es lo que voy a implementar para asegurarme de que todo eso nunca vuelva a suceder.\"",
      },
      {
        title: "Oe - Gather",
        subtitle: "Ne or Se",
        tag: "Observer Extroverted",
        lines: [
          "Channel change, we'll see, wants control - but doesn't",
          "Answers are found by gathering new facts/concepts, then organizing known facts/concepts later.",
          "Keeps channel changing and interrupting self, variety.",
          "Seeks Variety before Certainty",
        ],
        test: { kind: "main", index: 2, side: "right" },
        opposite: "Oi - Organize",
        interpretation:
          "Se deduce porque su Oi es un demonio (aunque todos tienen algo de Oi adentro): dirá que quiere control, pero no verá que no lo está logrando — sin saberlo, fuerza al mundo exterior a controlarlo a él. Está obligado a mirar cada pieza de información nueva que llega; donde el Oi dice \"No\" diez veces al día, él dice \"Sí\" a todo. Con el tiempo se le acumula una pila gigante de caos que otros terminan teniendo que entrar a reducir por él.",
        example:
          "\"Y luego hicimos esto, y luego pasó aquello, y luego esta cosa aleatoria... En fin, pasemos a esta otra cosa aleatoria por aquí. Oh, ¿te conté sobre Johnny? ¡Tienes que escuchar esta historia!\"",
      },
    ],
  },
  {
    title: "Letters",
    items: [
      {
        title: "Feeling",
        subtitle: "Fi or Fe",
        lines: [
          "Values, likes, hates, weak reasons, won't make it work",
          "Looks to prioritize/value of something, then figures out the reasons.",
          "Prioritizing, emotions, likes",
        ],
        test: { kind: "main", index: 4, side: "left" },
        opposite: "Thinking",
        interpretation:
          "Se deduce porque su Pensamiento es un demonio: sabe qué es valioso y se enfoca directamente en eso, pero le resulta difícil implementarlo en la práctica — puede desear y valorar algo todo el día sin quedarse despierto toda la noche para hacerlo funcionar.",
        example:
          "Ama la idea de que todos disfruten una buena comida juntos a las 5 p.m., pero no considera los horarios de trabajo de los demás, si tienen suficientes sillas, ni si compraron la comida a tiempo.",
      },
      {
        title: "Thinking",
        subtitle: "Ti or Te",
        lines: [
          "Works, get it done, logic, reasons, unowned emotions",
          "Looks to figure out the reasons of something, then figures out the priorities/values.",
          "Getting it done, reasons, what works",
        ],
        test: { kind: "main", index: 4, side: "right" },
        opposite: "Feeling",
        interpretation:
          "Se deduce porque su Sentimiento es un demonio: le resulta difícil identificar los sentimientos propios y ajenos, así que empieza a trabajar en lo que hay que hacer sin notar el ambiente incómodo de la sala. Cree que cuanto más trabajo resuelva, menos sentimientos negativos habrá después — aunque eso le pase factura a él mismo.",
        example:
          "\"Me quedé despierto hasta tarde y resolví este gran problema en el trabajo. ¡Todos estarán muy contentos el lunes al ver que yo lo resolví!\" (Luego duerme hasta tarde el lunes porque quedó emocionalmente agotado, otra vez.)",
      },
      {
        title: "Sensory",
        subtitle: "Si or Se",
        lines: [
          "Proving, gives facts, grounded, not jumping or summarizing",
          "Looks for the proveable facts first, then sees the abstract connections.",
          "Responsible to prove the case, tracks the facts",
        ],
        test: { kind: "main", index: 3, side: "right" },
        opposite: "Intuition",
        interpretation:
          "Se deduce porque su Intuición es un demonio: le cuesta hacer conjeturas abstractas sin hechos que las respalden, así que está obligado a probar y fundamentar lo que realmente ocurrió antes de que se le \"permita\" adivinar. Una frase que dice mucho: \"No entiendo\" (cuando le piden ver la conexión o el patrón general).",
        example:
          "\"Cuando me levanto por la mañana, primero bebo un poco de agua, luego reviso mis correos electrónicos, después me ducho y finalmente desayuno. En general, mi rutina matutina es bastante eficiente.\"",
      },
      {
        title: "Intuition",
        subtitle: "Ni or Ne",
        lines: [
          "Summarizing, categories, abstract, void in supporting facts",
          "Looks for abstract connections first, then sees the provable facts.",
          "Jumps to conclusions, tracks the patterns",
        ],
        test: { kind: "main", index: 3, side: "left" },
        opposite: "Sensory",
        interpretation:
          "Se deduce porque su Sensación es un demonio: le cuesta decir lo obvio y dar detalles específicos aunque parezca que está fingiendo. Busca el resumen, el concepto, la conclusión — para él, los detalles de un caso no representan el panorama completo. Una frase que dice mucho: \"Esto me recuerda a...\" (conecta por analogía en vez de listar hechos).",
        example:
          "\"Mi rutina matutina es eficiente. Me levanto, hago todas mis cosas de la mañana y luego me voy al trabajo. ¡Hago más que un caballo de carreras promedio!\" (¿Qué rayos?)",
      },
      {
        title: "SF",
        subtitle: "Popularity",
        lines: ["Sees the value in the physical world, then seeks to figure out the reasons in the abstract."],
        test: { kind: "and", tests: [{ kind: "main", index: 3, side: "right" }, { kind: "main", index: 4, side: "left" }] },
        opposite: "NT",
        interpretation:
          "Combina el Sentimiento (prioriza lo valioso) con la Sensación (necesita hechos probados): nota primero qué tiene valor en el mundo físico o social, y recién después busca la razón que lo explique.",
        example: "Nota, por hechos concretos (quién sonrió, quién repitió comida), que la junta gustó — y recién después entiende técnicamente por qué funcionó.",
      },
      {
        title: "NT",
        subtitle: "Nerdy",
        lines: ["Figures out the reasons in the abstract world, then seeks to find the value in the physical."],
        test: { kind: "and", tests: [{ kind: "main", index: 3, side: "left" }, { kind: "main", index: 4, side: "right" }] },
        opposite: "SF",
        interpretation:
          "Combina el Pensamiento (razones, lógica) con la Intuición (patrones, resumen): encuentra primero la razón en el mundo abstracto, y después busca dónde tiene valor en lo físico.",
        example: "Diseña un sistema lógicamente elegante y recién después se pregunta si a alguien le va a servir en la práctica.",
      },
      {
        title: "ST",
        subtitle: "Reporter",
        lines: ["Sees the reasons in the physical world, then seeks to figure out the value in the abstract."],
        test: { kind: "and", tests: [{ kind: "main", index: 3, side: "right" }, { kind: "main", index: 4, side: "right" }] },
        opposite: "NF",
        interpretation:
          "Combina el Pensamiento con la Sensación: ve primero las razones probables y concretas de lo físico, y después el valor abstracto que tienen.",
        example:
          "Reporta exactamente qué pasó en la reunión, cifras y hechos, antes de opinar sobre qué significa para el equipo.",
      },
      {
        title: "NF",
        subtitle: "Hippie",
        lines: ["Sees the value in the abstract world, then seeks to figure out the reasons in the physical."],
        test: { kind: "and", tests: [{ kind: "main", index: 3, side: "left" }, { kind: "main", index: 4, side: "left" }] },
        opposite: "ST",
        interpretation:
          "Combina el Sentimiento con la Intuición: ve primero el valor en el mundo abstracto, y después busca la razón concreta que lo explique.",
        example:
          "Siente que \"esto no se sintió bien\" en la reunión, y recién después intenta señalar qué hecho concreto lo causó.",
      },
    ],
  },
  {
    title: "Functions",
    items: [
      {
        title: "Si",
        subtitle: "Introverted Sensory",
        lines: [
          "Answers are found by going over known facts, then gathering in new concepts later.",
          "Shoves away new concepts, understandings, and possibilities, so they can go over and refine their known, personal, facts.",
        ],
        test: { kind: "function", code: "Si" },
        opposite: "Se",
        interpretation:
          "El Salvador Si descarta constantemente conceptos y posibilidades nuevas para repasar y refinar sus hechos personales conocidos, impulsado por el miedo a que \"cualquier cosa pueda pasar\".",
        example:
          "Su mayor miedo es que un caos aleatorio que nunca pudo predecir caiga del cielo y destruya todo lo que construyó.",
      },
      {
        title: "Ne",
        subtitle: "Extroverted Intuition",
        lines: [
          "Answers are found by gathering new concepts, then organizing known facts later.",
          "Has a hard time staying on one topic, narrowing down, and giving specific details.",
        ],
        test: { kind: "function", code: "Ne" },
        opposite: "Ni",
        interpretation:
          "El Salvador Ne tiene dificultad para centrarse en un solo tema y dar detalles específicos; impulsado por el miedo a ser físicamente controlado, escanea constantemente nuevos conceptos y posibilidades.",
        example: "Su mayor miedo es que algún controlador tenga su información física encerrada.",
      },
      {
        title: "Ni",
        subtitle: "Introverted Intuition",
        lines: [
          "Answers are found by going over known concepts, then gathering in new facts later.",
          "Shoves away every new fact that they can't connect back to their old, personal, patterns.",
        ],
        test: { kind: "function", code: "Ni" },
        opposite: "Ne",
        interpretation:
          "El Salvador Ni descarta cualquier hecho nuevo que no conecte con sus patrones personales previos, impulsado por el miedo al caos físico aleatorio que arruine su camino.",
        example:
          "Su mayor miedo es que los hechos nuevos colapsen la visión abstracta y anticuada del mundo que construyó en su cabeza.",
      },
      {
        title: "Se",
        subtitle: "Extroverted Sensory",
        lines: [
          "Answers are found by gathering new facts, then organizing known concepts later.",
          "Has a hard time staying on one topic, narrowing down, and seeing how much this experience is just like all the ones before and after it.",
        ],
        test: { kind: "function", code: "Se" },
        opposite: "Si",
        interpretation:
          "El Salvador Se tiene dificultad para quedarse en un tema y ver cómo esta experiencia se parece a otras anteriores; escanea y junta hechos con la esperanza de algún día encontrar control.",
        example:
          "Su mayor miedo es descubrir algún día que, aunque \"parecía nuevo\" en su momento, en realidad estaba atrapado en los mismos círculos de siempre.",
      },
      {
        title: "Fi",
        subtitle: "Introverted Feeling",
        lines: [
          "Prioritizes their personal values first, then seeks the spectrum of the tribe's reasons.",
          "Shoves away all the work that the tribe needs help with, so they can do more of what they love.",
        ],
        test: { kind: "function", code: "Fi" },
        opposite: "Fe",
        interpretation:
          "El Salvador Fi descarta todo el trabajo que la tribu necesita para poder hacer más de lo que ama, esperando que otros vean su pasión y de alguna manera hagan el trabajo por él.",
        example: "Su mayor miedo es que la tribu le diga que lo que ama es estúpido, y que tenga que hacer un trabajo que odia para ser realmente valioso.",
      },
      {
        title: "Te",
        subtitle: "Extroverted Thinking",
        lines: [
          "Prioritizes the spectrum of the tribe's reasons, then seeks their personal values.",
          "Has a hard time narrowing in on all the things that need to be done, and picking the one that has a higher value for themselves.",
        ],
        test: { kind: "function", code: "Te" },
        opposite: "Ti",
        interpretation:
          "El Salvador Te tiene dificultad para enfocarse en todas las cosas que necesitan hacerse y elegir la que tenga mayor valor para sí mismo; hace todo el trabajo de la tribu para que todos tengan que amarlo.",
        example: "Su mayor miedo es hacer todo el trabajo duro y que, aun así, nadie lo ame.",
      },
      {
        title: "Ti",
        subtitle: "Introverted Thinking",
        lines: [
          "Prioritizes their personal reasons first, then seeks the spectrum of the tribe's values.",
          "Shoves away what everyone else loves and wants to do, so they can work on what they know is true for them.",
        ],
        test: { kind: "function", code: "Ti" },
        opposite: "Te",
        interpretation:
          "El Salvador Ti descarta lo que todos los demás aman y quieren hacer, para trabajar en lo que sabe que es verdad para sí mismo, construyendo algo increíble para que otros tengan que amarlo.",
        example:
          "Su mayor miedo es pasar años descubriendo la verdad y construyendo algo increíble, solo para descubrir que a la tribu ni siquiera le importa.",
      },
      {
        title: "Fe",
        subtitle: "Extroverted Feeling",
        lines: [
          "Prioritizes the spectrum of the tribe's values, then seeks their personal reasons.",
          "Has a hard time narrowing down on what everyone loves, and going with what they know to be true (even though everyone will hate that).",
        ],
        test: { kind: "function", code: "Fe" },
        opposite: "Fi",
        interpretation:
          "El Salvador Fe tiene dificultad para seguir lo que sabe que es verdad si la tribu lo va a odiar; intenta constantemente hacer felices a todos para que lo ayuden con su propio trabajo.",
        example:
          "Su mayor miedo es darse cuenta de que todos esos años preocupándose por los demás lo dejaron inseguro y sin poder hacer que las cosas funcionen para sí mismo.",
      },
    ],
  },
  {
    title: "Animals",
    items: [
      {
        title: "Sleep",
        subtitle: "Di + Oi",
        lines: [
          "Same story about self, processed, resolved, won't jump in",
          "Process and preserves energy for self, before expending energy for the tribe",
          "Same old story about me, processed, work alone",
          "Introverted Energy Animal",
        ],
        test: { kind: "main", index: 5, side: "left" },
        opposite: "Play",
        interpretation:
          "Sleep \"pisa los frenos\", preserva, introspecta y procesa desde el principio. Son los momentos tranquilos del día, sin distracciones externas, solo uno repasando lo conocido.",
        example:
          "\"¿Por qué sigue ocurriendo esto? ¿Cómo puedo evitar tropezar con los mismos problemas todos los días? ¿Quién quiero ser? ¿Cómo voy a lograrlo?\"",
      },
      {
        title: "Play",
        subtitle: "De + Oe",
        lines: [
          "Random story about others, unresolved, won't hit the brakes",
          "Expends energy for the tribe, before processing and preserving energy for self.",
          "Random story about others, process & do with others",
          "Extroverted Energy Animal",
        ],
        test: { kind: "main", index: 5, side: "right" },
        opposite: "Sleep",
        interpretation:
          "Play salta a la acción, gasta energía, causa caos, aprende y procesa un poco recién al final; aprende interactuando con otros, lanzándose y probando cosas.",
        example:
          "\"¡Puedo ayudar con eso! ¡Hagámoslo ahora juntos! ¿Qué necesitas que haga? ¡Aquí tienes esto! ¡Yay, lo estamos haciendo juntos!\"",
      },
      {
        title: "Consume",
        subtitle: "Oe + Di",
        lines: [
          "Random story about self, takes you along, trails off, not ready",
          "Takes in and respects info, before getting started and teaching.",
          "Random story about me, pile for me, savor",
          "Introverted Information Animal",
        ],
        test: { kind: "main", index: 6, side: "left" },
        opposite: "Blast",
        interpretation:
          "Consume aprende absorbiendo información a solas. Como tiene a Blast como demonio, le resulta difícil reducirla y comunicarla; nunca siente que está listo para empezar, porque siempre hay más que aprender.",
        example:
          "\"Estuve investigando un nuevo programa que podríamos usar para el trabajo, lo encontré aquí, y este artículo tiene muchos puntos buenos. Por cierto, esto es lo que más me gusta de él...\" (¿de qué trata esto? ¿Realmente lo necesitamos?)",
      },
      {
        title: "Blast",
        subtitle: "De + Oi",
        lines: [
          "Same story about others, lessons, jumps in, overextended",
          "Gets started and is able to teach, before respecting and gathering info.",
          "Same old story about others, can talk, produce",
          "Extroverted Information Animal",
        ],
        test: { kind: "main", index: 6, side: "right" },
        opposite: "Consume",
        interpretation:
          "Blast aprende lanzándose, probando y enseñando a otros; toma un poco de información y rápidamente se siente listo para probarla y enseñarla, aunque el grupo note que está \"vacío\".",
        example:
          "\"¡Acabo de ver un video sobre este tema nuevo, déjame explicártelo!\" — habla con tono autoritario aunque no tenga idea de lo que está diciendo. \"No importa, lo descubriré mientras avanzo.\"",
      },
      {
        title: "Info Dominant",
        lines: [
          "Balance in learning and sharing info, works/rests in swings",
          "Relative balance in conversations, knowledge is power",
          "Imbalanced with work and rest, over or under exert",
          "Blast and Consume in top 3 animals, Play or Sleep last.",
        ],
        test: { kind: "main", index: 7, side: "left" },
        opposite: "Energy Dominant",
        interpretation:
          "Equilibrio entre aprender y compartir información, trabaja y descansa en ciclos desparejos: relativamente balanceado en las conversaciones, pero imbalanceado con el trabajo y el descanso.",
        example: "En una charla reparte parejo entre escuchar y opinar, pero en su semana se sobre-exige o se tira a no hacer nada.",
      },
      {
        title: "Energy Dominant",
        lines: [
          "Balance in work and rest, learns/talks in swings",
          "Relative balance with work and rest, goofy",
          "Imbalanced in conversations, overshare or undershare information",
          "Play and Sleep in top 3 animals, Consume or Blast last.",
        ],
        test: { kind: "main", index: 7, side: "right" },
        opposite: "Info Dominant",
        interpretation:
          "Equilibrio entre trabajar y descansar, aprende y habla en ciclos: relativamente balanceado con el trabajo y el descanso, pero imbalanceado en las conversaciones.",
        example: "Organiza bien sus tiempos de trabajo y descanso, pero en una charla puede quedarse callado toda la noche o hablar sin parar.",
      },
      {
        title: "SC",
        subtitle: "Sleep + Consume",
        lines: ["Deep inner world of taking in info and processing."],
        test: { kind: "and", tests: [{ kind: "main", index: 5, side: "left" }, { kind: "main", index: 6, side: "left" }] },
        opposite: "PB",
        interpretation:
          "Combina el absorber información a solas (Consume) con el procesar en soledad (Sleep): un mundo interior profundo, todo hacia adentro.",
        example: "Pasa el fin de semana solo, leyendo y dándole vueltas a un tema, sin necesidad de compartirlo todavía.",
      },
      {
        title: "CP",
        subtitle: "Consume + Play",
        lines: ["Over gathers then wants to do something with it."],
        test: { kind: "and", tests: [{ kind: "main", index: 5, side: "right" }, { kind: "main", index: 6, side: "left" }] },
        opposite: "BS",
        interpretation:
          "Combina el absorber información (Consume) con el lanzarse a la acción con otros (Play): junta de más y después quiere hacer algo con eso, ya con la tribu.",
        example: "Devora cursos y tutoriales, y en cuanto puede arrastra a otros a probar lo aprendido.",
      },
      {
        title: "PB",
        subtitle: "Play + Blast",
        lines: ["Expends energy and shares knowledge."],
        test: { kind: "and", tests: [{ kind: "main", index: 5, side: "right" }, { kind: "main", index: 6, side: "right" }] },
        opposite: "SC",
        interpretation:
          "Combina el lanzarse con otros (Play) con el enseñar de inmediato (Blast): gasta energía y comparte lo que sabe, todo hacia afuera.",
        example: "Pasa el fin de semana organizando y enseñándole cosas al grupo, sin frenar a procesar nada en soledad.",
      },
      {
        title: "BS",
        subtitle: "Blast + Sleep",
        lines: ["Reworks same info and then shares knowledge."],
        test: { kind: "and", tests: [{ kind: "main", index: 5, side: "left" }, { kind: "main", index: 6, side: "right" }] },
        opposite: "CP",
        interpretation:
          "Combina el enseñar (Blast) con el procesar a solas (Sleep): retrabaja la misma información conocida y recién después la comparte.",
        example: "Vuelve una y otra vez sobre lo mismo que ya sabe, y cuando lo tiene pulido en su cabeza, ahí sí sale a compartirlo.",
      },
      {
        title: "Introverted",
        lines: ['Always "kicked" by the tribe to talk and move, outbursts later.', "Play or Blast last."],
        test: { kind: "main", index: 8, side: "left" },
        opposite: "Extroverted",
        interpretation:
          "Siempre está \"impulsado\" por el grupo (tribe) para hablar y moverse, con estallidos de energía más tarde.",
        example: "Se queda calladito en la reunión hasta que alguien lo saca a hablar, y ahí ya no para.",
      },
      {
        title: "Extroverted",
        lines: ["Always tiring out self and tribe, then crashes later.", "Sleep or Consume last."],
        test: { kind: "main", index: 8, side: "right" },
        opposite: "Introverted",
        interpretation: "Siempre se agota a sí mismo y al grupo (tribe), y luego se derrumba más tarde.",
        example: "Es el motor de la juntada toda la noche, y al día siguiente no puede ni levantarse de la cama.",
      },
    ],
  },
  {
    title: "Modalities",
    items: [
      {
        title: "De Feminine",
        lines: ["Moveable with the tribe, direct on identity.", "Pressure on self, easy on others."],
        test: { kind: "extra", index: 0, side: "left" },
        opposite: "De Masculine",
        interpretation:
          "Su función Decisora Extrovertida (De: Fe o Te) es Femenina: flexible, tranquila y no confrontacional con la tribu — aunque puede ser firme y directa en su propia identidad.",
        example: "Cede fácil en un plan grupal y evita el enfrentamiento, pero no transa un milímetro en algo que define quién es él.",
      },
      {
        title: "De Masculine",
        lines: ["Direct with the tribe, moveable on identity.", "Pressure on others, easy on self."],
        test: { kind: "extra", index: 0, side: "right" },
        opposite: "De Feminine",
        interpretation:
          "Su función Decisora Extrovertida (De: Fe o Te) es Masculina: inflexible, impositiva y persistente con la tribu.",
        example: "Impone su plan al grupo sin problema y no da el brazo a torcer fácilmente frente a los demás.",
      },
      {
        title: "S Feminine",
        lines: ["Solid with the concepts, moveable with the facts.", "Visual/Tester, visualizes pictures."],
        test: { kind: "extra", index: 1, side: "left" },
        opposite: "S Masculine",
        interpretation:
          "Su función Sensorial es Femenina, \"en el medio\": según el documento, usa mucho más su Intuición que alguien con Sensación Masculina.",
        example: "Da una versión eficiente y resumida de su rutina o su día, sin enumerar cada hecho puntual — más parecido al reporte del Intuitivo.",
      },
      {
        title: "S Masculine",
        lines: ["Solid with the facts, moveable with the concepts.", "Audio/Kinesthetic, knows timeline."],
        test: { kind: "extra", index: 1, side: "right" },
        opposite: "S Feminine",
        interpretation:
          "Su función Sensorial es Masculina, \"al frente\": se apoya mucho menos en la Intuición, pegada a los hechos concretos, uno por uno.",
        example:
          "\"Cuando me levanto por la mañana, primero bebo un poco de agua, luego reviso mis correos electrónicos, después me ducho y finalmente desayuno\" — un reporte hecho por hecho, en orden.",
      },
    ],
  },
];

export function checklistItemChecked(test, ctx) {
  const { selections, extraSelections, saviorFunctions } = ctx;
  switch (test.kind) {
    case "main":
      return selections[test.index] === test.side;
    case "extra":
      return extraSelections[test.index] === test.side;
    case "function":
      return !!saviorFunctions && saviorFunctions.includes(test.code);
    case "and":
      return test.tests.every((t) => checklistItemChecked(t, ctx));
    default:
      return false;
  }
}

export function findChecklistItem(title) {
  for (const section of CHECKLIST_SECTIONS) {
    const item = section.items.find((i) => i.title === title);
    if (item) return item;
  }
  return null;
}
