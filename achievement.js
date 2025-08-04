// Achievement System für KI-Manager Game
class AchievementSystem {
    constructor() {
        this.achievements = [
            {
                id: 'first_question',
                name: '🎯 Erster Versuch',
                description: 'Beantworte deine erste Frage',
                icon: '🎯',
                unlocked: false,
                progress: 0,
                maxProgress: 1,
                category: 'basics'
            },
            {
                id: 'ki_guru',
                name: '🧠 KI-Guru',
                description: 'Beantworte 100 Fragen richtig',
                icon: '🧠',
                unlocked: false,
                progress: 0,
                maxProgress: 100,
                category: 'mastery'
            },
            {
                id: 'pony_whisperer',
                name: '🦄 Pony-Flüsterer',
                description: 'Fange 5 verschiedene Pony-Arten',
                icon: '🦄',
                unlocked: false,
                progress: 0,
                maxProgress: 5,
                category: 'ponies'
            },
            {
                id: 'fusion_master',
                name: '⚗️ Fusionsmeister',
                description: 'Führe 10 erfolgreiche Item-Fusionen durch',
                icon: '⚗️',
                unlocked: false,
                progress: 0,
                maxProgress: 10,
                category: 'crafting'
            },
            {
                id: 'shopaholic',
                name: '🛒 Shopaholic',
                description: 'Kaufe 20 Items im Shop',
                icon: '🛒',
                unlocked: false,
                progress: 0,
                maxProgress: 20,
                category: 'economics'
            },
            {
                id: 'perfectionist',
                name: '✨ Perfektionist',
                description: 'Beantworte 20 Fragen perfekt hintereinander',
                icon: '✨',
                unlocked: false,
                progress: 0,
                maxProgress: 20,
                category: 'skill'
            },
            {
                id: 'speed_demon',
                name: '⚡ Blitzdenker',
                description: 'Beantworte 10 Fragen in unter 5 Sekunden',
                icon: '⚡',
                unlocked: false,
                progress: 0,
                maxProgress: 10,
                category: 'speed'
            },
            {
                id: 'ethics_expert',
                name: '⚖️ Ethik-Experte',
                description: 'Beantworte 25 Ethik-Fragen richtig',
                icon: '⚖️',
                unlocked: false,
                progress: 0,
                maxProgress: 25,
                category: 'specialization'
            },
            {
                id: 'point_collector',
                name: '💎 Punktesammler',
                description: 'Erreiche 1000 Punkte',
                icon: '💎',
                unlocked: false,
                progress: 0,
                maxProgress: 1000,
                category: 'progression'
            },
            {
                id: 'office_decorator',
                name: '🏢 Büro-Designer',
                description: 'Platziere 15 Items in deinem Büro',
                icon: '🏢',
                unlocked: false,
                progress: 0,
                maxProgress: 15,
                category: 'decoration'
            },
            {
                id: 'lucky_streak',
                name: '🍀 Glückspilz',
                description: 'Erhalte 5 richtige Antworten durch Zufall',
                icon: '🍀',
                unlocked: false,
                progress: 0,
                maxProgress: 5,
                category: 'luck'
            },
            {
                id: 'npc_meeting',
                name: '🤝 Netzwerker',
                description: 'Treffe alle 15 verschiedenen NPC-Typen',
                icon: '🤝',
                unlocked: false,
                progress: 0,
                maxProgress: 15,
                category: 'social'
            }
        ];
        
        this.statistics = {
            questionsAnswered: 0,
            questionsCorrect: 0,
            questionsPerfect: 0,
            poniesFound: new Set(),
            fusionsCompleted: 0,
            itemsBought: 0,
            itemsPlaced: 0,
            totalPoints: 0,
            playTime: 0,
            npcsMet: new Set(),
            ethicsQuestions: 0,
            speedAnswers: 0,
            luckyAnswers: 0,
            currentStreak: 0,
            bestStreak: 0
        };
        
        this.loadProgress();
        this.init();
    }
    
    init() {
        this.createAchievementUI();
        this.setupEventListeners();
        
        // Hook into game events
        this.hookIntoGame();
    }
    
    hookIntoGame() {
        // Wait for game to be available
        const checkGame = () => {
            if (window.game) {
                this.attachGameHooks();
            } else {
                setTimeout(checkGame, 100);
            }
        };
        checkGame();
    }
    
    attachGameHooks() {
        // Hook into question answering
        const originalAnswerQuestion = window.game.answerQuestion;
        if (originalAnswerQuestion) {
            window.game.answerQuestion = (...args) => {
                const result = originalAnswerQuestion.apply(window.game, args);
                this.onQuestionAnswered(args[0], result);
                return result;
            };
        }
        
        // Hook into shop purchases
        if (window.ShopSystem) {
            const originalBuyItem = window.ShopSystem.buyItem;
            if (originalBuyItem) {
                window.ShopSystem.buyItem = (...args) => {
                    const result = originalBuyItem.apply(window.ShopSystem, args);
                    if (result) this.onItemBought();
                    return result;
                };
            }
        }
        
        // Hook into fusion system
        if (window.FusionSystem) {
            const originalPerformFusion = window.FusionSystem.performAdvancedFusion;
            if (originalPerformFusion) {
                window.FusionSystem.performAdvancedFusion = (...args) => {
                    const result = originalPerformFusion.apply(window.FusionSystem, args);
                    this.onFusionCompleted();
                    return result;
                };
            }
        }
    }
    
    onQuestionAnswered(selectedAnswers, isCorrect) {
        this.statistics.questionsAnswered++;
        
        if (isCorrect) {
            this.statistics.questionsCorrect++;
            this.statistics.currentStreak++;
            this.statistics.bestStreak = Math.max(this.statistics.bestStreak, this.statistics.currentStreak);
            
            // Check for perfect answer (all correct answers selected)
            if (window.game.currentQuestion && this.isFullyCorrect(selectedAnswers)) {
                this.statistics.questionsPerfect++;
                this.updateAchievementProgress('perfectionist', 1);
            }
            
            // Check if ethics question
            if (this.isEthicsQuestion(window.game.currentQuestion)) {
                this.statistics.ethicsQuestions++;
                this.updateAchievementProgress('ethics_expert', 1);
            }
            
            this.updateAchievementProgress('first_question', 1);
            this.updateAchievementProgress('ki_guru', 1);
        } else {
            this.statistics.currentStreak = 0;
        }
        
        this.updateAchievementProgress('point_collector', window.game.score);
        this.saveProgress();
    }
    
    onItemBought() {
        this.statistics.itemsBought++;
        this.updateAchievementProgress('shopaholic', 1);
        this.saveProgress();
    }
    
    onFusionCompleted() {
        this.statistics.fusionsCompleted++;
        this.updateAchievementProgress('fusion_master', 1);
        this.saveProgress();
    }
    
    onPonyFound(ponyType) {
        this.statistics.poniesFound.add(ponyType);
        this.updateAchievementProgress('pony_whisperer', this.statistics.poniesFound.size);
        this.saveProgress();
    }
    
    onNPCMet(npcType) {
        this.statistics.npcsMet.add(npcType);
        this.updateAchievementProgress('npc_meeting', this.statistics.npcsMet.size);
        this.saveProgress();
    }
    
    onItemPlaced() {
        this.statistics.itemsPlaced++;
        this.updateAchievementProgress('office_decorator', 1);
        this.saveProgress();
    }
    
    isFullyCorrect(selectedAnswers) {
        if (!window.game.currentQuestion) return false;
        const question = window.game.currentQuestion;
        
        if (question.type === 'multiple') {
            const correctAnswers = question.antworten.filter(a => a.korrekt).length;
            return selectedAnswers.size === correctAnswers;
        }
        return true;
    }
    
    isEthicsQuestion(question) {
        if (!question) return false;
        const ethicsKeywords = ['ethik', 'moral', 'bias', 'fairness', 'verantwortung', 'transparenz'];
        const text = (question.frage + ' ' + JSON.stringify(question.antworten)).toLowerCase();
        return ethicsKeywords.some(keyword => text.includes(keyword));
    }
    
    updateAchievementProgress(achievementId, increment = 1) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement || achievement.unlocked) return;
        
        if (achievementId === 'point_collector') {
            achievement.progress = increment; // Direct value for points
        } else if (achievementId === 'pony_whisperer' || achievementId === 'npc_meeting') {
            achievement.progress = increment; // Direct value for sets
        } else {
            achievement.progress += increment;
        }
        
        if (achievement.progress >= achievement.maxProgress) {
            this.unlockAchievement(achievement);
        }
        
        this.updateAchievementDisplay();
    }
    
    unlockAchievement(achievement) {
        if (achievement.unlocked) return;
        
        achievement.unlocked = true;
        achievement.progress = achievement.maxProgress;
        
        this.showAchievementNotification(achievement);
        this.saveProgress();
        
        console.log(`🏆 Achievement unlocked: ${achievement.name}`);
    }
    
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(145deg, #F39C12, #E67E22);
            color: white;
            padding: 20px 25px;
            border-radius: 15px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            z-index: 2000;
            border: 3px solid #D35400;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            transform: translateX(400px);
            transition: all 0.5s ease;
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 18px; margin-bottom: 8px;">
                🏆 Achievement Unlocked!
            </div>
            <div style="font-size: 24px; margin-bottom: 5px;">
                ${achievement.icon} ${achievement.name}
            </div>
            <div style="font-size: 14px; opacity: 0.9;">
                ${achievement.description}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }
    
    createAchievementUI() {
        // Achievement button in top bar
        const achievementButton = document.createElement('button');
        achievementButton.id = 'achievementButton';
        achievementButton.innerHTML = '🏆 Erfolge';
        achievementButton.style.cssText = `
            padding: 8px 16px;
            background: #9B59B6;
            border: 3px solid #8E44AD;
            border-style: outset;
            color: #FFFFFF;
            font-weight: bold;
            font-size: 16px;
            font-family: 'Courier New', monospace;
            cursor: pointer;
            transition: all 0.1s ease;
            image-rendering: pixelated;
            text-shadow: 1px 1px 0px #000000;
        `;
        
        achievementButton.addEventListener('click', () => this.toggleAchievementPanel());
        achievementButton.addEventListener('mouseenter', () => {
            achievementButton.style.background = '#8E44AD';
            achievementButton.style.borderStyle = 'inset';
        });
        achievementButton.addEventListener('mouseleave', () => {
            achievementButton.style.background = '#9B59B6';
            achievementButton.style.borderStyle = 'outset';
        });
        
        // Add to top bar
        const topBar = document.getElementById('topBar');
        if (topBar) {
            topBar.appendChild(achievementButton);
        }
        
        // Achievement panel
        this.createAchievementPanel();
    }
    
    createAchievementPanel() {
        const panel = document.createElement('div');
        panel.id = 'achievementPanel';
        panel.className = 'hidden';
        panel.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1500;
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
            border: 4px solid #9B59B6;
            box-shadow: 0 0 40px rgba(155, 89, 182, 0.5);
        `;
        
        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="color: #9B59B6; margin: 0; font-size: 28px;">🏆 Erfolge & Statistiken</h2>
                <button id="closeAchievements" style="background: #E74C3C; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-size: 16px;">✖</button>
            </div>
            <div id="achievementContent"></div>
        `;
        
        panel.appendChild(content);
        document.body.appendChild(panel);
        
        document.getElementById('closeAchievements').addEventListener('click', () => {
            this.toggleAchievementPanel();
        });
        
        this.updateAchievementDisplay();
    }
    
    updateAchievementDisplay() {
        const content = document.getElementById('achievementContent');
        if (!content) return;
        
        const categories = {
            'basics': '🎯 Grundlagen',
            'mastery': '🧠 Meisterschaft', 
            'ponies': '🦄 Pony-Sammlung',
            'crafting': '⚗️ Handwerk',
            'economics': '💰 Wirtschaft',
            'skill': '✨ Fertigkeiten',
            'speed': '⚡ Geschwindigkeit',
            'specialization': '🎓 Spezialisierung',
            'progression': '📈 Fortschritt',
            'decoration': '🏢 Dekoration',
            'luck': '🍀 Glück',
            'social': '🤝 Soziales'
        };
        
        let html = `
            <div style="margin-bottom: 25px; padding: 20px; background: rgba(52, 73, 94, 0.3); border-radius: 10px;">
                <h3 style="color: #3498DB; margin-bottom: 15px;">📊 Deine Statistiken</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 14px;">
                    <div>📝 Fragen beantwortet: <strong>${this.statistics.questionsAnswered}</strong></div>
                    <div>✅ Richtige Antworten: <strong>${this.statistics.questionsCorrect}</strong></div>
                    <div>⭐ Perfekte Antworten: <strong>${this.statistics.questionsPerfect}</strong></div>
                    <div>🦄 Ponies gefunden: <strong>${this.statistics.poniesFound.size}</strong></div>
                    <div>⚗️ Fusionen: <strong>${this.statistics.fusionsCompleted}</strong></div>
                    <div>🛒 Items gekauft: <strong>${this.statistics.itemsBought}</strong></div>
                    <div>🔥 Aktuelle Serie: <strong>${this.statistics.currentStreak}</strong></div>
                    <div>🏆 Beste Serie: <strong>${this.statistics.bestStreak}</strong></div>
                </div>
            </div>
        `;
        
        Object.entries(categories).forEach(([categoryId, categoryName]) => {
            const categoryAchievements = this.achievements.filter(a => a.category === categoryId);
            if (categoryAchievements.length === 0) return;
            
            html += `<div style="margin-bottom: 20px;">
                <h3 style="color: #F39C12; margin-bottom: 15px;">${categoryName}</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">`;
            
            categoryAchievements.forEach(achievement => {
                const progress = Math.min(achievement.progress, achievement.maxProgress);
                const percentage = (progress / achievement.maxProgress) * 100;
                const isUnlocked = achievement.unlocked;
                
                html += `
                    <div style="padding: 15px; background: ${isUnlocked ? 'rgba(46, 204, 113, 0.2)' : 'rgba(52, 73, 94, 0.3)'}; border-radius: 10px; border: 2px solid ${isUnlocked ? '#2ECC71' : '#7F8C8D'};">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 24px; margin-right: 10px;">${achievement.icon}</span>
                            <div>
                                <div style="font-weight: bold; color: ${isUnlocked ? '#2ECC71' : '#ECF0F1'};">${achievement.name}</div>
                                <div style="font-size: 12px; color: #BDC3C7;">${achievement.description}</div>
                            </div>
                        </div>
                        <div style="background: #34495E; border-radius: 10px; overflow: hidden; height: 8px;">
                            <div style="background: ${isUnlocked ? '#2ECC71' : '#3498DB'}; height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                        </div>
                        <div style="font-size: 12px; margin-top: 5px; text-align: right;">
                            ${progress}/${achievement.maxProgress} ${isUnlocked ? '✅' : ''}
                        </div>
                    </div>
                `;
            });
            
            html += '</div></div>';
        });
        
        content.innerHTML = html;
    }
    
    toggleAchievementPanel() {
        const panel = document.getElementById('achievementPanel');
        if (panel) {
            panel.classList.toggle('hidden');
            if (!panel.classList.contains('hidden')) {
                this.updateAchievementDisplay();
            }
        }
    }
    
    setupEventListeners() {
        // Close panel with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const panel = document.getElementById('achievementPanel');
                if (panel && !panel.classList.contains('hidden')) {
                    this.toggleAchievementPanel();
                }
            }
        });
    }
    
    saveProgress() {
        const data = {
            achievements: this.achievements,
            statistics: {
                ...this.statistics,
                poniesFound: Array.from(this.statistics.poniesFound),
                npcsMet: Array.from(this.statistics.npcsMet)
            }
        };
        localStorage.setItem('kimanager_achievements', JSON.stringify(data));
    }
    
    loadProgress() {
        const saved = localStorage.getItem('kimanager_achievements');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                
                // Merge achievements (keep new ones, update existing)
                if (data.achievements) {
                    data.achievements.forEach(savedAch => {
                        const existing = this.achievements.find(a => a.id === savedAch.id);
                        if (existing) {
                            existing.progress = savedAch.progress;
                            existing.unlocked = savedAch.unlocked;
                        }
                    });
                }
                
                // Load statistics
                if (data.statistics) {
                    Object.assign(this.statistics, data.statistics);
                    this.statistics.poniesFound = new Set(data.statistics.poniesFound || []);
                    this.statistics.npcsMet = new Set(data.statistics.npcsMet || []);
                }
            } catch (e) {
                console.warn('Failed to load achievement progress:', e);
            }
        }
    }
    
    // Public methods for game integration
    recordPonyFound(ponyType) {
        this.onPonyFound(ponyType);
    }
    
    recordNPCMet(npcType) {
        this.onNPCMet(npcType);
    }
    
    recordItemPlaced() {
        this.onItemPlaced();
    }
    
    recordSpeedAnswer() {
        this.statistics.speedAnswers++;
        this.updateAchievementProgress('speed_demon', 1);
        this.saveProgress();
    }
    
    recordLuckyAnswer() {
        this.statistics.luckyAnswers++;
        this.updateAchievementProgress('lucky_streak', 1);
        this.saveProgress();
    }
}

// Initialize achievement system
window.addEventListener('load', () => {
    window.AchievementSystem = new AchievementSystem();
});