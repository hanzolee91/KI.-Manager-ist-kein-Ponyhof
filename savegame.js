// Comprehensive Savegame System für KI-Manager Game
class SaveGameSystem {
    constructor() {
        this.saveVersion = '1.0';
        this.autoSaveInterval = 30000; // 30 seconds
        this.autoSaveTimer = null;
        this.saveSlots = 3;
        this.currentSave = null;
        
        this.init();
    }
    
    init() {
        this.createSaveUI();
        this.startAutoSave();
        this.setupEventListeners();
    }
    
    createSaveUI() {
        // Add save button to top bar
        const topBar = document.getElementById('topBar');
        if (topBar) {
            const saveButton = document.createElement('button');
            saveButton.id = 'saveButton';
            saveButton.innerHTML = '💾 Speichern';
            saveButton.style.cssText = `
                padding: 8px 16px;
                background: #27AE60;
                border: 3px solid #2ECC71;
                border-style: outset;
                color: #FFFFFF;
                font-weight: bold;
                font-size: 16px;
                font-family: 'Courier New', monospace;
                cursor: pointer;
                transition: all 0.1s ease;
                image-rendering: pixelated;
                text-shadow: 1px 1px 0px #000000;
                margin-left: 10px;
            `;
            
            saveButton.addEventListener('click', () => this.showSaveDialog());
            saveButton.addEventListener('mouseenter', () => {
                saveButton.style.background = '#229954';
                saveButton.style.borderStyle = 'inset';
            });
            saveButton.addEventListener('mouseleave', () => {
                saveButton.style.background = '#27AE60';
                saveButton.style.borderStyle = 'outset';
            });
            
            topBar.appendChild(saveButton);
        }
        
        this.createSaveDialog();
    }
    
    createSaveDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'saveDialog';
        dialog.className = 'hidden';
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1600;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: linear-gradient(145deg, #2C3E50, #34495E);
            color: #ECF0F1;
            padding: 30px;
            border-radius: 20px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            border: 4px solid #27AE60;
            box-shadow: 0 0 40px rgba(39, 174, 96, 0.5);
        `;
        
        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="color: #27AE60; margin: 0; font-size: 28px;">💾 Spiel Speichern / Laden</h2>
                <button id="closeSaveDialog" style="background: #E74C3C; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-size: 16px;">✖</button>
            </div>
            
            <div style="display: flex; gap: 20px; margin-bottom: 25px;">
                <button id="saveTab" class="save-tab-button active" style="padding: 10px 20px; background: #27AE60; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Speichern</button>
                <button id="loadTab" class="save-tab-button" style="padding: 10px 20px; background: #7F8C8D; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Laden</button>
                <button id="exportTab" class="save-tab-button" style="padding: 10px 20px; background: #3498DB; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Export/Import</button>
            </div>
            
            <div id="saveContent"></div>
        `;
        
        dialog.appendChild(content);
        document.body.appendChild(dialog);
        
        // Event listeners
        document.getElementById('closeSaveDialog').addEventListener('click', () => this.hideSaveDialog());
        document.getElementById('saveTab').addEventListener('click', () => this.switchSaveTab('save'));
        document.getElementById('loadTab').addEventListener('click', () => this.switchSaveTab('load'));
        document.getElementById('exportTab').addEventListener('click', () => this.switchSaveTab('export'));
        
        this.switchSaveTab('save');
    }
    
    switchSaveTab(tab) {
        // Update tab appearance
        document.querySelectorAll('.save-tab-button').forEach(btn => {
            btn.style.background = '#7F8C8D';
            btn.classList.remove('active');
        });
        
        const activeTab = document.getElementById(tab + 'Tab');
        if (activeTab) {
            activeTab.style.background = tab === 'save' ? '#27AE60' : tab === 'load' ? '#F39C12' : '#3498DB';
            activeTab.classList.add('active');
        }
        
        // Update content
        const content = document.getElementById('saveContent');
        if (content) {
            switch (tab) {
                case 'save':
                    this.renderSaveTab(content);
                    break;
                case 'load':
                    this.renderLoadTab(content);
                    break;
                case 'export':
                    this.renderExportTab(content);
                    break;
            }
        }
    }
    
    renderSaveTab(content) {
        const saves = this.getAllSaves();
        
        let html = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #27AE60; margin-bottom: 15px;">💾 Spielstand speichern</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
        `;
        
        for (let i = 1; i <= this.saveSlots; i++) {
            const save = saves[`slot_${i}`];
            const isEmpty = !save;
            
            html += `
                <div style="padding: 15px; background: rgba(52, 73, 94, 0.3); border-radius: 10px; border: 2px solid ${isEmpty ? '#7F8C8D' : '#27AE60'};">
                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                        <h4 style="margin: 0; color: #ECF0F1;">Slot ${i}</h4>
                        ${!isEmpty ? '<span style="color: #2ECC71; font-size: 12px;">💾 Belegt</span>' : '<span style="color: #95A5A6; font-size: 12px;">📂 Leer</span>'}
                    </div>
                    
                    ${!isEmpty ? `
                        <div style="font-size: 12px; color: #BDC3C7; margin-bottom: 10px;">
                            <div>Level: ${save.level || 1}</div>
                            <div>Punkte: ${save.score || 0}</div>
                            <div>Ponies: ${save.poniesFound || 0}</div>
                            <div>${new Date(save.timestamp).toLocaleString()}</div>
                        </div>
                    ` : `
                        <div style="font-size: 12px; color: #95A5A6; margin-bottom: 10px;">
                            Leerer Speicherplatz
                        </div>
                    `}
                    
                    <button onclick="window.SaveGameSystem.saveToSlot(${i})" style="width: 100%; padding: 8px; background: #27AE60; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        ${isEmpty ? '💾 Speichern' : '💾 Überschreiben'}
                    </button>
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
            
            <div style="background: rgba(241, 196, 15, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #F1C40F;">
                <h4 style="color: #F1C40F; margin-top: 0;">🔄 Auto-Speichern</h4>
                <p style="margin: 5px 0; font-size: 14px;">Das Spiel speichert automatisch alle 30 Sekunden in einem speziellen Auto-Save-Slot.</p>
                <div style="margin-top: 10px;">
                    <button onclick="window.SaveGameSystem.toggleAutoSave()" style="padding: 8px 16px; background: ${this.autoSaveTimer ? '#E74C3C' : '#27AE60'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        ${this.autoSaveTimer ? '⏸️ Auto-Save pausieren' : '▶️ Auto-Save aktivieren'}
                    </button>
                </div>
            </div>
        `;
        
        content.innerHTML = html;
    }
    
    renderLoadTab(content) {
        const saves = this.getAllSaves();
        
        let html = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #F39C12; margin-bottom: 15px;">📂 Spielstand laden</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
        `;
        
        // Regular save slots
        for (let i = 1; i <= this.saveSlots; i++) {
            const save = saves[`slot_${i}`];
            const isEmpty = !save;
            
            html += `
                <div style="padding: 15px; background: rgba(52, 73, 94, 0.3); border-radius: 10px; border: 2px solid ${isEmpty ? '#7F8C8D' : '#F39C12'};">
                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                        <h4 style="margin: 0; color: #ECF0F1;">Slot ${i}</h4>
                        ${!isEmpty ? '<span style="color: #F39C12; font-size: 12px;">💾 Gespeichert</span>' : '<span style="color: #95A5A6; font-size: 12px;">📂 Leer</span>'}
                    </div>
                    
                    ${!isEmpty ? `
                        <div style="font-size: 12px; color: #BDC3C7; margin-bottom: 10px;">
                            <div>Level: ${save.level || 1} (${save.totalXP || 0} XP)</div>
                            <div>Punkte: ${save.score || 0}</div>
                            <div>Ponies: ${save.poniesFound || 0}</div>
                            <div>Items: ${save.itemsOwned || 0}</div>
                            <div>Spielzeit: ${this.formatPlayTime(save.playTime || 0)}</div>
                            <div>${new Date(save.timestamp).toLocaleString()}</div>
                        </div>
                        <div style="display: flex; gap: 5px;">
                            <button onclick="window.SaveGameSystem.loadFromSlot(${i})" style="flex: 1; padding: 8px; background: #F39C12; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                                📂 Laden
                            </button>
                            <button onclick="window.SaveGameSystem.deleteSlot(${i})" style="padding: 8px; background: #E74C3C; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                                🗑️
                            </button>
                        </div>
                    ` : `
                        <div style="font-size: 12px; color: #95A5A6; margin-bottom: 15px;">
                            Kein Spielstand vorhanden
                        </div>
                        <button disabled style="width: 100%; padding: 8px; background: #7F8C8D; color: #BDC3C7; border: none; border-radius: 5px; cursor: not-allowed;">
                            📂 Nicht verfügbar
                        </button>
                    `}
                </div>
            `;
        }
        
        // Auto-save slot
        const autoSave = saves['autosave'];
        html += `
                <div style="padding: 15px; background: rgba(52, 152, 219, 0.2); border-radius: 10px; border: 2px solid #3498DB;">
                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                        <h4 style="margin: 0; color: #3498DB;">🔄 Auto-Save</h4>
                        ${autoSave ? '<span style="color: #3498DB; font-size: 12px;">💾 Verfügbar</span>' : '<span style="color: #95A5A6; font-size: 12px;">📂 Leer</span>'}
                    </div>
                    
                    ${autoSave ? `
                        <div style="font-size: 12px; color: #BDC3C7; margin-bottom: 10px;">
                            <div>Level: ${autoSave.level || 1} (${autoSave.totalXP || 0} XP)</div>
                            <div>Punkte: ${autoSave.score || 0}</div>
                            <div>Automatisch gespeichert</div>
                            <div>${new Date(autoSave.timestamp).toLocaleString()}</div>
                        </div>
                        <button onclick="window.SaveGameSystem.loadFromSlot('autosave')" style="width: 100%; padding: 8px; background: #3498DB; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                            📂 Auto-Save laden
                        </button>
                    ` : `
                        <div style="font-size: 12px; color: #95A5A6; margin-bottom: 15px;">
                            Noch kein Auto-Save vorhanden
                        </div>
                        <button disabled style="width: 100%; padding: 8px; background: #7F8C8D; color: #BDC3C7; border: none; border-radius: 5px; cursor: not-allowed;">
                            📂 Nicht verfügbar
                        </button>
                    `}
                </div>
        `;
        
        html += '</div></div>';
        
        content.innerHTML = html;
    }
    
    renderExportTab(content) {
        content.innerHTML = `
            <div>
                <h3 style="color: #3498DB; margin-bottom: 15px;">📤 Export / Import</h3>
                
                <div style="margin-bottom: 25px; padding: 15px; background: rgba(52, 152, 219, 0.1); border-radius: 10px;">
                    <h4 style="color: #3498DB; margin-top: 0;">📤 Spielstand exportieren</h4>
                    <p style="font-size: 14px; margin-bottom: 15px;">Exportiere deinen aktuellen Spielstand als Datei, um ihn zu sichern oder auf einem anderen Gerät zu verwenden.</p>
                    <button onclick="window.SaveGameSystem.exportSave()" style="padding: 10px 20px; background: #3498DB; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        📤 Aktuellen Spielstand exportieren
                    </button>
                </div>
                
                <div style="margin-bottom: 25px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px;">
                    <h4 style="color: #2ECC71; margin-top: 0;">📥 Spielstand importieren</h4>
                    <p style="font-size: 14px; margin-bottom: 15px;">Lade einen exportierten Spielstand von einer Datei. Dies überschreibt deinen aktuellen Fortschritt!</p>
                    <input type="file" id="importFile" accept=".json,.kimanager" style="margin-bottom: 10px; padding: 8px; border: 1px solid #BDC3C7; border-radius: 4px; background: white; color: black;">
                    <br>
                    <button onclick="window.SaveGameSystem.importSave()" style="padding: 10px 20px; background: #2ECC71; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        📥 Spielstand importieren
                    </button>
                </div>
                
                <div style="margin-bottom: 25px; padding: 15px; background: rgba(231, 76, 60, 0.1); border-radius: 10px;">
                    <h4 style="color: #E74C3C; margin-top: 0;">🗑️ Alle Daten löschen</h4>
                    <p style="font-size: 14px; margin-bottom: 15px;">⚠️ Vorsicht! Dies löscht ALLE Speicherstände und setzt das Spiel komplett zurück!</p>
                    <button onclick="window.SaveGameSystem.clearAllData()" style="padding: 10px 20px; background: #E74C3C; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        🗑️ ALLE Daten löschen
                    </button>
                </div>
                
                <div style="padding: 15px; background: rgba(127, 140, 141, 0.1); border-radius: 10px;">
                    <h4 style="color: #7F8C8D; margin-top: 0;">📊 Speicher-Informationen</h4>
                    <div id="storageInfo" style="font-size: 14px; font-family: monospace;"></div>
                </div>
            </div>
        `;
        
        this.updateStorageInfo();
    }
    
    updateStorageInfo() {
        const info = document.getElementById('storageInfo');
        if (!info) return;
        
        const saves = this.getAllSaves();
        const saveCount = Object.keys(saves).length;
        const totalSize = JSON.stringify(saves).length;
        
        let usedStorage = 0;
        let totalStorage = 0;
        
        try {
            const testKey = 'localStorage_test';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    usedStorage += localStorage[key].length;
                }
            }
            
            // Rough estimate of localStorage limit (usually 5-10MB)
            totalStorage = 5 * 1024 * 1024; // 5MB
        } catch (e) {
            usedStorage = -1;
        }
        
        info.innerHTML = `
            <div>Speicherstände: ${saveCount}</div>
            <div>Spielstand-Größe: ${(totalSize / 1024).toFixed(2)} KB</div>
            ${usedStorage >= 0 ? `
                <div>Browser-Speicher: ${(usedStorage / 1024).toFixed(2)} KB / ${(totalStorage / 1024 / 1024).toFixed(1)} MB</div>
                <div>Speicher-Auslastung: ${((usedStorage / totalStorage) * 100).toFixed(1)}%</div>
            ` : '<div>Speicher-Info nicht verfügbar</div>'}
        `;
    }
    
    showSaveDialog() {
        const dialog = document.getElementById('saveDialog');
        if (dialog) {
            dialog.classList.remove('hidden');
            this.switchSaveTab('save');
        }
    }
    
    hideSaveDialog() {
        const dialog = document.getElementById('saveDialog');
        if (dialog) {
            dialog.classList.add('hidden');
        }
    }
    
    setupEventListeners() {
        // ESC key to close save dialog
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const dialog = document.getElementById('saveDialog');
                if (dialog && !dialog.classList.contains('hidden')) {
                    this.hideSaveDialog();
                }
            }
        });
        
        // Ctrl+S to save quickly
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.quickSave();
            }
        });
        
        // Before page unload, try to save
        window.addEventListener('beforeunload', () => {
            this.autoSave();
        });
    }
    
    collectGameData() {
        const data = {
            version: this.saveVersion,
            timestamp: Date.now(),
            
            // Core game state
            score: window.game?.score || 0,
            successRate: window.game?.successRate || 0,
            
            // Level system
            level: window.LevelSystem?.level || 1,
            xp: window.LevelSystem?.xp || 0,
            totalXP: window.LevelSystem?.totalXP || 0,
            competencies: window.LevelSystem?.competencies || {},
            
            // Achievement system
            achievements: window.AchievementSystem?.achievements || [],
            statistics: window.AchievementSystem?.statistics || {},
            
            // Inventory
            inventoryItems: window.InventorySystem?.items || [],
            
            // Shop
            ownedItems: Array.from(window.ShopSystem?.ownedItems || []),
            
            // Pony system
            caughtPonies: window.PonySystem?.caughtPonies || [],
            poniesFound: window.PonySystem?.caughtPonies?.length || 0,
            
            // Question progress
            usedQuestions: Array.from(window.game?.usedQuestions || []),
            
            // Calculated statistics
            itemsOwned: Array.from(window.ShopSystem?.ownedItems || []).length,
            playTime: this.calculatePlayTime()
        };
        
        return data;
    }
    
    calculatePlayTime() {
        const startTime = window.LevelSystem?.startTime || Date.now();
        return Date.now() - startTime;
    }
    
    formatPlayTime(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    }
    
    saveToSlot(slotNumber) {
        try {
            const data = this.collectGameData();
            const key = slotNumber === 'autosave' ? 'kimanager_autosave' : `kimanager_save_${slotNumber}`;
            
            localStorage.setItem(key, JSON.stringify(data));
            this.currentSave = slotNumber;
            
            // Only show notification for manual saves, not auto-saves
            if (slotNumber !== 'autosave') {
                this.showSaveNotification(`💾 Spielstand in Slot ${slotNumber} gespeichert!`);
                this.switchSaveTab('save'); // Refresh the save tab
            }
            
            console.log(`Game saved to slot ${slotNumber}`);
        } catch (e) {
            this.showSaveNotification(`❌ Fehler beim Speichern: ${e.message}`, 'error');
            console.error('Save failed:', e);
        }
    }
    
    loadFromSlot(slotNumber) {
        try {
            const key = slotNumber === 'autosave' ? 'kimanager_autosave' : `kimanager_save_${slotNumber}`;
            const saveData = localStorage.getItem(key);
            
            if (!saveData) {
                this.showSaveNotification(`❌ Kein Spielstand in Slot ${slotNumber} gefunden!`, 'error');
                return false;
            }
            
            const data = JSON.parse(saveData);
            this.restoreGameState(data);
            this.currentSave = slotNumber;
            
            this.showSaveNotification(`📂 Spielstand aus Slot ${slotNumber} geladen!`);
            this.hideSaveDialog();
            
            console.log(`Game loaded from slot ${slotNumber}`);
            return true;
        } catch (e) {
            this.showSaveNotification(`❌ Fehler beim Laden: ${e.message}`, 'error');
            console.error('Load failed:', e);
            return false;
        }
    }
    
    restoreGameState(data) {
        try {
            // Restore core game state
            if (window.game) {
                window.game.score = data.score || 0;
                window.game.successRate = data.successRate || 0;
                window.game.usedQuestions = new Set(data.usedQuestions || []);
                window.game.updateUI();
            }
            
            // Restore level system
            if (window.LevelSystem) {
                window.LevelSystem.level = data.level || 1;
                window.LevelSystem.xp = data.xp || 0;
                window.LevelSystem.totalXP = data.totalXP || 0;
                window.LevelSystem.competencies = data.competencies || {};
                window.LevelSystem.updateDisplay();
                window.LevelSystem.saveProgress();
            }
            
            // Restore achievement system
            if (window.AchievementSystem) {
                if (data.achievements) {
                    data.achievements.forEach(savedAch => {
                        const existing = window.AchievementSystem.achievements.find(a => a.id === savedAch.id);
                        if (existing) {
                            existing.progress = savedAch.progress;
                            existing.unlocked = savedAch.unlocked;
                        }
                    });
                }
                if (data.statistics) {
                    Object.assign(window.AchievementSystem.statistics, data.statistics);
                }
                window.AchievementSystem.saveProgress();
            }
            
            // Restore inventory
            if (window.InventorySystem && data.inventoryItems) {
                window.InventorySystem.items = data.inventoryItems;
                window.InventorySystem.updateDisplay();
            }
            
            // Restore shop
            if (window.ShopSystem && data.ownedItems) {
                window.ShopSystem.ownedItems = new Set(data.ownedItems);
            }
            
            // Restore ponies
            if (window.PonySystem && data.caughtPonies) {
                window.PonySystem.caughtPonies = data.caughtPonies;
            }
            
            console.log('Game state restored successfully');
        } catch (e) {
            console.error('Failed to restore game state:', e);
            throw new Error('Spielstand konnte nicht wiederhergestellt werden');
        }
    }
    
    deleteSlot(slotNumber) {
        if (confirm(`Wirklich Speicherstand aus Slot ${slotNumber} löschen?`)) {
            try {
                const key = `kimanager_save_${slotNumber}`;
                localStorage.removeItem(key);
                this.showSaveNotification(`🗑️ Slot ${slotNumber} gelöscht!`);
                this.switchSaveTab('load'); // Refresh the load tab
            } catch (e) {
                this.showSaveNotification(`❌ Fehler beim Löschen: ${e.message}`, 'error');
            }
        }
    }
    
    getAllSaves() {
        const saves = {};
        
        // Regular save slots
        for (let i = 1; i <= this.saveSlots; i++) {
            const key = `kimanager_save_${i}`;
            const save = localStorage.getItem(key);
            if (save) {
                try {
                    saves[`slot_${i}`] = JSON.parse(save);
                } catch (e) {
                    console.warn(`Failed to parse save slot ${i}:`, e);
                }
            }
        }
        
        // Auto-save
        const autoSave = localStorage.getItem('kimanager_autosave');
        if (autoSave) {
            try {
                saves['autosave'] = JSON.parse(autoSave);
            } catch (e) {
                console.warn('Failed to parse auto-save:', e);
            }
        }
        
        return saves;
    }
    
    quickSave() {
        this.saveToSlot('autosave');
    }
    
    autoSave() {
        if (this.autoSaveTimer) {
            this.saveToSlot('autosave');
        }
    }
    
    startAutoSave() {
        this.autoSaveTimer = setInterval(() => {
            this.autoSave();
        }, this.autoSaveInterval);
    }
    
    toggleAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        } else {
            this.startAutoSave();
        }
        this.switchSaveTab('save'); // Refresh save tab
    }
    
    exportSave() {
        try {
            const data = this.collectGameData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `ki-manager-save-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.kimanager`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showSaveNotification('📤 Spielstand exportiert!');
        } catch (e) {
            this.showSaveNotification(`❌ Export fehlgeschlagen: ${e.message}`, 'error');
        }
    }
    
    importSave() {
        const fileInput = document.getElementById('importFile');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showSaveNotification('❌ Bitte wähle eine Datei aus!', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm('Aktuellen Spielstand wirklich überschreiben?')) {
                    this.restoreGameState(data);
                    this.showSaveNotification('📥 Spielstand importiert!');
                    this.hideSaveDialog();
                }
            } catch (e) {
                this.showSaveNotification(`❌ Ungültige Datei: ${e.message}`, 'error');
            }
        };
        reader.readAsText(file);
    }
    
    clearAllData() {
        if (confirm('WARNUNG: Alle Speicherstände und der gesamte Fortschritt werden gelöscht!\n\nBist du dir WIRKLICH sicher?')) {
            if (confirm('LETZTE WARNUNG: Dies kann nicht rückgängig gemacht werden!\n\nAlle Daten löschen?')) {
                try {
                    // Clear all save-related localStorage
                    const keysToRemove = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key.startsWith('kimanager_')) {
                            keysToRemove.push(key);
                        }
                    }
                    
                    keysToRemove.forEach(key => localStorage.removeItem(key));
                    
                    this.showSaveNotification('🗑️ Alle Daten gelöscht! Seite wird neu geladen...');
                    
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                    
                } catch (e) {
                    this.showSaveNotification(`❌ Fehler beim Löschen: ${e.message}`, 'error');
                }
            }
        }
    }
    
    showSaveNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'linear-gradient(145deg, #E74C3C, #C0392B)' : 'linear-gradient(145deg, #27AE60, #229954)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            z-index: 2000;
            transform: translateX(400px);
            transition: all 0.3s ease;
            border: 3px solid ${type === 'error' ? '#C0392B' : '#229954'};
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            max-width: 300px;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize save system
window.addEventListener('load', () => {
    window.SaveGameSystem = new SaveGameSystem();
});