// KI-Manager ist kein Ponyhof - Main Game Script
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.successRate = 0;
        this.questions = [];
        this.currentQuestion = null;
        this.usedQuestions = new Set(); // Track ALL used questions globally
        this.usedMultipleChoiceQuestions = new Set(); // Separate tracking für Multiple-Choice Fragen
        this.selectedAnswerIndex = null; // Track selected answer before confirmation
        this.currentQuestionType = 'multiple'; // 'multiple' or 'fill'
        
        // Globale Fragenverwaltung
        this.totalQuestionsCount = 0; // Wird nach dem Laden der Fragen gesetzt
        this.allQuestionTypes = ['general', 'fill', 'sandra', 'juergen', 'thomas']; // Alle Fragentypen
        
        // Lückentext-Fragen für übermüdete NPCs
        this.fillInQuestions = [
            {
                frage: "Die EU-KI-Verordnung regelt den Umgang mit ___ in Europa.",
                answer: "künstlicher intelligenz",
                alternatives: ["ki", "ai", "artificial intelligence", "kuenstlicher intelligenz"],
                explanation: "😴 Müder NPC-Tipp: Die EU-KI-Verordnung ist das erste umfassende KI-Gesetz!"
            },
            {
                frage: "Machine Learning ermöglicht es Computern, aus ___ zu lernen.",
                answer: "daten",
                alternatives: ["data", "erfahrungen", "beispielen", "informationen"],
                explanation: "😴 Schläfriger Hinweis: Daten sind das Futter für KI-Algorithmen!"
            },
            {
                frage: "Ein neuronales Netz ist inspiriert von der Funktionsweise des menschlichen ___.",
                answer: "gehirns",
                alternatives: ["brain", "hirns", "neurons", "nervensystems"],
                explanation: "😴 Müdigkeits-Info: Neuronale Netze imitieren biologische Neuronen!"
            },
            {
                frage: "High-Risk KI-Systeme benötigen eine ___ bevor sie eingesetzt werden dürfen.",
                answer: "zertifizierung",
                alternatives: ["prüfung", "genehmigung", "kontrolle", "bewertung", "evaluation"],
                explanation: "😴 Compliance-Schlaf-Tipp: Sicherheit first bei kritischen KI-Systemen!"
            },
            {
                frage: "KI-Bias entsteht oft durch ___ in den Trainingsdaten.",
                answer: "verzerrungen",
                alternatives: ["vorurteile", "ungleichgewicht", "fehler", "diskriminierung", "bias"],
                explanation: "😴 Ethik-Nickerchen: Faire Daten = Faire KI!"
            }
        ];
        
        // NPC-spezifische Fragen
        this.npcSpecificQuestions = {
            sandra: [
                {
                    frage: "Was ist bei der Einstellung von KI-Entwicklern besonders wichtig?",
                    antworten: [
                        { text: "Verständnis für Datenschutz und Ethik", korrekt: true },
                        { text: "Nur technische Fähigkeiten", korrekt: false },
                        { text: "Erfahrung mit sozialen Medien", korrekt: false },
                        { text: "Kaffeekonsum-Fähigkeiten", korrekt: false }
                    ],
                    explanation: "👥 HR-Tipp: KI-Entwickler brauchen nicht nur Code-Skills, sondern auch ethisches Verständnis!"
                },
                {
                    frage: "Wie sollten Mitarbeiter über KI-Nutzung geschult werden?",
                    antworten: [
                        { text: "Regelmäßige Schulungen zu Chancen und Risiken", korrekt: true },
                        { text: "Gar nicht, das regelt sich von selbst", korrekt: false },
                        { text: "Nur einmalige Einführung", korrekt: false },
                        { text: "YouTube-Videos reichen aus", korrekt: false }
                    ],
                    explanation: "📚 HR-Weisheit: KI-Bildung ist ein kontinuierlicher Prozess, nicht nur ein Workshop!"
                }
            ],
            juergen: [
                {
                    frage: "Was ist ein High-Risk KI-System nach EU-Verordnung?",
                    antworten: [
                        { text: "Systeme mit potentiell hohem Schaden", korrekt: true },
                        { text: "Sehr teure KI-Software", korrekt: false },
                        { text: "KI für Computerspiele", korrekt: false },
                        { text: "Chatbots für Kundenservice", korrekt: false }
                    ],
                    explanation: "⚖️ Compliance-Regel: High-Risk KI braucht strenge Kontrollen - wie ein TÜV für Algorithmen!"
                },
                {
                    frage: "Welche Dokumentation ist für KI-Compliance erforderlich?",
                    antworten: [
                        { text: "Vollständige Risikoanalyse und Testberichte", korrekt: true },
                        { text: "Nur der Quellcode", korrekt: false },
                        { text: "Ein einfacher Produktbeschreibung", korrekt: false },
                        { text: "Screenshots der Benutzeroberfläche", korrekt: false }
                    ],
                    explanation: "📋 Compliance-Grundsatz: Dokumentation ist der Beweis, dass alles rechtens läuft!"
                }
            ],
            thomas: [
                {
                    frage: "Wie kann KI den ROI eines Unternehmens steigern?",
                    antworten: [
                        { text: "Automatisierung und bessere Entscheidungen", korrekt: true },
                        { text: "Nur durch Kostensenkung", korrekt: false },
                        { text: "Ersatz aller Mitarbeiter", korrekt: false },
                        { text: "Mehr bunte Grafiken erstellen", korrekt: false }
                    ],
                    explanation: "💰 Business-Regel: KI ist ein Produktivitäts-Multiplikator, kein Zauberstab!"
                },
                {
                    frage: "Welche KI-Metriken sind für Business-Analyse wichtig?",
                    antworten: [
                        { text: "Genauigkeit, Effizienz und Geschäftswert", korrekt: true },
                        { text: "Nur die Geschwindigkeit", korrekt: false },
                        { text: "Anzahl der Parameter im Modell", korrekt: false },
                        { text: "Wie cool die KI aussieht", korrekt: false }
                    ],
                    explanation: "📊 Business-Insight: Messe was zählt - Impact, nicht nur Technik-Zahlen!"
                }
            ]
        };
        this.gameState = 'playing'; // playing, question, shop
        
        // Audio System
        this.audioContext = null;
        this.backgroundMusic = null;
        this.soundEffects = {};
        this.musicVolume = 0.3;
        this.effectsVolume = 0.5;
        this.initAudioSystem();
        
        // Game objects
        this.player = { x: 80, y: 350, width: 48, height: 64 }; // Manager position at desk
        this.npcs = [];
        this.items = [];
        this.powerUps = [];
        
        // Office furniture - standard desk and PC from start
        this.officeFurniture = [
            { type: 'desk', x: 60, y: 370, width: 120, height: 60 },
            { type: 'pc', x: 140, y: 340, width: 40, height: 30 },
            { type: 'chair', x: 70, y: 380, width: 30, height: 30 },
            { type: 'bookshelf', x: 450, y: 120, width: 60, height: 120 },
            { type: 'plant', x: 520, y: 200, width: 40, height: 60 }
        ];
        
        // Pony stall area - moved to top left
        this.stall = {
            x: 20,
            y: 20,
            width: 180,
            height: 120
        };
        
        // NPC spawning system
        this.npcSpawnTimer = 0;
        this.npcSpawnInterval = 3000; // 3 seconds between NPCs (faster)
        this.activeNPC = null;
        this.npcQueue = [];
        this.npcTypes = ['developer', 'manager', 'intern', 'client', 'sandra', 'juergen', 'thomas'];
        this.officeEntrance = { x: 580, y: 300 }; // Right side entrance
        this.questionSpot = { x: 220, y: 260 }; // Where NPCs stand to ask questions
        
        // Müde NPCs haben andere Sprüche  
        this.tiredNpcSayings = {
            developer: [
                "*gähnt* Ich hab die ganze Nacht gecoded...",
                "Kaffee... brauche mehr Kaffee...",
                "Wo war ich nochmal? Ach ja, bei der Frage...",
                "*reibt sich die Augen* Entschuldigung, bin etwas müde..."
            ],
            manager: [
                "*gähnt* Sorry, hatte zu viele Meetings heute...",
                "Können Sie das nochmal wiederholen? Bin etwas durch...",
                "*müde* Die Zahlen... äh... wo waren wir?",
                "Brauche dringend einen Kaffee..."
            ],
            intern: [
                "*schläfrig* War zu spät noch am Lernen...",
                "Entschuldigung, bin noch nicht ganz wach...",
                "*gähnt* Diese Frage ist bestimmt wichtig...",
                "Hoffe, das ist nicht zu schwer..."
            ],
            client: [
                "*müde* Langer Flug heute morgen...",
                "Jetlag... können wir das kurz halten?",
                "*gähnt* Diese KI-Sachen sind kompliziert...",
                "Brauche erstmal einen Kaffee..."
            ],
            sandra: [
                "*schläfrig* Zu viele Bewerbungen heute gelesen...",
                "Sorry, bin etwas übermüdet vom Recruiting...",
                "*gähnt* HR ist manchmal anstrengend...",
                "Kaffee würde jetzt helfen..."
            ],
            juergen: [
                "*müde* Compliance-Berichte bis spät in die Nacht...",
                "Entschuldigung, zu lange an Vorschriften gearbeitet...",
                "*gähnt* Diese Gesetze sind so trocken...",
                "Brauche definitiv Koffein..."
            ],
            thomas: [
                "*schläfrig* Quartalszahlen bis 3 Uhr nachts...",
                "Sorry, Business Analytics macht müde...",
                "*gähnt* ROI-Berechnungen den ganzen Tag...",
                "Golf wäre jetzt entspannender..."
            ]
        };

        // Spezielle Sprüche für Lückentext-Fragen - vergesslich und erschöpft
        this.fillInNpcSayings = {
            developer: [
                "*kratzt sich am Kopf* Ach... wie hieß das noch gleich?",
                "*müde* Mir liegt's auf der Zunge, aber das Wort ist weg...",
                "*gähnt* Mein Hirn macht gerade Pause – können Sie mir helfen?",
                "*reibt sich die Schläfen* Uff, mir fällt das Wort einfach nicht ein...",
                "*seufzt* Sorry, bin heute echt durch... was war nochmal...?"
            ],
            manager: [
                "*nervös lächelnd* Äh... das Wort ist mir gerade entfallen...",
                "*verlegen* Peinlich, aber mir fällt das nicht ein...",
                "*müde* Mist, ich hab's auf der Zunge, aber...",
                "*seufzt* Zu viele Meetings heute – können Sie aushelfen?",
                "*kratzt sich den Kopf* Wie nennt man das nochmal...?"
            ],
            intern: [
                "*schüchtern* Äh... ich weiß es eigentlich, aber...",
                "*verlegen* Das Wort ist mir gerade weg... können Sie helfen?",
                "*unsicher* Ach... wie hieß das doch gleich?",
                "*müde* War zu lange am Lernen – mir fällt's nicht ein...",
                "*seufzt* Mist, das wusste ich doch eben noch..."
            ],
            client: [
                "*ungeduldig* Können Sie mir schnell helfen? Das Wort...",
                "*gestresst* Mir fällt's nicht ein – zu viel Stress heute...",
                "*müde* Ach... wie nennt man das nochmal?",
                "*seufzt* Mein Kopf ist heute wie Pudding... das Wort...?",
                "*erschöpft* Können Sie das Wort für mich vervollständigen?"
            ],
            sandra: [
                "*lächelt müde* Entschuldigung, mir ist das Wort entfallen...",
                "*reibt sich die Stirn* Ach... wie hieß das nochmal?",
                "*seufzt* Zu viel Papierkram – das Wort ist weg...",
                "*verlegen* Können Sie mir auf die Sprünge helfen?",
                "*müde* Mir liegt's auf der Zunge, aber..."
            ],
            juergen: [
                "*justiert die Brille* Das Fachwort ist mir entfallen...",
                "*seufzt* Zu viele Paragrafen heute – wie hieß das?",
                "*müde* Ach... das Wort schwebt mir vor, aber...",
                "*kratzt sich den Kopf* Können Sie das vervollständigen?",
                "*erschöpft* Mist, ich hab's auf der Zunge..."
            ],
            thomas: [
                "*schaut müde auf seine Unterlagen* Das Wort... äh...",
                "*seufzt* Zu viele Daten heute – mir fällt's nicht ein...",
                "*reibt sich die Augen* Ach... wie nennt man das?",
                "*müde* Die Zahlen haben mein Hirn vernebelt – das Wort...?",
                "*verlegen* Können Sie mir helfen? Mir ist's entfallen..."
            ]
        };
        
        // NPC Namen und flotte Sprüche
        this.npcNames = {
            developer: "Max Codebreaker",
            manager: "Boss McBossface",
            intern: "Julia Newbie",
            client: "Dr. Wichtig",
            sandra: "Sandra HR-Queen",
            juergen: "Jürgen Autoexperte", 
            thomas: "Thomas Golfprofi"
        };
        
        this.npcPositions = {
            developer: "Senior Developer",
            manager: "Projektmanager", 
            intern: "Praktikantin",
            client: "Kunde",
            sandra: "HR-Managerin",
            juergen: "Compliance Officer",
            thomas: "Business Analyst"
        };
        
        this.npcSayings = {
            developer: [
                "Mein Code ist perfekt! ...meistens.",
                "Haben Sie schon mal versucht, einem Computer Gefühle beizubringen?",
                "KI ist wie Kaffee - ohne geht nichts!",
                "Bugs sind nur unentdeckte Features!"
            ],
            manager: [
                "Zeit ist Geld, und KI spart beides!",
                "Können wir das nicht einfach mit Blockchain lösen?",
                "Brauchen wir dafür wirklich eine KI?",
                "Hauptsache, es macht BEEP BOOP Geräusche!"
            ],
            intern: [
                "Ich habe ChatGPT gefragt, aber...",
                "Ist maschinelles Lernen wie normales Lernen?",
                "Können Roboter auch Praktika machen?",
                "Wo ist der Ein/Aus-Schalter bei der KI?"
            ],
            client: [
                "Ich zahle viel Geld für Ihre Expertise!",
                "Meine Konkurrenz hat schon KI!",
                "Können Sie garantieren, dass es funktioniert?",
                "Wie lange dauert es, eine KI zu trainieren?"
            ],
            sandra: [
                "Als HR-Expertin mache ich mir Sorgen um faire Bewerbungsverfahren.",
                "Diskriminierung durch KI? Das darf nicht passieren!",
                "Wie erkläre ich den Mitarbeitern, dass KI fair entscheidet?",
                "Datenschutz im Recruiting ist essentiell!"
            ],
            juergen: [
                "In der Automobilindustrie ist Präzision alles!",
                "Autonome Fahrzeuge sind die Zukunft!",
                "Sicherheit geht vor Geschwindigkeit!",
                "KI muss auch bei 200 km/h funktionieren!"
            ],
            thomas: [
                "Golf und KI haben mehr gemeinsam als man denkt!",
                "Präzision ist beim Golf wie bei KI entscheidend!",
                "Ein guter Schwung ist wie ein guter Algorithmus!",
                "Auch Tiger Woods könnte von KI-Analyse profitieren!"
            ]
        };
        
        // Special NPC questions
        this.specialNPCQuestions = {
            sandra: [
                {
                    "frage": "Sandra aus der HR fragt: 'Welche ethischen Prinzipien sind bei der Einführung von KI-Systemen im HR-Bereich besonders wichtig?'",
                    "antworten": [
                        { "text": "A) Transparenz bei Bewerbungsverfahren", "korrekt": true },
                        { "text": "B) Diskriminierungsfreie Entscheidungen", "korrekt": true },
                        { "text": "C) Kostenoptimierung über alles", "korrekt": false },
                        { "text": "D) Datenschutz und Privatsphäre", "korrekt": true }
                    ],
                    "explanation": "👩‍💼 Merksatz: HR + KI = Fairness first! Transparenz, Diskriminierungsfreiheit und Datenschutz sind die drei Säulen ethischen Recruitings."
                },
                {
                    "frage": "Sandra möchte wissen: 'Wie kann man Bias in KI-gestützten Recruiting-Systemen vermeiden?'",
                    "antworten": [
                        { "text": "A) Diverse Trainingsdaten verwenden", "korrekt": true },
                        { "text": "B) Nur männliche Bewerber berücksichtigen", "korrekt": false },
                        { "text": "C) Regelmäßige Überprüfung der Algorithmen", "korrekt": true },
                        { "text": "D) Menschliche Überwachung des Prozesses", "korrekt": true }
                    ],
                    "explanation": "🎯 Merksatz: Diverse Daten + regelmäßige Kontrolle + menschliche Aufsicht = Bias-freie KI!"
                }
            ],
            juergen: [
                {
                    "frage": "Jürgen aus der Automobilindustrie fragt: 'Welche KI-Technologien sind in der modernen Fahrzeugproduktion besonders relevant?'",
                    "antworten": [
                        { "text": "A) Computer Vision für Qualitätskontrolle", "korrekt": true },
                        { "text": "B) Predictive Maintenance für Maschinen", "korrekt": true },
                        { "text": "C) Manuelle Endkontrolle", "korrekt": false },
                        { "text": "D) Robotik für Montageautomatisierung", "korrekt": true }
                    ],
                    "explanation": "🚗 Merksatz: Moderne Autoproduktion = Sehen + Voraussagen + Automatisieren! KI macht Fabriken smart."
                },
                {
                    "frage": "Jürgen möchte wissen: 'Welche Herausforderungen gibt es bei autonomen Fahrzeugen?'",
                    "antworten": [
                        { "text": "A) Ethische Entscheidungen in Notfällen", "korrekt": true },
                        { "text": "B) Wetter- und Straßenbedingungen", "korrekt": true },
                        { "text": "C) Kommunikation mit anderen Fahrzeugen", "korrekt": true },
                        { "text": "D) Einfache Programmierung", "korrekt": false }
                    ],
                    "explanation": "🚙 Merksatz: Autonome Fahrzeuge müssen ethisch, technisch und kommunikativ perfekt sein - eine große Herausforderung!"
                }
            ],
            thomas: [
                {
                    "frage": "Thomas der Golfer fragt: 'Wie kann KI im Sport eingesetzt werden?'",
                    "antworten": [
                        { "text": "A) Bewegungsanalyse und Technikverbesserung", "korrekt": true },
                        { "text": "B) Automatische Punktevergabe", "korrekt": false },
                        { "text": "C) Leistungsdatenauswertung", "korrekt": true },
                        { "text": "D) Wetter- und Windvorhersage für Turniere", "korrekt": true }
                    ],
                    "explanation": "⛳ Merksatz: KI unterstützt Sportler durch Analyse und Vorhersage, aber den Sport selbst müssen Menschen noch spielen!"
                },
                {
                    "frage": "Thomas erzählt weiter: 'Was macht KI-gestützte Golfplatzverwaltung so interessant?'",
                    "antworten": [
                        { "text": "A) Optimierte Bewässerungssysteme", "korrekt": true },
                        { "text": "B) Vorhersage von Spielerströmen", "korrekt": true },
                        { "text": "C) Automatisches Loch-in-Eins garantiert", "korrekt": false },
                        { "text": "D) Präzise Rasenpflege mit Sensoren", "korrekt": true }
                    ],
                    "explanation": "🌱 Merksatz: Smarter Golfplatz = Wasser sparen + Gäste vorhersagen + perfekter Rasen! KI optimiert das ganze Green."
                }
            ]
        };
        
        // UI elements
        this.scoreElement = document.getElementById('scoreValue');
        this.successBar = document.getElementById('successBar');
        this.successText = document.getElementById('successText');
        this.acceptQuestionButton = document.getElementById('acceptQuestionButton');
        
        this.init();
    }
    
    async init() {
        await this.loadQuestions();
        this.setupEventListeners();
        this.spawnFirstNPC(); // Start with first NPC
        
        // Initial UI update um sicherzustellen dass alles korrekt angezeigt wird
        this.updateUI();
        
        this.gameLoop();
    }
    
    convertNewQuestionsFormat(newQuestions) {
        console.log(`🔄 Konvertiere ${newQuestions.length} Fragen vom neuen Format...`);
        
        const convertedQuestions = newQuestions.map(q => {
            // Konvertiere options (A, B, C, D) zu antworten-Array
            const antworten = [];
            
            // Iteriere durch A, B, C, D
            ['A', 'B', 'C', 'D'].forEach(optionKey => {
                if (q.options && q.options[optionKey]) {
                    antworten.push({
                        text: q.options[optionKey],
                        korrekt: q.correct_answers && q.correct_answers.includes(optionKey)
                    });
                }
            });
            
            // Erstelle konvertierte Frage im alten Format
            return {
                id: q.id,
                frage: q.question,
                antworten: antworten,
                type: q.type, // single_choice oder multiple_choice
                explanation: q.explanation || null // Falls vorhanden
            };
        });
        
        console.log(`✅ ${convertedQuestions.length} Fragen erfolgreich konvertiert`);
        console.log(`📊 Single-Choice: ${convertedQuestions.filter(q => q.type === 'single_choice').length}`);
        console.log(`📊 Multiple-Choice: ${convertedQuestions.filter(q => q.type === 'multiple_choice').length}`);
        
        return convertedQuestions;
    }
    
    async loadQuestions() {
        // Versuche zuerst neues Format (ki_fragen_komplett.json)
        try {
            console.log('🔄 Versuche neues Format: ki_fragen_komplett.json...');
            const response = await fetch('ki_fragen_komplett.json');
            
            if (response.ok) {
                const jsonData = await response.json();
                
                // Prüfe neue JSON-Struktur mit questions-Array
                if (jsonData.questions && Array.isArray(jsonData.questions) && jsonData.questions.length > 0) {
                    // Konvertiere neue JSON-Struktur zu interner Struktur
                    this.questions = this.convertNewQuestionsFormat(jsonData.questions);
                    console.log(`✅ Neues Format erfolgreich geladen: ${this.questions.length} Fragen`);
                    this.calculateTotalQuestions();
                    return; // Erfolgreich geladen, verlasse Funktion
                }
            }
        } catch (error) {
            console.log('⚠️ Neues Format nicht verfügbar, versuche altes Format...');
        }
        
        // Fallback: Versuche altes Format (dekra_fragen_komplett.json)
        try {
            console.log('🔄 Lade altes Format: dekra_fragen_komplett.json...');
            const response = await fetch('dekra_fragen_komplett.json');
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const jsonData = await response.json();
            console.log('JSON erfolgreich geparst, Anzahl Fragen:', jsonData.length);
            
            if (!Array.isArray(jsonData) || jsonData.length === 0) {
                throw new Error('Fragendatei ist leer oder nicht gültig');
            }
            
            this.questions = jsonData;
            console.log(`✅ ${this.questions.length} Fragen erfolgreich geladen`);
            console.log(`📊 Fragenpool-Status: ${this.questions.length}/125 erwartete Fragen geladen`);
            console.log('📝 Erste Frage:', this.questions[0].frage);
            console.log('📝 Letzte Frage:', this.questions[this.questions.length - 1].frage);
            
            // Überprüfe Fragenstruktur
            const sampleQuestion = this.questions[0];
            console.log('🔍 Fragenstruktur-Check:', {
                hasFrage: !!sampleQuestion.frage,
                hasAntworten: !!sampleQuestion.antworten,
                antwortCount: sampleQuestion.antworten ? sampleQuestion.antworten.length : 0,
                hasKorrektFlag: sampleQuestion.antworten ? sampleQuestion.antworten.some(a => a.korrekt) : false
            });
            
            // Berechne Gesamtanzahl aller verfügbaren Fragen
            this.calculateTotalQuestions();
            
        } catch (error) {
            console.error('❌ FEHLER beim Laden der Fragen:', error);
            console.error('Fehlerdetails:', {
                message: error.message,
                name: error.name,
                stack: error.stack
            });
            
            // Verwende erweiterte Fallback-Fragen als Backup
            this.questions = [
                {
                    frage: "Was bedeutet KI?",
                    antworten: [
                        { text: "Künstliche Intelligenz", korrekt: true },
                        { text: "Kreative Ideen", korrekt: false },
                        { text: "Komplizierte Informatik", korrekt: false },
                        { text: "Keine Intelligenz", korrekt: false }
                    ],
                    explanation: "🤖 KI steht für Künstliche Intelligenz - Systeme die menschliche Intelligenz simulieren."
                },
                {
                    frage: "Was ist Machine Learning?",
                    antworten: [
                        { text: "Lernen aus Daten", korrekt: true },
                        { text: "Maschinenreparatur", korrekt: false },
                        { text: "Programmieren lernen", korrekt: false },
                        { text: "Hardware-Training", korrekt: false }
                    ],
                    explanation: "📊 Machine Learning ermöglicht es Computern, aus Daten zu lernen ohne explizit programmiert zu werden."
                }
            ];
            console.log('⚠️ Fallback-Fragen verwendet - bitte Serverproblem prüfen!');
            this.calculateTotalQuestions();
        }
    }
    
    calculateTotalQuestions() {
        let total = 0;
        let details = {};
        
        // Allgemeine Fragen (HAUPTPOOL)
        total += this.questions.length;
        details.allgemeineFragen = this.questions.length;
        
        // Lückentextfragen
        const fillCount = this.fillInQuestions ? this.fillInQuestions.length : 0;
        total += fillCount;
        details.lueckentextFragen = fillCount;
        
        // NPC-spezifische Fragen (werden jetzt AUCH global verwendet)
        const sandraCount = this.npcSpecificQuestions.sandra ? this.npcSpecificQuestions.sandra.length : 0;
        const juergenCount = this.npcSpecificQuestions.juergen ? this.npcSpecificQuestions.juergen.length : 0;
        const thomasCount = this.npcSpecificQuestions.thomas ? this.npcSpecificQuestions.thomas.length : 0;
        
        total += sandraCount + juergenCount + thomasCount;
        details.sandraFragen = sandraCount;
        details.juergenFragen = juergenCount;
        details.thomasFragen = thomasCount;
        
        this.totalQuestionsCount = total;
        console.log(`📊 FRAGENPOOL-ÜBERSICHT:`);
        console.log(`   🎯 Gesamt verfügbar: ${total} Fragen`);
        console.log(`   📝 Hauptpool (JSON): ${details.allgemeineFragen} Fragen`);
        console.log(`   📚 Details:`, details);
        console.log(`   ✅ Alle Fragen können jetzt global von jedem NPC verwendet werden!`);
    }
    
    setupEventListeners() {
        // Canvas click events (nur für Pony-Catching)
        this.canvas.addEventListener('click', (e) => {
            if (this.gameState === 'playing') {
                this.handleCanvasClick(e);
            }
        });
        
        // Shop button
        document.getElementById('shopButton').addEventListener('click', () => {
            this.openShop();
        });
        
        // NEUER: Frage annehmen Button
        document.getElementById('acceptQuestionButton').addEventListener('click', () => {
            if (this.activeNPC && this.activeNPC.hasQuestion) {
                this.startQuestion();
            }
        });
        
        
        // Confirm button for questions
        document.getElementById('confirmButton').addEventListener('click', () => {
            this.confirmAnswer();
        });
        
        // Question dialog
        document.getElementById('questionDialog').addEventListener('click', (e) => {
            if (e.target === document.getElementById('questionDialog')) {
                this.closeQuestion();
            }
        });
        
    }
    
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Canvas-Clicks nur noch für Pony-Catching verwenden
        // NPCs werden jetzt über den "Frage annehmen" Button bedient
        
        // Check for pony clicks
        if (window.PonySystem && window.PonySystem.ponies.length > 0) {
            window.PonySystem.tryToCatchPony({ clientX: rect.left + x, clientY: rect.top + y });
        }
        
        // Check for stallpony clicks (in stall area)
        if (window.PonySystem && window.PonySystem.caughtPonies) {
            const stall = this.stall;
            if (x >= stall.x && x <= stall.x + stall.width &&
                y >= stall.y && y <= stall.y + stall.height) {
                
                window.PonySystem.caughtPonies.forEach(pony => {
                    if (pony.stallPosition && 
                        x >= pony.stallPosition.x && x <= pony.stallPosition.x + pony.stallPosition.width &&
                        y >= pony.stallPosition.y && y <= pony.stallPosition.y + pony.stallPosition.height) {
                        
                        if (window.PonySystem.showPonyInfo) {
                            window.PonySystem.showPonyInfo(pony);
                        }
                    }
                });
            }
        }
    }
    
    spawnFirstNPC() {
        // Spawn the first NPC immediately
        this.spawnNewNPC();
    }
    
    spawnNewNPC() {
        if (this.activeNPC) return; // Only one NPC at a time
        
        const npcType = this.npcTypes[Math.floor(Math.random() * this.npcTypes.length)];
        
        // Bestimme ob NPC müde ist (30% Chance)
        const isTired = Math.random() < 0.3;
        
        this.activeNPC = {
            x: this.officeEntrance.x,
            y: this.officeEntrance.y,
            targetX: this.questionSpot.x,
            targetY: this.questionSpot.y,
            width: 32,
            height: 48,
            type: npcType,
            state: 'entering', // entering, questioning, leaving
            hasQuestion: false,
            visible: true,
            speed: isTired ? 2 : 3, // Müde NPCs: 2, Normale NPCs: 3
            waitTimer: 0,
            tired: isTired
        };
        
        this.npcs = [this.activeNPC]; // Replace any existing NPCs
    }
    
    updateNPCs(deltaTime) {
        if (!this.activeNPC) return;
        
        const npc = this.activeNPC;
        
        switch (npc.state) {
            case 'entering':
                // Move NPC to question spot
                const dx = npc.targetX - npc.x;
                const dy = npc.targetY - npc.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 2) {
                    npc.x += (dx / distance) * npc.speed;
                    npc.y += (dy / distance) * npc.speed;
                } else {
                    // Snap to exact position and set state
                    npc.x = npc.targetX;
                    npc.y = npc.targetY;
                    npc.state = 'questioning';
                    npc.hasQuestion = true;
                    npc.waitTimer = 0;
                    // Button sofort aktualisieren wenn NPC ready ist
                    this.updateAcceptQuestionButton();
                }
                break;
                
            case 'questioning':
                // NPCs warten unbegrenzt auf Klick (kein Timeout mehr)
                break;
                
            case 'leaving':
                // Move NPC back to entrance
                const exitDx = this.officeEntrance.x - npc.x;
                const exitDy = this.officeEntrance.y - npc.y;
                const exitDistance = Math.sqrt(exitDx * exitDx + exitDy * exitDy);
                
                if (exitDistance > 5) {
                    npc.x += (exitDx / exitDistance) * npc.speed;
                    npc.y += (exitDy / exitDistance) * npc.speed;
                } else {
                    // NPC has left, spawn timer for next one
                    this.activeNPC = null;
                    this.npcs = [];
                    this.npcSpawnTimer = 0;
                    // Button verstecken wenn NPC weg ist
                    this.updateAcceptQuestionButton();
                }
                break;
        }
    }
    
    startNPCLeaving() {
        if (this.activeNPC) {
            this.activeNPC.state = 'leaving';
            this.activeNPC.hasQuestion = false;
            this.activeNPC.targetX = this.officeEntrance.x;
            this.activeNPC.targetY = this.officeEntrance.y;
        }
    }
    
    getRandomColor() {
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Audio System
    initAudioSystem() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createAmbientMusic();
            this.createSoundEffects();
        } catch (error) {
            console.log('Audio nicht verfügbar:', error);
        }
    }
    
    createAmbientMusic() {
        // Erstelle HTML5 Audio Element für MP3-Wiedergabe (wird nicht automatisch gestartet)
        this.backgroundMusic = new Audio('Untitled.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.musicVolume;
        // Musik wird nur durch startGameMusic() gestartet, nicht automatisch
    }
    
    startGameMusic() {
        // Starte Ingame-Musik nur wenn das Spiel läuft
        if (this.backgroundMusic && this.gameState === 'playing') {
            this.backgroundMusic.play().catch(error => {
                console.log('Ingame-Musik konnte nicht gestartet werden:', error);
            });
        }
    }
    
    stopGameMusic() {
        // Stoppe Ingame-Musik
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }
    
    createSoundEffects() {
        if (!this.audioContext) return;
        
        // Erfolgssound
        this.soundEffects.success = () => {
            const gainNode = this.audioContext.createGain();
            gainNode.connect(this.audioContext.destination);
            gainNode.gain.setValueAtTime(this.effectsVolume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            const osc = this.audioContext.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
            osc.connect(gainNode);
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.5);
        };
        
        // Fehlersound
        this.soundEffects.error = () => {
            const gainNode = this.audioContext.createGain();
            gainNode.connect(this.audioContext.destination);
            gainNode.gain.setValueAtTime(this.effectsVolume * 0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            const osc = this.audioContext.createOscillator();
            osc.type = 'square';
            osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
            osc.connect(gainNode);
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.3);
        };
        
        // Frage-Sound
        this.soundEffects.question = () => {
            const gainNode = this.audioContext.createGain();
            gainNode.connect(this.audioContext.destination);
            gainNode.gain.setValueAtTime(this.effectsVolume * 0.15, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            const osc = this.audioContext.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, this.audioContext.currentTime);
            osc.connect(gainNode);
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.2);
        };
    }
    
    playSound(soundName) {
        if (this.soundEffects[soundName] && this.audioContext && this.audioContext.state === 'running') {
            this.soundEffects[soundName]();
        }
    }
    
    startQuestion() {
        if (!this.activeNPC) {
            console.log('Kein aktiver NPC');
            return;
        }
        
        // Bestimme Fragentyp basierend auf NPC-Zustand
        const npcType = this.activeNPC.type;
        const isTired = this.activeNPC.tired;
        
        // Prüfe ob alle Multiple-Choice-Fragen verwendet wurden (separater Reset)
        if (this.usedMultipleChoiceQuestions.size >= this.questions.length) {
            console.log('🔄 Alle Multiple-Choice-Fragen verwendet, setze Pool zurück');
            this.usedMultipleChoiceQuestions.clear();
        }
        
        let selectedQuestion = null;
        
        // Müde NPCs stellen Lückentextfragen (BLEIBEN ZUFÄLLIG)
        if (isTired && Math.random() < 0.7) { // 70% Chance für Lückentext bei müden NPCs
            this.currentQuestionType = 'fill';
            console.log(`😴 Müder NPC ${npcType} - versuche Lückentext-Frage`);
            
            // Lückentext-Fragen bleiben vollständig zufällig - keine "einmal pro Frage"-Regel
            if (this.fillInQuestions && this.fillInQuestions.length > 0) {
                const randomIndex = Math.floor(Math.random() * this.fillInQuestions.length);
                selectedQuestion = {
                    question: this.fillInQuestions[randomIndex],
                    id: `fill_random_${Date.now()}` // Immer eindeutige ID für Lückentext
                };
                console.log(`✅ Lückentext-Frage (zufällig) für müden NPC gefunden`);
            } else {
                console.log(`❌ Keine Lückentext-Fragen verfügbar - Fallback zu Multiple Choice`);
                this.currentQuestionType = 'multiple';
            }
        }
        
        // Normale Multiple Choice Fragen (oder Fallback) - JEDE FRAGE GENAU EINMAL
        if (!selectedQuestion) {
            this.currentQuestionType = 'multiple';
            
            // Neue Logik: Jede Multiple-Choice-Frage genau einmal verwenden
            selectedQuestion = this.findAvailableMultipleChoiceQuestion();
        }
        
        // Wenn immer noch keine Frage gefunden, handle Notfall
        if (!selectedQuestion) {
            console.log('🚨 NOTFALL: Keine Frage gefunden - entferne NPC');
            this.handleNoQuestionAvailable();
            return;
        }
        
        // Markiere Frage als verwendet und setze als aktuelle Frage
        this.usedQuestions.add(selectedQuestion.id);
        
        // Für Multiple-Choice-Fragen auch im separaten Tracker markieren
        if (this.currentQuestionType === 'multiple') {
            this.usedMultipleChoiceQuestions.add(selectedQuestion.id);
        }
        
        this.currentQuestion = selectedQuestion.question;
        console.log(`✅ Gewählte Frage (${selectedQuestion.id}): ${this.currentQuestion.frage}`);
        
        if (this.currentQuestionType === 'multiple') {
            console.log(`📊 Multiple-Choice verwendet: ${this.usedMultipleChoiceQuestions.size}/${this.questions.length}`);
        } else {
            console.log(`📊 Lückentext-Frage (zufällig ausgewählt)`);
        }
        
        // Spiele Frage-Sound
        this.playSound('question');
        
        this.gameState = 'question';
        this.showQuestionDialog();
    }
    
    findAvailableMultipleChoiceQuestion() {
        console.log(`🔍 Suche unbenutzte Multiple-Choice-Frage (${this.usedMultipleChoiceQuestions.size}/${this.questions.length} verwendet)`);
        
        // Finde alle unbenutzten Multiple-Choice-Fragen
        const availableQuestions = this.questions.filter((_, index) => 
            !this.usedMultipleChoiceQuestions.has(`mc_${index}`)
        );
        
        if (availableQuestions.length > 0) {
            // Wähle zufällig eine unbenutzte Frage
            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            const selectedQuestion = availableQuestions[randomIndex];
            const originalIndex = this.questions.indexOf(selectedQuestion);
            const questionId = `mc_${originalIndex}`;
            
            console.log(`✅ Multiple-Choice-Frage gefunden: ${selectedQuestion.frage.substring(0, 50)}...`);
            return {
                question: selectedQuestion,
                id: questionId
            };
        }
        
        console.log(`❌ Alle Multiple-Choice-Fragen wurden verwendet - automatischer Reset`);
        this.usedMultipleChoiceQuestions.clear();
        
        // Nach Reset: Wähle erste verfügbare Frage
        if (this.questions.length > 0) {
            const selectedQuestion = this.questions[0];
            const questionId = `mc_0`;
            
            console.log(`✅ Multiple-Choice-Frage nach Reset gefunden`);
            return {
                question: selectedQuestion,
                id: questionId
            };
        }
        
        console.log(`❌ Keine Multiple-Choice-Fragen verfügbar - kritischer Fehler!`);
        return null;
    }

    findAvailableQuestion(npcType) {
        console.log(`🔍 Suche Frage für NPC-Typ: ${npcType} (von ${this.questions.length} verfügbaren Fragen)`);
        
        // NEUE STRATEGIE: Nutze ALLE 125 Fragen global ohne NPC-Einschränkungen
        // Stufe 1: Versuche aus dem vollständigen Fragenpool (alle 125 Fragen)
        console.log(`📝 Prüfe alle verfügbaren Fragen (${this.questions.length} insgesamt)`);
        const globalQuestions = this.tryGetQuestionsFromPool(this.questions, 'global');
        if (globalQuestions) {
            console.log(`✅ Globale Frage gefunden (${this.usedQuestions.size}/${this.questions.length} verwendet)`);
            return globalQuestions;
        }
        console.log(`❌ Alle globalen Fragen aufgebraucht`);
        
        // Stufe 2: Versuche Lückentext-Fragen wenn vorhanden
        if (this.fillInQuestions && this.fillInQuestions.length > 0) {
            console.log(`📝 Prüfe Lückentext-Fragen als Fallback`);
            const fillQuestions = this.tryGetQuestionsFromPool(this.fillInQuestions, 'fill');
            if (fillQuestions) {
                console.log(`✅ Lückentext-Frage als Fallback gefunden`);
                return fillQuestions;
            }
        }
        
        // Stufe 3: Alle Fragen zurücksetzen und nochmal versuchen
        console.log(`🔄 ALLE Fragen aufgebraucht - setze kompletten Pool zurück`);
        this.usedQuestions.clear();
        
        // Nach Reset nochmal versuchen mit vollem Pool
        const resetQuestions = this.tryGetQuestionsFromPool(this.questions, 'global');
        if (resetQuestions) {
            console.log(`✅ Frage nach kompletten Reset gefunden`);
            return resetQuestions;
        }
        
        console.log(`❌ Selbst nach Reset keine Frage gefunden - kritischer Fehler!`);
        return null;
    }
    
    tryGetQuestionsFromPool(questionPool, poolPrefix) {
        if (!questionPool || questionPool.length === 0) {
            return null;
        }
        
        // Finde unbenutzte Fragen aus dem Pool
        const availableQuestions = questionPool.filter((_, index) => 
            !this.usedQuestions.has(`${poolPrefix}_${index}`)
        );
        
        if (availableQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            const originalIndex = questionPool.indexOf(availableQuestions[randomIndex]);
            const questionId = `${poolPrefix}_${originalIndex}`;
            
            return {
                question: availableQuestions[randomIndex],
                id: questionId
            };
        }
        
        return null;
    }
    
    handleNoQuestionAvailable() {
        console.log('🚨 NPC hat keine verfügbaren Fragen - entferne NPC');
        
        if (this.activeNPC) {
            // NPC zum Gehen schicken
            this.activeNPC.hasQuestion = false;
            this.startNPCLeaving();
            
            // Button-Status aktualisieren
            this.updateAcceptQuestionButton();
        }
    }
    
    showQuestionDialog() {
        const dialog = document.getElementById('questionDialog');
        const questionText = document.getElementById('questionText');
        const answerButtons = document.getElementById('answerButtons');
        
        // Erstelle formatierte Gesamtnachricht mit NPC-Infos + Frage
        let fullQuestionContent = '';
        
        if (this.activeNPC) {
            const npcName = this.npcNames[this.activeNPC.type] || 'Unbekannter NPC';
            const npcPosition = this.npcPositions[this.activeNPC.type] || 'Unbekannte Position';
            
            // Wähle Spruch basierend auf Fragetyp und Müdigkeit
            let sayings;
            if (this.currentQuestionType === 'fill' && this.fillInNpcSayings[this.activeNPC.type]) {
                // Spezielle Lückentext-Sprüche (vergesslich/erschöpft)
                sayings = this.fillInNpcSayings[this.activeNPC.type];
            } else if (this.activeNPC.tired && this.tiredNpcSayings[this.activeNPC.type]) {
                // Normale müde Sprüche
                sayings = this.tiredNpcSayings[this.activeNPC.type];
            } else {
                // Normale NPC Sprüche
                sayings = this.npcSayings[this.activeNPC.type] || ['...'];
            }
            const randomSaying = sayings[Math.floor(Math.random() * sayings.length)];
            
            // Formatiere alles zusammen in einem Block
            fullQuestionContent = `
                <div class="npc-info-section">
                    <div class="npc-header">
                        <span class="npc-name">${npcName}</span> - <span class="npc-position">${npcPosition}</span>
                    </div>
                    <div class="npc-saying">"${randomSaying}"</div>
                </div>
                <div class="question-section">
                    ${this.currentQuestion.frage}
                </div>
            `;
        } else {
            // Fallback ohne NPC
            fullQuestionContent = `<div class="question-section">${this.currentQuestion.frage}</div>`;
        }
        
        questionText.innerHTML = fullQuestionContent;
        answerButtons.innerHTML = '';
        
        if (this.currentQuestionType === 'fill') {
            // Lückentext-Input für müde NPCs
            const inputContainer = document.createElement('div');
            inputContainer.style.cssText = 'margin: 20px 0; text-align: center;';
            
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.id = 'fillInAnswer';
            textInput.placeholder = 'Ihre Antwort hier eingeben...';
            textInput.style.cssText = `
                padding: 12px;
                font-size: 16px;
                border: 2px solid #3498DB;
                border-radius: 5px;
                width: 300px;
                text-align: center;
                font-family: 'Courier New', monospace;
            `;
            
            textInput.addEventListener('input', () => {
                const confirmButton = document.getElementById('confirmButton');
                confirmButton.disabled = textInput.value.trim() === '';
            });
            
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && textInput.value.trim() !== '') {
                    this.confirmAnswer();
                }
            });
            
            inputContainer.appendChild(textInput);
            answerButtons.appendChild(inputContainer);
            
            // Fokus auf Input setzen
            setTimeout(() => textInput.focus(), 100);
        } else {
            // Normale Multiple Choice Buttons mit Randomisierung
            const shuffledAnswers = this.shuffleAnswers(this.currentQuestion.antworten);
            
            shuffledAnswers.forEach((answer, displayIndex) => {
                // Container für Radio-Button-Style
                const answerContainer = document.createElement('div');
                answerContainer.className = 'answer-container';
                
                // Radio Button (für Accessibility)
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = 'answer';
                radioInput.id = `answer_${displayIndex}`;
                radioInput.value = answer.originalIndex;
                radioInput.className = 'answer-radio';
                
                // Label für den Radio Button
                const label = document.createElement('label');
                label.htmlFor = `answer_${displayIndex}`;
                label.className = 'answer-button';
                label.textContent = answer.text;
                
                // Click-Handler für beide Elemente
                const selectHandler = () => this.selectAnswer(answer.originalIndex);
                radioInput.addEventListener('click', selectHandler);
                label.addEventListener('click', selectHandler);
                
                answerContainer.appendChild(radioInput);
                answerContainer.appendChild(label);
                answerButtons.appendChild(answerContainer);
            });
        }
        
        dialog.classList.remove('hidden');
    }
    
    shuffleAnswers(answers) {
        // Erstelle Array mit Original-Indizes
        const answersWithIndex = answers.map((answer, index) => ({
            ...answer,
            originalIndex: index
        }));
        
        // Fisher-Yates Shuffle Algorithm für echte Randomisierung
        const shuffled = [...answersWithIndex];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        console.log(`🔀 Antworten randomisiert: ${answers.map(a => a.text.substring(0, 20)).join(', ')}`);
        return shuffled;
    }
    
    selectAnswer(answerIndex) {
        // Entferne Auswahl von anderen Buttons und Radio-Buttons
        const labels = document.querySelectorAll('.answer-button');
        const radios = document.querySelectorAll('.answer-radio');
        
        labels.forEach(label => {
            label.classList.remove('selected');
        });
        
        // Setze den entsprechenden Radio Button
        let selectedLabel = null;
        let selectedRadio = null;
        
        radios.forEach(radio => {
            if (parseInt(radio.value) === answerIndex) {
                radio.checked = true;
                selectedRadio = radio;
                selectedLabel = document.querySelector(`label[for="${radio.id}"]`);
            } else {
                radio.checked = false;
            }
        });
        
        // Markiere gewählte Antwort
        if (selectedLabel) {
            selectedLabel.classList.add('selected');
        }
        
        // Speichere Auswahl
        this.selectedAnswerIndex = answerIndex;
        
        // Aktiviere Bestätigungs-Button
        const confirmButton = document.getElementById('confirmButton');
        confirmButton.disabled = false;
    }
    
    
    confirmAnswer() {
        if (this.currentQuestionType === 'fill') {
            return this.confirmFillInAnswer();
        }
        
        if (this.selectedAnswerIndex === null) return;
        
        const selectedAnswer = this.currentQuestion.antworten[this.selectedAnswerIndex];
        const buttons = document.querySelectorAll('.answer-button');
        
        // Erkenne ob Single-Choice oder Multiple-Choice
        // Prüfe zuerst das type-Feld der Frage, dann Fallback auf Anzahl korrekter Antworten
        let isSingleChoice;
        if (this.currentQuestion.type) {
            isSingleChoice = this.currentQuestion.type === 'single_choice';
        } else {
            // Fallback für alte Fragen ohne type-Feld
            const correctAnswers = this.currentQuestion.antworten.filter(answer => answer.korrekt);
            isSingleChoice = correctAnswers.length === 1;
        }
        
        // Show correct/incorrect feedback basierend auf Fragen-Typ
        // Wichtig: Hier müssen wir die Radio-Buttons verwenden, um die Original-Indizes zu ermitteln
        const radioButtons = document.querySelectorAll('.answer-radio');
        
        buttons.forEach((button, displayIndex) => {
            // Entferne vorherige Feedback-Klassen
            button.classList.remove('correct', 'incorrect', 'selected');
            
            // Ermittle den Original-Index für diesen Button
            const correspondingRadio = radioButtons[displayIndex];
            const originalIndex = correspondingRadio ? parseInt(correspondingRadio.value) : displayIndex;
            const originalAnswer = this.currentQuestion.antworten[originalIndex];
            
            if (isSingleChoice) {
                // Single-Choice: Nur ausgewählte Antwort markieren
                if (originalIndex === this.selectedAnswerIndex) {
                    if (selectedAnswer.korrekt) {
                        button.classList.add('correct');
                    } else {
                        button.classList.add('incorrect');
                    }
                }
            } else {
                // Multiple-Choice: Alle korrekten Antworten zeigen
                if (originalAnswer && originalAnswer.korrekt) {
                    button.classList.add('correct');
                } else if (originalIndex === this.selectedAnswerIndex && !selectedAnswer.korrekt) {
                    button.classList.add('incorrect');
                }
            }
            button.disabled = true;
        });
        
        // Deaktiviere Bestätigungs-Button
        const confirmButton = document.getElementById('confirmButton');
        confirmButton.disabled = true;
        
        // Calculate points with bonuses
        let pointsEarned = 0;
        let successIncrease = 0;
        
        if (selectedAnswer.korrekt) {
            pointsEarned = 1;
            successIncrease = 10;
            this.playSound('success');
            
            // Apply item bonuses
            if (window.ShopSystem) {
                pointsEarned += window.ShopSystem.getPointBonus();
                successIncrease += window.ShopSystem.getSuccessBonus();
            }
            
            this.score += pointsEarned;
            this.successRate = Math.min(100, this.successRate + successIncrease);
        } else {
            this.playSound('error');
            let pointsLost = 1;
            let successDecrease = 5;
            
            // Apply protection from carpet
            if (window.ShopSystem && window.ShopSystem.hasProtection()) {
                pointsLost = Math.max(0, pointsLost - 1);
                successDecrease = Math.max(0, successDecrease - 2);
            }
            
            this.score = Math.max(0, this.score - pointsLost);
            this.successRate = Math.max(0, this.successRate - successDecrease);
        }
        
        this.updateUI();
        
        // Check for pony spawn
        if (this.successRate >= 100) {
            this.spawnPony();
        }
        
        // Show explanation if available
        if (this.currentQuestion.explanation) {
            setTimeout(() => {
                this.showQuestionExplanation(this.currentQuestion.explanation);
            }, 1000);
        } else {
            // Wenn keine Erklärung vorhanden, nach kurzer Zeit schließen
            setTimeout(() => {
                this.closeQuestion();
                this.startNPCLeaving();
            }, 2000);
        }
        
        // Reset selected answer
        this.selectedAnswerIndex = null;
    }
    
    confirmFillInAnswer() {
        const textInput = document.getElementById('fillInAnswer');
        if (!textInput || textInput.value.trim() === '') return;
        
        const userAnswer = textInput.value.trim().toLowerCase();
        const correctAnswer = this.currentQuestion.answer.toLowerCase();
        const alternatives = this.currentQuestion.alternatives.map(alt => alt.toLowerCase());
        
        // Prüfe ob Antwort korrekt ist
        const isCorrect = userAnswer === correctAnswer || alternatives.includes(userAnswer);
        
        // Visuelles Feedback
        if (isCorrect) {
            textInput.style.backgroundColor = '#2ECC71';
            textInput.style.color = 'white';
            this.playSound('success');
        } else {
            textInput.style.backgroundColor = '#E74C3C';
            textInput.style.color = 'white';
            this.playSound('error');
        }
        
        textInput.disabled = true;
        
        // Zeige korrekte Antwort
        const answerFeedback = document.createElement('div');
        answerFeedback.style.cssText = `
            margin-top: 15px;
            padding: 10px;
            background: ${isCorrect ? '#D5F4E6' : '#F8D7DA'};
            border: 2px solid ${isCorrect ? '#27AE60' : '#E74C3C'};
            border-radius: 5px;
            color: ${isCorrect ? '#1E8449' : '#C0392B'};
            font-weight: bold;
            text-align: center;
        `;
        answerFeedback.textContent = isCorrect ? 
            `✓ Richtig! "${correctAnswer}"` : 
            `✗ Falsch! Korrekte Antwort: "${correctAnswer}"`;
        
        const answerButtons = document.getElementById('answerButtons');
        answerButtons.appendChild(answerFeedback);
        
        // Deaktiviere Bestätigungs-Button
        const confirmButton = document.getElementById('confirmButton');
        confirmButton.disabled = true;
        
        // Punkte berechnen
        let pointsEarned = 0;
        let successIncrease = 0;
        
        if (isCorrect) {
            pointsEarned = 1;
            successIncrease = 10;
            
            // Apply item bonuses
            if (window.ShopSystem) {
                pointsEarned += window.ShopSystem.getPointBonus();
                successIncrease += window.ShopSystem.getSuccessBonus();
            }
            
            this.score += pointsEarned;
            this.successRate = Math.min(100, this.successRate + successIncrease);
        } else {
            let pointsLost = 1;
            let successDecrease = 5;
            
            // Apply protection from carpet
            if (window.ShopSystem && window.ShopSystem.hasProtection()) {
                pointsLost = Math.max(0, pointsLost - 1);
                successDecrease = Math.max(0, successDecrease - 2);
            }
            
            this.score = Math.max(0, this.score - pointsLost);
            this.successRate = Math.max(0, this.successRate - successDecrease);
        }
        
        this.updateUI();
        
        // Check for pony spawn
        if (this.successRate >= 100) {
            this.spawnPony();
        }
        
        // Show explanation if available
        if (this.currentQuestion.explanation) {
            setTimeout(() => {
                this.showQuestionExplanation(this.currentQuestion.explanation);
            }, 1000);
        } else {
            // Wenn keine Erklärung vorhanden, nach kurzer Zeit schließen
            setTimeout(() => {
                this.closeQuestion();
                this.startNPCLeaving();
            }, 2000);
        }
        
        // Reset selected answer
        this.selectedAnswerIndex = null;
    }
    
    showQuestionExplanation(explanation) {
        // Create explanation element if it doesn't exist
        let explanationDiv = document.getElementById('questionExplanation');
        if (!explanationDiv) {
            explanationDiv = document.createElement('div');
            explanationDiv.id = 'questionExplanation';
            explanationDiv.style.cssText = `
                margin-top: 15px;
                padding: 12px;
                background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
                border: 2px solid #2196F3;
                border-radius: 8px;
                color: #1565C0;
                font-weight: bold;
                font-size: 14px;
                line-height: 1.4;
                box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
                animation: slideIn 0.5s ease-out;
            `;
            document.getElementById('questionContent').appendChild(explanationDiv);
        }
        
        explanationDiv.textContent = explanation;
        explanationDiv.style.display = 'block';
        
        // Erstelle "Weiter"-Button
        let continueButton = document.getElementById('continueButton');
        if (!continueButton) {
            continueButton = document.createElement('button');
            continueButton.id = 'continueButton';
            continueButton.textContent = 'Weiter';
            continueButton.style.cssText = `
                margin-top: 15px;
                padding: 10px 20px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                font-family: 'Courier New', monospace;
                display: block;
                margin-left: auto;
                margin-right: auto;
            `;
            
            continueButton.addEventListener('click', () => {
                this.closeQuestion();
                this.startNPCLeaving();
            });
            
            explanationDiv.appendChild(continueButton);
        }
        
        continueButton.style.display = 'block';
    }
    
    closeQuestion() {
        // Remove explanation and continue button if they exist
        const explanationDiv = document.getElementById('questionExplanation');
        if (explanationDiv) {
            explanationDiv.remove();
        }
        
        const continueButton = document.getElementById('continueButton');
        if (continueButton) {
            continueButton.remove();
        }
        
        // Reset answer selection state
        this.selectedAnswerIndex = null;
        const confirmButton = document.getElementById('confirmButton');
        confirmButton.disabled = true;
        
        document.getElementById('questionDialog').classList.add('hidden');
        this.gameState = 'playing';
        this.currentQuestion = null;
        
        // Button-Status aktualisieren nach Frage-Ende
        this.updateAcceptQuestionButton();
    }
    
    spawnPony() {
        // This will be implemented in pony.js
        if (window.PonySystem) {
            window.PonySystem.spawn();
        }
        this.successRate = 0; // Reset after pony spawn
        this.updateUI();
    }
    
    openShop() {
        if (window.ShopSystem) {
            window.ShopSystem.open();
        }
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.successBar.style.width = `${this.successRate}%`;
        this.successText.textContent = `${Math.round(this.successRate)}%`;
        
        // Update Frage-annehmen Button
        this.updateAcceptQuestionButton();
    }
    
    updateAcceptQuestionButton() {
        if (!this.acceptQuestionButton) {
            console.error('❌ acceptQuestionButton nicht gefunden!');
            return;
        }
        
        if (this.activeNPC && this.activeNPC.hasQuestion && this.gameState === 'playing') {
            // Button anzeigen und aktivieren
            this.acceptQuestionButton.classList.remove('hidden');
            this.acceptQuestionButton.disabled = false;
        } else {
            // Button verstecken
            this.acceptQuestionButton.classList.add('hidden');
            this.acceptQuestionButton.disabled = true;
        }
    }
    
    // 16-Bit Pixel art drawing functions
    drawPixelRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(Math.floor(x), Math.floor(y), width, height);
    }
    
    draw16BitOfficeBackground(x, y, width, height) {
        // Detailed carpet floor with pattern like Stardew Valley
        const tileSize = 32;
        for (let i = 0; i < width; i += tileSize) {
            for (let j = 60; j < height; j += tileSize) {
                const baseX = x + i;
                const baseY = y + j;
                
                // Carpet base with rich colors
                this.drawPixelRect(baseX, baseY, tileSize, tileSize, '#8B4B8B'); // Purple-brown base
                this.drawPixelRect(baseX + 2, baseY + 2, tileSize - 4, tileSize - 4, '#9966AA'); // Lighter purple
                
                // Decorative carpet pattern
                this.drawPixelRect(baseX + 8, baseY + 8, 4, 4, '#FFDDAA'); // Gold accent
                this.drawPixelRect(baseX + 20, baseY + 8, 4, 4, '#FFDDAA');
                this.drawPixelRect(baseX + 8, baseY + 20, 4, 4, '#FFDDAA');
                this.drawPixelRect(baseX + 20, baseY + 20, 4, 4, '#FFDDAA');
                
                // Diamond pattern
                this.drawPixelRect(baseX + 14, baseY + 4, 4, 2, '#AA3366');
                this.drawPixelRect(baseX + 12, baseY + 6, 8, 2, '#AA3366');
                this.drawPixelRect(baseX + 14, baseY + 8, 4, 2, '#AA3366');
            }
        }
        
        // Rich colored walls with wood paneling
        this.drawPixelRect(0, 0, width, 60, '#D4A574'); // Warm beige walls
        this.drawPixelRect(0, 0, 60, height, '#D4A574'); // Left wall
        
        // Wood wainscoting (lower wall panels)
        this.drawPixelRect(0, 30, width, 30, '#8B4513'); // Dark wood panel
        this.drawPixelRect(0, 32, width, 26, '#A0522D'); // Medium wood
        this.drawPixelRect(0, 30, 60, 30, '#8B4513'); // Left wall panel
        this.drawPixelRect(2, 32, 56, 26, '#A0522D');
        
        // Decorative molding
        this.drawPixelRect(0, 28, width, 4, '#654321'); // Top molding
        this.drawPixelRect(0, 58, width, 4, '#654321'); // Bottom molding
        
        // Wall decorations - paintings and certificates
        for (let i = 100; i < width - 150; i += 180) {
            // Picture frames
            this.drawPixelRect(i, 8, 60, 40, '#8B4513'); // Frame
            this.drawPixelRect(i + 4, 12, 52, 32, '#FFE4B5'); // Picture background
            this.drawPixelRect(i + 8, 16, 44, 24, '#87CEEB'); // Picture content
            // Picture details
            this.drawPixelRect(i + 12, 20, 8, 4, '#228B22'); // Green element
            this.drawPixelRect(i + 24, 22, 12, 6, '#FF6347'); // Red element
            this.drawPixelRect(i + 40, 18, 6, 8, '#4169E1'); // Blue element
        }
        
        // Beautiful window with detailed frame
        const windowX = width - 160;
        this.drawPixelRect(windowX, 5, 150, 50, '#87CEEB'); // Sky
        this.drawPixelRect(windowX + 2, 7, 146, 46, '#B0E0E6'); // Lighter sky
        
        // Clouds in window
        this.drawPixelRect(windowX + 20, 15, 16, 8, '#FFFFFF');
        this.drawPixelRect(windowX + 18, 17, 20, 4, '#FFFFFF');
        this.drawPixelRect(windowX + 100, 12, 20, 10, '#FFFFFF');
        this.drawPixelRect(windowX + 98, 14, 24, 6, '#FFFFFF');
        
        // Sun
        this.drawPixelRect(windowX + 130, 10, 12, 12, '#FFD700');
        this.drawPixelRect(windowX + 132, 8, 8, 16, '#FFD700');
        this.drawPixelRect(windowX + 128, 12, 16, 8, '#FFD700');
        
        // Ornate window frame
        this.drawPixelRect(windowX - 4, 1, 158, 58, '#8B4513'); // Outer frame
        this.drawPixelRect(windowX - 2, 3, 154, 54, '#A0522D'); // Inner frame
        this.drawPixelRect(windowX, 5, 150, 50, '#87CEEB'); // Window glass area
        
        // Window dividers
        this.drawPixelRect(windowX + 73, 5, 4, 50, '#8B4513'); // Vertical center
        this.drawPixelRect(windowX, 27, 150, 4, '#8B4513'); // Horizontal center
        
        // Decorative window corners
        this.drawPixelRect(windowX - 2, 3, 8, 8, '#654321');
        this.drawPixelRect(windowX + 146, 3, 8, 8, '#654321');
        this.drawPixelRect(windowX - 2, 49, 8, 8, '#654321');
        this.drawPixelRect(windowX + 146, 49, 8, 8, '#654321');
    }
    
    drawOfficeFurniture() {
        // Draw standard office furniture
        this.officeFurniture.forEach(furniture => {
            switch(furniture.type) {
                case 'desk':
                    this.drawStandardDesk(furniture.x, furniture.y, furniture.width, furniture.height);
                    break;
                case 'pc':
                    this.drawStandardPC(furniture.x, furniture.y, furniture.width, furniture.height);
                    break;
                case 'chair':
                    this.drawOfficeChair(furniture.x, furniture.y, furniture.width, furniture.height);
                    break;
                case 'bookshelf':
                    this.drawBookshelf(furniture.x, furniture.y, furniture.width, furniture.height);
                    break;
                case 'plant':
                    this.drawOfficePlant(furniture.x, furniture.y, furniture.width, furniture.height);
                    break;
            }
        });
    }
    
    drawStandardDesk(x, y, width, height) {
        // Detailed wooden desk like Stardew Valley furniture
        // Desk surface
        this.drawPixelRect(x, y, width, height, '#8B4513'); // Dark wood
        this.drawPixelRect(x + 2, y + 2, width - 4, height - 4, '#A0522D'); // Medium wood surface
        this.drawPixelRect(x + 4, y + 4, width - 8, height - 8, '#CD853F'); // Light wood top
        
        // Wood grain details
        for (let i = 0; i < 3; i++) {
            this.drawPixelRect(x + 8 + i * 30, y + 6, 2, height - 12, '#A0522D');
        }
        
        // Desk legs
        this.drawPixelRect(x + 4, y + height - 8, 8, 8, '#654321'); // Front left leg
        this.drawPixelRect(x + width - 12, y + height - 8, 8, 8, '#654321'); // Front right leg
        
        // Desk drawers
        this.drawPixelRect(x + 15, y + height - 25, 25, 15, '#654321'); // Left drawer
        this.drawPixelRect(x + 17, y + height - 23, 21, 11, '#8B4513');
        this.drawPixelRect(x + 32, y + height - 18, 4, 2, '#FFD700'); // Drawer handle
        
        this.drawPixelRect(x + 50, y + height - 25, 25, 15, '#654321'); // Right drawer
        this.drawPixelRect(x + 52, y + height - 23, 21, 11, '#8B4513');
        this.drawPixelRect(x + 67, y + height - 18, 4, 2, '#FFD700'); // Drawer handle
    }
    
    drawStandardPC(x, y, width, height) {
        // Detailed PC monitor and tower
        // Monitor base
        this.drawPixelRect(x, y + height - 6, width, 6, '#2F2F2F'); // Monitor stand
        this.drawPixelRect(x + 5, y + height - 8, width - 10, 4, '#1C1C1C'); // Stand base
        
        // Monitor screen
        this.drawPixelRect(x + 2, y, width - 4, height - 8, '#000000'); // Screen frame
        this.drawPixelRect(x + 4, y + 2, width - 8, height - 12, '#001122'); // Screen background
        this.drawPixelRect(x + 6, y + 4, width - 12, height - 16, '#003366'); // Desktop
        
        // Screen content - KI interface
        this.drawPixelRect(x + 8, y + 6, width - 16, 3, '#00FF00'); // Green status bar
        this.drawPixelRect(x + 8, y + 12, width - 16, 2, '#FFFF00'); // Yellow text
        this.drawPixelRect(x + 8, y + 16, width - 16, 2, '#FFFFFF'); // White text
        
        // Power LED
        this.drawPixelRect(x + width - 6, y + height - 4, 2, 2, '#00FF00'); // Green power light
    }
    
    drawOfficeChair(x, y, width, height) {
        // Executive office chair
        // Chair back
        this.drawPixelRect(x + 8, y, 14, 20, '#8B0000'); // Dark red leather
        this.drawPixelRect(x + 10, y + 2, 10, 16, '#DC143C'); // Bright red leather
        
        // Chair seat
        this.drawPixelRect(x + 2, y + 18, 26, 12, '#8B0000'); // Seat base
        this.drawPixelRect(x + 4, y + 20, 22, 8, '#DC143C'); // Seat cushion
        
        // Armrests
        this.drawPixelRect(x, y + 12, 6, 12, '#654321'); // Left armrest
        this.drawPixelRect(x + 24, y + 12, 6, 12, '#654321'); // Right armrest
        
        // Chair base
        this.drawPixelRect(x + 12, y + 28, 6, 8, '#2F2F2F'); // Central post
        
        // Chair wheels
        this.drawPixelRect(x + 4, y + 34, 4, 2, '#1C1C1C');
        this.drawPixelRect(x + 10, y + 34, 4, 2, '#1C1C1C');
        this.drawPixelRect(x + 16, y + 34, 4, 2, '#1C1C1C');
        this.drawPixelRect(x + 22, y + 34, 4, 2, '#1C1C1C');
    }
    
    drawBookshelf(x, y, width, height) {
        // Cozy wooden bookshelf like in reference image
        // Main bookshelf structure
        this.drawPixelRect(x, y, width, height, '#8B4513'); // Dark wood frame
        this.drawPixelRect(x + 2, y + 2, width - 4, height - 4, '#D2B48C'); // Interior
        
        // Shelves
        const shelfHeight = Math.floor(height / 4);
        for (let i = 1; i < 4; i++) {
            this.drawPixelRect(x + 2, y + i * shelfHeight, width - 4, 3, '#8B4513');
        }
        
        // Books on shelves - colorful like Stardew Valley
        const bookColors = ['#8B0000', '#228B22', '#4169E1', '#FF8C00', '#9370DB', '#DC143C'];
        for (let shelf = 0; shelf < 3; shelf++) {
            const shelfY = y + shelf * shelfHeight + 6;
            for (let book = 0; book < 5; book++) {
                const bookX = x + 4 + book * 4;
                const bookColor = bookColors[book % bookColors.length];
                this.drawPixelRect(bookX, shelfY, 3, shelfHeight - 9, bookColor);
                this.drawPixelRect(bookX, shelfY, 3, 2, this.lightenColor(bookColor)); // Book top
            }
        }
    }
    
    drawOfficePlant(x, y, width, height) {
        // Cheerful office plant like in reference image
        // Pot
        this.drawPixelRect(x, y + height - 12, width, 12, '#8B4513'); // Brown pot
        this.drawPixelRect(x + 2, y + height - 10, width - 4, 8, '#CD853F'); // Lighter pot
        
        // Plant stem
        this.drawPixelRect(x + width/2 - 2, y + 8, 4, height - 20, '#228B22'); // Main stem
        
        // Leaves - multiple layers for fullness
        const leafColors = ['#228B22', '#32CD32', '#90EE90'];
        for (let i = 0; i < 3; i++) {
            const leafY = y + i * 6;
            const leafColor = leafColors[i % leafColors.length];
            // Multiple leaf shapes
            this.drawPixelRect(x + 2, leafY, 8, 10, leafColor); // Left leaves
            this.drawPixelRect(x + width - 10, leafY + 2, 8, 10, leafColor); // Right leaves
            this.drawPixelRect(x + width/2 - 6, leafY - 2, 12, 8, leafColor); // Center leaves
        }
        
        // Decorative pot details
        this.drawPixelRect(x + 2, y + height - 8, width - 4, 2, '#654321'); // Pot rim
    }
    
    drawStall() {
        const stall = this.stall;
        
        // Stall-Hintergrund (Heu-Boden)
        this.drawPixelRect(stall.x, stall.y, stall.width, stall.height, '#DAA520');
        this.drawPixelRect(stall.x + 2, stall.y + 2, stall.width - 4, stall.height - 4, '#F4A460');
        
        // Heu-Textur (kleine Striche)
        this.ctx.fillStyle = '#CD853F';
        for (let i = 0; i < 20; i++) {
            const x = stall.x + 4 + Math.random() * (stall.width - 8);
            const y = stall.y + 4 + Math.random() * (stall.height - 8);
            this.drawPixelRect(Math.floor(x), Math.floor(y), 2, 1, '#CD853F');
        }
        
        // Holzzaun-Umrandung
        // Obere und untere Balken
        this.drawPixelRect(stall.x, stall.y, stall.width, 4, '#8B4513');
        this.drawPixelRect(stall.x, stall.y + stall.height - 4, stall.width, 4, '#8B4513');
        
        // Seitliche Balken
        this.drawPixelRect(stall.x, stall.y, 4, stall.height, '#8B4513');
        this.drawPixelRect(stall.x + stall.width - 4, stall.y, 4, stall.height, '#8B4513');
        
        // Vertikale Zaunlatten
        for (let i = 0; i < 5; i++) {
            const x = stall.x + 20 + i * 30;
            this.drawPixelRect(x, stall.y, 3, stall.height, '#A0522D');
        }
        
        // Stall-Label
        this.ctx.fillStyle = '#654321';
        this.ctx.font = 'bold 12px "Courier New", monospace';
        this.ctx.fillText('Der Stall', stall.x + 5, stall.y - 5);
        
        // Pony-Zähler
        const ponyCount = window.PonySystem ? window.PonySystem.caughtPonies.length : 0;
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = 'bold 10px "Courier New", monospace';
        this.ctx.fillText(`Ponies: ${ponyCount}`, stall.x + 5, stall.y + stall.height + 15);
        
        // Draw ponies in stall
        this.drawPoniesInStall();
    }
    
    drawPoniesInStall() {
        if (!window.PonySystem || !window.PonySystem.caughtPonies) return;
        
        const stall = this.stall;
        const ponies = window.PonySystem.caughtPonies;
        const stallPadding = 8;
        const ponySize = 16;
        const spacing = 4;
        
        // Berechne Pony-Positionen im Stall
        const availableWidth = stall.width - 2 * stallPadding;
        const poniesPerRow = Math.floor(availableWidth / (ponySize + spacing));
        
        ponies.forEach((pony, index) => {
            const row = Math.floor(index / poniesPerRow);
            const col = index % poniesPerRow;
            
            const x = stall.x + stallPadding + col * (ponySize + spacing);
            const y = stall.y + stallPadding + row * (ponySize + spacing);
            
            // Zeichne kleines Pony
            this.drawSmallPony(x, y, ponySize, pony.type);
            
            // Speichere Position für Click-Detection
            pony.stallPosition = { x, y, width: ponySize, height: ponySize };
        });
    }
    
    drawSmallPony(x, y, size, ponyType) {
        const colors = ponyType.colors;
        const scale = size / 32; // Skalierung auf gewünschte Größe
        
        // Körper (vereinfacht)
        this.drawPixelRect(x + 2, y + 4, Math.floor(12 * scale), Math.floor(8 * scale), colors.body || '#FFFFFF');
        
        // Mähne
        this.drawPixelRect(x + 1, y + 2, Math.floor(6 * scale), Math.floor(4 * scale), colors.mane || '#FF69B4');
        
        // Augen (kleine Punkte)
        this.drawPixelRect(x + 3, y + 3, 1, 1, '#000000');
        this.drawPixelRect(x + 5, y + 3, 1, 1, '#000000');
        
        // Horn für Einhorn
        if (ponyType.id === 'unicorn') {
            this.drawPixelRect(x + 4, y, 2, 3, colors.horn || '#FFD700');
        }
    }
    
    lightenColor(color) {
        // Einfache Funktion um Farbe aufzuhellen
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const amt = 44;
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    draw16BitManager(x, y, frame = 0) {
        // Professional manager sprite (48x64 pixels)
        const colors = {
            skin: '#FDBCB4',
            hair: '#8B4513',
            suit: '#2F4F4F',
            shirt: '#FFFFFF',
            tie: '#DC143C',
            pants: '#2F4F4F',
            shoes: '#000000'
        };
        
        // Head and face
        this.drawPixelRect(x + 16, y, 16, 20, colors.skin);
        // Hair
        this.drawPixelRect(x + 14, y - 2, 20, 8, colors.hair);
        // Eyes
        this.drawPixelRect(x + 18, y + 6, 2, 2, '#000000');
        this.drawPixelRect(x + 26, y + 6, 2, 2, '#000000');
        // Mouth
        this.drawPixelRect(x + 20, y + 12, 6, 2, '#000000');
        
        // Body - suit jacket
        this.drawPixelRect(x + 8, y + 20, 32, 28, colors.suit);
        // Shirt
        this.drawPixelRect(x + 16, y + 22, 16, 24, colors.shirt);
        // Tie
        this.drawPixelRect(x + 22, y + 22, 4, 20, colors.tie);
        
        // Arms
        this.drawPixelRect(x + 4, y + 22, 8, 20, colors.suit);
        this.drawPixelRect(x + 36, y + 22, 8, 20, colors.suit);
        // Hands
        this.drawPixelRect(x + 4, y + 40, 8, 6, colors.skin);
        this.drawPixelRect(x + 36, y + 40, 8, 6, colors.skin);
        
        // Legs
        this.drawPixelRect(x + 12, y + 48, 10, 16, colors.pants);
        this.drawPixelRect(x + 26, y + 48, 10, 16, colors.pants);
        
        // Shoes
        this.drawPixelRect(x + 10, y + 60, 14, 4, colors.shoes);
        this.drawPixelRect(x + 24, y + 60, 14, 4, colors.shoes);
    }
    
    draw16BitNPC(x, y, npcType, frame = 0) {
        const types = {
            developer: {
                colors: { shirt: '#4CAF50', pants: '#2196F3', hair: '#FF9800' },
                accessories: ['glasses']
            },
            manager: {
                colors: { shirt: '#9C27B0', pants: '#795548', hair: '#607D8B' },
                accessories: ['briefcase']
            },
            intern: {
                colors: { shirt: '#FF5722', pants: '#9E9E9E', hair: '#FFC107' },
                accessories: ['notebook']
            },
            client: {
                colors: { shirt: '#3F51B5', pants: '#424242', hair: '#8BC34A' },
                accessories: ['tie']
            }
        };
        
        const type = types[npcType] || types.developer;
        
        // Basic body structure (32x48 pixels)
        // Head
        this.drawPixelRect(x + 8, y, 16, 16, '#FDBCB4');
        // Hair
        this.drawPixelRect(x + 6, y - 2, 20, 6, type.colors.hair);
        // Eyes
        this.drawPixelRect(x + 10, y + 5, 2, 2, '#000000');
        this.drawPixelRect(x + 18, y + 5, 2, 2, '#000000');
        
        // Body
        this.drawPixelRect(x + 4, y + 16, 24, 20, type.colors.shirt);
        
        // Arms (with simple animation)
        const armOffset = Math.sin(frame * 0.1) * 2;
        this.drawPixelRect(x, y + 18 + armOffset, 8, 16, type.colors.shirt);
        this.drawPixelRect(x + 24, y + 18 - armOffset, 8, 16, type.colors.shirt);
        
        // Legs (with walking animation)
        const legOffset = Math.sin(frame * 0.2) * 3;
        this.drawPixelRect(x + 8, y + 36, 6, 12, type.colors.pants);
        this.drawPixelRect(x + 18, y + 36, 6, 12, type.colors.pants);
        
        // Feet
        this.drawPixelRect(x + 6, y + 44 + legOffset, 10, 4, '#000000');
        this.drawPixelRect(x + 16, y + 44 - legOffset, 10, 4, '#000000');
        
        // Accessories
        if (type.accessories.includes('glasses')) {
            this.drawPixelRect(x + 8, y + 4, 16, 2, '#000000');
        }
        if (type.accessories.includes('briefcase')) {
            this.drawPixelRect(x - 2, y + 20, 6, 8, '#8B4513');
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw 16-bit office background
        this.draw16BitOfficeBackground(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw standard office furniture
        this.drawOfficeFurniture();
        
        // Draw stall area
        this.drawStall();
        
        // Draw room items (from room system)
        if (window.RoomSystem) {
            window.RoomSystem.render(this.ctx);
        }
        
        // Draw NPCs with 16-bit graphics
        this.npcs.forEach((npc, index) => {
            if (npc.visible) {
                this.draw16BitNPC(npc.x, npc.y, npc.type, Date.now() + index * 1000);
                
                // Question bubble
                if (npc.hasQuestion) {
                    // Speech bubble
                    this.drawPixelRect(npc.x + npc.width + 5, npc.y - 10, 24, 18, '#FFFFFF');
                    this.drawPixelRect(npc.x + npc.width + 7, npc.y - 8, 20, 14, '#F0F0F0');
                    this.drawPixelRect(npc.x + npc.width + 3, npc.y + 2, 6, 6, '#FFFFFF'); // tail
                    
                    // Question mark
                    this.ctx.fillStyle = '#FF6B00';
                    this.ctx.font = 'bold 14px monospace';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('?', npc.x + npc.width + 17, npc.y + 2);
                    this.ctx.textAlign = 'left';
                }
            }
        });
        
        // Draw manager (player) with 16-bit graphics
        this.draw16BitManager(this.player.x, this.player.y, Date.now());
        
        // Draw pony if spawned
        if (window.PonySystem) {
            window.PonySystem.render(this.ctx);
        }
        
        // Draw catch particles if any
        if (this.catchParticles) {
            this.catchParticles.forEach(particle => {
                this.ctx.globalAlpha = particle.life;
                this.ctx.fillStyle = particle.color;
                this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
            });
            this.ctx.globalAlpha = 1;
        }
    }
    
    gameLoop() {
        const now = Date.now();
        const deltaTime = now - (this.lastTime || now);
        this.lastTime = now;
        
        // Update NPC spawning
        if (!this.activeNPC && this.gameState === 'playing') {
            this.npcSpawnTimer += deltaTime;
            if (this.npcSpawnTimer >= this.npcSpawnInterval) {
                this.spawnNewNPC();
            }
        }
        
        // Update NPCs
        this.updateNPCs(deltaTime);
        
        // Update pony system
        if (window.PonySystem) {
            window.PonySystem.update(deltaTime);
        }
        
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start game when page loads
window.addEventListener('load', () => {
    window.game = new Game();
});