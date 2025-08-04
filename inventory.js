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