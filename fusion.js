// Fusion System für KI-Manager Game
class FusionSystem {
    constructor() {
        // Hook into inventory system
        this.init();
    }
    
    init() {
        // Wait for inventory system to be available
        const checkInventory = () => {
            if (window.InventorySystem) {
                this.hookIntoInventory();
            } else {
                setTimeout(checkInventory, 100);
            }
        };
        checkInventory();
    }
    
    hookIntoInventory() {
        // Override the original addItem method
        const originalAddItem = window.InventorySystem.addItem;
        window.InventorySystem.addItem = function(item) {
            const result = originalAddItem.call(this, item);
            if (result && window.FusionSystem) {
                setTimeout(() => window.FusionSystem.checkForFusion(), 100);
            }
            return result;
        };
    }
    
    checkForFusion() {
        if (!window.InventorySystem) return;
        
        const items = window.InventorySystem.items;
        const hasReactor = items.some(item => item && item.effect === 'fusionReactor');
        
        // Definiere alle möglichen Fusionen
        const fusionRecipes = [
            // Basis-Fusion (ohne Reaktor)
            {
                ingredients: ['golfCaddy', 'robotChip'],
                result: {
                    id: `ai_caddy_${Date.now()}`,
                    name: 'Künstlicher Intelligenz-Caddy',
                    icon: '🤖',
                    type: 'office',
                    effect: 'aiCaddyBonus',
                    value: 3,
                    successBonus: 5,
                    description: 'Ein revolutionärer AI-Caddy! Verleiht +3 Punkte und +5% Erfolgsbonus!'
                },
                reactorRequired: false
            },
            
            // Erweiterte Fusionen (benötigen Reaktor)
            {
                ingredients: ['coffee', 'memoryBoost'],
                result: {
                    id: `mega_coffee_${Date.now()}`,
                    name: '🚀 Quanten-Kaffee Deluxe',
                    icon: '☕',
                    type: 'office',
                    effect: 'megaCoffee',
                    value: 2,
                    description: 'Ultimative Koffein-Fusion! Zeigt bei Lückentext-Fragen 3 Begriffe statt 2!'
                },
                reactorRequired: true
            },
            {
                ingredients: ['ponyAttraction', 'golfCaddy'],
                result: {
                    id: `pony_trainer_${Date.now()}`,
                    name: '🦄 Mystischer Pony-Trainer',
                    icon: '🎠',
                    type: 'office',
                    effect: 'ponyTrainer',
                    value: 1,
                    description: 'Macht alle Ponys zahm! 100% Fangchance ohne Lasso!'
                },
                reactorRequired: true
            },
            {
                ingredients: ['aiCaddyBonus', 'fusionCore'],
                result: {
                    id: `ai_overlord_${Date.now()}`,
                    name: '👑 KI-Overlord Supreme',
                    icon: '🧠',
                    type: 'office',
                    effect: 'aiOverlord',
                    value: 5,
                    successBonus: 10,
                    description: 'Macht dich zum KI-Gott! +5 Punkte, +10% Erfolg, beantwortet manchmal Fragen selbst!'
                },
                reactorRequired: true
            },
            {
                ingredients: ['pointBonus', 'successBonus'],
                result: {
                    id: `luck_amplifier_${Date.now()}`,
                    name: '🍀 Glücks-Verstärker 3000',
                    icon: '🌟',
                    type: 'office',
                    effect: 'luckAmplifier',
                    value: 1,
                    description: '1% Chance bei jeder Frage auf automatisch richtige Antwort!'
                },
                reactorRequired: true
            },
            {
                ingredients: ['protection', 'memory'],
                result: {
                    id: `shield_brain_${Date.now()}`,
                    name: '🧠🛡️ Neuro-Schild Matrix',
                    icon: '🔰',
                    type: 'office',
                    effect: 'neuroShield',
                    value: 1,
                    description: 'Verhindert Punktverluste UND merkt sich alle falschen Antworten!'
                },
                reactorRequired: true
            }
        ];
        
        // Prüfe alle Rezepte
        for (const recipe of fusionRecipes) {
            if (recipe.reactorRequired && !hasReactor) continue;
            
            const slots = this.findFusionSlots(recipe.ingredients);
            if (slots.length === recipe.ingredients.length) {
                this.showAdvancedFusionDialog(slots, recipe);
                return; // Nur eine Fusion zur Zeit
            }
        }
    }
    
    findFusionSlots(ingredients) {
        const foundSlots = [];
        const items = window.InventorySystem.items;
        
        for (const ingredient of ingredients) {
            const slot = items.findIndex((item, index) => 
                item && 
                (item.effect === ingredient || item.id.includes(ingredient)) &&
                !foundSlots.includes(index) // Verhindere doppelte Verwendung
            );
            
            if (slot !== -1) {
                foundSlots.push(slot);
            } else {
                return []; // Nicht alle Zutaten vorhanden
            }
        }
        
        return foundSlots;
    }
    
    showAdvancedFusionDialog(slots, recipe) {
        const fusionDialog = document.createElement('div');
        fusionDialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const ingredients = slots.map(slot => window.InventorySystem.items[slot]);
        const ingredientNames = ingredients.map(item => item.name).join(' + ');
        
        fusionDialog.innerHTML = `
            <div style="background: linear-gradient(145deg, #1a1a2e, #16213e); color: #ECF0F1; padding: 40px; border-radius: 20px; text-align: center; max-width: 500px; border: 3px solid #F39C12; box-shadow: 0 0 30px rgba(243, 156, 18, 0.5);">
                <h2 style="color: #F39C12; margin-bottom: 25px; text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">
                    ⚡ ${recipe.reactorRequired ? 'REAKTOR-FUSION' : 'BASIS-FUSION'} ERKANNT! ⚡
                </h2>
                <div style="margin-bottom: 20px; font-size: 14px;">
                    <strong>Zutaten gefunden:</strong><br>
                    ${ingredientNames}
                </div>
                ${recipe.reactorRequired ? '<div style="color: #9400D3; font-weight: bold; margin-bottom: 15px;">🔬 Erweiterte Fusion mit Reaktor!</div>' : ''}
                <p style="margin-bottom: 20px;">Möchtest du sie zu einem <strong>${recipe.result.name}</strong> fusionieren?</p>
                <div style="background: linear-gradient(145deg, #F1C40F, #F39C12); padding: 20px; border-radius: 15px; margin: 20px 0; color: #2C3E50;">
                    <div style="font-size: 24px; margin-bottom: 10px;">${recipe.result.icon}</div>
                    <strong>${recipe.result.name}</strong><br>
                    <em style="font-size: 14px;">${recipe.result.description}</em>
                </div>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="advancedFusionYes" style="background: linear-gradient(45deg, #27AE60, #2ECC71); color: white; padding: 12px 25px; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px;">✨ Ja, fusionieren!</button>
                    <button id="advancedFusionNo" style="background: linear-gradient(45deg, #E74C3C, #C0392B); color: white; padding: 12px 25px; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px;">❌ Abbrechen</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(fusionDialog);
        
        document.getElementById('advancedFusionYes').addEventListener('click', () => {
            this.performAdvancedFusion(slots, recipe);
            document.body.removeChild(fusionDialog);
        });
        
        document.getElementById('advancedFusionNo').addEventListener('click', () => {
            document.body.removeChild(fusionDialog);
        });
    }
    
    performAdvancedFusion(slots, recipe) {
        if (!window.InventorySystem) return;
        
        // Entferne alle Zutaten-Items
        slots.forEach(slot => {
            window.InventorySystem.items[slot] = null;
        });
        
        // Erstelle das neue Item
        const fusedItem = {
            ...recipe.result,
            placeable: true
        };
        
        // Füge das neue Item hinzu
        for (let i = 0; i < window.InventorySystem.slots; i++) {
            if (window.InventorySystem.items[i] === null) {
                window.InventorySystem.items[i] = fusedItem;
                break;
            }
        }
        
        window.InventorySystem.updateDisplay();
        this.showAdvancedFusionSuccess(recipe.result);
    }
    
    showAdvancedFusionSuccess(result) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(145deg, #27AE60, #2ECC71);
            color: white;
            padding: 25px 35px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 20px;
            z-index: 1001;
            border: 4px solid #F39C12;
            box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            text-align: center;
            animation: fusionSuccess 1s ease-out;
        `;
        successDiv.innerHTML = `
            ⚡ FUSION ERFOLGREICH! ⚡<br>
            <div style="font-size: 32px; margin: 10px 0;">${result.icon}</div>
            <strong>${result.name}</strong> erstellt!<br>
            <em style="font-size: 16px; margin-top: 10px; display: block;">${result.description}</em>
        `;
        
        // CSS Animation
        if (!document.getElementById('fusionSuccessCSS')) {
            const style = document.createElement('style');
            style.id = 'fusionSuccessCSS';
            style.textContent = `
                @keyframes fusionSuccess {
                    0% { transform: translate(-50%, -50%) scale(0.3) rotate(-180deg); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.1) rotate(0deg); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 4000);
    }
    
    showFusionDialog(caddySlot, chipSlot) {
        const fusionDialog = document.createElement('div');
        fusionDialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        fusionDialog.innerHTML = `
            <div style="background: #ECF0F1; color: #2C3E50; padding: 30px; border-radius: 15px; text-align: center; max-width: 400px;">
                <h2 style="color: #E74C3C; margin-bottom: 20px;">🔧⛳ FUSION MÖGLICH! 🔧⛳</h2>
                <p style="margin-bottom: 20px;">Du hast einen <strong>Golf-Caddy</strong> und einen <strong>Roboter-Chip</strong>!</p>
                <p style="margin-bottom: 20px;">Möchtest du sie zu einem <strong>AI-Caddy</strong> fusionieren?</p>
                <div style="background: #F1C40F; padding: 15px; border-radius: 10px; margin: 15px 0;">
                    <strong>🤖 AI-Caddy</strong><br>
                    <em>Verleiht +3 Punkte pro richtige Antwort und +5% Erfolgsbonus!</em>
                </div>
                <button id="fusionYes" style="background: #27AE60; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin: 5px; cursor: pointer; font-weight: bold;">✨ Ja, fusionieren!</button>
                <button id="fusionNo" style="background: #E74C3C; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin: 5px; cursor: pointer; font-weight: bold;">❌ Nein, behalten</button>
            </div>
        `;
        
        document.body.appendChild(fusionDialog);
        
        document.getElementById('fusionYes').addEventListener('click', () => {
            this.performFusion(caddySlot, chipSlot);
            document.body.removeChild(fusionDialog);
        });
        
        document.getElementById('fusionNo').addEventListener('click', () => {
            document.body.removeChild(fusionDialog);
        });
    }
    
    performFusion(caddySlot, chipSlot) {
        if (!window.InventorySystem) return;
        
        // Remove the original items
        window.InventorySystem.items[caddySlot] = null;
        window.InventorySystem.items[chipSlot] = null;
        
        // Create AI Caddy
        const aiCaddy = {
            id: `ai_caddy_${Date.now()}`,
            name: 'Künstlicher Intelligenz-Caddy',
            icon: '🤖',
            type: 'office',
            effect: 'aiCaddyBonus',
            value: 3, // Point bonus
            successBonus: 5, // Success bonus
            description: 'Ein revolutionärer AI-Caddy! Verleiht +3 Punkte und +5% Erfolgsbonus!',
            placeable: true
        };
        
        // Add AI Caddy to first available slot (guaranteed to have space since we removed 2 items)
        for (let i = 0; i < window.InventorySystem.slots; i++) {
            if (window.InventorySystem.items[i] === null) {
                window.InventorySystem.items[i] = aiCaddy;
                break;
            }
        }
        
        window.InventorySystem.updateDisplay();
        this.showFusionSuccess();
    }
    
    showFusionSuccess() {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            background: #27AE60;
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            font-weight: bold;
            font-size: 18px;
            z-index: 1001;
            border: 4px solid #2ECC71;
            box-shadow: 0 8px 25px rgba(0,0,0,0.4);
            text-align: center;
        `;
        successDiv.innerHTML = `
            ✨ FUSION ERFOLGREICH! ✨<br>
            🤖 AI-Caddy erstellt!<br>
            <em style="font-size: 14px;">+3 Punkte & +5% Erfolgsbonus!</em>
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 4000);
    }
}

// Initialize fusion system
window.addEventListener('load', () => {
    window.FusionSystem = new FusionSystem();
});