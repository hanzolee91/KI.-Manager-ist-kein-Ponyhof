// Shop System for KI-Manager Game
class ShopSystem {
    constructor() {
        this.isOpen = false;
        this.currentTab = 'powerups';
        
        this.powerUps = [
            {
                id: 'tip',
                name: 'KI-Wahrsager 3000',
                description: 'Blendet 1 falsche Antwort aus. Warnung: Hat einen Hang zu Verschwörungstheorien und behauptet, die Wahrheit sei da draußen!',
                price: 5,
                icon: '💡'
            },
            {
                id: 'skip',
                name: 'Ausreden-Generator Ultra',
                description: 'Überspringt Fragen mit kreativen Ausreden wie "Mein Hamster hat die Antwort gefressen" oder "Quantencomputer sind heute rebellisch"',
                price: 3,
                icon: '⏭️'
            },
            {
                id: 'double',
                name: 'Turbo-Klugscheißer™',
                description: 'Verdoppelt Punkte, macht aber 50% arroganter. Nebenwirkung: Unkontrollierbares Angeben und "Eigentlich wusste ich das schon"-Syndrom',
                price: 10,
                icon: '⚡'
            },
            {
                id: 'slowmo',
                name: 'Zen-Master 2.0',
                description: 'Verlangsamt alles auf Schneckentempo. Perfekt für Leute, die beim Fast Food ungeduldig werden und Meditation brauchen',
                price: 8,
                icon: '🐌'
            },
            {
                id: 'quantum_hint',
                name: 'Quanten-Orakel 5000',
                description: 'Zeigt gleichzeitig alle möglichen Antworten in parallelen Realitäten. Verwirrend, aber hilfreich!',
                price: 12,
                icon: '🔮'
            },
            {
                id: 'ai_assistant',
                name: 'Mini-KI-Sidekick',
                description: 'Kleiner AI-Helfer der manchmal richtig liegt. Hat eine 50:50 Chance zwischen Genie und Wahnsinn!',
                price: 15,
                icon: '🤖'
            },
            {
                id: 'time_freeze',
                name: 'Zeitanhalter-Matrix',
                description: 'Stoppt die Zeit für alle außer dir. Neo wäre neidisch! Leider nur 10 Sekunden.',
                price: 20,
                icon: '⏸️'
            },
            {
                id: 'lucky_charm',
                name: 'Glücksbringer des Universums',
                description: 'Erhöht deine Glücks-Wahrscheinlichkeit. Auch bekannt als "Hoffnung in Item-Form".',
                price: 6,
                icon: '🍀'
            },
            {
                id: 'brain_booster',
                name: 'Gehirn-Turbo-Loader',
                description: 'Lädt dein Gehirn wie einen Laptop! Achtung: Kann zu spontanem Klugscheißer-Verhalten führen.',
                price: 18,
                icon: '🧠'
            },
            {
                id: 'chaos_mode',
                name: 'Chaos-Würfel des Wahnsinns',
                description: 'Aktiviert zufällige Effekte! Von super hilfreich bis völlig verrückt. Russisches Roulette für Fragen!',
                price: 9,
                icon: '🎲'
            }
        ];
        
        this.officeItems = [
            {
                id: 'desk',
                name: 'Executive Ego-Booster 5000',
                description: '+1 Punkt pro Antwort. Aus 90% recyceltem Chefgehabe und 10% echtem Holz gefertigt. Mit integriertem Selbstbewusstsein-Verstärker!',
                price: 10,
                icon: '🏢',
                effect: 'pointBonus',
                value: 1
            },
            {
                id: 'plant',
                name: 'Pseudo-Therapeutische Grünpflanze',
                description: 'Tut so, als würde sie zuhören. Wird manchmal passiv-aggressiv und lässt demonstrativ Blätter fallen wenn ignoriert',
                price: 5,
                icon: '🌱',
                effect: 'mood',
                value: 1
            },
            {
                id: 'monitor',
                name: 'Orakel-O-Vision™ Display',
                description: 'Hebt wichtige Wörter hervor. Manchmal auch völlig unwichtige, weil es sich langweilt und Aufmerksamkeit braucht',
                price: 20,
                icon: '🖥️',
                effect: 'highlight',
                value: 1
            },
            {
                id: 'coffee',
                name: 'Koffein-Katapult Deluxe',
                description: 'Beschleunigt alles! Achtung: Kann zu unkontrolliertem Augenzucken, Kaffeenentzug-Panik und spontanem Koffein-Tourette führen',
                price: 8,
                icon: '☕',
                effect: 'speed',
                value: 1
            },
            {
                id: 'butler',
                name: 'Sir Hilfreich McHologramm',
                description: 'Britischer Butler mit 200 Jahren Erfahrung (davon 199 als Pixel). Sehr eingebildet und korrigiert ständig Ihre Grammatik',
                price: 30,
                icon: '🤖',
                effect: 'tips',
                value: 1
            },
            {
                id: 'lasso',
                name: 'Anti-Pony Lasso der Vernunft',
                description: 'Fängt entlaufene Ponys und unrealistische Management-Träume. Warnung: Wirkt nicht bei Einhörnern oder Venture-Capital-Fantasien',
                price: 12,
                icon: '🪢',
                effect: 'ponyCapture',
                value: 1
            },
            {
                id: 'carpet',
                name: 'Weich-Fall-Wunder-Teppich',
                description: 'Dämpft den Schmerz schlechter Entscheidungen und Punktverluste. Leider nicht waschbar und riecht nach gebrochenen Träumen',
                price: 6,
                icon: '🏠',
                effect: 'protection',
                value: 1
            },
            {
                id: 'poster',
                name: 'Motivations-Lügen-Plakat',
                description: '+1% Erfolg. Zeigt hängende Katze mit "Hang in there!". Ironisch gemeint... oder etwa nicht? Niemand weiß es genau',
                price: 3,
                icon: '🖼️',
                effect: 'successBonus',
                value: 1
            },
            {
                id: 'whiteboard',
                name: 'Gedächtnis-Prothese Whiteboard Pro',
                description: 'Merkt sich Fragen, die Sie längst vergessen haben. Hat ein besseres Gedächtnis als Sie und ist stolz darauf',
                price: 9,
                icon: '📋',
                effect: 'memory',
                value: 1
            },
            {
                id: 'carrot',
                name: 'Premium Pony-Karotte Gold',
                description: 'Verlockende Karotte die Ponys unwiderstehlich finden. Essbar für Ponys, nicht für Manager (Nebenwirkungen: Orange Zähne)',
                price: 15,
                icon: '🥕',
                effect: 'ponyAttraction',
                value: 1,
                consumable: true
            },
            {
                id: 'coffee',
                name: 'Turbo-Koffein Gedächtnishilfe',
                description: 'Hilft übermüdeten Mitarbeitern beim Erinnern! Lässt 2 Begriffe einfallen - einen richtigen, einen falschen. Nebenwirkung: Zittern',
                price: 8,
                icon: '☕',
                effect: 'memoryBoost',
                value: 1,
                consumable: true
            },
            {
                id: 'fusion_core',
                name: 'Quantenenergie-Kristall',
                description: 'Seltener Kristall aus einer anderen Dimension. Benötigt für erweiterte Fusionen. Nur für wahre KI-Meister!',
                price: 100,
                icon: '💎',
                effect: 'fusionCore',
                value: 1,
                rare: true,
                unlockRequirement: 500 // Benötigt 500 Punkte zum Freischalten
            },
            {
                id: 'fusion_reactor',
                name: '🔬 Experimenteller Fusionsreaktor MK-VII',
                description: 'Extrem seltener Prototyp! Ermöglicht die Fusion aller Items! Warnung: Kann spontan lustige Geräusche machen und Kaffee produzieren',
                price: 999,
                icon: '⚛️',
                effect: 'fusionReactor',
                value: 1,
                legendary: true,
                unlockRequirement: 1000, // Benötigt 1000 Punkte
                specialRequirement: 'fusion_core' // Benötigt Kristall im Inventar
            },
            {
                id: 'mystery_box',
                name: '📦 Mysteriöse Überraschungsbox',
                description: 'Was ist drin? Niemand weiß es! Könnte alles sein - von nutzlos bis legendär! Nur für Mutige!',
                price: 25,
                icon: '📦',
                effect: 'mysteryBox',
                value: 1,
                consumable: true,
                surprise: true
            },
            {
                id: 'rubber_duck',
                name: '🦆 Debugging-Ente der Weisheit',
                description: 'Die klassische Gummi-Ente! Wenn du ihr deine Probleme erzählst, lösen sie sich wie von Zauberhand. Quakt manchmal zurück.',
                price: 7,
                icon: '🦆',
                effect: 'debugDuck',
                value: 1,
                funnyItem: true
            },
            {
                id: 'quantum_pretzel',
                name: '🥨 Quanten-Brezel des Verstehens',
                description: 'Diese Brezel existiert in mehreren Dimensionen gleichzeitig. Macht dich klüger oder hungriger - manchmal beides!',
                price: 13,
                icon: '🥨',
                effect: 'quantumSnack',
                value: 1,
                weirdItem: true
            },
            {
                id: 'procrastination_shield',
                name: '🛡️ Anti-Prokrastinations-Schild',
                description: 'Schützt vor dem Drang, "später" zu sagen. Sehr effektiv gegen spontane YouTube-Sessions!',
                price: 18,
                icon: '🛡️',
                effect: 'focusShield',
                value: 1
            },
            {
                id: 'stress_ball',
                name: '⚽ Stress-Ball 3000',
                description: 'Beruhigt dich bei falschen Antworten. Hergestellt aus 100% recycelten Manager-Tränen.',
                price: 4,
                icon: '⚽',
                effect: 'stressRelief',
                value: 1
            },
            {
                id: 'demotivational_poster',
                name: '😑 Demotivational Poster',
                description: '"Fehler: Es könnte sein, dass dein Versagen anderen als Warnung dient." Ironisch motivierend!',
                price: 6,
                icon: '🖼️',
                effect: 'ironicMotivation',
                value: 1
            },
            {
                id: 'crystal_ball',
                name: '🔮 KI-Kristallkugel',
                description: 'Zeigt Wahrscheinlichkeiten für richtige Antworten. Manchmal liegt sie falsch, aber wer ist schon perfekt?',
                price: 22,
                icon: '🔮',
                effect: 'probability',
                value: 1
            },
            {
                id: 'memory_eraser',
                name: '💾 Whiteboard des Vergessens',
                description: 'Löscht schlechte Antworten aus der Historie. Funktioniert leider nicht bei echten Erinnerungen.',
                price: 16,
                icon: '📝',
                effect: 'forgetfulness',
                value: 1
            },
            {
                id: 'chaos_fan',
                name: '🌪️ Ventilator der Verwirrung',
                description: 'Wirbelt Antworten durcheinander für extra Challenge! Für Masochisten und Langweiler.',
                price: 11,
                icon: '🌪️',
                effect: 'chaosMode',
                value: 1
            },
            {
                id: 'golden_cactus',
                name: '🌵 Goldener Kaktus der Perfektion',
                description: 'Ultimatives Prestigeobjekt! Zeigt allen, dass du 1000+ Punkte erreicht hast. Sticht aber trotzdem.',
                price: 500,
                icon: '🌵',
                effect: 'prestige',
                value: 1,
                unlockRequirement: 1000
            },
            {
                id: 'ai_core',
                name: '💻 Experimenteller KI-Kern',
                description: 'Kernstück einer echten KI! Verleiht mysteriöse Kräfte und glüht im Dunkeln.',
                price: 200,
                icon: '💻',
                effect: 'aiCore',
                value: 1,
                unlockRequirement: 750
            },
            {
                id: 'meta_device',
                name: '📱 Meta-Realitäts-Gerät',
                description: 'Öffnet Portale zu anderen Spiel-Dimensionen. Nebenwirkung: Existenzielle Krisen.',
                price: 150,
                icon: '📱',
                effect: 'metaReality',
                value: 1,
                unlockRequirement: 600
            },
            {
                id: 'time_crystal',
                name: '⏰ Zeit-Kristall des Chronos',
                description: 'Manipuliert die Zeit selbst! Zeigt vergangene und zukünftige Antworten. Sehr verwirrend.',
                price: 300,
                icon: '⏰',
                effect: 'timeManipulation',
                value: 1,
                unlockRequirement: 800
            },
            {
                id: 'neural_interface',
                name: '🧠 Neurales Interface v2.0',
                description: 'Direkter Anschluss an dein Gehirn! Erhöht IQ um 50 Punkte oder verursacht Kopfschmerzen.',
                price: 180,
                icon: '🧠',
                effect: 'neuralBoost',
                value: 1,
                unlockRequirement: 650
            }
        ];
        
        this.ownedItems = new Set();
        this.activePowerUps = new Set();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Close shop - Event-Listener wird jetzt dynamisch in renderShop() gesetzt
        
        // Close on background click
        document.getElementById('shopDialog').addEventListener('click', (e) => {
            if (e.target === document.getElementById('shopDialog')) {
                this.close();
            }
        });
    }
    
    open() {
        this.isOpen = true;
        this.renderShop();
        document.getElementById('shopDialog').classList.remove('hidden');
        window.game.gameState = 'shop';
    }
    
    close() {
        this.isOpen = false;
        document.getElementById('shopDialog').classList.add('hidden');
        window.game.gameState = 'playing';
    }
    
    switchTab(tab) {
        this.currentTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        this.renderShop();
    }
    
    renderShop() {
        const shopItems = document.getElementById('shopItems');
        shopItems.innerHTML = '';
        
        // Show loading skeletons first
        this.showLoadingSkeletons(shopItems);
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            shopItems.innerHTML = '';
            
            const items = this.currentTab === 'powerups' ? this.powerUps : this.officeItems;
            
            items.forEach((item, index) => {
                const itemElement = this.createItemElement(item);
                itemElement.style.opacity = '0';
                itemElement.style.animation = `fadeInItem 0.3s ease-out forwards`;
                itemElement.style.animationDelay = `${index * 0.05}s`;
                shopItems.appendChild(itemElement);
            });
            
            // Schließen-Button nach allen Items hinzufügen
            const closeButton = document.createElement('button');
            closeButton.id = 'closeShop';
            closeButton.textContent = 'Schließen';
            closeButton.style.opacity = '0';
            closeButton.style.animation = `fadeInItem 0.3s ease-out forwards`;
            closeButton.style.animationDelay = `${items.length * 0.05 + 0.2}s`;
            closeButton.addEventListener('click', () => {
                this.close();
            });
            shopItems.appendChild(closeButton);
        }, 400);
    }
    
    showLoadingSkeletons(container) {
        const skeletonCount = this.currentTab === 'powerups' ? this.powerUps.length : this.officeItems.length;
        
        for (let i = 0; i < Math.min(skeletonCount, 8); i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'shop-skeleton';
            skeleton.innerHTML = `
                <div class="skeleton-content">
                    <div class="skeleton-icon"></div>
                    <div class="skeleton-text">
                        <div class="skeleton-line skeleton-title"></div>
                        <div class="skeleton-line skeleton-desc"></div>
                    </div>
                    <div class="skeleton-button"></div>
                </div>
            `;
            container.appendChild(skeleton);
        }
    }
    
    createItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';
        
        const canAfford = window.game.score >= item.price;
        const alreadyOwned = this.ownedItems.has(item.id);
        const isUnlocked = this.isItemUnlocked(item);
        const hasSpecialRequirement = this.hasSpecialRequirement(item);
        
        // Spezielle Styles für seltene Items
        if (item.rare) {
            itemDiv.style.background = 'linear-gradient(145deg, #FFD700, #FFF8DC)';
            itemDiv.style.border = '2px solid #DAA520';
        }
        if (item.legendary) {
            itemDiv.style.background = 'linear-gradient(145deg, #9400D3, #E6E6FA)';
            itemDiv.style.border = '2px solid #8A2BE2';
            itemDiv.style.boxShadow = '0 0 15px rgba(148, 0, 211, 0.5)';
        }
        
        let buttonText = 'Kaufen';
        let buttonDisabled = false;
        
        if (alreadyOwned) {
            buttonText = 'Besessen';
            buttonDisabled = true;
        } else if (!isUnlocked) {
            buttonText = `Benötigt ${item.unlockRequirement} Punkte`;
            buttonDisabled = true;
        } else if (!hasSpecialRequirement) {
            buttonText = 'Benötigt Kristall';
            buttonDisabled = true;
        } else if (!canAfford) {
            buttonText = 'Zu teuer';
            buttonDisabled = true;
        }
        
        itemDiv.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.icon} ${item.name}</div>
                <div class="item-description">${item.description}</div>
                ${item.rare ? '<div style="color: #DAA520; font-weight: bold; font-size: 12px;">✨ SELTEN ✨</div>' : ''}
                ${item.legendary ? '<div style="color: #9400D3; font-weight: bold; font-size: 12px;">🌟 LEGENDÄR 🌟</div>' : ''}
            </div>
            <div class="item-price">${item.price} Punkte</div>
            <button class="buy-button" ${buttonDisabled ? 'disabled' : ''}>
                ${buttonText}
            </button>
        `;
        
        const buyButton = itemDiv.querySelector('.buy-button');
        if (!buttonDisabled) {
            buyButton.addEventListener('click', () => {
                this.buyItem(item);
            });
        }
        
        return itemDiv;
    }
    
    isItemUnlocked(item) {
        if (!item.unlockRequirement) return true;
        return window.game.score >= item.unlockRequirement;
    }
    
    hasSpecialRequirement(item) {
        if (!item.specialRequirement) return true;
        
        // Check if player has the required item in inventory
        if (window.InventorySystem) {
            return window.InventorySystem.items.some(invItem => 
                invItem && invItem.id.includes(item.specialRequirement)
            );
        }
        return false;
    }
    
    buyItem(item) {
        if (window.game.score >= item.price && (!this.ownedItems.has(item.id) || this.currentTab === 'powerups')) {
            window.game.score -= item.price;
            window.game.updateUI();
            
            if (this.currentTab === 'powerups') {
                // Add power-up to inventory
                if (window.InventorySystem) {
                    const inventoryItem = {
                        ...item,
                        type: 'powerup'
                    };
                    window.InventorySystem.addItem(inventoryItem);
                } else {
                    this.activePowerUps.add(item.id);
                }
            } else {
                // Spezielle Behandlung für Mystery Box
                if (item.id === 'mystery_box') {
                    this.openMysteryBox();
                } else {
                    // Add office item to inventory
                    if (window.InventorySystem) {
                        const inventoryItem = {
                            ...item,
                            type: 'office'
                        };
                        const success = window.InventorySystem.addItem(inventoryItem);
                        if (success) {
                            this.ownedItems.add(item.id);
                        }
                    } else {
                        // Fallback: add directly to office
                        this.ownedItems.add(item.id);
                        this.addItemToOffice(item);
                    }
                }
            }
            
            this.renderShop();
            this.showPurchaseEffect(item);
        }
    }
    
    addItemToOffice(item) {
        // Add visual item to the office
        const officeItem = {
            id: item.id,
            x: Math.random() * (window.game.canvas.width - 64) + 32,
            y: Math.random() * (window.game.canvas.height - 64) + 32,
            width: 32,
            height: 32,
            color: this.getItemColor(item.id),
            icon: item.icon,
            effect: item.effect,
            value: item.value
        };
        
        window.game.items.push(officeItem);
    }
    
    getItemColor(itemId) {
        const colors = {
            desk: '#8B4513',
            plant: '#228B22',
            monitor: '#2F4F4F',
            coffee: '#8B4513',
            butler: '#4682B4',
            lasso: '#DAA520',
            carpet: '#DC143C',
            poster: '#FF6347',
            whiteboard: '#F5F5F5'
        };
        return colors[itemId] || '#808080';
    }
    
    showPurchaseEffect(item) {
        // Visual feedback for purchase
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2ecc71;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
        `;
        effect.textContent = `${item.icon} ${item.name} gekauft!`;
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 2000);
    }
    
    // Power-up usage methods
    usePowerUp(powerUpId) {
        if (this.activePowerUps.has(powerUpId)) {
            this.activePowerUps.delete(powerUpId);
            return true;
        }
        return false;
    }
    
    hasPowerUp(powerUpId) {
        return this.activePowerUps.has(powerUpId);
    }
    
    hasItem(itemId) {
        return this.ownedItems.has(itemId);
    }
    
    // Get bonuses from owned items
    getPointBonus() {
        let bonus = window.game.items
            .filter(item => item.effect === 'pointBonus')
            .reduce((total, item) => total + item.value, 0);
            
        // Add AI Caddy bonus from inventory
        if (window.InventorySystem) {
            const aiCaddyBonus = window.InventorySystem.items
                .filter(item => item && item.effect === 'aiCaddyBonus')
                .reduce((total, item) => total + item.value, 0);
            bonus += aiCaddyBonus;
        }
        
        return bonus;
    }
    
    getSuccessBonus() {
        let bonus = window.game.items
            .filter(item => item.effect === 'successBonus')
            .reduce((total, item) => total + item.value, 0);
            
        // Add AI Caddy success bonus from inventory
        if (window.InventorySystem) {
            const aiCaddyBonus = window.InventorySystem.items
                .filter(item => item && item.effect === 'aiCaddyBonus')
                .reduce((total, item) => total + (item.successBonus || 0), 0);
            bonus += aiCaddyBonus;
        }
        
        return bonus;
    }
    
    hasProtection() {
        return window.game.items.some(item => item.effect === 'protection');
    }
    
    canCatchPony() {
        return this.hasItem('lasso');
    }
    
    openMysteryBox() {
        const surpriseItems = [
            // Normale Überraschungen (70%)
            { weight: 15, item: { id: 'surprise_coffee', name: 'Kaffee der Inspiration', icon: '☕', effect: 'inspiredCoffee', description: 'Macht 30 Sekunden lang alle Antworten 50% wahrscheinlicher richtig!' }},
            { weight: 15, item: { id: 'rubber_chicken', name: 'Gummi-Huhn des Glücks', icon: '🐔', effect: 'luckyChicken', description: 'Bringt Glück bei der nächsten Frage!' }},
            { weight: 10, item: { id: 'broken_calculator', name: 'Kaputter Taschenrechner', icon: '🧮', effect: 'useless', description: 'Völlig nutzlos, aber irgendwie nostalgisch...' }},
            { weight: 10, item: { id: 'motivational_cat', name: 'Motivationskatze', icon: '🐱', effect: 'catMotivation', description: 'Sagt dir, dass du toll bist. Sehr überzeugend!' }},
            { weight: 10, item: { id: 'quantum_eraser', name: 'Quanten-Radiergummi', icon: '🔮', effect: 'quantumEraser', description: 'Löscht falsche Antworten aus der Realität!' }},
            { weight: 10, item: { id: 'time_crystal', name: 'Zeit-Kristall', icon: '⏳', effect: 'timeCrystal', description: 'Macht die nächste Frage 5 Sekunden länger verfügbar!' }},
            
            // Seltene Überraschungen (25%)
            { weight: 8, item: { id: 'ai_buddy', name: 'KI-Kumpel Beta', icon: '🤖', effect: 'aiBuddy', description: 'Hilft bei jeder 5. Frage mit einem Tipp!' }},
            { weight: 7, item: { id: 'wisdom_pretzel', name: 'Weisheits-Brezel', icon: '🥨', effect: 'wisdomPretzel', description: 'Verdoppelt Punkte für die nächsten 3 Fragen!' }},
            { weight: 5, item: { id: 'mega_points', name: 'Punkte-Explosion', icon: '💥', effect: 'pointExplosion', description: '+50 Sofort-Punkte!' }},
            { weight: 5, item: { id: 'fusion_hint', name: 'Fusions-Hinweis', icon: '🔍', effect: 'fusionHint', description: 'Zeigt dir eine mögliche Fusion!' }},
            
            // Legendäre Überraschungen (5%)
            { weight: 2, item: { id: 'golden_pony', name: 'Goldenes Pony', icon: '🦄', effect: 'goldenPony', description: 'Ein legendäres goldenes Pony! Verdoppelt alle Pony-Belohnungen!' }},
            { weight: 2, item: { id: 'ai_oracle', name: 'KI-Orakel', icon: '🧙‍♂️', effect: 'aiOracle', description: 'Beantwortet die nächsten 3 Fragen automatisch richtig!' }},
            { weight: 1, item: { id: 'reality_gem', name: 'Realitäts-Edelstein', icon: '💎', effect: 'realityGem', description: 'Kann die Realität nach deinen Wünschen verbiegen!' }}
        ];
        
        // Gewichtete Zufallsauswahl
        const totalWeight = surpriseItems.reduce((sum, item) => sum + item.weight, 0);
        let randomValue = Math.random() * totalWeight;
        
        let selectedItem = null;
        for (const surprise of surpriseItems) {
            randomValue -= surprise.weight;
            if (randomValue <= 0) {
                selectedItem = surprise.item;
                break;
            }
        }
        
        if (selectedItem) {
            // Dramatische Enthüllung
            this.showMysteryBoxReveal(selectedItem);
            
            // Item zum Inventar hinzufügen
            if (window.InventorySystem) {
                const inventoryItem = {
                    ...selectedItem,
                    id: `${selectedItem.id}_${Date.now()}`,
                    type: 'office',
                    placeable: true
                };
                window.InventorySystem.addItem(inventoryItem);
            }
        }
    }
    
    showMysteryBoxReveal(item) {
        const revealDiv = document.createElement('div');
        revealDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            font-family: 'Courier New', monospace;
        `;
        
        revealDiv.innerHTML = `
            <div style="text-align: center; color: white;">
                <div style="font-size: 48px; margin-bottom: 20px; animation: boxShake 0.5s ease-in-out infinite;">📦</div>
                <div style="font-size: 24px; margin-bottom: 30px; color: #F39C12;">Die Box öffnet sich...</div>
                <div id="revealContent" style="opacity: 0; transition: all 1s ease-in-out;">
                    <div style="font-size: 64px; margin-bottom: 20px;">${item.icon}</div>
                    <div style="font-size: 28px; font-weight: bold; color: #2ECC71; margin-bottom: 10px;">${item.name}</div>
                    <div style="font-size: 16px; color: #ECF0F1; max-width: 400px; margin: 0 auto;">${item.description}</div>
                </div>
                <div style="margin-top: 30px; font-size: 14px; color: #95A5A6;">Klicken zum Schließen</div>
            </div>
        `;
        
        // CSS Animation
        if (!document.getElementById('mysteryBoxCSS')) {
            const style = document.createElement('style');
            style.id = 'mysteryBoxCSS';
            style.textContent = `
                @keyframes boxShake {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-5deg); }
                    75% { transform: rotate(5deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(revealDiv);
        
        // Verzögerte Enthüllung
        setTimeout(() => {
            const content = document.getElementById('revealContent');
            if (content) {
                content.style.opacity = '1';
                content.style.transform = 'scale(1.1)';
            }
        }, 1500);
        
        // Schließen bei Klick
        revealDiv.addEventListener('click', () => {
            revealDiv.style.transition = 'opacity 0.5s ease-out';
            revealDiv.style.opacity = '0';
            setTimeout(() => {
                if (revealDiv.parentNode) {
                    revealDiv.parentNode.removeChild(revealDiv);
                }
            }, 500);
        });
    }
}

// Initialize shop system
window.addEventListener('load', () => {
    window.ShopSystem = new ShopSystem();
});