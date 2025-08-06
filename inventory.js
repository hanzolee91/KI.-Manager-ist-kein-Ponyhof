// Inventar System für KI-Manager Spiel
class InventorySystem {
    constructor() {
        this.slots = 24; // 6x4 Grid
        this.items = new Array(this.slots).fill(null);
        this.draggedItem = null;
        this.draggedFromSlot = null;
        this.element = document.getElementById('inventory');
        
        this.init();
    }
    
    init() {
        this.createSlots();
        this.setupEventListeners();
    }
    
    createSlots() {
        // Clear existing slots
        this.element.innerHTML = '<div id="inventoryTitle">Inventar</div>';
        
        for (let i = 0; i < this.slots; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.dataset.slotIndex = i;
            this.element.appendChild(slot);
        }
    }
    
    setupEventListeners() {
        // Drag and drop for inventory items
        this.element.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('inventory-item')) {
                this.startDrag(e);
            }
        });
        
        this.element.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        this.element.addEventListener('drop', (e) => {
            e.preventDefault();
            this.handleDrop(e);
        });
        
        // Mouse events for better drag experience
        this.element.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('inventory-item')) {
                this.startMouseDrag(e);
            }
        });
        
        // Tooltip events
        this.element.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('inventory-item')) {
                this.showTooltip(e);
            }
        });
        
        this.element.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('inventory-item')) {
                this.hideTooltip();
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            this.handleMouseDrag(e);
        });
        
        document.addEventListener('mouseup', (e) => {
            this.endMouseDrag(e);
        });
    }
    
    startDrag(e) {
        const slot = e.target.closest('.inventory-slot');
        const slotIndex = parseInt(slot.dataset.slotIndex);
        
        this.draggedItem = this.items[slotIndex];
        this.draggedFromSlot = slotIndex;
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
        
        e.target.classList.add('dragging');
    }
    
    startMouseDrag(e) {
        const slot = e.target.closest('.inventory-slot');
        const slotIndex = parseInt(slot.dataset.slotIndex);
        
        this.draggedItem = this.items[slotIndex];
        this.draggedFromSlot = slotIndex;
        
        e.target.classList.add('dragging');
        
        // Create ghost element for dragging
        this.ghostElement = e.target.cloneNode(true);
        this.ghostElement.style.position = 'absolute';
        this.ghostElement.style.pointerEvents = 'none';
        this.ghostElement.style.zIndex = '1000';
        this.ghostElement.style.opacity = '0.7';
        document.body.appendChild(this.ghostElement);
        
        this.updateGhostPosition(e);
    }
    
    handleMouseDrag(e) {
        if (this.ghostElement) {
            this.updateGhostPosition(e);
        }
    }
    
    updateGhostPosition(e) {
        if (this.ghostElement) {
            this.ghostElement.style.left = (e.clientX - 16) + 'px';
            this.ghostElement.style.top = (e.clientY - 16) + 'px';
        }
    }
    
    endMouseDrag(e) {
        if (this.ghostElement) {
            document.body.removeChild(this.ghostElement);
            this.ghostElement = null;
        }
        
        if (this.draggedItem) {
            // Check if dropped on inventory slot
            const targetSlot = document.elementFromPoint(e.clientX, e.clientY);
            if (targetSlot && targetSlot.classList.contains('inventory-slot')) {
                this.handleSlotDrop(targetSlot);
            } else {
                // Check if dropped on canvas (to place item in office)
                const canvas = document.getElementById('gameCanvas');
                const rect = canvas.getBoundingClientRect();
                
                if (e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top && e.clientY <= rect.bottom) {
                    this.placeItemInOffice(e.clientX - rect.left, e.clientY - rect.top);
                }
            }
            
            this.endDrag();
        }
    }
    
    handleDrop(e) {
        const targetSlot = e.target.closest('.inventory-slot');
        if (targetSlot) {
            this.handleSlotDrop(targetSlot);
        }
        this.endDrag();
    }
    
    handleSlotDrop(targetSlot) {
        const targetIndex = parseInt(targetSlot.dataset.slotIndex);
        
        if (targetIndex !== this.draggedFromSlot) {
            // Swap items or move to empty slot
            const targetItem = this.items[targetIndex];
            this.items[targetIndex] = this.draggedItem;
            this.items[this.draggedFromSlot] = targetItem;
            
            this.updateDisplay();
        }
    }
    
    placeItemInOffice(canvasX, canvasY) {
        if (this.draggedItem && this.draggedItem.placeable) {
            // Add item to office at mouse position
            const officeItem = {
                id: this.draggedItem.id,
                x: canvasX - 16,
                y: canvasY - 16,
                width: 32,
                height: 32,
                icon: this.draggedItem.icon,
                effect: this.draggedItem.effect,
                value: this.draggedItem.value,
                type: this.draggedItem.type || 'decoration'
            };
            
            // Add to game items
            if (window.game) {
                window.game.items.push(officeItem);
            }
            
            // Remove from inventory
            this.items[this.draggedFromSlot] = null;
            this.updateDisplay();
            
            // Show placement effect
            this.showPlacementEffect(this.draggedItem.name);
        }
    }
    
    showPlacementEffect(itemName) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #27AE60;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
            font-family: 'Courier New', monospace;
        `;
        effect.textContent = `${itemName} im Büro platziert!`;
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (document.body.contains(effect)) {
                document.body.removeChild(effect);
            }
        }, 2000);
    }
    
    endDrag() {
        // Remove dragging class from all items
        document.querySelectorAll('.inventory-item.dragging').forEach(item => {
            item.classList.remove('dragging');
        });
        
        this.draggedItem = null;
        this.draggedFromSlot = null;
    }
    
    addItem(item) {
        // Find first empty slot
        for (let i = 0; i < this.slots; i++) {
            if (this.items[i] === null) {
                this.items[i] = {
                    ...item,
                    placeable: item.type !== 'powerup' // Only non-powerups can be placed
                };
                this.updateDisplay();
                return true;
            }
        }
        
        // Inventory full
        this.showInventoryFullMessage();
        return false;
    }
    
    showInventoryFullMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #E74C3C;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
            font-family: 'Courier New', monospace;
        `;
        message.textContent = 'Inventar ist voll!';
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 2000);
    }
    
    removeItem(slotIndex) {
        if (slotIndex >= 0 && slotIndex < this.slots) {
            this.items[slotIndex] = null;
            this.updateDisplay();
        }
    }
    
    updateDisplay() {
        const slots = this.element.querySelectorAll('.inventory-slot');
        
        slots.forEach((slot, index) => {
            const item = this.items[index];
            
            // Clear slot
            slot.innerHTML = '';
            slot.classList.remove('occupied');
            
            if (item) {
                slot.classList.add('occupied');
                
                const itemElement = document.createElement('div');
                itemElement.className = 'inventory-item';
                itemElement.draggable = true;
                itemElement.textContent = item.icon;
                itemElement.title = `${item.name}\n${item.description}`;
                
                slot.appendChild(itemElement);
            }
        });
    }
    
    hasItem(itemId) {
        return this.items.some(item => item && item.id === itemId);
    }
    
    getItemCount(itemId) {
        return this.items.filter(item => item && item.id === itemId).length;
    }
    
    useItem(itemId) {
        // Find and remove one instance of the item
        for (let i = 0; i < this.slots; i++) {
            if (this.items[i] && this.items[i].id === itemId) {
                const item = this.items[i];
                this.items[i] = null;
                this.updateDisplay();
                return item;
            }
        }
        return null;
    }
    
    showTooltip(e) {
        const slot = e.target.closest('.inventory-slot');
        const slotIndex = parseInt(slot.dataset.slotIndex);
        const item = this.items[slotIndex];
        
        if (!item) return;
        
        // Remove existing tooltip
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.id = 'inventoryTooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: linear-gradient(145deg, #2C3E50, #34495E);
            color: #ECF0F1;
            padding: 10px 12px;
            border-radius: 6px;
            border: 2px solid #3498DB;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 200px;
            word-wrap: break-word;
            animation: tooltipFadeIn 0.2s ease-out;
        `;
        
        tooltip.innerHTML = `
            <div style="font-weight: bold; color: #F1C40F; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 14px;">${item.icon}</span>
                <span>${item.name}</span>
            </div>
            <div style="color: #BDC3C7; font-size: 11px; line-height: 1.3;">
                ${item.description}
            </div>
            ${item.effect ? `<div style="color: #2ECC71; font-size: 10px; margin-top: 6px;">
                Effekt: ${this.getEffectDescription(item.effect)}
            </div>` : ''}
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = slot.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + rect.width + 10;
        let top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        
        // Keep tooltip on screen
        if (left + tooltipRect.width > window.innerWidth) {
            left = rect.left - tooltipRect.width - 10;
        }
        if (top < 0) {
            top = 10;
        }
        if (top + tooltipRect.height > window.innerHeight) {
            top = window.innerHeight - tooltipRect.height - 10;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }
    
    hideTooltip() {
        const tooltip = document.getElementById('inventoryTooltip');
        if (tooltip) {
            tooltip.style.animation = 'tooltipFadeOut 0.15s ease-in forwards';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 150);
        }
    }
    
    getEffectDescription(effect) {
        const descriptions = {
            pointBonus: 'Bonus-Punkte pro Antwort',
            successBonus: 'Erhöht Erfolgsrate',
            mood: 'Verbessert Stimmung',
            highlight: 'Hebt wichtige Wörter hervor',
            speed: 'Beschleunigt Gameplay',
            tips: 'Gibt hilfreiche Tipps',
            ponyCapture: 'Fängt entlaufene Ponys',
            protection: 'Reduziert Punktverlust',
            memory: 'Merkt sich Antworten',
            ponyAttraction: 'Lockt Ponys an',
            memoryBoost: 'Temporärer Gedächtnisschub',
            fusionCore: 'Ermöglicht erweiterte Fusionen',
            fusionReactor: 'Ultimative Fusion-Technologie',
            mysteryBox: 'Zufällige Überraschung',
            debugDuck: 'Hilft beim Problemlösen',
            quantumSnack: 'Quanten-Effekte',
            focusShield: 'Schützt vor Ablenkung',
            stressRelief: 'Beruhigt bei Fehlern',
            ironicMotivation: 'Ironische Motivation',
            probability: 'Zeigt Antwort-Wahrscheinlichkeiten',
            forgetfulness: 'Löscht schlechte Erinnerungen',
            chaosMode: 'Zufällige Chaos-Effekte',
            prestige: 'Prestigeobjekt',
            aiCore: 'KI-verstärkte Fähigkeiten',
            metaReality: 'Realitäts-Manipulation',
            timeManipulation: 'Zeit-Verzerrung',
            neuralBoost: 'Gehirn-Verstärkung'
        };
        return descriptions[effect] || 'Unbekannter Effekt';
    }

    // Get inventory data for saving
    getData() {
        return {
            items: this.items.filter(item => item !== null)
        };
    }
    
    // Load inventory data
    loadData(data) {
        if (data && data.items) {
            this.items = new Array(this.slots).fill(null);
            data.items.forEach((item, index) => {
                if (index < this.slots) {
                    this.items[index] = item;
                }
            });
            this.updateDisplay();
        }
    }
}

// Initialize inventory system
window.addEventListener('load', () => {
    window.InventorySystem = new InventorySystem();
});