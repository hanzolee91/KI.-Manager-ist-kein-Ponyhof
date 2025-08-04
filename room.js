// Room Management System for KI-Manager Game
class RoomSystem {
    constructor() {
        this.isDragging = false;
        this.dragItem = null;
        this.dragOffset = { x: 0, y: 0 };
        this.selectedItem = null;
        this.gridSize = 16; // Snap to grid
        
        this.decorationSprites = new Map();
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.createDecorationSprites();
    }
    
    setupEventListeners() {
        const canvas = window.game.canvas;
        
        canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
        // Touch events for mobile
        canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
        canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
        
        // Prevent context menu on right click
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    createDecorationSprites() {
        // Create simple pixel art representations for each item type
        this.decorationSprites.set('desk', this.createDeskSprite());
        this.decorationSprites.set('plant', this.createPlantSprite());
        this.decorationSprites.set('monitor', this.createMonitorSprite());
        this.decorationSprites.set('coffee', this.createCoffeeSprite());
        this.decorationSprites.set('butler', this.createButlerSprite());
        this.decorationSprites.set('lasso', this.createLassoSprite());
        this.decorationSprites.set('carpet', this.createCarpetSprite());
        this.decorationSprites.set('poster', this.createPosterSprite());
        this.decorationSprites.set('whiteboard', this.createWhiteboardSprite());
    }
    
    createDeskSprite() {
        return {
            draw: (ctx, x, y, width, height) => {
                // Desk surface
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x, y + height - 8, width, 8);
                // Legs
                ctx.fillStyle = '#654321';
                ctx.fillRect(x + 2, y + height - 16, 4, 16);
                ctx.fillRect(x + width - 6, y + height - 16, 4, 16);
            }
        };
    }
    
    createPlantSprite() {
        return {
            draw: (ctx, x, y, width, height) => {
                // Pot
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x + 8, y + height - 12, width - 16, 12);
                // Plant
                ctx.fillStyle = '#228B22';
                ctx.fillRect(x + 12, y + 8, 8, height - 20);
                // Leaves
                ctx.fillRect(x + 8, y + 4, 4, 8);
                ctx.fillRect(x + 20, y + 4, 4, 8);
                ctx.fillRect(x + 6, y + 12, 4, 8);
                ctx.fillRect(x + 22, y + 12, 4, 8);
            }
        };
    }
    
    createMonitorSprite() {
        return {
            draw: (ctx, x, y, width, height) => {
                // Stand
                ctx.fillStyle = '#2F4F4F';
                ctx.fillRect(x + width/2 - 2, y + height - 8, 4, 8);
                // Screen frame
                ctx.fillStyle = '#000000';
                ctx.fillRect(x + 2, y + 4, width - 4, height - 16);
                // Screen
                ctx.fillStyle = '#00FF00';
                ctx.fillRect(x + 4, y + 6, width - 8, height - 20);
                // Screen content
                ctx.fillStyle = '#000000';
                for (let i = 0; i < 3; i++) {
                    ctx.fillRect(x + 6, y + 8 + i * 4, width - 12, 2);
                }
            }
        };
    }
    
    createCoffeeSprite() {
        return {
            draw: (ctx, x, y, width, height) => {
                // Machine body
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x + 4, y + 8, width - 8, height - 16);
                // Water tank
                ctx.fillStyle = '#4682B4';
                ctx.fillRect(x + 6, y + 10, width - 12, 8);
                // Spout
                ctx.fillStyle = '#654321';
                ctx.fillRect(x + width/2 - 2, y + height - 12, 4, 4);
                // Steam
                ctx.fillStyle = '#F5F5F5';
                ctx.fillRect(x + width/2 - 1, y + 4, 1, 4);
                ctx.fillRect(x + width/2 + 1, y + 2, 1, 4);
            }
        };
    }
    
    createButlerSprite() {
        return {
            draw: (ctx, x, y, width, height) => {
                // Holographic base
                ctx.fillStyle = '#4682B4';
                ctx.fillRect(x + 8, y + height - 4, width - 16, 4);
                // Body (translucent)
                ctx.globalAlpha = 0.7;
                ctx.fillStyle = '#87CEEB';
                ctx.fillRect(x + 10, y + 8, width - 20, height - 16);
                // Head
                ctx.fillRect(x + 12, y + 4, width - 24, 8);
                ctx.globalAlpha = 1;
                // Eyes
                ctx.fillStyle = '#000080';
                ctx.fillRect(x + 14, y + 6, 2, 2);
                ctx.fillRect(x + width - 16, y + 6, 2, 2);
            }
        };
    }
    
    createLassoSprite() {
        return {
            draw: (ctx, x, y, width, height) => {
                // Rope handle
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x + width/2 - 2, y + height - 12, 4, 12);
                // Rope coil
                ctx.strokeStyle = '#DAA520';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let i = 0; i < 3; i++) {
                    ctx.arc(x + width/2, y + 8 + i * 6, 6 + i * 2, 0, Math.PI * 2);
                }
                ctx.stroke();
            }
        };
    }
    
    createCarpetSprite() {
        return {
            draw: (ctx, x, y, width, height) => {
                // Main carpet
                ctx.fillStyle = '#DC143C';
                ctx.fillRect(x, y + height - 8, width, 8);
                // Pattern
                ctx.fillStyle = '#B22222';
                for (let i = 0; i < width; i += 8) {
                    ctx.fillRect(x + i, y + height - 6, 4, 2);
                }
                // Tassels
                ctx.fillStyle = '#8B0000';
                ctx.fillRect(x - 2, y + height - 4, 2, 4);
                ctx.fillRect(x + width, y + height - 4, 2, 4);
            }
        };
    }
    
    createPosterSprite() {
        return {
            draw: (ctx, x, y, width, height) => {
                // Frame
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x, y, width, height);
                // Image area
                ctx.fillStyle = '#FF6347';
                ctx.fillRect(x + 2, y + 2, width - 4, height - 4);
                // "Image" content
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(x + 4, y + 4, width - 8, 8);
                ctx.fillStyle = '#000000';
                ctx.fillRect(x + 6, y + 6, width - 12, 4);
            }
        };
    }
    
    createWhiteboardSprite() {
        return {
            draw: (ctx, x, y, width, height) => {
                // Board
                ctx.fillStyle = '#F5F5F5';
                ctx.fillRect(x, y, width, height);
                // Frame
                ctx.strokeStyle = '#C0C0C0';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, width, height);
                // Text lines
                ctx.fillStyle = '#4169E1';
                for (let i = 0; i < 3; i++) {
                    ctx.fillRect(x + 4, y + 6 + i * 6, width - 8, 2);
                }
            }
        };
    }
    
    getMousePos(e) {
        const rect = window.game.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    getTouchPos(e) {
        const rect = window.game.canvas.getBoundingClientRect();
        const touch = e.touches[0] || e.changedTouches[0];
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }
    
    snapToGrid(value) {
        return Math.round(value / this.gridSize) * this.gridSize;
    }
    
    findItemAt(x, y) {
        // Find topmost item at position (reverse order for z-index)
        for (let i = window.game.items.length - 1; i >= 0; i--) {
            const item = window.game.items[i];
            if (x >= item.x && x <= item.x + item.width &&
                y >= item.y && y <= item.y + item.height) {
                return { item, index: i };
            }
        }
        return null;
    }
    
    onMouseDown(e) {
        if (window.game.gameState !== 'playing') return;
        
        const pos = this.getMousePos(e);
        const found = this.findItemAt(pos.x, pos.y);
        
        if (found && e.button === 0) { // Left click
            this.startDrag(found.item, pos);
        } else if (found && e.button === 2) { // Right click
            this.showItemMenu(found.item, pos);
        }
    }
    
    onMouseMove(e) {
        if (!this.isDragging) return;
        
        const pos = this.getMousePos(e);
        this.updateDrag(pos);
    }
    
    onMouseUp(e) {
        if (this.isDragging) {
            this.endDrag();
        }
    }
    
    onTouchStart(e) {
        e.preventDefault();
        if (window.game.gameState !== 'playing') return;
        
        const pos = this.getTouchPos(e);
        const found = this.findItemAt(pos.x, pos.y);
        
        if (found) {
            this.startDrag(found.item, pos);
        }
    }
    
    onTouchMove(e) {
        e.preventDefault();
        if (!this.isDragging) return;
        
        const pos = this.getTouchPos(e);
        this.updateDrag(pos);
    }
    
    onTouchEnd(e) {
        e.preventDefault();
        if (this.isDragging) {
            this.endDrag();
        }
    }
    
    startDrag(item, pos) {
        this.isDragging = true;
        this.dragItem = item;
        this.selectedItem = item;
        this.dragOffset = {
            x: pos.x - item.x,
            y: pos.y - item.y
        };
        
        // Visual feedback
        this.dragItem.isDragging = true;
    }
    
    updateDrag(pos) {
        if (!this.dragItem) return;
        
        // Update position with grid snapping
        this.dragItem.x = this.snapToGrid(pos.x - this.dragOffset.x);
        this.dragItem.y = this.snapToGrid(pos.y - this.dragOffset.y);
        
        // Keep within canvas bounds
        this.dragItem.x = Math.max(0, Math.min(
            window.game.canvas.width - this.dragItem.width,
            this.dragItem.x
        ));
        this.dragItem.y = Math.max(0, Math.min(
            window.game.canvas.height - this.dragItem.height,
            this.dragItem.y
        ));
    }
    
    endDrag() {
        if (this.dragItem) {
            this.dragItem.isDragging = false;
        }
        
        this.isDragging = false;
        this.dragItem = null;
        this.dragOffset = { x: 0, y: 0 };
    }
    
    showItemMenu(item, pos) {
        // Simple context menu (could be expanded)
        const menu = document.createElement('div');
        menu.style.cssText = `
            position: fixed;
            left: ${pos.x}px;
            top: ${pos.y}px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 8px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        
        menu.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">${item.icon} ${this.getItemName(item.id)}</div>
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">${this.getItemDescription(item.id)}</div>
            <button onclick="this.parentElement.remove()" style="width: 100%; padding: 4px;">Schließen</button>
        `;
        
        document.body.appendChild(menu);
        
        // Remove menu after a few seconds or on click elsewhere
        setTimeout(() => {
            if (document.body.contains(menu)) {
                document.body.removeChild(menu);
            }
        }, 3000);
    }
    
    getItemName(id) {
        const names = {
            desk: 'Schreibtisch',
            plant: 'Pflanze',
            monitor: 'KI-Monitor',
            coffee: 'Kaffeemaschine',
            butler: 'Hologramm-Butler',
            lasso: 'Lasso',
            carpet: 'Teppich',
            poster: 'Poster',
            whiteboard: 'Whiteboard'
        };
        return names[id] || 'Unbekannt';
    }
    
    getItemDescription(id) {
        const descriptions = {
            desk: '+1 Punkt pro richtiger Antwort',
            plant: 'Erhöht freundliche Reaktionen',
            monitor: 'Hebt Keywords hervor',
            coffee: 'Kürzere Wartezeit',
            butler: 'Gibt Tipps',
            lasso: 'Zum Pony-Fangen',
            carpet: 'Mildert Punktabzug',
            poster: '+1% Erfolgsanzeige',
            whiteboard: 'Zeigt vorherige Fragen'
        };
        return descriptions[id] || 'Keine Beschreibung';
    }
    
    render(ctx) {
        // Render all items
        window.game.items.forEach(item => {
            this.renderItem(ctx, item);
        });
        
        // Draw grid if dragging
        if (this.isDragging) {
            this.drawGrid(ctx);
        }
        
        // Highlight selected item
        if (this.selectedItem && !this.isDragging) {
            this.drawSelectionHighlight(ctx, this.selectedItem);
        }
    }
    
    renderItem(ctx, item) {
        const sprite = this.decorationSprites.get(item.id);
        
        if (sprite) {
            // Apply dragging effect
            if (item.isDragging) {
                ctx.globalAlpha = 0.7;
                ctx.save();
                ctx.translate(item.x + item.width/2, item.y + item.height/2);
                ctx.scale(1.1, 1.1);
                ctx.translate(-item.width/2, -item.height/2);
                sprite.draw(ctx, 0, 0, item.width, item.height);
                ctx.restore();
                ctx.globalAlpha = 1;
            } else {
                sprite.draw(ctx, item.x, item.y, item.width, item.height);
            }
        } else {
            // Fallback rendering
            ctx.fillStyle = item.color || '#888';
            ctx.fillRect(item.x, item.y, item.width, item.height);
            
            // Draw icon if available
            if (item.icon) {
                ctx.fillStyle = '#fff';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(
                    item.icon,
                    item.x + item.width / 2,
                    item.y + item.height / 2 + 6
                );
                ctx.textAlign = 'left';
            }
        }
    }
    
    drawGrid(ctx) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < window.game.canvas.width; x += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, window.game.canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < window.game.canvas.height; y += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(window.game.canvas.width, y);
            ctx.stroke();
        }
    }
    
    drawSelectionHighlight(ctx, item) {
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(item.x - 2, item.y - 2, item.width + 4, item.height + 4);
        ctx.setLineDash([]);
    }
    
    // Auto-arrange items
    autoArrange() {
        const margin = 16;
        const itemsPerRow = Math.floor((window.game.canvas.width - margin * 2) / (32 + margin));
        
        window.game.items.forEach((item, index) => {
            const row = Math.floor(index / itemsPerRow);
            const col = index % itemsPerRow;
            
            item.x = margin + col * (32 + margin);
            item.y = margin + row * (32 + margin);
        });
    }
    
    // Save/load room layout (could be expanded for persistence)
    saveLayout() {
        const layout = window.game.items.map(item => ({
            id: item.id,
            x: item.x,
            y: item.y
        }));
        localStorage.setItem('kiManagerRoomLayout', JSON.stringify(layout));
    }
    
    loadLayout() {
        const saved = localStorage.getItem('kiManagerRoomLayout');
        if (saved) {
            const layout = JSON.parse(saved);
            layout.forEach(savedItem => {
                const item = window.game.items.find(i => i.id === savedItem.id);
                if (item) {
                    item.x = savedItem.x;
                    item.y = savedItem.y;
                }
            });
        }
    }
}

// Initialize room system
window.addEventListener('load', () => {
    window.RoomSystem = new RoomSystem();
});