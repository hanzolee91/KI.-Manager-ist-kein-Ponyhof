// Pony System für KI-Manager Spiel
class PonySystem {
    constructor() {
        this.ponies = [];
        this.caughtPonies = [];
        this.spawnTimer = 0;
        this.spawnInterval = 30000; // 30 seconds between ponies
        this.maxPonies = 3;
        this.poniescaught = 0;
        
        // Verschiedene Pony-Designs mit detaillierten Eigenschaften
        this.ponyTypes = [
            {
                id: 'unicorn',
                name: 'Einhorn',
                colors: { body: '#FFFFFF', mane: '#FF69B4', horn: '#FFD700' },
                speed: 1.5,
                points: 50,
                rarity: 'legendary'
            },
            {
                id: 'rainbow',
                name: 'Regenbogen-Pony',
                colors: { body: '#87CEEB', mane: '#FF6347', tail: '#32CD32' },
                speed: 2.0,
                points: 30,
                rarity: 'rare'
            },
            {
                id: 'fire',
                name: 'Feuer-Pony',
                colors: { body: '#FF4500', mane: '#FFD700', eyes: '#FF0000' },
                speed: 2.5,
                points: 40,
                rarity: 'rare'
            },
            {
                id: 'ice',
                name: 'Eis-Pony',
                colors: { body: '#B0E0E6', mane: '#FFFFFF', eyes: '#00BFFF' },
                speed: 1.0,
                points: 35,
                rarity: 'rare'
            },
            {
                id: 'shadow',
                name: 'Schatten-Pony',
                colors: { body: '#2F2F2F', mane: '#8A2BE2', eyes: '#FF00FF' },
                speed: 3.0,
                points: 60,
                rarity: 'legendary'
            },
            {
                id: 'forest',
                name: 'Wald-Pony',
                colors: { body: '#228B22', mane: '#8B4513', eyes: '#006400' },
                speed: 1.2,
                points: 25,
                rarity: 'common'
            },
            {
                id: 'sunset',
                name: 'Sonnenuntergang-Pony',
                colors: { body: '#FF8C00', mane: '#DC143C', tail: '#FFD700' },
                speed: 1.8,
                points: 35,
                rarity: 'common'
            },
            {
                id: 'storm',
                name: 'Sturm-Pony',
                colors: { body: '#708090', mane: '#191970', eyes: '#00CED1' },
                speed: 2.2,
                points: 45,
                rarity: 'rare'
            },
            {
                id: 'crypto',
                name: 'Crypto-Pony',
                colors: { body: '#FFD700', mane: '#FF6B35', eyes: '#00FF00', horn: '#BTC' },
                speed: 1.5,
                points: 80,
                rarity: 'legendary'
            },
            {
                id: 'quantum',
                name: 'Quanten-Pony',
                colors: { body: '#9400D3', mane: '#00CED1', eyes: '#FFFF00' },
                speed: 3.0, // Quantum superposition - sehr schnell
                points: 100,
                rarity: 'legendary'
            },
            {
                id: 'metaverse',
                name: 'Metaverse-Pony',
                colors: { body: '#FF1493', mane: '#00FFFF', eyes: '#FFD700' },
                speed: 1.8,
                points: 70,
                rarity: 'rare'
            },
            {
                id: 'robo',
                name: 'Robo-Pony',
                colors: { body: '#C0C0C0', mane: '#FF0000', eyes: '#0000FF' },
                speed: 2.5,
                points: 90,
                rarity: 'legendary'
            },
            {
                id: 'time',
                name: 'Zeit-Pony',
                colors: { body: '#4B0082', mane: '#FFD700', eyes: '#FFFFFF' },
                speed: 1.0,
                points: 150,
                rarity: 'legendary'
            },
            {
                id: 'glitch',
                name: 'Glitch-Pony',
                colors: { body: '#00FF00', mane: '#FF00FF', eyes: '#FFFF00' },
                speed: 4.0, // Glitchy fast movement
                points: 200,
                rarity: 'legendary'
            }
        ];
        
        this.rarityWeights = {
            'common': 60,
            'rare': 25,
            'legendary': 15
        };
        
        // Special challenging pony questions
        this.ponyQuestions = [
            {
                "frage": "Ordne die KI-Begriffe den korrekten Definitionen zu:",
                "type": "matching",
                "antworten": [
                    { "text": "A) Machine Learning = Lernen aus Daten ohne explizite Programmierung", "korrekt": true },
                    { "text": "B) Deep Learning = Verwendung mehrschichtiger neuronaler Netze", "korrekt": true },
                    { "text": "C) Natural Language Processing = Verstehen und Generieren natürlicher Sprache", "korrekt": true },
                    { "text": "D) Computer Vision = Bildanalyse und -erkennung", "korrekt": true },
                    { "text": "E) Machine Learning = Nur regelbasierte Programmierung", "korrekt": false },
                    { "text": "F) Deep Learning = Oberflächliche Datenanalyse", "korrekt": false }
                ]
            },
            {
                "frage": "Welche Aussagen über KI-Ethik sind korrekt? (Mehrere Antworten möglich)",
                "type": "complex_multiple",
                "antworten": [
                    { "text": "A) Transparenz bedeutet, dass KI-Entscheidungen nachvollziehbar sein sollten", "korrekt": true },
                    { "text": "B) Fairness erfordert die Vermeidung von Diskriminierung und Bias", "korrekt": true },
                    { "text": "C) Accountability bedeutet, dass jemand für KI-Entscheidungen verantwortlich ist", "korrekt": true },
                    { "text": "D) Privacy-by-Design sollte von Anfang an mitgedacht werden", "korrekt": true },
                    { "text": "E) KI-Systeme sind immer objektiv und neutral", "korrekt": false },
                    { "text": "F) Menschen sollten keine Kontrolle über KI-Entscheidungen haben", "korrekt": false }
                ]
            },
            {
                "frage": "Ordne die EU AI Act Risikoklassen den korrekten Beschreibungen zu:",
                "type": "matching",
                "antworten": [
                    { "text": "A) Minimales Risiko = Chatbots und Spamfilter", "korrekt": true },
                    { "text": "B) Begrenztes Risiko = Deepfakes und Emotionserkennung", "korrekt": true },
                    { "text": "C) Hohes Risiko = Medizinische Diagnose und Kreditbewertung", "korrekt": true },
                    { "text": "D) Unannehmbares Risiko = Social Scoring und Manipulation", "korrekt": true },
                    { "text": "E) Hohes Risiko = Einfache Taschenrechner", "korrekt": false },
                    { "text": "F) Unannehmbares Risiko = Normale Suchmaschinen", "korrekt": false }
                ]
            },
            {
                "frage": "Welche Schritte gehören zum Machine Learning Pipeline? (Richtige Reihenfolge)",
                "type": "sequence",
                "antworten": [
                    { "text": "A) Datensammlung → Datenvorverarbeitung → Modelltraining → Evaluierung", "korrekt": true },
                    { "text": "B) Feature Engineering gehört zur Datenvorverarbeitung", "korrekt": true },
                    { "text": "C) Cross-Validation ist Teil der Evaluierung", "korrekt": true },
                    { "text": "D) Deployment erfolgt nach erfolgreicher Evaluierung", "korrekt": true },
                    { "text": "E) Modelltraining sollte vor Datensammlung stattfinden", "korrekt": false },
                    { "text": "F) Evaluierung ist nicht notwendig wenn das Modell komplex ist", "korrekt": false }
                ]
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Canvas click für Pony-Fangen
        if (window.game && window.game.canvas) {
            window.game.canvas.addEventListener('click', (e) => {
                if (this.ponies.length > 0 && window.game.gameState === 'playing') {
                    this.tryToCatchPony(e);
                }
            });
        }
    }
    
    spawn() {
        if (this.ponies.length >= this.maxPonies) {
            return;
        }
        
        const ponyType = this.getRandomPonyType();
        const canvas = document.getElementById('gameCanvas');
        
        const pony = {
            id: Date.now() + Math.random(),
            type: ponyType,
            x: canvas.width + 50, // Start off-screen right
            y: Math.random() * (canvas.height - 100) + 50,
            targetX: Math.random() * (canvas.width - 100) + 50,
            targetY: Math.random() * (canvas.height - 100) + 50,
            width: 48,
            height: 36,
            speed: ponyType.speed,
            state: 'roaming', // roaming, fleeing, caught
            direction: Math.random() * Math.PI * 2,
            wanderTimer: 0,
            fleeTimer: 0,
            animFrame: 0,
            catchable: true,
            sparkles: []
        };
        
        this.ponies.push(pony);
        this.showPonySpawnMessage(ponyType);
        this.generateSparkles(pony);
    }
    
    getRandomPonyType() {
        const totalWeight = Object.values(this.rarityWeights).reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const [rarity, weight] of Object.entries(this.rarityWeights)) {
            random -= weight;
            if (random <= 0) {
                const poniesOfRarity = this.ponyTypes.filter(p => p.rarity === rarity);
                return poniesOfRarity[Math.floor(Math.random() * poniesOfRarity.length)];
            }
        }
        
        // Fallback
        return this.ponyTypes[0];
    }
    
    showPonySpawnMessage(ponyType) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 30%;
            right: 20px;
            background: #9B59B6;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
            font-family: 'Courier New', monospace;
            border: 3px solid #8E44AD;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            font-size: 14px;
        `;
        message.innerHTML = `
            <div>🦄 ${ponyType.name} erschienen!</div>
            <div style="font-size: 12px; margin-top: 5px;">Seltenheit: ${ponyType.rarity}</div>
            <div style="font-size: 12px;">Punkte: ${ponyType.points}</div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (document.body.contains(message)) {
                message.style.transition = 'opacity 0.5s';
                message.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(message)) {
                        document.body.removeChild(message);
                    }
                }, 500);
            }
        }, 4000);
    }
    
    generateSparkles(pony) {
        for (let i = 0; i < 5; i++) {
            pony.sparkles.push({
                x: pony.x + Math.random() * pony.width,
                y: pony.y + Math.random() * pony.height,
                life: 1,
                decay: 0.02 + Math.random() * 0.02,
                size: 2 + Math.random() * 3
            });
        }
    }
    
    update(deltaTime) {
        // Update spawn timer - only spawn at 100% success rate
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval && this.ponies.length < this.maxPonies) {
            if (window.game && window.game.successRate >= 100) {
                this.spawn();
                this.spawnTimer = 0;
                // Reset success rate after pony spawn
                window.game.successRate = 0;
                window.game.updateUI();
            }
        }
        
        // Update all ponies
        this.ponies.forEach(pony => {
            this.updatePony(pony, deltaTime);
        });
        
        // Remove ponies that have left the screen
        this.ponies = this.ponies.filter(pony => {
            return pony.x > -100 && pony.x < 800 && pony.y > -100 && pony.y < 600;
        });
    }
    
    updatePony(pony, deltaTime) {
        pony.animFrame += deltaTime * 0.01;
        
        // Update sparkles
        pony.sparkles = pony.sparkles.filter(sparkle => {
            sparkle.life -= sparkle.decay;
            sparkle.y -= 1;
            sparkle.x += (Math.random() - 0.5) * 2;
            return sparkle.life > 0;
        });
        
        // Generate new sparkles
        if (Math.random() < 0.1) {
            this.generateSparkles(pony);
        }
        
        switch (pony.state) {
            case 'roaming':
                this.updateRoaming(pony, deltaTime);
                break;
            case 'fleeing':
                this.updateFleeing(pony, deltaTime);
                break;
            case 'caught':
                // Pony is caught, don't move
                break;
        }
    }
    
    updateRoaming(pony, deltaTime) {
        pony.wanderTimer += deltaTime;
        
        // Change direction occasionally
        if (pony.wanderTimer > 3000) {
            pony.direction = Math.random() * Math.PI * 2;
            pony.wanderTimer = 0;
        }
        
        // Move in current direction
        const moveSpeed = pony.speed * (deltaTime / 1000) * 60;
        pony.x += Math.cos(pony.direction) * moveSpeed;
        pony.y += Math.sin(pony.direction) * moveSpeed;
        
        // Bounce off walls
        const canvas = document.getElementById('gameCanvas');
        if (pony.x <= 0 || pony.x >= canvas.width - pony.width) {
            pony.direction = Math.PI - pony.direction;
        }
        if (pony.y <= 0 || pony.y >= canvas.height - pony.height) {
            pony.direction = -pony.direction;
        }
        
        // Keep within bounds
        pony.x = Math.max(0, Math.min(canvas.width - pony.width, pony.x));
        pony.y = Math.max(0, Math.min(canvas.height - pony.height, pony.y));
    }
    
    updateFleeing(pony, deltaTime) {
        pony.fleeTimer += deltaTime;
        
        // Flee for 5 seconds then return to roaming
        if (pony.fleeTimer > 5000) {
            pony.state = 'roaming';
            pony.fleeTimer = 0;
            return;
        }
        
        // Move away from player/manager
        const player = window.game.player;
        const dx = pony.x - player.x;
        const dy = pony.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const fleeSpeed = pony.speed * 2 * (deltaTime / 1000) * 60;
            pony.x += (dx / distance) * fleeSpeed;
            pony.y += (dy / distance) * fleeSpeed;
        }
    }
    
    tryToCatchPony(event) {
        const rect = window.game.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        let clickedPony = null;
        
        this.ponies.forEach((pony, index) => {
            if (pony.catchable && 
                clickX >= pony.x && clickX <= pony.x + pony.width &&
                clickY >= pony.y && clickY <= pony.y + pony.height) {
                
                clickedPony = pony;
                
                // Check if player has lasso - REQUIRED to catch ponies
                const hasLasso = window.ShopSystem && window.ShopSystem.canCatchPony();
                
                if (!hasLasso) {
                    this.showNeedsLassoMessage();
                    return;
                }
                
                // Check for carrot bonus
                const hasCarrot = window.InventorySystem && window.InventorySystem.hasItem('carrot');
                
                if (hasCarrot) {
                    // Pony asks special question with carrot bonus
                    this.startPonyQuestionWithCarrot(pony, index);
                } else {
                    // Normal catching attempt
                    this.attemptCatch(pony, index, false);
                }
            }
        });
        
        return clickedPony;
    }
    
    showNeedsLassoMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #E74C3C;
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
            font-family: 'Courier New', monospace;
            border: 3px solid #C0392B;
            box-shadow: 0 6px 12px rgba(0,0,0,0.4);
            text-align: center;
            font-size: 16px;
        `;
        message.innerHTML = `
            <div style="font-size: 18px;">🪢 Du brauchst ein Lasso!</div>
            <div style="font-size: 14px; margin-top: 5px;">Kaufe ein "Anti-Pony Lasso der Vernunft" im Shop</div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 3000);
    }
    
    startPonyQuestionWithCarrot(pony, ponyIndex) {
        // Use carrot from inventory
        if (window.InventorySystem) {
            window.InventorySystem.useItem('carrot');
        }
        
        // Pony asks special challenging question
        const specialQuestion = this.ponyQuestions[Math.floor(Math.random() * this.ponyQuestions.length)];
        
        this.showPonyQuestionDialog(pony, ponyIndex, specialQuestion, true);
    }
    
    showPonyQuestionDialog(pony, ponyIndex, question, hasCarrotBonus) {
        // Create special pony question dialog
        const dialog = document.createElement('div');
        dialog.id = 'ponyQuestionDialog';
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(155, 89, 182, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 300;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: #F8C471;
            color: #8B4513;
            padding: 30px;
            border: 6px solid #F39C12;
            border-style: outset;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        `;
        
        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 24px; font-weight: bold;">🦄 ${pony.type.name} 🦄</div>
                <div style="font-size: 14px; margin: 10px 0;">
                    ${hasCarrotBonus ? '🥕 Das Pony nimmt dankbar die Karotte und stellt dir eine besonders knifflige Frage!' : 'Das Pony möchte dein KI-Wissen testen!'}
                </div>
            </div>
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 20px;" id="ponyQuestionText">
                ${question.frage}
            </div>
            <div id="ponyAnswerButtons" style="display: flex; flex-direction: column; gap: 10px;">
            </div>
            <button id="ponyConfirmButton" disabled style="
                padding: 12px 24px;
                background: #27AE60;
                color: white;
                border: 3px solid #2ECC71;
                border-style: outset;
                font-weight: bold;
                font-size: 16px;
                font-family: 'Courier New', monospace;
                cursor: pointer;
                margin-top: 15px;
                width: 100%;
            ">Antwort bestätigen</button>
        `;
        
        dialog.appendChild(content);
        document.body.appendChild(dialog);
        
        // Setup answer buttons
        const answerButtons = content.querySelector('#ponyAnswerButtons');
        const selectedAnswers = new Set();
        
        question.antworten.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'pony-answer-button';
            button.style.cssText = `
                padding: 12px;
                background: #3498DB;
                color: white;
                border: 2px solid #5DADE2;
                border-style: outset;
                cursor: pointer;
                text-align: left;
                font-size: 14px;
                font-family: 'Courier New', monospace;
                font-weight: bold;
            `;
            button.textContent = answer.text;
            button.onclick = () => {
                if (selectedAnswers.has(index)) {
                    selectedAnswers.delete(index);
                    button.style.background = '#3498DB';
                    button.style.borderStyle = 'outset';
                } else {
                    selectedAnswers.add(index);
                    button.style.background = '#F39C12';
                    button.style.borderStyle = 'inset';
                }
                
                const confirmButton = content.querySelector('#ponyConfirmButton');
                confirmButton.disabled = selectedAnswers.size === 0;
                confirmButton.style.background = selectedAnswers.size === 0 ? '#95A5A6' : '#27AE60';
            };
            answerButtons.appendChild(button);
        });
        
        // Setup confirm button
        content.querySelector('#ponyConfirmButton').onclick = () => {
            this.evaluatePonyAnswer(pony, ponyIndex, question, selectedAnswers, hasCarrotBonus, dialog);
        };
    }
    
    evaluatePonyAnswer(pony, ponyIndex, question, selectedAnswers, hasCarrotBonus, dialog) {
        const correctAnswers = question.antworten
            .map((answer, index) => ({ answer, index }))
            .filter(item => item.answer.korrekt);
        
        const selectedCorrectAnswers = correctAnswers.filter(item => selectedAnswers.has(item.index));
        const selectedIncorrectAnswers = Array.from(selectedAnswers).filter(index =>
            !question.antworten[index].korrekt
        );
        
        const allCorrectSelected = selectedCorrectAnswers.length === correctAnswers.length;
        const noIncorrectSelected = selectedIncorrectAnswers.length === 0;
        const perfectAnswer = allCorrectSelected && noIncorrectSelected;
        
        // Calculate catch chance based on answer quality and carrot bonus
        let baseCatchChance = 0.6; // Base chance with lasso
        
        if (perfectAnswer) {
            baseCatchChance = 0.9; // High chance for perfect answer
        } else if (selectedCorrectAnswers.length > 0) {
            baseCatchChance = 0.4; // Lower chance for partial answer
        } else {
            baseCatchChance = 0.1; // Very low chance for wrong answer
        }
        
        // Carrot bonus
        if (hasCarrotBonus) {
            baseCatchChance = Math.min(0.95, baseCatchChance + 0.3);
        }
        
        // Remove dialog
        document.body.removeChild(dialog);
        
        // Attempt catch with calculated chance
        this.attemptCatch(pony, ponyIndex, hasCarrotBonus, baseCatchChance, perfectAnswer);
    }
    
    attemptCatch(pony, ponyIndex, hasCarrotBonus, customCatchChance = null, perfectAnswer = false) {
        const catchChance = customCatchChance || 0.6; // Base chance with lasso
        
        if (Math.random() < catchChance) {
            // Successfully caught pony
            pony.state = 'caught';
            pony.catchable = false;
            
            // Add to caught ponies and inventory
            this.caughtPonies.push(pony);
            if (window.InventorySystem) {
                const inventoryItem = {
                    id: 'pony_' + pony.id,
                    name: pony.type.name,
                    description: `Ein wunderschönes ${pony.type.name}! Seltenheit: ${pony.type.rarity}`,
                    icon: '🦄',
                    type: 'pony',
                    ponyData: pony,
                    placeable: true
                };
                window.InventorySystem.addItem(inventoryItem);
            }
            
            // Award points with bonus for perfect answers
            let points = pony.type.points;
            if (perfectAnswer) {
                points *= 2; // Double points for perfect pony question answer
            }
            
            if (window.game) {
                window.game.score += points;
                window.game.updateUI();
            }
            
            this.poniescaught++;
            
            // Remove from active ponies
            this.ponies.splice(ponyIndex, 1);
            
            this.showCatchMessage(pony, true, hasCarrotBonus, perfectAnswer);
            
            // Starte sofort Expert-Frage vom gefangenen Pony
            setTimeout(() => {
                if (window.game && window.game.startPonyQuestion) {
                    console.log(`🦄 Starte automatische Expert-Frage von gefangenem ${pony.type.name}`);
                    window.game.startPonyQuestion(pony);
                }
            }, 2000); // Kurze Verzögerung nach der Fang-Nachricht
        } else {
            // Failed to catch - pony flees
            pony.state = 'fleeing';
            pony.fleeTimer = 0;
            this.showMissMessage(pony);
        }
    }
    
    showCatchMessage(pony, hasLasso, hasCarrotBonus = false, perfectAnswer = false) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #27AE60;
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
            font-family: 'Courier New', monospace;
            border: 3px solid #2ECC71;
            box-shadow: 0 6px 12px rgba(0,0,0,0.4);
            text-align: center;
            font-size: 16px;
        `;
        
        let points = pony.type.points;
        if (perfectAnswer) points *= 2;
        
        message.innerHTML = `
            <div style="font-size: 18px;">🎉 ${pony.type.name} gefangen!</div>
            <div style="font-size: 14px; margin-top: 5px;">+${points} Punkte</div>
            ${hasLasso ? '<div style="font-size: 12px; margin-top: 3px;">🪢 Lasso war erforderlich!</div>' : ''}
            ${hasCarrotBonus ? '<div style="font-size: 12px; margin-top: 3px;">🥕 Karotten-Bonus half!</div>' : ''}
            ${perfectAnswer ? '<div style="font-size: 12px; margin-top: 3px;">✨ Perfekte Antwort = Doppelte Punkte!</div>' : ''}
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (document.body.contains(message)) {
                message.style.transition = 'all 0.5s';
                message.style.opacity = '0';
                message.style.transform = 'translate(-50%, -50%) scale(0.8)';
                setTimeout(() => {
                    if (document.body.contains(message)) {
                        document.body.removeChild(message);
                    }
                }, 500);
            }
        }, 4000);
    }
    
    showMissMessage(pony) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 60%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #E74C3C;
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
            font-family: 'Courier New', monospace;
            font-size: 14px;
        `;
        message.textContent = `${pony.type.name} ist entkommen! 🏃‍♀️💨`;
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 2000);
    }
    
    render(ctx) {
        this.ponies.forEach(pony => {
            this.drawPony(ctx, pony);
        });
    }
    
    drawPony(ctx, pony) {
        const x = Math.floor(pony.x);
        const y = Math.floor(pony.y);
        const colors = pony.type.colors;
        
        // Draw sparkles first
        pony.sparkles.forEach(sparkle => {
            ctx.globalAlpha = sparkle.life;
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(Math.floor(sparkle.x), Math.floor(sparkle.y), Math.floor(sparkle.size), Math.floor(sparkle.size));
        });
        ctx.globalAlpha = 1;
        
        // Blinking animation for fleeing ponies
        const opacity = pony.state === 'fleeing' ? 0.7 + 0.3 * Math.sin(pony.animFrame * 10) : 1.0;
        ctx.globalAlpha = opacity;
        
        // Body (main body shape)
        ctx.fillStyle = colors.body;
        ctx.fillRect(x + 8, y + 12, 32, 20);
        
        // Legs with slight animation
        const legOffset = Math.sin(pony.animFrame * 8) * 1;
        ctx.fillStyle = colors.body;
        ctx.fillRect(x + 10, y + 28 + legOffset, 4, 8); // Front left
        ctx.fillRect(x + 18, y + 28 - legOffset, 4, 8); // Front right  
        ctx.fillRect(x + 26, y + 28 - legOffset, 4, 8); // Back left
        ctx.fillRect(x + 34, y + 28 + legOffset, 4, 8); // Back right
        
        // Head
        ctx.fillStyle = colors.body;
        ctx.fillRect(x + 4, y + 8, 16, 12);
        
        // Mane (flowing hair)
        ctx.fillStyle = colors.mane;
        ctx.fillRect(x + 2, y + 4, 20, 8);
        ctx.fillRect(x + 6, y + 12, 12, 4);
        // Mane flow animation
        const maneFlow = Math.sin(pony.animFrame * 3) * 2;
        ctx.fillRect(x + 22 + maneFlow, y + 6, 4, 6);
        
        // Tail (animated)
        const tailColor = colors.tail || colors.mane;
        ctx.fillStyle = tailColor;
        const tailSway = Math.sin(pony.animFrame * 4) * 3;
        ctx.fillRect(x + 36 + tailSway, y + 14, 8, 12);
        ctx.fillRect(x + 40 + tailSway, y + 18, 4, 8);
        
        // Eyes
        const eyeColor = colors.eyes || '#000000';
        ctx.fillStyle = eyeColor;
        ctx.fillRect(x + 8, y + 10, 2, 2);
        ctx.fillRect(x + 14, y + 10, 2, 2);
        
        // Eye sparkle
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 8, y + 10, 1, 1);
        ctx.fillRect(x + 14, y + 10, 1, 1);
        
        // Special features based on type
        switch (pony.type.id) {
            case 'unicorn':
                // Horn
                ctx.fillStyle = colors.horn;
                ctx.fillRect(x + 10, y + 2, 4, 8);
                ctx.fillRect(x + 11, y, 2, 4);
                // Horn spiral
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(x + 11, y + 2, 1, 1);
                ctx.fillRect(x + 12, y + 4, 1, 1);
                ctx.fillRect(x + 11, y + 6, 1, 1);
                break;
                
            case 'fire':
                // Fire effects
                ctx.fillStyle = '#FF4500';
                const fireAnim = Math.sin(pony.animFrame * 8);
                ctx.fillRect(x + 2, y + 16 + fireAnim * 2, 2, 4);
                ctx.fillRect(x + 44, y + 18 + fireAnim * 2, 2, 4);
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(x + 3, y + 17 + fireAnim * 2, 1, 2);
                ctx.fillRect(x + 45, y + 19 + fireAnim * 2, 1, 2);
                break;
                
            case 'ice':
                // Ice crystals
                ctx.fillStyle = '#00BFFF';
                ctx.fillRect(x + 2, y + 10, 2, 2);
                ctx.fillRect(x + 46, y + 12, 2, 2);
                ctx.fillRect(x + 8, y + 28, 2, 2);
                break;
                
            case 'shadow':
                // Shadow effects
                ctx.fillStyle = 'rgba(139, 43, 226, 0.3)';
                ctx.fillRect(x - 2, y + 32, 52, 4);
                // Purple aura
                ctx.fillStyle = 'rgba(138, 43, 226, 0.2)';
                ctx.fillRect(x - 4, y - 2, 56, 36);
                break;
                
            case 'storm':
                // Lightning effects
                ctx.fillStyle = colors.eyes;
                const lightningAnim = Math.sin(pony.animFrame * 12);
                if (lightningAnim > 0.8) {
                    ctx.fillRect(x + 20, y - 4, 2, 8);
                    ctx.fillRect(x + 18, y + 2, 6, 2);
                }
                break;
                
            case 'rainbow':
                // Rainbow trail
                const rainbow = ['#FF0000', '#FF8000', '#FFFF00', '#00FF00', '#0080FF', '#8000FF'];
                rainbow.forEach((color, i) => {
                    ctx.fillStyle = color;
                    ctx.fillRect(x - (i * 2) + Math.sin(pony.animFrame * 5 + i) * 2, y + 16 + i, 1, 1);
                });
                break;
        }
        
        // Catchable indicator (golden glow)
        if (pony.catchable && pony.state !== 'fleeing') {
            ctx.fillStyle = '#FFD700';
            const glowPulse = 0.5 + 0.5 * Math.sin(pony.animFrame * 6);
            ctx.globalAlpha = glowPulse * 0.3;
            ctx.fillRect(x - 2, y - 2, pony.width + 4, pony.height + 4);
            ctx.globalAlpha = opacity;
            
            // Golden sparkle on top
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(x + 20, y - 4, 8, 2);
            ctx.fillRect(x + 22, y - 6, 4, 2);
        }
        
        // Lasso catching radius if player has lasso
        if (window.ShopSystem && window.ShopSystem.canCatchPony() && pony.catchable) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(
                x + pony.width / 2,
                y + pony.height / 2,
                40, // catch radius
                0,
                Math.PI * 2
            );
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        ctx.globalAlpha = 1.0;
    }
    
    // Get data for saving
    getData() {
        return {
            caughtPonies: this.caughtPonies.map(pony => ({
                id: pony.id,
                type: pony.type,
                points: pony.type.points
            })),
            totalCaught: this.poniescaught
        };
    }
    
    // Load data
    loadData(data) {
        if (data) {
            if (data.caughtPonies) {
                this.caughtPonies = data.caughtPonies;
            }
            if (data.totalCaught) {
                this.poniescaught = data.totalCaught;
            }
        }
    }
    
    getStats() {
        return {
            activePonies: this.ponies.length,
            caughtPonies: this.poniescaught,
            currentPonyTypes: this.ponies.map(p => p.type.name)
        };
    }
}

// Initialize pony system
window.addEventListener('load', () => {
    window.PonySystem = new PonySystem();
});