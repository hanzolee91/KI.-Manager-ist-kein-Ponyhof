// Animierter Titelbildschirm für KI-Manager Spiel
class TitleScreen {
    constructor() {
        this.isActive = true;
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = 0;
        this.clouds = [];
        this.particles = [];
        this.titleGlow = 0;
        this.buttonPulse = 0;
        
        this.init();
    }
    
    init() {
        this.createTitleScreen();
        this.setupAnimations();
        this.setupAudio();
        this.startAnimation();
    }
    
    createTitleScreen() {
        // Erstelle Overlay-Container
        const titleContainer = document.createElement('div');
        titleContainer.id = 'titleScreen';
        titleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #F0E68C 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            font-family: 'Courier New', monospace;
        `;
        
        // Titel-Canvas für Animationen (16:9 Format)
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 450;
        canvas.style.cssText = `
            border: 4px solid #8B4513;
            border-radius: 15px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            background: url('titelbild.png') center/cover;
            image-rendering: pixelated;
        `;
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Spielstart-Button
        const startButton = document.createElement('button');
        startButton.id = 'startGameButton';
        startButton.textContent = '🎮 Spiel starten! 🎮';
        startButton.style.cssText = `
            margin-top: 30px;
            padding: 15px 40px;
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(45deg, #FF6B35, #F7931E);
            color: white;
            border: 4px solid #D2691E;
            border-radius: 15px;
            cursor: pointer;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
            font-family: 'Courier New', monospace;
        `;
        
        startButton.addEventListener('click', () => this.startGame());
        startButton.addEventListener('mouseenter', () => {
            startButton.style.transform = 'scale(1.1) translateY(-2px)';
            startButton.style.boxShadow = '0 12px 30px rgba(0,0,0,0.4)';
        });
        startButton.addEventListener('mouseleave', () => {
            startButton.style.transform = 'scale(1) translateY(0px)';
            startButton.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
        });
        
        // Untertitel
        const subtitle = document.createElement('div');
        subtitle.style.cssText = `
            margin-top: 20px;
            font-size: 16px;
            color: #2C3E50;
            text-align: center;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
            max-width: 600px;
            line-height: 1.4;
        `;
        subtitle.innerHTML = `
            <div style="margin-bottom: 10px;">
                <strong>🤖 Das ultimative KI-Management Abenteuer! 🤖</strong>
            </div>
            <div style="font-size: 14px;">
                Beantworte DEKRA-Zertifizierungsfragen, sammle Items, fange Ponys,<br>
                triff spezielle NPCs und werde zum KI-Experten!
            </div>
        `;
        
        titleContainer.appendChild(canvas);
        titleContainer.appendChild(startButton);
        titleContainer.appendChild(subtitle);
        document.body.appendChild(titleContainer);
    }
    
    setupAnimations() {
        // Wolken für Hintergrund-Animation
        for (let i = 0; i < 8; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * 150 + 50,
                speed: Math.random() * 0.5 + 0.2,
                size: Math.random() * 40 + 20,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
        
        // Glitzer-Partikel
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: Math.random() * 100,
                maxLife: 100,
                color: ['#FFD700', '#FF69B4', '#00CED1', '#98FB98'][Math.floor(Math.random() * 4)]
            });
        }
    }
    
    setupAudio() {
        // Title Screen Soundtrack
        this.titleMusic = document.createElement('audio');
        this.titleMusic.src = 'KI-Manager ist KEIN Ponyhof.mp3';
        this.titleMusic.loop = true;
        this.titleMusic.volume = 0.7;
        
        // Variable für Musik-Status
        this.isMusicPlaying = false;
        
        // Auto-start der Musik versuchen
        this.attemptAutoPlay();
    }
    
    attemptAutoPlay() {
        // Mehrere Versuche für Auto-Play
        const tryPlay = (attempt = 1) => {
            if (!this.isActive) return;
            
            this.titleMusic.play().then(() => {
                this.isMusicPlaying = true;
                console.log('Titel-Musik erfolgreich gestartet');
            }).catch(e => {
                console.log(`Auto-Play Versuch ${attempt} fehlgeschlagen:`, e.message);
                
                if (attempt < 3) {
                    // Nochmal versuchen nach kurzer Zeit
                    setTimeout(() => tryPlay(attempt + 1), 500);
                } else {
                    // Fallback: Bei User-Interaktion starten
                    this.setupFallbackStart();
                }
            });
        };
        
        // Erster Versuch nach kurzer Verzögerung
        setTimeout(() => tryPlay(1), 200);
    }
    
    setupFallbackStart() {
        // Event-Listener für User-Interaktion
        const startOnInteraction = () => {
            if (this.isActive && !this.isMusicPlaying) {
                this.titleMusic.play().then(() => {
                    this.isMusicPlaying = true;
                    console.log('Titel-Musik durch User-Interaktion gestartet');
                }).catch(e => {
                    console.log('Auch Fallback-Start fehlgeschlagen:', e);
                });
            }
        };
        
        // Verschiedene Events für maximale Kompatibilität
        document.addEventListener('click', startOnInteraction, { once: true });
        document.addEventListener('keydown', startOnInteraction, { once: true });
        document.addEventListener('touchstart', startOnInteraction, { once: true });
    }
    
    startAnimation() {
        if (!this.isActive) return;
        
        this.animationFrame++;
        this.titleGlow = Math.sin(this.animationFrame * 0.05) * 0.5 + 0.5;
        this.buttonPulse = Math.sin(this.animationFrame * 0.08) * 0.3 + 0.7;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Animierte Wolken
        this.drawClouds();
        
        // Glitzer-Effekte
        this.drawParticles();
        
        // Titel-Glow-Effekt
        this.drawTitleGlow();
        
        // Titel-Text
        this.drawTitleText();
        
        // Charaktere animieren (schweben/wippen)
        this.animateCharacters();
        
        // Button-Puls-Effekt
        const startButton = document.getElementById('startGameButton');
        if (startButton) {
            startButton.style.opacity = this.buttonPulse;
        }
        
        requestAnimationFrame(() => this.startAnimation());
    }
    
    drawClouds() {
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > this.canvas.width + cloud.size) {
                cloud.x = -cloud.size;
            }
            
            this.ctx.globalAlpha = cloud.opacity;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.size * 0.6, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.size * 1.2, cloud.y, cloud.size * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.life <= 0) {
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
                particle.life = particle.maxLife;
            }
            
            const alpha = particle.life / particle.maxLife;
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Glitzer-Stern-Effekt
            this.ctx.strokeStyle = particle.color;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x - 5, particle.y);
            this.ctx.lineTo(particle.x + 5, particle.y);
            this.ctx.moveTo(particle.x, particle.y - 5);
            this.ctx.lineTo(particle.x, particle.y + 5);
            this.ctx.stroke();
        });
        this.ctx.globalAlpha = 1;
    }
    
    drawTitleGlow() {
        // Animierter Glow-Effekt um den Titel (zentriert um neuen, tieferen Titel)
        const glowSize = 50 + this.titleGlow * 30;
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, 210, 0,
            this.canvas.width / 2, 210, glowSize
        );
        gradient.addColorStop(0, `rgba(255, 215, 0, ${this.titleGlow * 0.3})`);
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 110, this.canvas.width, 240);
    }
    
    drawTitleText() {
        // Zentraler Titel-Text
        this.ctx.save();
        
        // Schatten-Effekt
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 3;
        
        // Haupttitel (optimal zentriert in oberer Bildhälfte - Canvas ist 450px hoch)
        this.ctx.font = 'bold 48px "Courier New", monospace';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('KI-Manager', this.canvas.width / 2, 190);
        
        // Untertitel (entsprechend nach unten verschoben für bessere Optik)
        this.ctx.font = 'bold 24px "Courier New", monospace';
        this.ctx.fillStyle = '#FFA500';
        this.ctx.fillText('ist KEIN Ponyhof!', this.canvas.width / 2, 230);
        
        // Zusätzliche Glitzer-Effekte am Text (an neue Position angepasst)
        const pulse = Math.sin(this.animationFrame * 0.1) * 0.3 + 0.7;
        this.ctx.globalAlpha = pulse;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 46px "Courier New", monospace';
        this.ctx.fillText('KI-Manager', this.canvas.width / 2, 190);
        
        this.ctx.restore();
    }
    
    animateCharacters() {
        // Simuliere schwebende/wippende Charaktere
        const time = this.animationFrame * 0.02;
        
        // Manager (schwebend)
        const managerFloat = Math.sin(time) * 3;
        this.drawFloatingIcon('👨‍💼', 400, 350 + managerFloat, 32);
        
        // Roboter (rotierend)
        const robotRotation = time * 2;
        this.drawRotatingIcon('🤖', 150, 400, 28, robotRotation);
        
        // Entwickler (wippend)
        const devBob = Math.sin(time * 1.5) * 2;
        this.drawFloatingIcon('👨‍💻', 650, 380 + devBob, 30);
        
        // Pony (hüpfend)
        const ponyJump = Math.abs(Math.sin(time * 3)) * 8;
        this.drawFloatingIcon('🦄', 550, 420 - ponyJump, 24);
        
        // KI-Symbole (funkelnd)
        const aiPulse = Math.sin(time * 4) * 0.5 + 0.5;
        this.ctx.globalAlpha = aiPulse;
        this.drawFloatingIcon('🧠', 250, 300, 20);
        this.drawFloatingIcon('⚡', 700, 250, 18);
        this.ctx.globalAlpha = 1;
    }
    
    drawFloatingIcon(icon, x, y, size, rotation = 0) {
        this.ctx.save();
        this.ctx.translate(x, y);
        if (rotation) {
            this.ctx.rotate(rotation);
        }
        this.ctx.font = `${size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(icon, 0, 0);
        this.ctx.restore();
    }
    
    drawRotatingIcon(icon, x, y, size, rotation) {
        this.drawFloatingIcon(icon, x, y, size, rotation);
    }
    
    startGame() {
        this.isActive = false;
        
        // Musik stoppen
        if (this.titleMusic) {
            this.titleMusic.pause();
            this.titleMusic.currentTime = 0;
        }
        
        // Fade-out Animation
        const titleScreen = document.getElementById('titleScreen');
        titleScreen.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        titleScreen.style.opacity = '0';
        titleScreen.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            if (titleScreen.parentNode) {
                titleScreen.parentNode.removeChild(titleScreen);
            }
            // Spiel starten - warte bis Game existiert
            this.waitForGameAndStart();
        }, 1000);
        
        // Übergangs-Sound-Effekt (visuell)
        this.showStartEffect();
    }
    
    waitForGameAndStart() {
        if (window.game) {
            window.game.gameState = 'playing';
            // Stelle sicher, dass die Musik wirklich gestoppt ist
            if (this.titleMusic) {
                this.titleMusic.pause();
                this.titleMusic.currentTime = 0;
            }
            // Zeige Game-Elemente an
            const gameCanvas = document.getElementById('gameCanvas');
            const ui = document.getElementById('ui');
            const inventory = document.getElementById('inventory');
            
            if (gameCanvas) gameCanvas.style.display = 'block';
            if (ui) ui.style.display = 'block';
            if (inventory) inventory.style.display = 'grid';
            
            // Starte Ingame-Musik
            if (window.game.startGameMusic) {
                window.game.startGameMusic();
            }
        } else {
            // Warte bis Game geladen ist
            setTimeout(() => this.waitForGameAndStart(), 100);
        }
    }
    
    showStartEffect() {
        const effectDiv = document.createElement('div');
        effectDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            color: #FFD700;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.7);
            z-index: 10001;
            pointer-events: none;
            animation: startGameEffect 1s ease-out forwards;
        `;
        effectDiv.textContent = '🚀 Los geht\'s! 🚀';
        
        // CSS Animation hinzufügen
        const style = document.createElement('style');
        style.textContent = `
            @keyframes startGameEffect {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(effectDiv);
        
        setTimeout(() => {
            if (effectDiv.parentNode) {
                effectDiv.parentNode.removeChild(effectDiv);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 1000);
    }
}

// Titelbildschirm sofort beim Laden anzeigen
window.addEventListener('load', () => {
    // Sofort anzeigen ohne Delay
    window.titleScreen = new TitleScreen();
});