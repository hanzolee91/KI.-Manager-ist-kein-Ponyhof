// Level System für KI-Manager Spiel
class LevelSystem {
    constructor() {
        this.level = 1;
        this.experience = 0;
        this.experienceToNext = 100;
        this.totalExperience = 0;
        
        // Level rewards
        this.levelRewards = {
            2: { type: 'shop_discount', value: 10, description: '10% Shop-Rabatt' },
            3: { type: 'inventory_slot', value: 2, description: '+2 Inventar-Plätze' },
            5: { type: 'success_bonus', value: 5, description: '+5% Erfolgsrate-Bonus' },
            7: { type: 'experience_bonus', value: 10, description: '+10% EP-Bonus' },
            10: { type: 'special_item', value: 'golden_manager', description: 'Goldener Manager' }
        };
        
        this.init();
    }
    
    init() {
        this.updateDisplay();
    }
    
    addExperience(amount) {
        this.experience += amount;
        this.totalExperience += amount;
        
        while (this.experience >= this.experienceToNext) {
            this.levelUp();
        }
        
        this.updateDisplay();
    }
    
    levelUp() {
        this.experience -= this.experienceToNext;
        this.level++;
        
        // Calculate next level requirements
        this.experienceToNext = Math.floor(100 * Math.pow(1.2, this.level - 1));
        
        this.showLevelUpNotification();
        this.checkLevelRewards();
        
        // Play level up sound
        if (window.game && window.game.playSound) {
            window.game.playSound('levelup');
        }
    }
    
    showLevelUpNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #FFD700, #FFA500);
            color: #000;
            padding: 20px 30px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 24px;
            z-index: 2000;
            pointer-events: none;
            font-family: 'Courier New', monospace;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            animation: levelUpPulse 2s ease-in-out;
        `;
        
        notification.innerHTML = `
            🎉 LEVEL UP! 🎉<br>
            <div style="font-size: 18px; margin-top: 5px;">Level ${this.level}</div>
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes levelUpPulse {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 3000);
    }
    
    checkLevelRewards() {
        const reward = this.levelRewards[this.level];
        if (reward) {
            this.grantLevelReward(reward);
        }
    }
    
    grantLevelReward(reward) {
        this.showRewardNotification(reward);
        
        switch (reward.type) {
            case 'shop_discount':
                // Implement shop discount
                if (window.ShopSystem) {
                    window.ShopSystem.addDiscount(reward.value);
                }
                break;
            case 'inventory_slot':
                // Add inventory slots
                if (window.InventorySystem) {
                    window.InventorySystem.addSlots(reward.value);
                }
                break;
            case 'success_bonus':
                // Add success rate bonus
                if (window.game) {
                    window.game.successRateBonus = (window.game.successRateBonus || 0) + reward.value;
                }
                break;
            case 'experience_bonus':
                // Add experience bonus
                this.experienceBonus = (this.experienceBonus || 0) + reward.value;
                break;
            case 'special_item':
                // Grant special item
                if (window.InventorySystem) {
                    const specialItem = this.createSpecialItem(reward.value);
                    window.InventorySystem.addItem(specialItem);
                }
                break;
        }
    }
    
    showRewardNotification(reward) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #27AE60;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 18px;
            z-index: 2000;
            pointer-events: none;
            font-family: 'Courier New', monospace;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0,0,0,0.4);
        `;
        
        notification.innerHTML = `
            🎁 Level-Belohnung erhalten!<br>
            <div style="font-size: 14px; margin-top: 5px;">${reward.description}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 4000);
    }
    
    createSpecialItem(itemType) {
        const specialItems = {
            golden_manager: {
                id: 'golden_manager',
                name: 'Goldener Manager',
                description: 'Ein seltener goldener Manager, der alle Erfolgsraten verdoppelt',
                icon: '👑',
                type: 'special',
                effect: 'double_success',
                value: 100,
                rarity: 'legendary'
            }
        };
        
        return specialItems[itemType] || null;
    }
    
    updateDisplay() {
        // Update level display if element exists
        const levelElement = document.getElementById('playerLevel');
        if (levelElement) {
            levelElement.textContent = this.level;
        }
        
        const expElement = document.getElementById('playerExperience');
        if (expElement) {
            expElement.textContent = `${this.experience}/${this.experienceToNext}`;
        }
        
        const expBarElement = document.getElementById('experienceBar');
        if (expBarElement) {
            const percentage = (this.experience / this.experienceToNext) * 100;
            expBarElement.style.width = `${percentage}%`;
        }
    }
    
    // Get level data for saving
    getData() {
        return {
            level: this.level,
            experience: this.experience,
            experienceToNext: this.experienceToNext,
            totalExperience: this.totalExperience,
            experienceBonus: this.experienceBonus || 0
        };
    }
    
    // Load level data
    loadData(data) {
        if (data) {
            this.level = data.level || 1;
            this.experience = data.experience || 0;
            this.experienceToNext = data.experienceToNext || 100;
            this.totalExperience = data.totalExperience || 0;
            this.experienceBonus = data.experienceBonus || 0;
            this.updateDisplay();
        }
    }
}

// Initialize level system
window.addEventListener('load', () => {
    window.LevelSystem = new LevelSystem();
});