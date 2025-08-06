// KI-Manager ist kein Ponyhof - Main Game Script
class Game {
    constructor() {
        console.log('Game Konstruktor gestartet...');
        this.canvas = document.getElementById('gameCanvas');
        console.log('Canvas gefunden:', !!this.canvas);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        console.log('Context gefunden:', !!this.ctx);
        this.score = 0;
        this.successRate = 0;
        this.questions = [];
        this.currentQuestion = null;
        this.usedQuestions = new Set(); // Track ALL used questions globally
        this.usedMultipleChoiceQuestions = new Set(); // Separate tracking für Multiple-Choice Fragen
        this.selectedAnswerIndex = null; // Track selected answer before confirmation (Single-Choice)
        this.selectedAnswerIndices = []; // Track selected answers for Multiple-Choice
        this.currentQuestionType = 'multiple'; // 'multiple' or 'fill'
        
        // Canvas Animation System
        this.animationTime = 0;
        this.dustParticles = [];
        this.initDustParticles();
        
        // Spezial-NPC System
        this.spezialNpcs = [];
        this.usedSpezialNpcs = new Set();
        console.log('🎭 Spezial-NPC System initialisiert');
        this.activeBonusEffects = new Map();
        this.loadSpezialNpcs();
        
        // Lückentext-Fragen System für vergessliche NPCs
        this.fillInQuestions = [];
        this.usedFillInQuestions = new Set();
        this.loadFillInQuestions();
        
        // Globale Fragenverwaltung
        this.totalQuestionsCount = 0; // Wird nach dem Laden der Fragen gesetzt
        
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
        
        // Pony stall area - positioned in background, away from manager and furniture
        this.stall = {
            x: 250,
            y: 80,
            width: 180,
            height: 120
        };
        
        // NPC spawning system
        this.npcSpawnTimer = 0;
        this.npcSpawnInterval = 3000; // 3 seconds between NPCs (faster)
        this.activeNPC = null;
        this.npcQueue = [];
        this.npcTypes = ['developer', 'manager', 'intern', 'client', 'sandra', 'juergen', 'thomas', 'forgetful_dev', 'confused_manager', 'sleepy_intern', 'distracted_client', 'coffee_addict'];
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
            ],
            forgetful_dev: [
                "*kratzt sich verwirrt den Kopf* Wie hieß das nochmal...?",
                "*gähnt ausgiebig* Ich hab's gleich, aber mir fehlt ein Wort...",
                "*reibt sich müde die Augen* Ah Mist... hilf mir mal eben auf die Sprünge!",
                "*seufzt erschöpft* Mein Kopf ist Matsch... da war doch was mit ___?",
                "*schaut verwirrt* Ach... das Wort ist wie weggeblasen..."
            ],
            confused_manager: [
                "*blickt verwirrt auf ihre Notizen* Äh... wie nennt man das gleich?",
                "*kratzt sich ratlos am Kopf* Mist, mir fällt das Wort nicht ein...",
                "*seufzt gestresst* Zu viele Meetings – das Wort ist weg...",
                "*schaut hilfesuchend* Können Sie mir auf die Sprünge helfen?",
                "*müde lächelnd* Ich weiß es eigentlich, aber..."
            ],
            sleepy_intern: [
                "*gähnt herzhaft* Entschuldigung... wie hieß das nochmal?",
                "*reibt sich verschlafen die Augen* Mir ist das Wort entfallen...",
                "*schläfrig* War zu lange am Lernen – das Wort...?",
                "*müde* Mein Hirn macht gerade Pause... können Sie helfen?",
                "*gähnt* Ach... wie nennt man das doch gleich?"
            ],
            distracted_client: [
                "*schaut zerstreut umher* Äh... das Wort... wie war das?",
                "*wirkt abgelenkt* Entschuldigung, mir schwebt das vor, aber...",
                "*ungeduldig* Können Sie schnell helfen? Das Wort...?",
                "*gestresst* Zu viel los heute – mir fällt's nicht ein...",
                "*zerstreut* Ach... wie nennt man das nochmal?"
            ],
            coffee_addict: [
                "*hält Kaffeetasse* Ohne Koffein kein Wort... wie hieß das?",
                "*trinkt hektisch Kaffee* Brauche mehr Koffein – das Wort...?",
                "*zittrig* Zu wenig Kaffee – mir fällt nichts ein...",
                "*müde mit Kaffee* Mein Hirn läuft noch nicht... das Wort?",
                "*erschöpft* Erst Kaffee, dann denken... wie hieß das nochmal?"
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
            thomas: "Thomas Golfprofi",
            forgetful_dev: "Paul Brainfog",
            confused_manager: "Lisa Durcheinander",
            sleepy_intern: "Tim Müdmann",
            distracted_client: "Anna Zerstreut",
            coffee_addict: "Marco Koffeinschock"
        };
        
        this.npcPositions = {
            developer: "Senior Developer",
            manager: "Projektmanager", 
            intern: "Praktikantin",
            client: "Kunde",
            sandra: "HR-Managerin",
            juergen: "Compliance Officer",
            thomas: "Business Analyst",
            forgetful_dev: "Übermüdeter Entwickler",
            confused_manager: "Verwirrte Managerin",
            sleepy_intern: "Schläfriger Praktikant",
            distracted_client: "Abgelenkte Kundin",
            coffee_addict: "Koffein-Abhängiger Kollege"
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
        
        
        // UI elements
        this.scoreElement = document.getElementById('scoreValue');
        this.successBar = document.getElementById('successBar');
        this.successText = document.getElementById('successText');
        this.acceptQuestionButton = document.getElementById('acceptQuestionButton');
        this.dismissNPCButton = document.getElementById('dismissNPCButton');
        
        console.log('UI-Elemente gefunden:', {
            scoreElement: !!this.scoreElement,
            successBar: !!this.successBar,
            successText: !!this.successText,
            acceptQuestionButton: !!this.acceptQuestionButton,
            dismissNPCButton: !!this.dismissNPCButton
        });
        
        console.log('Game Konstruktor abgeschlossen, starte init()...');
        this.init();
    }
    
    async init() {
        console.log('Game init() gestartet...');
        await this.loadQuestions();
        console.log('Fragen geladen');
        this.setupEventListeners();
        console.log('Event Listeners eingerichtet');
        this.setupAudioEventListeners();
        console.log('Audio Event Listeners eingerichtet');
        this.spawnFirstNPC(); // Start with first NPC
        console.log('Erster NPC gespawnt');
        
        // Initial UI update um sicherzustellen dass alles korrekt angezeigt wird
        this.updateUI();
        console.log('UI aktualisiert');
        
        this.gameLoop();
        console.log('Game Loop gestartet - Game init() abgeschlossen!');
    }
    
    // Funktion für den Titelbildschirm, um den Game Loop zu starten
    startGameLoop() {
        console.log('startGameLoop() aufgerufen - aber Game Loop läuft bereits');
        // Game Loop läuft bereits, nichts zu tun
        return true;
    }
    
    initDustParticles() {
        // Create subtle floating dust particles
        for (let i = 0; i < 15; i++) {
            this.dustParticles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.3 + 0.1,
                size: Math.random() * 2 + 1
            });
        }
    }
    
    updateCanvasAnimations(deltaTime) {
        this.animationTime += deltaTime;
        
        // Update dust particles
        this.dustParticles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Gentle floating motion
            particle.y += Math.sin(this.animationTime * 0.001 + particle.x * 0.01) * 0.1;
        });
    }
    
    drawCanvasAnimations() {
        // Draw floating dust particles
        this.dustParticles.forEach(particle => {
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = '#D2B48C';
            this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        });
        this.ctx.globalAlpha = 1;
        
        // Subtle LED blinking on PC monitor
        if (Math.sin(this.animationTime * 0.002) > 0.7) {
            this.drawPixelRect(145, 345, 2, 2, '#00FF00'); // Green LED
        }
        
        // Plant leaves gentle sway
        const plantX = 520;
        const plantY = 200;
        const swayOffset = Math.sin(this.animationTime * 0.0008) * 2;
        
        // Redraw plant with sway (simplified)
        this.ctx.globalAlpha = 0.8;
        this.drawPixelRect(plantX + swayOffset, plantY - 5, 8, 8, '#228B22');
        this.drawPixelRect(plantX + 15 - swayOffset, plantY - 3, 6, 6, '#32CD32');
        this.drawPixelRect(plantX + 25 + swayOffset * 0.5, plantY - 2, 10, 8, '#90EE90');
        this.ctx.globalAlpha = 1;
    }
    
    async loadSpezialNpcs() {
        try {
            const response = await fetch('spezial_npcs.json');
            if (!response.ok) {
                console.warn('Spezial-NPCs konnten nicht geladen werden');
                return;
            }
            const rawSpezialNpcs = await response.json();
            
            // Validiere und filtere Spezial-NPCs
            this.spezialNpcs = rawSpezialNpcs.filter(npc => this.validateSpezialNpc(npc));
            
            console.log(`✨ ${this.spezialNpcs.length} gültige Spezial-NPCs geladen (${rawSpezialNpcs.length - this.spezialNpcs.length} ungültige gefiltert)`);
            
            if (this.spezialNpcs.length === 0) {
                console.warn('⚠️ Keine gültigen Spezial-NPCs verfügbar!');
            }
        } catch (error) {
            console.warn('Fehler beim Laden der Spezial-NPCs:', error);
            this.spezialNpcs = []; // Fallback zu leerem Array
        }
    }
    
    async loadFillInQuestions() {
        try {
            const response = await fetch('fill_in_questions.json');
            if (!response.ok) {
                console.warn('Lückentext-Fragen konnten nicht geladen werden');
                return;
            }
            this.fillInQuestions = await response.json();
            console.log(`🧠 ${this.fillInQuestions.length} Lückentext-Fragen geladen`);
        } catch (error) {
            console.warn('Fehler beim Laden der Lückentext-Fragen:', error);
            this.fillInQuestions = []; // Fallback zu leerem Array
        }
    }
    
    validateSpezialNpc(npc) {
        const requiredFields = ['id', 'name', 'frage', 'antworten', 'korrekteAntwort', 'erklaerung'];
        
        // Prüfe alle erforderlichen Felder
        for (const field of requiredFields) {
            if (!npc[field]) {
                console.error(`❌ Spezial-NPC ${npc.id || 'unbekannt'} fehlt Feld: ${field}`);
                return false;
            }
        }
        
        // Prüfe spezifische Feldtypen
        if (!Array.isArray(npc.antworten) || npc.antworten.length === 0) {
            console.error(`❌ Spezial-NPC ${npc.id}: 'antworten' muss ein nicht-leeres Array sein`);
            return false;
        }
        
        if (typeof npc.frage !== 'string' || npc.frage.trim() === '') {
            console.error(`❌ Spezial-NPC ${npc.id}: 'frage' muss ein nicht-leerer String sein`);
            return false;
        }
        
        if (typeof npc.korrekteAntwort !== 'string' || npc.korrekteAntwort.trim() === '') {
            console.error(`❌ Spezial-NPC ${npc.id}: 'korrekteAntwort' muss ein nicht-leerer String sein`);
            return false;
        }
        
        // Prüfe ob korrekteAntwort zu den verfügbaren Antworten passt
        const hasMatchingAnswer = npc.antworten.some(answer => 
            answer.startsWith(npc.korrekteAntwort + ':')
        );
        
        if (!hasMatchingAnswer) {
            console.error(`❌ Spezial-NPC ${npc.id}: korrekteAntwort '${npc.korrekteAntwort}' entspricht keiner verfügbaren Antwort`);
            return false;
        }
        
        console.log(`✅ Spezial-NPC ${npc.id} (${npc.name}) erfolgreich validiert`);
        return true;
    }
    
    isSpezialNpc() {
        // 15% Chance auf Spezial-NPC, aber nur wenn noch welche verfügbar sind
        const availableSpezialNpcs = this.spezialNpcs.filter(npc => !this.usedSpezialNpcs.has(npc.id));
        return Math.random() < 0.15 && availableSpezialNpcs.length > 0;
    }
    
    createSpezialNpc() {
        const availableSpezialNpcs = this.spezialNpcs.filter(npc => !this.usedSpezialNpcs.has(npc.id));
        
        console.log(`🎭 Erstelle Spezial-NPC: ${availableSpezialNpcs.length} verfügbar, ${this.usedSpezialNpcs.size} bereits verwendet`);
        
        if (availableSpezialNpcs.length === 0) {
            console.log('📭 Keine Spezial-NPCs mehr verfügbar');
            return null;
        }
        
        const spezialNpc = availableSpezialNpcs[Math.floor(Math.random() * availableSpezialNpcs.length)];
        
        console.log(`✨ Spezial-NPC erstellt: ${spezialNpc.name} (ID: ${spezialNpc.id})`);
        
        return {
            x: this.officeEntrance.x,
            y: this.officeEntrance.y,
            width: 48,
            height: 64,
            targetX: this.questionSpot.x,
            targetY: this.questionSpot.y,
            speed: 2,
            type: 'spezial',
            hasQuestion: true,
            visible: true,
            spezialData: spezialNpc,
            name: spezialNpc.name,
            position: "Legendäre Persönlichkeit",
            saying: `"Ich habe eine besondere Frage für Sie..."`,
            questionId: spezialNpc.id
        };
    }
    
    setupAudioEventListeners() {
        // Warte kurz, damit alle UI-Elemente geladen sind
        setTimeout(() => {
            // Button Hover-Sounds
            document.querySelectorAll('button, .answer-button').forEach(button => {
                button.addEventListener('mouseenter', () => {
                    this.playSound('hover');
                });
            });
            
            // Shop Items Hover-Sounds
            document.addEventListener('mouseover', (e) => {
                if (e.target.classList.contains('shop-item') || 
                    e.target.classList.contains('inventory-slot')) {
                    this.playSound('hover');
                }
            });
        }, 1000);
    }
    
    convertDekraQuestionsFormat(rawQuestions) {
        console.log(`🔄 Konvertiere ${rawQuestions.length} Fragen vom result.json-Format...`);
        
        const convertedQuestions = rawQuestions.map((q, index) => {
            // Validierung: Prüfe ob Frage vollständig ist
            if (!q.question || !q.options || !q.correct_answers || !Array.isArray(q.options) || !Array.isArray(q.correct_answers)) {
                console.warn(`⚠️ Überspringe ungültige Frage ${q.id || index + 1}:`, q);
                return null;
            }
            
            // Bestimme Fragentyp basierend auf Anzahl korrekter Antworten
            const questionType = q.correct_answers.length === 1 ? 'single_choice' : 'multiple_choice';
            
            // Konvertiere options Array zu antworten Array (ohne doppelte Präfixe)
            const antworten = q.options.map((option, optionIndex) => {
                const letter = String.fromCharCode(65 + optionIndex); // A, B, C, D
                const isCorrect = q.correct_answers.includes(letter);
                
                return {
                    text: option, // Kein Label hier - wird in UI hinzugefügt
                    korrekt: isCorrect
                };
            });
            
            // Erstelle konvertierte Frage im internen Format
            return {
                id: q.id,
                frage: q.question,
                antworten: antworten,
                type: questionType,
                explanation: null // result.json hat keine Erklärungen
            };
        }).filter(q => q !== null); // Entferne ungültige Fragen
        
        console.log(`✅ ${convertedQuestions.length} Fragen erfolgreich konvertiert`);
        console.log(`📊 Single-Choice: ${convertedQuestions.filter(q => q.type === 'single_choice').length}`);
        console.log(`📊 Multiple-Choice: ${convertedQuestions.filter(q => q.type === 'multiple_choice').length}`);
        
        return convertedQuestions;
    }
    
    async loadQuestions() {
        console.log('🔄 Lade Fragen...');
        
        // Versuche zuerst result.json zu laden
        let rawQuestions = null;
        
        try {
            console.log('🔄 Versuche result.json zu laden...');
            const response = await fetch('./result.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            rawQuestions = await response.json();
            
            // Validierung: Prüfe ob Datei leer oder ungültig ist
            if (!rawQuestions || !Array.isArray(rawQuestions) || rawQuestions.length === 0) {
                throw new Error('Datei ist leer oder enthält keine gültigen Fragen');
            }
            
            console.log(`✅ ${rawQuestions.length} Fragen aus result.json geladen`);
            
        } catch (error) {
            console.warn('⚠️ result.json konnte nicht geladen werden:', error.message);
            
            // Fallback: Verwende Backup-Fragen
            if (window.backupQuestions && Array.isArray(window.backupQuestions) && window.backupQuestions.length > 0) {
                console.log('🔄 Verwende Backup-Fragen...');
                rawQuestions = window.backupQuestions;
                console.log(`✅ ${rawQuestions.length} Backup-Fragen geladen`);
            } else {
                console.error('❌ Keine Backup-Fragen verfügbar!');
                this.questions = [];
                alert(`FEHLER: Weder result.json noch Backup-Fragen konnten geladen werden.\n\nFehler: ${error.message}\n\nBitte:\n1. Öffnen Sie das Spiel über http://localhost:8000/index.html\n2. Oder stellen Sie sicher, dass questions.js geladen wurde`);
                this.calculateTotalQuestions();
                return;
            }
        }
        
        // Konvertiere das JSON-Format ins interne Format
        this.questions = this.convertDekraQuestionsFormat(rawQuestions);
        console.log(`✅ ${this.questions.length} Fragen erfolgreich konvertiert`);
        this.calculateTotalQuestions();
    }
    
    calculateTotalQuestions() {
        // Fragen aus result.json
        this.totalQuestionsCount = this.questions.length;
        console.log(`📊 FRAGENPOOL-ÜBERSICHT:`);
        console.log(`   🎯 Gesamt verfügbar: ${this.totalQuestionsCount} Fragen`);
        console.log(`   📝 Ausschließlich aus result.json`);
        console.log(`   ✅ Keine hartkodierten Fragen - nur die ${this.totalQuestionsCount} validierten Fragen aktiv!`);
        console.log(`   🔄 Wiederholungsschutz aktiv - jede Frage erst nach vollständigem Durchlauf erneut`);
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
        
        // NEUER: NPC wegschicken Button
        document.getElementById('dismissNPCButton').addEventListener('click', () => {
            if (this.activeNPC) {
                this.dismissCurrentNPC();
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
        
        // DEBUG: Prüfe ob Lückentext-Fragen geladen sind
        console.log(`🧠 Lückentext-Status: ${this.fillInQuestions.length} Fragen geladen`);
        
        // Prüfe ob Spezial-NPC spawnen soll
        if (this.isSpezialNpc()) {
            const spezialNpc = this.createSpezialNpc();
            if (spezialNpc) {
                spezialNpc.state = 'entering';
                spezialNpc.waitTimer = 0;
                this.activeNPC = spezialNpc;
                this.npcs = [this.activeNPC];
                console.log(`✨ Spezial-NPC spawned: ${spezialNpc.name}`);
                return;
            }
        }
        
        // TEMPORÄR: Erhöhe Chance für vergessliche NPCs zum Testen (80%)
        const forgetfulNpcTypes = ['forgetful_dev', 'confused_manager', 'sleepy_intern', 'distracted_client', 'coffee_addict'];
        let npcType;
        
        if (Math.random() < 0.8) {
            // 80% Chance für vergessliche NPCs
            npcType = forgetfulNpcTypes[Math.floor(Math.random() * forgetfulNpcTypes.length)];
            console.log(`🧠 FORCE SPAWN vergesslicher NPC: ${npcType}`);
        } else {
            // 20% Chance für normale NPCs
            npcType = this.npcTypes[Math.floor(Math.random() * this.npcTypes.length)];
            console.log(`👤 Normal NPC spawned: ${npcType}`);
        }
        
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
    
    dismissCurrentNPC() {
        console.log('🚪 NPC wird weggeschickt...');
        
        if (this.activeNPC) {
            // Close any open question dialog
            this.closeQuestion();
            
            // Clear current question data
            this.currentQuestion = null;
            this.currentQuestionType = null;
            this.selectedAnswerIndex = null;
            this.selectedAnswerIndices = [];
            this.selectedSpezialAnswer = null;
            
            // Reset game state
            this.gameState = 'playing';
            
            // Start NPC leaving animation
            this.startNPCLeaving();
            
            // Update button visibility
            this.updateAcceptQuestionButton();
            this.updateDismissButton();
            
            // Show confirmation message
            this.showDismissMessage();
        }
    }
    
    showDismissMessage() {
        // Create temporary message element
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #F39C12;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;
        messageDiv.textContent = '🚪 NPC ist gegangen...';
        
        // Add fade animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
        
        // Add to DOM and remove after animation
        document.body.appendChild(messageDiv);
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 2000);
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
        
        // Neuer Hover-Sound für Buttons
        this.soundEffects.hover = () => {
            const gainNode = this.audioContext.createGain();
            gainNode.connect(this.audioContext.destination);
            gainNode.gain.setValueAtTime(this.effectsVolume * 0.05, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            const osc = this.audioContext.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, this.audioContext.currentTime);
            osc.connect(gainNode);
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.05);
        };
        
        // Chime für Level-Up/Achievement
        this.soundEffects.chime = () => {
            const gainNode = this.audioContext.createGain();
            gainNode.connect(this.audioContext.destination);
            gainNode.gain.setValueAtTime(this.effectsVolume * 0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
            
            [523, 659, 784, 1047].forEach((freq, i) => {
                const osc = this.audioContext.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                osc.connect(gainNode);
                osc.start(this.audioContext.currentTime + i * 0.15);
                osc.stop(this.audioContext.currentTime + i * 0.15 + 0.3);
            });
        };
        
        // Whoosh für UI-Übergänge
        this.soundEffects.whoosh = () => {
            const gainNode = this.audioContext.createGain();
            gainNode.connect(this.audioContext.destination);
            gainNode.gain.setValueAtTime(this.effectsVolume * 0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
            
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(100, this.audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.4);
            filter.connect(gainNode);
            
            const noise = this.audioContext.createBufferSource();
            const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.4, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < data.length; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.1;
            }
            noise.buffer = buffer;
            noise.connect(filter);
            noise.start();
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
        
        // Vergessliche NPCs stellen immer Lückentext-Fragen
        const forgetfulNpcTypes = ['forgetful_dev', 'confused_manager', 'sleepy_intern', 'distracted_client', 'coffee_addict'];
        const isForgetfulNpc = forgetfulNpcTypes.includes(npcType);
        
        console.log(`🔍 NPC-Typ: ${npcType}, Vergesslich: ${isForgetfulNpc}, FillIn-Fragen verfügbar: ${this.fillInQuestions.length}`);
        
        let selectedQuestion = null;
        
        if (isForgetfulNpc) {
            // Vergessliche NPCs verwenden Lückentext-Fragen
            console.log(`🧠 Suche Lückentext-Frage für vergesslichen NPC...`);
            this.currentQuestionType = 'fill';
            selectedQuestion = this.findAvailableFillInQuestion();
            
            if (selectedQuestion) {
                console.log(`✅ Lückentext-Frage gefunden: ${selectedQuestion.question.frage.substring(0, 50)}...`);
            } else {
                console.error(`❌ Keine Lückentext-Frage gefunden! UsedSet Größe: ${this.usedFillInQuestions.size}`);
            }
        } else {
            // Prüfe ob alle Multiple-Choice-Fragen verwendet wurden (separater Reset)
            if (this.usedMultipleChoiceQuestions.size >= this.questions.length) {
                console.log('🔄 Alle Multiple-Choice-Fragen verwendet, setze Pool zurück');
                this.usedMultipleChoiceQuestions.clear();
            }
            
            // Normale Multiple Choice Fragen (oder Fallback) - JEDE FRAGE GENAU EINMAL
            this.currentQuestionType = 'multiple';
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
        } else if (this.currentQuestionType === 'fill') {
            // Für Lückentext-Fragen auch im separaten Tracker markieren
            this.usedFillInQuestions.add(selectedQuestion.id);
        }
        
        this.currentQuestion = selectedQuestion.question;
        console.log(`✅ Gewählte Frage (${selectedQuestion.id}): ${selectedQuestion.question.frage}`);
        
        if (this.currentQuestionType === 'multiple') {
            console.log(`📊 Multiple-Choice verwendet: ${this.usedMultipleChoiceQuestions.size}/${this.questions.length}`);
        } else if (this.currentQuestionType === 'fill') {
            console.log(`📊 Lückentext-Fragen verwendet: ${this.usedFillInQuestions.size}/${this.fillInQuestions.length}`);
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
    
    findAvailableFillInQuestion() {
        console.log(`🔍 Suche unbenutzte Lückentext-Frage (${this.usedFillInQuestions.size}/${this.fillInQuestions.length} verwendet)`);
        
        // DEBUG: Überprüfe ob fillInQuestions Array leer ist
        if (!this.fillInQuestions || this.fillInQuestions.length === 0) {
            console.error(`❌ CRITICAL: fillInQuestions Array ist leer oder undefined!`);
            return null;
        }
        
        // Finde alle unbenutzten Lückentext-Fragen
        const availableQuestions = this.fillInQuestions.filter(question => 
            !this.usedFillInQuestions.has(question.id)
        );
        
        console.log(`📊 Verfügbare Lückentext-Fragen: ${availableQuestions.length}`);
        
        if (availableQuestions.length > 0) {
            // Wähle zufällig eine unbenutzte Frage
            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            const selectedQuestion = availableQuestions[randomIndex];
            
            console.log(`✅ Lückentext-Frage gefunden: ${selectedQuestion.question.substring(0, 50)}...`);
            return {
                question: {
                    frage: selectedQuestion.question,
                    answer: selectedQuestion.answer,
                    alternatives: selectedQuestion.alternatives,
                    explanation: selectedQuestion.explanation
                },
                id: selectedQuestion.id
            };
        }
        
        console.log(`❌ Alle Lückentext-Fragen wurden verwendet - automatischer Reset`);
        this.usedFillInQuestions.clear();
        
        // Nach Reset: Wähle erste verfügbare Frage
        if (this.fillInQuestions.length > 0) {
            const selectedQuestion = this.fillInQuestions[0];
            
            console.log(`✅ Lückentext-Frage nach Reset gefunden`);
            return {
                question: {
                    frage: selectedQuestion.question,
                    answer: selectedQuestion.answer,
                    alternatives: selectedQuestion.alternatives,
                    explanation: selectedQuestion.explanation
                },
                id: selectedQuestion.id
            };
        }
        
        console.log(`❌ Keine Lückentext-Fragen verfügbar - kritischer Fehler!`);
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
        
        // Keine Lückentext-Fragen mehr - nur noch die internen Hauptfragen
        
        // Stufe 2: Alle Fragen aufgebraucht - setze Pool zurück
        console.log(`🔄 Alle ${this.totalQuestionsCount} Fragen durchlaufen - setze Pool zurück für neue Rotation`);
        this.usedQuestions.clear();
        
        // Nach Reset nochmal versuchen mit vollem Pool
        const resetQuestions = this.tryGetQuestionsFromPool(this.questions, 'global');
        if (resetQuestions) {
            console.log(`✅ Frage nach Reset gefunden - neue Rotation startet`);
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
            // Spezial-NPC Behandlung
            if (this.activeNPC.type === 'spezial') {
                const spezialData = this.activeNPC.spezialData;
                
                // Validiere Spezial-NPC Daten vor Verwendung
                if (!spezialData || !spezialData.frage || !spezialData.name) {
                    console.error('❌ Ungültige Spezial-NPC Daten:', spezialData);
                    alert("❌ Fehler: Die aktuelle Spezial-NPC Frage ist ungültig oder nicht vorhanden. Der NPC wird entfernt.");
                    this.handleNoQuestionAvailable();
                    return;
                }
                
                fullQuestionContent = `
                    <div class="npc-info-section spezial-npc">
                        <div class="npc-header">
                            <span class="npc-name spezial-name">✨ ${spezialData.name} ✨</span> - <span class="npc-position">${this.activeNPC.position}</span>
                        </div>
                        <div class="npc-saying">"${this.activeNPC.saying}"</div>
                    </div>
                    <div class="question-section spezial-question">
                        ${spezialData.frage}
                    </div>
                `;
            } else {
                // Normale NPC Behandlung
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
                
                // Validiere normale Frage vor Verwendung
                if (!this.currentQuestion || !this.currentQuestion.frage) {
                    console.error('❌ Ungültige normale Frage:', this.currentQuestion);
                    alert("❌ Fehler: Die aktuelle Frage ist ungültig oder nicht vorhanden. Bitte prüfe die Daten.");
                    this.handleNoQuestionAvailable();
                    return;
                }
                
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
            }
        } else {
            // Fallback ohne NPC - validiere auch hier
            if (!this.currentQuestion || !this.currentQuestion.frage) {
                console.error('❌ Ungültige Frage ohne NPC:', this.currentQuestion);
                alert("❌ Fehler: Die aktuelle Frage ist ungültig oder nicht vorhanden. Bitte prüfe die Daten.");
                this.handleNoQuestionAvailable();
                return;
            }
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
            // Spezial-NPC: Verwende spezielle Antworten
            if (this.activeNPC && this.activeNPC.type === 'spezial') {
                const spezialData = this.activeNPC.spezialData;
                
                // Validiere Spezial-NPC Antworten
                if (!spezialData || !Array.isArray(spezialData.antworten) || spezialData.antworten.length === 0) {
                    console.error('❌ Ungültige Spezial-NPC Antworten:', spezialData);
                    alert("❌ Fehler: Die Antwortoptionen für diesen Spezial-NPC sind ungültig. Der NPC wird entfernt.");
                    this.handleNoQuestionAvailable();
                    return;
                }
                
                spezialData.antworten.forEach((answer, index) => {
                    const answerContainer = document.createElement('div');
                    answerContainer.className = 'answer-container';
                    
                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = 'spezialAnswer';
                    radio.value = answer;
                    radio.id = `spezial_${index}`;
                    radio.className = 'answer-radio';
                    
                    const label = document.createElement('label');
                    label.htmlFor = `spezial_${index}`;
                    label.className = 'answer-button';
                    // Add letter label (A, B, C, D) before answer text
                    const letterLabel = String.fromCharCode(65 + index); // 65 = 'A'
                    label.textContent = `${letterLabel}) ${answer}`;
                    
                    radio.addEventListener('change', () => {
                        document.querySelectorAll('.answer-button').forEach(btn => btn.classList.remove('selected'));
                        label.classList.add('selected');
                        this.selectedSpezialAnswer = answer;
                        document.getElementById('confirmButton').disabled = false;
                    });
                    
                    answerContainer.appendChild(radio);
                    answerContainer.appendChild(label);
                    answerButtons.appendChild(answerContainer);
                });
            } else {
                // Normale Fragen-Behandlung - validiere zuerst die Fragedaten
                if (!this.currentQuestion || !this.currentQuestion.antworten || !Array.isArray(this.currentQuestion.antworten) || this.currentQuestion.antworten.length === 0) {
                    console.error('❌ Ungültige normale Frage-Antworten:', this.currentQuestion);
                    alert("❌ Fehler: Die Antwortoptionen für diese Frage sind ungültig oder nicht vorhanden. Bitte prüfe die Daten.");
                    this.handleNoQuestionAvailable();
                    return;
                }
                
                const isSingleChoice = this.currentQuestion.type === 'single_choice';
                const inputType = isSingleChoice ? 'radio' : 'checkbox';
                const inputClass = isSingleChoice ? 'answer-radio' : 'answer-checkbox';
                
                console.log(`🎯 Fragentyp: ${this.currentQuestion.type} → ${inputType}`);
                
                // Multiple Choice Buttons mit Randomisierung
                const shuffledAnswers = this.shuffleAnswers(this.currentQuestion.antworten);
                
                shuffledAnswers.forEach((answer, displayIndex) => {
                    // Container für Input-Style
                    const answerContainer = document.createElement('div');
                    answerContainer.className = 'answer-container';
                    
                    // Input (Radio oder Checkbox)
                    const input = document.createElement('input');
                    input.type = inputType;
                    input.name = isSingleChoice ? 'answer' : `answer_${displayIndex}`; // Checkboxen brauchen verschiedene Namen
                    input.id = `answer_${displayIndex}`;
                    input.value = answer.originalIndex;
                    input.className = inputClass;
                    
                    // Label für den Input
                    const label = document.createElement('label');
                    label.htmlFor = `answer_${displayIndex}`;
                    label.className = 'answer-button';
                    // Add letter label (A, B, C, D) before answer text
                    const letterLabel = String.fromCharCode(65 + displayIndex); // 65 = 'A'
                    label.textContent = `${letterLabel}) ${answer.text}`;
                    
                    // Click-Handler für beide Elemente
                    const selectHandler = () => this.selectAnswer(answer.originalIndex, isSingleChoice);
                    input.addEventListener('click', selectHandler);
                    label.addEventListener('click', selectHandler);
                    
                    answerContainer.appendChild(input);
                    answerContainer.appendChild(label);
                    answerButtons.appendChild(answerContainer);
                });
            }
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
    
    selectAnswer(answerIndex, isSingleChoice) {
        if (isSingleChoice) {
            // Single-Choice: Wie bisher - nur eine Auswahl möglich
            const labels = document.querySelectorAll('.answer-button');
            const radios = document.querySelectorAll('.answer-radio');
            
            labels.forEach(label => {
                label.classList.remove('selected');
            });
            
            // Setze den entsprechenden Radio Button
            let selectedLabel = null;
            
            radios.forEach(radio => {
                if (parseInt(radio.value) === answerIndex) {
                    radio.checked = true;
                    selectedLabel = document.querySelector(`label[for="${radio.id}"]`);
                } else {
                    radio.checked = false;
                }
            });
            
            // Markiere gewählte Antwort
            if (selectedLabel) {
                selectedLabel.classList.add('selected');
            }
            
            // Speichere Auswahl für Single-Choice
            this.selectedAnswerIndex = answerIndex;
            this.selectedAnswerIndices = [answerIndex]; // Für einheitliche Verarbeitung
            
        } else {
            // Multiple-Choice: Toggle-Verhalten für Checkboxen
            const checkbox = document.querySelector(`input[value="${answerIndex}"].answer-checkbox`);
            const label = document.querySelector(`label[for="${checkbox.id}"]`);
            
            if (checkbox.checked) {
                // Checkbox ist aktiviert - zur Auswahl hinzufügen
                if (!this.selectedAnswerIndices.includes(answerIndex)) {
                    this.selectedAnswerIndices.push(answerIndex);
                }
                label.classList.add('selected');
            } else {
                // Checkbox ist deaktiviert - aus Auswahl entfernen
                this.selectedAnswerIndices = this.selectedAnswerIndices.filter(index => index !== answerIndex);
                label.classList.remove('selected');
            }
            
            console.log(`🔘 Multiple-Choice Auswahl:`, this.selectedAnswerIndices);
        }
        
        // Aktiviere Bestätigungs-Button wenn mindestens eine Antwort ausgewählt
        const confirmButton = document.getElementById('confirmButton');
        confirmButton.disabled = this.selectedAnswerIndices.length === 0;
    }
    
    
    confirmAnswer() {
        if (this.currentQuestionType === 'fill') {
            return this.confirmFillInAnswer();
        }
        
        // Spezial-NPC Antwort-Behandlung
        if (this.activeNPC && this.activeNPC.type === 'spezial') {
            console.log(`🎭 Verarbeite Spezial-NPC Antwort: ${this.activeNPC.spezialData?.name || 'unbekannt'}`);
            return this.confirmSpezialAnswer();
        }
        
        if (this.selectedAnswerIndices.length === 0) return;
        
        const buttons = document.querySelectorAll('.answer-button');
        
        // Erkenne ob Single-Choice oder Multiple-Choice
        const isSingleChoice = this.currentQuestion.type === 'single_choice';
        
        // Bestimme alle korrekten Antworten
        const correctAnswerIndices = this.currentQuestion.antworten
            .map((answer, index) => answer.korrekt ? index : -1)
            .filter(index => index !== -1);
        
        console.log(`🎯 Korrekte Antworten:`, correctAnswerIndices);
        console.log(`🔘 Benutzer-Auswahl:`, this.selectedAnswerIndices);
        
        // Prüfe auf exakte Übereinstimmung
        const isCorrect = this.checkExactMatch(this.selectedAnswerIndices, correctAnswerIndices);
        
        console.log(`✅ Antwort korrekt:`, isCorrect);
        
        // Zeige visuelles Feedback für alle Antworten
        const inputs = document.querySelectorAll('.answer-radio, .answer-checkbox');
        
        buttons.forEach((button, displayIndex) => {
            // Entferne vorherige Feedback-Klassen
            button.classList.remove('correct', 'incorrect', 'selected');
            
            // Ermittle den Original-Index für diesen Button
            const correspondingInput = inputs[displayIndex];
            const originalIndex = correspondingInput ? parseInt(correspondingInput.value) : displayIndex;
            const originalAnswer = this.currentQuestion.antworten[originalIndex];
            
            // Feedback basierend auf Auswahl und Korrektheit
            if (this.selectedAnswerIndices.includes(originalIndex)) {
                // Benutzer hat diese Antwort ausgewählt
                if (originalAnswer && originalAnswer.korrekt) {
                    button.classList.add('correct'); // Richtig ausgewählt
                } else {
                    button.classList.add('incorrect'); // Falsch ausgewählt
                }
            } else if (originalAnswer && originalAnswer.korrekt) {
                // Korrekte Antwort, aber nicht ausgewählt (bei Multiple-Choice)
                if (!isSingleChoice) {
                    button.classList.add('correct'); // Zeige verpasste korrekte Antworten
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
        
        if (isCorrect) {
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
            
            // Show positive feedback
            this.showAnswerFeedback("✅ Richtig! Gut gemacht.", 'success');
            this.createSuccessParticles();
        } else {
            this.playSound('error');
            let successDecrease = 5;
            
            // Apply protection from carpet (only affects success rate decrease)
            if (window.ShopSystem && window.ShopSystem.hasProtection()) {
                successDecrease = Math.max(0, successDecrease - 2);
            }
            
            // Only reduce success rate, keep points unchanged
            this.successRate = Math.max(0, this.successRate - successDecrease);
            
            // Show negative feedback with correct answers
            this.showIncorrectAnswerFeedback();
        }
        
        this.updateUI();
        
        // Check for pony spawn
        if (this.successRate >= 100) {
            this.spawnPony();
        }
        
        // Show explanation immediately after answer feedback
        if (this.currentQuestion.erklaerung) {
            this.showQuestionExplanation(this.currentQuestion.erklaerung);
        } else if (this.currentQuestion.explanation) {
            this.showQuestionExplanation(this.currentQuestion.explanation);
        } else {
            // No explanation available - show continue button anyway for consistency
            this.showQuestionExplanation("Weitere Informationen sind nicht verfügbar.");
        }
        
        // Reset selected answers
        this.selectedAnswerIndex = null;
        this.selectedAnswerIndices = [];
    }
    
    confirmSpezialAnswer() {
        if (!this.selectedSpezialAnswer) return;
        
        // Validiere Spezial-NPC Daten vor Verarbeitung
        if (!this.activeNPC || !this.activeNPC.spezialData) {
            console.error('❌ Kein aktiver Spezial-NPC oder fehlende spezialData');
            alert("❌ Fehler: Spezial-NPC Daten sind nicht verfügbar. Die Antwort kann nicht verarbeitet werden.");
            this.closeQuestion();
            return;
        }
        
        const spezialData = this.activeNPC.spezialData;
        
        // Validiere korrekteAntwort Feld
        if (!spezialData.korrekteAntwort) {
            console.error('❌ Spezial-NPC hat keine korrekteAntwort:', spezialData);
            alert("❌ Fehler: Die korrekte Antwort für diesen Spezial-NPC ist nicht definiert.");
            this.closeQuestion();
            return;
        }
        
        const isCorrect = this.selectedSpezialAnswer.startsWith(spezialData.korrekteAntwort + ':');
        
        // Markiere den Spezial-NPC als verwendet 
        this.usedSpezialNpcs.add(spezialData.id);
        
        // Zeige visuelles Feedback
        const buttons = document.querySelectorAll('.answer-button');
        buttons.forEach(button => {
            button.disabled = true;
            if (button.textContent === this.selectedSpezialAnswer) {
                button.classList.add(isCorrect ? 'correct' : 'incorrect');
            } else if (button.textContent.startsWith(spezialData.korrekteAntwort + ':')) {
                button.classList.add('correct');
            }
        });
        
        // Berechne Punkte und Erfolgsrate
        let pointsEarned = 0;
        let successIncrease = 0;
        
        if (isCorrect) {
            pointsEarned = 2; // Spezial-NPCs geben mehr Punkte
            successIncrease = 15; // Und mehr Erfolgsrate
            this.playSound('success');
            
            // Apply item bonuses
            if (window.ShopSystem) {
                pointsEarned += window.ShopSystem.getPointBonus();
                successIncrease += window.ShopSystem.getSuccessBonus();
            }
            
            this.score += pointsEarned;
            this.successRate = Math.min(100, this.successRate + successIncrease);
            
            // Aktiviere Bonus-Effekt
            this.activateSpezialBonus(spezialData);
            
            this.showAnswerFeedback(`✨ Richtig! ${spezialData.bonus}`, 'success');
            this.createSuccessParticles();
        } else {
            this.playSound('error');
            let successDecrease = 3; // Weniger Strafe bei Spezial-NPCs
            
            if (window.ShopSystem && window.ShopSystem.hasProtection()) {
                successDecrease = Math.max(0, successDecrease - 2);
            }
            
            this.successRate = Math.max(0, this.successRate - successDecrease);
            this.showAnswerFeedback("❌ Nicht ganz richtig. Versuchen Sie es beim nächsten Mal!", 'error');
        }
        
        this.updateUI();
        
        // Zeige Erklärung sofort
        this.showQuestionExplanation(spezialData.erklaerung || "Weitere Informationen sind nicht verfügbar.");
        
        // Reset für nächste Frage
        this.selectedSpezialAnswer = null;
    }
    
    activateSpezialBonus(spezialData) {
        // Validiere spezialData vor Bonus-Aktivierung
        if (!spezialData || !spezialData.id || !spezialData.bonus) {
            console.error('❌ Ungültige spezialData für Bonus-Aktivierung:', spezialData);
            return; // Beende stillschweigend, da Bonus optional ist
        }
        
        const bonusId = `bonus_${spezialData.id}`;
        this.activeBonusEffects.set(bonusId, {
            type: spezialData.name || 'Unbekannter NPC',
            effect: spezialData.bonus,
            activated: Date.now()
        });
        
        console.log(`✨ Bonus aktiviert: ${spezialData.bonus}`);
        
        // Spezielle Bonus-Effekte implementieren
        switch (spezialData.id) {
            case 1001: // Einstein - +10% Erfolgsanzeige
                this.successRate = Math.min(100, this.successRate + 10);
                break;
            case 1003: // Tesla - +5 Punkte
                this.score += 5;
                break;
            case 1008: // Simone Giertz - +5% Erfolgsanzeige
                this.successRate = Math.min(100, this.successRate + 5);
                break;
            // Weitere Bonus-Effekte können hier implementiert werden
        }
        
        this.updateUI();
    }
    
    // Hilfsmethode für exakte Übereinstimmung
    checkExactMatch(selected, correct) {
        if (selected.length !== correct.length) {
            return false;
        }
        
        // Sortiere beide Arrays für Vergleich
        const sortedSelected = [...selected].sort((a, b) => a - b);
        const sortedCorrect = [...correct].sort((a, b) => a - b);
        
        return sortedSelected.every((val, index) => val === sortedCorrect[index]);
    }
    
    // Show general answer feedback
    showAnswerFeedback(message, type = 'info') {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            background: ${type === 'success' ? 'linear-gradient(145deg, #27AE60, #2ECC71)' : 
                         type === 'error' ? 'linear-gradient(145deg, #E74C3C, #EC7063)' : 
                         'linear-gradient(145deg, #3498DB, #5DADE2)'};
            color: white;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            font-size: 16px;
            z-index: 1500;
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            border: 3px solid ${type === 'success' ? '#229954' : 
                               type === 'error' ? '#C0392B' : '#2980B9'};
            animation: slideDown 0.3s ease-out;
        `;
        
        feedbackDiv.textContent = message;
        document.body.appendChild(feedbackDiv);
        
        // Add animation styles if not already present
        if (!document.getElementById('feedbackStyles')) {
            const style = document.createElement('style');
            style.id = 'feedbackStyles';
            style.textContent = `
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove after delay
        setTimeout(() => {
            if (feedbackDiv.parentNode) {
                feedbackDiv.style.animation = 'slideDown 0.3s ease-out reverse';
                setTimeout(() => {
                    if (feedbackDiv.parentNode) {
                        feedbackDiv.parentNode.removeChild(feedbackDiv);
                    }
                }, 300);
            }
        }, 2500);
    }
    
    // Show detailed feedback for incorrect answers
    showIncorrectAnswerFeedback() {
        // Get correct answer texts
        const correctTexts = [];
        const correctAnswerIndices = this.currentQuestion.antworten
            .map((answer, index) => answer.korrekt ? index : -1)
            .filter(index => index !== -1);
            
        correctAnswerIndices.forEach(index => {
            const answer = this.currentQuestion.antworten[index];
            if (answer && answer.text) {
                correctTexts.push(answer.text);
            }
        });
        
        const correctAnswersText = correctTexts.length > 0 ? 
            correctTexts.join(', ') : 'Unbekannt';
        
        const message = `❌ Leider falsch. Die richtige Antwort wäre gewesen: ${correctAnswersText}`;
        this.showAnswerFeedback(message, 'error');
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
            this.showQuestionExplanation(this.currentQuestion.explanation);
        } else {
            // No explanation available - show continue button anyway for consistency
            this.showQuestionExplanation("Weitere Informationen sind nicht verfügbar.");
        }
        
        // Reset selected answers
        this.selectedAnswerIndex = null;
        this.selectedAnswerIndices = [];
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
        this.selectedAnswerIndices = [];
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
        // Animated Score Counter
        this.animateNumber(this.scoreElement, parseInt(this.scoreElement.textContent) || 0, this.score);
        
        // Animated Success Rate with milestone chimes
        const currentSuccess = parseInt(this.successText.textContent) || 0;
        const targetSuccess = Math.round(this.successRate);
        this.animateNumber(this.successText, currentSuccess, targetSuccess, '%');
        
        // Check for success rate milestones
        this.checkSuccessMilestones(currentSuccess, targetSuccess);
        
        // Smooth Success Bar
        this.successBar.style.width = `${this.successRate}%`;
        
        // Pulse effect on changes
        if (parseInt(this.scoreElement.textContent) !== this.score) {
            this.pulseElement(this.scoreElement.parentElement);
        }
        
        // Update Frage-annehmen Button
        this.updateAcceptQuestionButton();
    }
    
    checkSuccessMilestones(oldRate, newRate) {
        const milestones = [25, 50, 75, 100];
        
        milestones.forEach(milestone => {
            if (oldRate < milestone && newRate >= milestone) {
                // Play milestone chime
                this.playSound('chime');
                // Add visual celebration
                this.celebrateMilestone(milestone);
            }
        });
    }
    
    celebrateMilestone(milestone) {
        // Brief glow effect on success meter
        const successMeter = document.getElementById('successMeter');
        successMeter.style.animation = 'milestoneGlow 0.8s ease-out';
        
        setTimeout(() => {
            successMeter.style.animation = '';
        }, 800);
        
        // Show milestone message
        this.showAnswerFeedback(`🎉 ${milestone}% Erfolgsrate erreicht!`, 'success');
    }
    
    animateNumber(element, from, to, suffix = '') {
        if (from === to) return;
        
        const duration = 800;
        const steps = 30;
        const stepValue = (to - from) / steps;
        const stepTime = duration / steps;
        let current = from;
        let step = 0;
        
        const animate = () => {
            step++;
            current += stepValue;
            
            if (step >= steps) {
                element.textContent = to + suffix;
                return;
            }
            
            element.textContent = Math.round(current) + suffix;
            setTimeout(animate, stepTime);
        };
        
        animate();
    }
    
    pulseElement(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'scorePulse 0.6s ease-out';
        }, 10);
    }
    
    createSuccessParticles() {
        // Simple DOM-based particles for success feedback
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                top: 20%;
                left: 50%;
                width: 8px;
                height: 8px;
                background: linear-gradient(45deg, #FFD700, #FFA500);
                border-radius: 50%;
                pointer-events: none;
                z-index: 2000;
                animation: particleExplosion 1.2s ease-out forwards;
                transform: translate(-50%, -50%);
            `;
            
            // Random direction and distance
            const angle = (i / 8) * Math.PI * 2;
            const distance = 60 + Math.random() * 40;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            particle.style.setProperty('--endX', endX + 'px');
            particle.style.setProperty('--endY', endY + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1200);
        }
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
        
        // Also update dismiss button when accept button updates
        this.updateDismissButton();
    }
    
    updateDismissButton() {
        if (!this.dismissNPCButton) {
            console.error('❌ dismissNPCButton nicht gefunden!');
            return;
        }
        
        if (this.activeNPC && this.gameState === 'playing') {
            // Button anzeigen und aktivieren wann immer ein NPC aktiv ist
            this.dismissNPCButton.classList.remove('hidden');
            this.dismissNPCButton.disabled = false;
        } else {
            // Button verstecken wenn kein NPC aktiv
            this.dismissNPCButton.classList.add('hidden');
            this.dismissNPCButton.disabled = true;
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
        
        // Boden-Schatten unter dem Stall für bessere räumliche Tiefe
        this.drawPixelRect(stall.x + 5, stall.y + stall.height + 2, stall.width - 5, 8, '#4A4A4A');
        this.drawPixelRect(stall.x + 8, stall.y + stall.height + 6, stall.width - 10, 4, '#666666');
        
        // Schatten-Effekt für 3D-Tiefe
        this.drawPixelRect(stall.x + 3, stall.y + 3, stall.width, stall.height, '#654321');
        
        // Stall-Hintergrund (Heu-Boden) - mehrschichtig für bessere Textur
        this.drawPixelRect(stall.x, stall.y, stall.width, stall.height, '#DAA520');
        this.drawPixelRect(stall.x + 2, stall.y + 2, stall.width - 4, stall.height - 4, '#F4A460');
        this.drawPixelRect(stall.x + 4, stall.y + 4, stall.width - 8, stall.height - 8, '#DEB887');
        
        // Verbesserte Heu-Textur (realistische Strohhalme)
        this.ctx.fillStyle = '#CD853F';
        for (let i = 0; i < 30; i++) {
            const x = stall.x + 6 + Math.random() * (stall.width - 12);
            const y = stall.y + 6 + Math.random() * (stall.height - 12);
            const length = 2 + Math.random() * 4;
            this.drawPixelRect(Math.floor(x), Math.floor(y), Math.floor(length), 1, '#CD853F');
            // Zusätzliche kleine Strohstücke
            if (Math.random() > 0.7) {
                this.drawPixelRect(Math.floor(x + 1), Math.floor(y + 1), 1, 1, '#B8860B');
            }
        }
        
        // Professioneller Holzzaun mit Details
        // Hauptbalken (dicker und detaillierter)
        this.drawPixelRect(stall.x, stall.y, stall.width, 6, '#8B4513');
        this.drawPixelRect(stall.x, stall.y + stall.height - 6, stall.width, 6, '#8B4513');
        this.drawPixelRect(stall.x, stall.y, 6, stall.height, '#8B4513');
        this.drawPixelRect(stall.x + stall.width - 6, stall.y, 6, stall.height, '#8B4513');
        
        // Holz-Details und Maserung
        this.drawPixelRect(stall.x + 1, stall.y + 1, stall.width - 2, 2, '#A0522D');
        this.drawPixelRect(stall.x + 1, stall.y + stall.height - 3, stall.width - 2, 2, '#A0522D');
        
        // Verbesserte vertikale Zaunlatten mit Schatten
        for (let i = 0; i < 6; i++) {
            const x = stall.x + 15 + i * 25;
            // Hauptlatte
            this.drawPixelRect(x, stall.y, 4, stall.height, '#A0522D');
            // Schatten-Effekt
            this.drawPixelRect(x + 4, stall.y + 1, 1, stall.height - 1, '#654321');
            // Licht-Reflex
            this.drawPixelRect(x, stall.y, 1, stall.height, '#D2691E');
        }
        
        // Professionelles Holzschild statt einfacher Text
        this.drawStallSign();
        
        // Verbesserter Pony-Zähler
        const ponyCount = window.PonySystem ? window.PonySystem.caughtPonies.length : 0;
        this.drawStallCounter(ponyCount);
        
        // Eingangsluke/Tor-Detail
        const gateX = stall.x + stall.width - 40;
        this.drawPixelRect(gateX, stall.y + 10, 35, stall.height - 20, '#8B4513');
        this.drawPixelRect(gateX + 2, stall.y + 12, 31, stall.height - 24, '#A0522D');
        // Tor-Griff
        this.drawPixelRect(gateX + 5, stall.y + stall.height / 2 - 2, 6, 4, '#4A4A4A');
        
        // Draw ponies in stall
        this.drawPoniesInStall();
        
        // Einfaches Hover-Info-System
        this.drawStallHoverInfo();
    }
    
    drawStallSign() {
        const stall = this.stall;
        const signX = stall.x + 5;
        const signY = stall.y - 25;
        const signWidth = 80;
        const signHeight = 18;
        
        // Holzschild-Hintergrund mit Schatten
        this.drawPixelRect(signX + 2, signY + 2, signWidth, signHeight, '#654321');
        this.drawPixelRect(signX, signY, signWidth, signHeight, '#DEB887');
        this.drawPixelRect(signX + 1, signY + 1, signWidth - 2, signHeight - 2, '#F5DEB3');
        
        // Schild-Umrandung
        this.drawPixelRect(signX, signY, signWidth, 2, '#8B4513');
        this.drawPixelRect(signX, signY + signHeight - 2, signWidth, 2, '#8B4513');
        this.drawPixelRect(signX, signY, 2, signHeight, '#8B4513');
        this.drawPixelRect(signX + signWidth - 2, signY, 2, signHeight, '#8B4513');
        
        // Schild-Text
        this.ctx.fillStyle = '#654321';
        this.ctx.font = 'bold 11px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🐴 PONY STALL', signX + signWidth/2, signY + 12);
        this.ctx.textAlign = 'left';
    }
    
    drawStallCounter(ponyCount) {
        const stall = this.stall;
        const counterX = stall.x + stall.width - 80;
        const counterY = stall.y + stall.height + 8;
        
        // Counter-Hintergrund
        this.drawPixelRect(counterX, counterY, 75, 16, '#2C3E50');
        this.drawPixelRect(counterX + 1, counterY + 1, 73, 14, '#34495E');
        
        // Counter-Text
        this.ctx.fillStyle = '#ECF0F1';
        this.ctx.font = 'bold 10px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Ponies: ${ponyCount}`, counterX + 37, counterY + 11);
        this.ctx.textAlign = 'left';
    }
    
    drawStallHoverInfo() {
        // Einfaches Info-Panel rechts neben dem Stall
        const stall = this.stall;
        const ponyCount = window.PonySystem ? window.PonySystem.caughtPonies.length : 0;
        
        if (ponyCount > 0) {
            const infoX = stall.x + stall.width + 10;
            const infoY = stall.y + 20;
            const infoWidth = 120;
            const infoHeight = 60;
            
            // Info-Panel Hintergrund
            this.drawPixelRect(infoX + 2, infoY + 2, infoWidth, infoHeight, '#34495E');
            this.drawPixelRect(infoX, infoY, infoWidth, infoHeight, '#ECF0F1');
            this.drawPixelRect(infoX + 1, infoY + 1, infoWidth - 2, infoHeight - 2, '#BDC3C7');
            
            // Info-Text
            this.ctx.fillStyle = '#2C3E50';
            this.ctx.font = 'bold 9px "Courier New", monospace';
            this.ctx.fillText('🏠 Pony-Stall Info:', infoX + 5, infoY + 12);
            this.ctx.font = '8px "Courier New", monospace';
            this.ctx.fillText(`Bewohner: ${ponyCount}`, infoX + 5, infoY + 25);
            this.ctx.fillText('Status: Gemütlich', infoX + 5, infoY + 35);
            this.ctx.fillText('Klicke zum Besuchen!', infoX + 5, infoY + 50);
        }
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
    
    draw16BitNPC(x, y, npcType, frame = 0, specialNpcData = null) {
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
            },
            forgetful_dev: {
                colors: { shirt: '#4CAF50', pants: '#2196F3', hair: '#FF9800' },
                accessories: ['glasses', 'messy_hair', 'tired_eyes']
            },
            confused_manager: {
                colors: { shirt: '#9C27B0', pants: '#795548', hair: '#607D8B' },
                accessories: ['briefcase', 'messy_hair', 'confused_look']
            },
            sleepy_intern: {
                colors: { shirt: '#FF5722', pants: '#9E9E9E', hair: '#FFC107' },
                accessories: ['notebook', 'yawning', 'sleepy_eyes']
            },
            distracted_client: {
                colors: { shirt: '#3F51B5', pants: '#424242', hair: '#8BC34A' },
                accessories: ['tie', 'distracted_look', 'head_scratch']
            },
            coffee_addict: {
                colors: { shirt: '#8B4513', pants: '#424242', hair: '#5D4037' },
                accessories: ['coffee_cup', 'jittery', 'coffee_stains']
            }
        };
        
        const type = types[npcType] || types.developer;
        
        // Handle special NPCs (forgetful types)
        if (specialNpcData && specialNpcData.id >= 2001 && specialNpcData.id <= 2005) {
            // Override type for forgetful special NPCs based on their ID
            const forgetfulTypes = {
                2001: 'tired_doctor', // Dr. Müdmann
                2002: 'scattered_emma', // Emma Schusselig  
                2003: 'coffee_ben', // Ben Koffeinjunkie
                2004: 'forgetful_lisa', // Lisa Gedächtnislücke
                2005: 'sleepy_max' // Max Brainfog
            };
            
            const forgetfulType = forgetfulTypes[specialNpcData.id];
            if (forgetfulType) {
                // Add forgetful styling based on NPC type
                switch (forgetfulType) {
                    case 'tired_doctor':
                        type.accessories = [...(type.accessories || []), 'tired_eyes', 'messy_hair', 'coffee_cup'];
                        break;
                    case 'scattered_emma':
                        type.accessories = [...(type.accessories || []), 'confused_look', 'messy_hair', 'head_scratch'];
                        break;
                    case 'coffee_ben':
                        type.accessories = [...(type.accessories || []), 'coffee_cup', 'jittery', 'coffee_stains'];
                        break;
                    case 'forgetful_lisa':
                        type.accessories = [...(type.accessories || []), 'confused_look', 'head_scratch', 'tired_eyes'];
                        break;
                    case 'sleepy_max':
                        type.accessories = [...(type.accessories || []), 'sleepy_eyes', 'yawning', 'messy_hair'];
                        break;
                }
            }
        }
        
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
        
        // Forgetful NPC Special Accessories
        if (type.accessories.includes('messy_hair')) {
            // Zerzauste Haare - unordentliche Strähnen
            this.drawPixelRect(x + 4, y - 3, 2, 2, type.colors.hair);
            this.drawPixelRect(x + 26, y - 2, 2, 3, type.colors.hair);
            this.drawPixelRect(x + 8, y - 4, 3, 2, type.colors.hair);
            this.drawPixelRect(x + 20, y - 3, 2, 2, type.colors.hair);
        }
        
        if (type.accessories.includes('tired_eyes')) {
            // Müde, halb geschlossene Augen
            this.drawPixelRect(x + 10, y + 4, 2, 3, '#000000');
            this.drawPixelRect(x + 18, y + 4, 2, 3, '#000000');
            // Augenringe
            this.drawPixelRect(x + 9, y + 7, 4, 1, '#8E8E8E');
            this.drawPixelRect(x + 17, y + 7, 4, 1, '#8E8E8E');
        }
        
        if (type.accessories.includes('sleepy_eyes')) {
            // Ganz müde Augen (fast zu)
            this.drawPixelRect(x + 10, y + 5, 2, 1, '#000000');
            this.drawPixelRect(x + 18, y + 5, 2, 1, '#000000');
            // Starke Augenringe
            this.drawPixelRect(x + 9, y + 6, 4, 2, '#666666');
            this.drawPixelRect(x + 17, y + 6, 4, 2, '#666666');
        }
        
        if (type.accessories.includes('yawning')) {
            // Gähnender Mund (animiert)
            const yawnSize = Math.abs(Math.sin(frame * 0.3)) * 2 + 1;
            this.drawPixelRect(x + 14, y + 10, 4, Math.floor(yawnSize), '#000000');
        }
        
        if (type.accessories.includes('coffee_cup')) {
            // Kaffeetasse in der Hand
            this.drawPixelRect(x - 4, y + 24, 4, 6, '#8B4513'); // Tasse
            this.drawPixelRect(x - 3, y + 24, 2, 2, '#3E2723'); // Kaffee
            this.drawPixelRect(x - 1, y + 26, 1, 2, '#8B4513'); // Henkel
            // Dampf (animiert)
            const steamOffset = Math.sin(frame * 0.2) * 1;
            this.drawPixelRect(x - 2, y + 20 + steamOffset, 1, 2, '#E0E0E0');
            this.drawPixelRect(x - 1, y + 18 - steamOffset, 1, 2, '#E0E0E0');
        }
        
        if (type.accessories.includes('jittery')) {
            // Zitternde Bewegung für Koffeinsüchtigen
            const jitter = Math.sin(frame * 0.8) * 1;
            // Verschiebt den ganzen NPC leicht
            x += jitter;
        }
        
        if (type.accessories.includes('coffee_stains')) {
            // Kaffeeflecken auf dem Hemd
            this.drawPixelRect(x + 8, y + 20, 2, 2, '#3E2723');
            this.drawPixelRect(x + 16, y + 25, 3, 2, '#3E2723');
            this.drawPixelRect(x + 12, y + 30, 2, 1, '#3E2723');
        }
        
        if (type.accessories.includes('confused_look')) {
            // Verwirrter Blick - schräge Augenbrauen
            this.drawPixelRect(x + 9, y + 3, 3, 1, '#000000'); // Linke Braue
            this.drawPixelRect(x + 18, y + 2, 3, 1, '#000000'); // Rechte Braue höher
        }
        
        if (type.accessories.includes('distracted_look')) {
            // Abgelenkter Blick - Augen schauen zur Seite
            this.drawPixelRect(x + 9, y + 5, 2, 2, '#000000'); // Linkes Auge nach links
            this.drawPixelRect(x + 17, y + 5, 2, 2, '#000000'); // Rechtes Auge nach links
        }
        
        if (type.accessories.includes('head_scratch')) {
            // Kratzende Hand am Kopf
            const scratchOffset = Math.sin(frame * 0.4) * 2;
            this.drawPixelRect(x + 28, y + 8 + scratchOffset, 4, 2, '#FDBCB4'); // Hand
            this.drawPixelRect(x + 30, y + 6 + scratchOffset, 2, 4, '#FDBCB4'); // Finger
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
                // Check if this is a special NPC and pass special data
                const specialNpcData = npc.type === 'spezial' ? npc.spezialData : null;
                this.draw16BitNPC(npc.x, npc.y, npc.type, Date.now() + index * 1000, specialNpcData);
                
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
        
        // Draw canvas animations (dust, LED, plant sway)
        this.drawCanvasAnimations();
        
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
        
        // Update canvas animations
        this.updateCanvasAnimations(deltaTime);
        
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start game when page loads
window.addEventListener('load', () => {
    console.log('Window loaded, erstelle Game...');
    try {
        window.game = new Game();
        console.log('Game erfolgreich erstellt:', window.game);
        console.log('Game State:', window.game.gameState);
    } catch(error) {
        console.error('Fehler beim Erstellen des Games:', error);
        console.error('Stack trace:', error.stack);
    }
});