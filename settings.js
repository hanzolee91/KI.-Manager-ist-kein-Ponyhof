// Settings System für KI-Manager Game
class SettingsSystem {
    constructor() {
        this.settings = {
            // Audio Settings
            masterVolume: 70,
            musicVolume: 50,
            sfxVolume: 80,
            muteAll: false,
            
            // Video Settings
            pixelArt: true,
            animations: true,
            particleEffects: true,
            screenShake: true,
            
            // Gameplay Settings
            autoSave: true,
            autoSaveInterval: 30,
            showHints: true,
            showFPS: false,
            difficultyMode: 'normal', // easy, normal, hard, expert
            
            // UI Settings
            fontSize: 16,
            uiScale: 100,
            colorblindMode: false,
            highContrast: false,
            reducedMotion: false,
            
            // Advanced Settings
            debugMode: false,
            showConsole: false,
            experimentalFeatures: false
        };
        
        this.loadSettings();
        this.init();
    }
    
    init() {
        this.createSettingsUI();
        this.applySettings();
        this.setupEventListeners();
    }
    
    createSettingsUI() {
        // Add settings button to top bar
        const topBar = document.getElementById('topBar');
        if (topBar) {
            const settingsButton = document.createElement('button');
            settingsButton.id = 'settingsButton';
            settingsButton.innerHTML = '⚙️ Einstellungen';
            settingsButton.style.cssText = `
                padding: 8px 16px;
                background: #7F8C8D;
                border: 3px solid #95A5A6;
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
            
            settingsButton.addEventListener('click', () => this.showSettingsDialog());
            settingsButton.addEventListener('mouseenter', () => {
                settingsButton.style.background = '#95A5A6';
                settingsButton.style.borderStyle = 'inset';
            });
            settingsButton.addEventListener('mouseleave', () => {
                settingsButton.style.background = '#7F8C8D';
                settingsButton.style.borderStyle = 'outset';
            });
            
            topBar.appendChild(settingsButton);
        }
        
        this.createSettingsDialog();
    }
    
    createSettingsDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'settingsDialog';
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
            z-index: 1700;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: linear-gradient(145deg, #2C3E50, #34495E);
            color: #ECF0F1;
            padding: 30px;
            border-radius: 20px;
            max-width: 900px;
            max-height: 85vh;
            overflow-y: auto;
            border: 4px solid #7F8C8D;
            box-shadow: 0 0 40px rgba(127, 140, 141, 0.5);
        `;
        
        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="color: #7F8C8D; margin: 0; font-size: 28px;">⚙️ Spieleinstellungen</h2>
                <button id="closeSettings" style="background: #E74C3C; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-size: 16px;">✖</button>
            </div>
            
            <div style="display: flex; gap: 20px; margin-bottom: 25px;">
                <button id="audioTab" class="settings-tab-button active" style="padding: 10px 20px; background: #7F8C8D; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">🔊 Audio</button>
                <button id="videoTab" class="settings-tab-button" style="padding: 10px 20px; background: #5D6D7E; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">🎮 Video</button>
                <button id="gameplayTab" class="settings-tab-button" style="padding: 10px 20px; background: #5D6D7E; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">🎯 Gameplay</button>
                <button id="uiTab" class="settings-tab-button" style="padding: 10px 20px; background: #5D6D7E; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">🖥️ UI</button>
                <button id="advancedTab" class="settings-tab-button" style="padding: 10px 20px; background: #5D6D7E; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">🔧 Erweitert</button>
            </div>
            
            <div id="settingsContent"></div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #5D6D7E; display: flex; gap: 15px; justify-content: center;">
                <button onclick="window.SettingsSystem.resetToDefaults()" style="padding: 10px 20px; background: #E74C3C; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">🔄 Zurücksetzen</button>
                <button onclick="window.SettingsSystem.exportSettings()" style="padding: 10px 20px; background: #3498DB; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">📤 Exportieren</button>
                <button onclick="window.SettingsSystem.importSettings()" style="padding: 10px 20px; background: #2ECC71; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">📥 Importieren</button>
            </div>
        `;
        
        dialog.appendChild(content);
        document.body.appendChild(dialog);
        
        // Event listeners
        document.getElementById('closeSettings').addEventListener('click', () => this.hideSettingsDialog());
        document.getElementById('audioTab').addEventListener('click', () => this.switchSettingsTab('audio'));
        document.getElementById('videoTab').addEventListener('click', () => this.switchSettingsTab('video'));
        document.getElementById('gameplayTab').addEventListener('click', () => this.switchSettingsTab('gameplay'));
        document.getElementById('uiTab').addEventListener('click', () => this.switchSettingsTab('ui'));
        document.getElementById('advancedTab').addEventListener('click', () => this.switchSettingsTab('advanced'));
        
        this.switchSettingsTab('audio');
    }
    
    switchSettingsTab(tab) {
        // Update tab appearance
        document.querySelectorAll('.settings-tab-button').forEach(btn => {
            btn.style.background = '#5D6D7E';
            btn.classList.remove('active');
        });
        
        const activeTab = document.getElementById(tab + 'Tab');
        if (activeTab) {
            activeTab.style.background = '#7F8C8D';
            activeTab.classList.add('active');
        }
        
        // Update content
        const content = document.getElementById('settingsContent');
        if (content) {
            switch (tab) {
                case 'audio':
                    this.renderAudioTab(content);
                    break;
                case 'video':
                    this.renderVideoTab(content);
                    break;
                case 'gameplay':
                    this.renderGameplayTab(content);
                    break;
                case 'ui':
                    this.renderUITab(content);
                    break;
                case 'advanced':
                    this.renderAdvancedTab(content);
                    break;
            }
        }
    }
    
    renderAudioTab(content) {
        content.innerHTML = `
            <div>
                <h3 style="color: #7F8C8D; margin-bottom: 20px;">🔊 Audio-Einstellungen</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div style="padding: 15px; background: rgba(52, 73, 94, 0.3); border-radius: 10px;">
                        <h4 style="color: #ECF0F1; margin-top: 0;">🎵 Lautstärke-Einstellungen</h4>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">Master-Lautstärke: <span id="masterVolumeValue">${this.settings.masterVolume}%</span></label>
                            <input type="range" id="masterVolume" min="0" max="100" value="${this.settings.masterVolume}" style="width: 100%;">
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">Musik-Lautstärke: <span id="musicVolumeValue">${this.settings.musicVolume}%</span></label>
                            <input type="range" id="musicVolume" min="0" max="100" value="${this.settings.musicVolume}" style="width: 100%;">
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">Sound-Effekte: <span id="sfxVolumeValue">${this.settings.sfxVolume}%</span></label>
                            <input type="range" id="sfxVolume" min="0" max="100" value="${this.settings.sfxVolume}" style="width: 100%;">
                        </div>
                        
                        <div>
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="muteAll" ${this.settings.muteAll ? 'checked' : ''}>
                                🔇 Alle Töne stumm schalten
                            </label>
                        </div>
                    </div>
                    
                    <div style="padding: 15px; background: rgba(52, 73, 94, 0.3); border-radius: 10px;">
                        <h4 style="color: #ECF0F1; margin-top: 0;">🎼 Audio-Informationen</h4>
                        <div style="font-size: 14px; color: #BDC3C7;">
                            <div style="margin-bottom: 10px;">🎵 Titel-Musik: KI-Manager ist KEIN Ponyhof.mp3</div>
                            <div style="margin-bottom: 10px;">🎮 Spiel-Musik: Untitled.mp3</div>
                            <div style="margin-bottom: 10px;">📊 Audio-Status: ${this.getAudioStatus()}</div>
                            <div style="margin-bottom: 10px;">🔊 Browser unterstützt: ${this.checkAudioSupport()}</div>
                        </div>
                        
                        <div style="margin-top: 15px;">
                            <button onclick="window.SettingsSystem.testAudio()" style="padding: 8px 16px; background: #3498DB; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                                🔊 Audio testen
                            </button>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(241, 196, 15, 0.1); border-radius: 10px; border-left: 4px solid #F1C40F;">
                    <h4 style="color: #F1C40F; margin-top: 0;">💡 Audio-Tipps</h4>
                    <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
                        <li>Musik wird automatisch beim Spielstart abgespielt</li>
                        <li>Bei Problemen: Browser neustarten oder andere Seiten schließen</li>
                        <li>Manche Browser blockieren Auto-Play - einfach irgendwo klicken</li>
                        <li>Kopfhörer empfohlen für beste Klangqualität!</li>
                    </ul>
                </div>
            </div>
        `;
        
        this.setupVolumeSliders();
    }
    
    renderVideoTab(content) {
        content.innerHTML = `
            <div>
                <h3 style="color: #7F8C8D; margin-bottom: 20px;">🎮 Video & Grafik-Einstellungen</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div style="padding: 15px; background: rgba(52, 73, 94, 0.3); border-radius: 10px;">
                        <h4 style="color: #ECF0F1; margin-top: 0;">🖼️ Grafik-Qualität</h4>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="pixelArt" ${this.settings.pixelArt ? 'checked' : ''}>
                                🎨 Pixel-Art Modus (knackige Kanten)
                            </label>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="animations" ${this.settings.animations ? 'checked' : ''}>
                                ✨ Animationen aktiviert
                            </label>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="particleEffects" ${this.settings.particleEffects ? 'checked' : ''}>
                                🎆 Partikel-Effekte
                            </label>
                        </div>
                        
                        <div>
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="screenShake" ${this.settings.screenShake ? 'checked' : ''}>
                                📳 Bildschirm-Wackeln bei Effekten
                            </label>
                        </div>
                    </div>
                    
                    <div style="padding: 15px; background: rgba(52, 73, 94, 0.3); border-radius: 10px;">
                        <h4 style="color: #ECF0F1; margin-top: 0;">📊 Performance-Info</h4>
                        <div style="font-size: 14px; color: #BDC3C7;">
                            <div style="margin-bottom: 10px;">🖥️ Canvas-Größe: 640x480</div>
                            <div style="margin-bottom: 10px;">🎯 Rendering: Canvas 2D</div>
                            <div style="margin-bottom: 10px;">⚡ Browser: ${navigator.userAgent.split(' ')[0]}</div>
                            <div style="margin-bottom: 10px;">💾 Speicher: ~${this.estimateMemoryUsage()} MB</div>
                        </div>
                        
                        <div style="margin-top: 15px;">
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="showFPS" ${this.settings.showFPS ? 'checked' : ''}>
                                📈 FPS-Counter anzeigen
                            </label>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(155, 89, 182, 0.1); border-radius: 10px; border-left: 4px solid #9B59B6;">
                    <h4 style="color: #9B59B6; margin-top: 0;">⚡ Performance-Tipps</h4>
                    <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
                        <li>Bei Laggen: Partikel-Effekte deaktivieren</li>
                        <li>Pixel-Art Modus für authentisches Retro-Gefühl</li>
                        <li>Animationen deaktivieren spart Batterie auf Laptops</li>
                        <li>FPS-Counter hilft bei Performance-Problemen</li>
                    </ul>
                </div>
            </div>
        `;
        
        this.setupVideoControls();
    }
    
    renderGameplayTab(content) {
        content.innerHTML = `
            <div>
                <h3 style="color: #7F8C8D; margin-bottom: 20px;">🎯 Gameplay-Einstellungen</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div style="padding: 15px; background: rgba(52, 73, 94, 0.3); border-radius: 10px;">
                        <h4 style="color: #ECF0F1; margin-top: 0;">💾 Speicher-Einstellungen</h4>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="autoSave" ${this.settings.autoSave ? 'checked' : ''}>
                                🔄 Automatisches Speichern
                            </label>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">Auto-Save Intervall: <span id="autoSaveIntervalValue">${this.settings.autoSaveInterval}s</span></label>
                            <input type="range" id="autoSaveInterval" min="10" max="300" step="10" value="${this.settings.autoSaveInterval}" style="width: 100%;">
                        </div>
                    </div>
                    
                    <div style="padding: 15px; background: rgba(52, 73, 94, 0.3); border-radius: 10px;">
                        <h4 style="color: #ECF0F1; margin-top: 0;">🎓 Schwierigkeitsgrad</h4>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">Schwierigkeit:</label>
                            <select id="difficultyMode" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #BDC3C7;">
                                <option value="easy" ${this.settings.difficultyMode === 'easy' ? 'selected' : ''}>😊 Einfach (+50% Punkte, mehr Hints)</option>
                                <option value="normal" ${this.settings.difficultyMode === 'normal' ? 'selected' : ''}>😐 Normal (Standard)</option>
                                <option value="hard" ${this.settings.difficultyMode === 'hard' ? 'selected' : ''}>😤 Schwer (Weniger Zeit, -25% Punkte)</option>
                                <option value="expert" ${this.settings.difficultyMode === 'expert' ? 'selected' : ''}>🤯 Experte (Hardcore, nur für Profis!)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="showHints" ${this.settings.showHints ? 'checked' : ''}>
                                💡 Hilfen und Tipps anzeigen
                            </label>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(52, 152, 219, 0.1); border-radius: 10px; border-left: 4px solid #3498DB;">
                    <h4 style="color: #3498DB; margin-top: 0;">🎮 Schwierigkeitsgrad-Effekte</h4>
                    <div style="font-size: 14px; color: #BDC3C7;">
                        <div style="margin-bottom: 8px;"><strong>😊 Einfach:</strong> +50% Punkte, mehr Hints, längere Antwortzeit</div>
                        <div style="margin-bottom: 8px;"><strong>😐 Normal:</strong> Standard-Spielerlebnis</div>
                        <div style="margin-bottom: 8px;"><strong>😤 Schwer:</strong> Weniger Zeit, -25% Punkte, weniger Hints</div>
                        <div><strong>🤯 Experte:</strong> Hardcore-Modus, minimale Hints, Zeitdruck</div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupGameplayControls();
    }
    
    renderUITab(content) {
        content.innerHTML = `
            <div>
                <h3 style="color: #7F8C8D; margin-bottom: 20px;">🖥️ Benutzeroberfläche</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div style="padding: 15px; background: rgba(52, 73, 94, 0.3); border-radius: 10px;">
                        <h4 style="color: #ECF0F1; margin-top: 0;">🔤 Text & Schrift</h4>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">Schriftgröße: <span id="fontSizeValue">${this.settings.fontSize}px</span></label>
                            <input type="range" id="fontSize" min="12" max="24" value="${this.settings.fontSize}" style="width: 100%;">
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">UI-Skalierung: <span id="uiScaleValue">${this.settings.uiScale}%</span></label>
                            <input type="range" id="uiScale" min="75" max="150" step="5" value="${this.settings.uiScale}" style="width: 100%;">
                        </div>
                    </div>
                    
                    <div style="padding: 15px; background: rgba(52, 73, 94, 0.3); border-radius: 10px;">
                        <h4 style="color: #ECF0F1; margin-top: 0;">♿ Barrierefreiheit</h4>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="colorblindMode" ${this.settings.colorblindMode ? 'checked' : ''}>
                                🌈 Farbenblind-freundliche Farben
                            </label>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="highContrast" ${this.settings.highContrast ? 'checked' : ''}>
                                ⚫ Hoher Kontrast
                            </label>
                        </div>
                        
                        <div>
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="reducedMotion" ${this.settings.reducedMotion ? 'checked' : ''}>
                                🚫 Bewegungen reduzieren
                            </label>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(230, 126, 34, 0.1); border-radius: 10px; border-left: 4px solid #E67E22;">
                    <h4 style="color: #E67E22; margin-top: 0;">🎨 Design-Vorschau</h4>
                    <div style="padding: 15px; background: rgba(52, 73, 94, 0.5); border-radius: 8px; border: 2px solid #3498DB; margin-top: 10px;">
                        <div style="font-size: ${this.settings.fontSize}px; margin-bottom: 10px;">📝 Beispiel-Text in gewählter Schriftgröße</div>
                        <div style="display: flex; gap: 10px;">
                            <div style="padding: 8px 16px; background: #3498DB; color: white; border-radius: 4px; transform: scale(${this.settings.uiScale/100});">Button</div>
                            <div style="padding: 8px 16px; background: ${this.settings.highContrast ? '#FFFFFF' : '#27AE60'}; color: ${this.settings.highContrast ? '#000000' : 'white'}; border-radius: 4px; transform: scale(${this.settings.uiScale/100});">Kontrast</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupUIControls();
    }
    
    renderAdvancedTab(content) {
        content.innerHTML = `
            <div>
                <h3 style="color: #7F8C8D; margin-bottom: 20px;">🔧 Erweiterte Einstellungen</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div style="padding: 15px; background: rgba(52, 73, 94, 0.3); border-radius: 10px;">
                        <h4 style="color: #ECF0F1; margin-top: 0;">🐛 Debug & Entwicklung</h4>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="debugMode" ${this.settings.debugMode ? 'checked' : ''}>
                                🐛 Debug-Modus aktivieren
                            </label>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="showConsole" ${this.settings.showConsole ? 'checked' : ''}>
                                📟 Konsolen-Ausgaben anzeigen
                            </label>
                        </div>
                        
                        <div>
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" id="experimentalFeatures" ${this.settings.experimentalFeatures ? 'checked' : ''}>
                                🧪 Experimentelle Features
                            </label>
                        </div>
                    </div>
                    
                    <div style="padding: 15px; background: rgba(52, 73, 94, 0.3); border-radius: 10px;">
                        <h4 style="color: #ECF0F1; margin-top: 0;">📊 System-Informationen</h4>
                        <div style="font-size: 14px; color: #BDC3C7; font-family: monospace;">
                            <div style="margin-bottom: 8px;">Browser: ${navigator.userAgent.split(' ')[0]}</div>
                            <div style="margin-bottom: 8px;">Plattform: ${navigator.platform}</div>
                            <div style="margin-bottom: 8px;">Sprache: ${navigator.language}</div>
                            <div style="margin-bottom: 8px;">Online: ${navigator.onLine ? '✅' : '❌'}</div>
                            <div style="margin-bottom: 8px;">Cookies: ${navigator.cookieEnabled ? '✅' : '❌'}</div>
                            <div style="margin-bottom: 8px;">LocalStorage: ${this.checkLocalStorageSupport()}</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(231, 76, 60, 0.1); border-radius: 10px; border-left: 4px solid #E74C3C;">
                    <h4 style="color: #E74C3C; margin-top: 0;">⚠️ Warnung - Erweiterte Einstellungen</h4>
                    <div style="font-size: 14px; color: #BDC3C7;">
                        <div style="margin-bottom: 8px;">Debug-Modus kann die Performance beeinträchtigen</div>
                        <div style="margin-bottom: 8px;">Experimentelle Features können instabil sein</div>
                        <div>Konsolen-Ausgaben nur für Entwickler relevant</div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; display: flex; gap: 15px; justify-content: center;">
                    <button onclick="window.SettingsSystem.clearCache()" style="padding: 10px 20px; background: #F39C12; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">🗑️ Cache leeren</button>
                    <button onclick="window.SettingsSystem.runDiagnostics()" style="padding: 10px 20px; background: #9B59B6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">🔍 System-Check</button>
                </div>
            </div>
        `;
        
        this.setupAdvancedControls();
    }
    
    setupVolumeSliders() {
        const sliders = ['masterVolume', 'musicVolume', 'sfxVolume'];
        
        sliders.forEach(slider => {
            const element = document.getElementById(slider);
            const valueDisplay = document.getElementById(slider + 'Value');
            
            if (element) {
                element.addEventListener('input', (e) => {
                    const value = parseInt(e.target.value);
                    this.settings[slider] = value;
                    if (valueDisplay) valueDisplay.textContent = value + '%';
                    this.applyAudioSettings();
                    this.saveSettings();
                });
            }
        });
        
        const muteCheckbox = document.getElementById('muteAll');
        if (muteCheckbox) {
            muteCheckbox.addEventListener('change', (e) => {
                this.settings.muteAll = e.target.checked;
                this.applyAudioSettings();
                this.saveSettings();
            });
        }
    }
    
    setupVideoControls() {
        const checkboxes = ['pixelArt', 'animations', 'particleEffects', 'screenShake', 'showFPS'];
        
        checkboxes.forEach(checkbox => {
            const element = document.getElementById(checkbox);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.settings[checkbox] = e.target.checked;
                    this.applyVideoSettings();
                    this.saveSettings();
                });
            }
        });
    }
    
    setupGameplayControls() {
        const autoSaveCheckbox = document.getElementById('autoSave');
        if (autoSaveCheckbox) {
            autoSaveCheckbox.addEventListener('change', (e) => {
                this.settings.autoSave = e.target.checked;
                this.applyGameplaySettings();
                this.saveSettings();
            });
        }
        
        const intervalSlider = document.getElementById('autoSaveInterval');
        const intervalValue = document.getElementById('autoSaveIntervalValue');
        if (intervalSlider) {
            intervalSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.settings.autoSaveInterval = value;
                if (intervalValue) intervalValue.textContent = value + 's';
                this.applyGameplaySettings();
                this.saveSettings();
            });
        }
        
        const difficultySelect = document.getElementById('difficultyMode');
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                this.settings.difficultyMode = e.target.value;
                this.applyGameplaySettings();
                this.saveSettings();
            });
        }
        
        const showHintsCheckbox = document.getElementById('showHints');
        if (showHintsCheckbox) {
            showHintsCheckbox.addEventListener('change', (e) => {
                this.settings.showHints = e.target.checked;
                this.saveSettings();
            });
        }
    }
    
    setupUIControls() {
        const fontSizeSlider = document.getElementById('fontSize');
        const fontSizeValue = document.getElementById('fontSizeValue');
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.settings.fontSize = value;
                if (fontSizeValue) fontSizeValue.textContent = value + 'px';
                this.applyUISettings();
                this.saveSettings();
            });
        }
        
        const uiScaleSlider = document.getElementById('uiScale');
        const uiScaleValue = document.getElementById('uiScaleValue');
        if (uiScaleSlider) {
            uiScaleSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.settings.uiScale = value;
                if (uiScaleValue) uiScaleValue.textContent = value + '%';
                this.applyUISettings();
                this.saveSettings();
            });
        }
        
        const checkboxes = ['colorblindMode', 'highContrast', 'reducedMotion'];
        checkboxes.forEach(checkbox => {
            const element = document.getElementById(checkbox);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.settings[checkbox] = e.target.checked;
                    this.applyUISettings();
                    this.saveSettings();
                });
            }
        });
    }
    
    setupAdvancedControls() {
        const checkboxes = ['debugMode', 'showConsole', 'experimentalFeatures'];
        checkboxes.forEach(checkbox => {
            const element = document.getElementById(checkbox);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.settings[checkbox] = e.target.checked;
                    this.applyAdvancedSettings();
                    this.saveSettings();
                });
            }
        });
    }
    
    setupEventListeners() {
        // ESC key to close settings
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const dialog = document.getElementById('settingsDialog');
                if (dialog && !dialog.classList.contains('hidden')) {
                    this.hideSettingsDialog();
                }
            }
        });
    }
    
    showSettingsDialog() {
        const dialog = document.getElementById('settingsDialog');
        if (dialog) {
            dialog.classList.remove('hidden');
            this.switchSettingsTab('audio');
        }
    }
    
    hideSettingsDialog() {
        const dialog = document.getElementById('settingsDialog');
        if (dialog) {
            dialog.classList.add('hidden');
        }
    }
    
    applySettings() {
        this.applyAudioSettings();
        this.applyVideoSettings();
        this.applyGameplaySettings();
        this.applyUISettings();
        this.applyAdvancedSettings();
    }
    
    applyAudioSettings() {
        // Apply to title music
        if (window.titleScreen && window.titleScreen.titleMusic) {
            const volume = this.settings.muteAll ? 0 : (this.settings.masterVolume * this.settings.musicVolume) / 10000;
            window.titleScreen.titleMusic.volume = Math.max(0, Math.min(1, volume));
        }
        
        // Apply to game music
        if (window.game && window.game.gameMusic) {
            const volume = this.settings.muteAll ? 0 : (this.settings.masterVolume * this.settings.musicVolume) / 10000;
            window.game.gameMusic.volume = Math.max(0, Math.min(1, volume));
        }
    }
    
    applyVideoSettings() {
        const gameCanvas = document.getElementById('gameCanvas');
        if (gameCanvas) {
            gameCanvas.style.imageRendering = this.settings.pixelArt ? 'pixelated' : 'auto';
        }
        
        document.body.style.setProperty('--animations-enabled', this.settings.animations ? '1' : '0');
        document.body.style.setProperty('--particles-enabled', this.settings.particleEffects ? '1' : '0');
    }
    
    applyGameplaySettings() {
        // Apply auto-save settings
        if (window.SaveGameSystem) {
            if (this.settings.autoSave) {
                window.SaveGameSystem.autoSaveInterval = this.settings.autoSaveInterval * 1000;
                window.SaveGameSystem.startAutoSave();
            } else {
                window.SaveGameSystem.toggleAutoSave();
            }
        }
    }
    
    applyUISettings() {
        document.body.style.fontSize = this.settings.fontSize + 'px';
        document.body.style.transform = `scale(${this.settings.uiScale / 100})`;
        document.body.style.transformOrigin = 'top left';
        
        if (this.settings.highContrast) {
            document.body.style.filter = 'contrast(150%) brightness(120%)';
        } else {
            document.body.style.filter = 'none';
        }
        
        if (this.settings.reducedMotion) {
            document.body.style.setProperty('--animation-duration', '0.1s');
        } else {
            document.body.style.setProperty('--animation-duration', '0.3s');
        }
    }
    
    applyAdvancedSettings() {
        if (this.settings.debugMode) {
            window.DEBUG_MODE = true;
            console.log('🐛 Debug mode enabled');
        } else {
            window.DEBUG_MODE = false;
        }
        
        if (this.settings.showConsole && !document.getElementById('debugConsole')) {
            this.createDebugConsole();
        } else if (!this.settings.showConsole && document.getElementById('debugConsole')) {
            const console = document.getElementById('debugConsole');
            if (console) console.remove();
        }
    }
    
    createDebugConsole() {
        const console = document.createElement('div');
        console.id = 'debugConsole';
        console.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            width: 400px;
            height: 200px;
            background: rgba(0, 0, 0, 0.9);
            color: #00FF00;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 10px;
            border: 2px solid #00FF00;
            border-radius: 5px;
            z-index: 1800;
            overflow-y: auto;
        `;
        console.innerHTML = '<div>🐛 Debug Console aktiviert</div>';
        document.body.appendChild(console);
    }
    
    // Utility methods
    getAudioStatus() {
        if (this.settings.muteAll) return '🔇 Stumm';
        return '🔊 Aktiv';
    }
    
    checkAudioSupport() {
        const audio = document.createElement('audio');
        const mp3Support = audio.canPlayType('audio/mpeg');
        return mp3Support ? '✅ MP3' : '❌ Eingeschränkt';
    }
    
    estimateMemoryUsage() {
        return '~5-10'; // Rough estimate
    }
    
    checkLocalStorageSupport() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return '✅ Verfügbar';
        } catch (e) {
            return '❌ Nicht verfügbar';
        }
    }
    
    // Public methods
    resetToDefaults() {
        if (confirm('Alle Einstellungen auf Standard zurücksetzen?')) {
            // Reset to default settings (keeping the constructor values)
            this.settings = {
                masterVolume: 70,
                musicVolume: 50,
                sfxVolume: 80,
                muteAll: false,
                pixelArt: true,
                animations: true,
                particleEffects: true,
                screenShake: true,
                autoSave: true,
                autoSaveInterval: 30,
                showHints: true,
                showFPS: false,
                difficultyMode: 'normal',
                fontSize: 16,
                uiScale: 100,
                colorblindMode: false,
                highContrast: false,
                reducedMotion: false,
                debugMode: false,
                showConsole: false,
                experimentalFeatures: false
            };
            
            this.saveSettings();
            this.applySettings();
            this.switchSettingsTab('audio'); // Refresh display
            
            this.showSettingsNotification('🔄 Einstellungen zurückgesetzt!');
        }
    }
    
    exportSettings() {
        try {
            const data = {
                version: '1.0',
                timestamp: Date.now(),
                settings: this.settings
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `ki-manager-settings-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showSettingsNotification('📤 Einstellungen exportiert!');
        } catch (e) {
            this.showSettingsNotification('❌ Export fehlgeschlagen!', 'error');
        }
    }
    
    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.settings) {
                        Object.assign(this.settings, data.settings);
                        this.saveSettings();
                        this.applySettings();
                        this.switchSettingsTab('audio'); // Refresh display
                        this.showSettingsNotification('📥 Einstellungen importiert!');
                    } else {
                        throw new Error('Ungültiges Format');
                    }
                } catch (e) {
                    this.showSettingsNotification('❌ Ungültige Datei!', 'error');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    testAudio() {
        this.showSettingsNotification('🔊 Audio-Test...', 'info');
        
        // Test with a simple beep sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1 * (this.settings.masterVolume / 100), audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        setTimeout(() => {
            this.showSettingsNotification('🔊 Audio-Test abgeschlossen!');
        }, 600);
    }
    
    clearCache() {
        if (confirm('Browser-Cache und temporäre Daten löschen?')) {
            // Clear any cached data
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => {
                        caches.delete(name);
                    });
                });
            }
            
            this.showSettingsNotification('🗑️ Cache geleert!');
        }
    }
    
    runDiagnostics() {
        this.showSettingsNotification('🔍 System-Check läuft...', 'info');
        
        setTimeout(() => {
            const results = {
                browser: navigator.userAgent.includes('Chrome') ? '✅' : '⚠️',
                localStorage: this.checkLocalStorageSupport().includes('✅') ? '✅' : '❌',
                audio: this.checkAudioSupport().includes('✅') ? '✅' : '❌',
                canvas: document.createElement('canvas').getContext ? '✅' : '❌',
                performance: performance.now() ? '✅' : '❌'
            };
            
            const passed = Object.values(results).filter(r => r === '✅').length;
            const total = Object.keys(results).length;
            
            this.showSettingsNotification(`🔍 System-Check: ${passed}/${total} Tests bestanden`);
        }, 1500);
    }
    
    showSettingsNotification(message, type = 'success') {
        const colors = {
            success: 'linear-gradient(145deg, #27AE60, #229954)',
            error: 'linear-gradient(145deg, #E74C3C, #C0392B)',
            info: 'linear-gradient(145deg, #3498DB, #2980B9)'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.success};
            color: white;
            padding: 12px 18px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            z-index: 2000;
            transform: translateX(400px);
            transition: all 0.3s ease;
            font-size: 14px;
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
    
    saveSettings() {
        localStorage.setItem('kimanager_settings', JSON.stringify(this.settings));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('kimanager_settings');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                Object.assign(this.settings, data);
            } catch (e) {
                console.warn('Failed to load settings:', e);
            }
        }
    }
    
    // Public getters for other systems
    getSetting(key) {
        return this.settings[key];
    }
    
    setSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.applySettings();
    }
}

// Initialize settings system
window.addEventListener('load', () => {
    window.SettingsSystem = new SettingsSystem();
});