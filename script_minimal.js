// Minimal test version
console.log('Script wird geladen...');

class Game {
    constructor() {
        console.log('Game Constructor aufgerufen');
        this.questions = [];
        this.loadQuestions();
    }
    
    loadQuestions() {
        console.log('loadQuestions aufgerufen');
        
        const rawQuestions = [
            {
                "id": 1,
                "question": "Test Frage?",
                "type": "single_choice",
                "options": {
                    "A": "Antwort A",
                    "B": "Antwort B"
                },
                "correct_answers": ["A"],
                "category": "Test",
                "explanation": "Test"
            }
        ];
        
        console.log('Fragen definiert:', rawQuestions.length);
        this.questions = rawQuestions;
        console.log('Fragen geladen:', this.questions.length);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM geladen, starte Spiel...');
    try {
        const game = new Game();
        console.log('Spiel erstellt');
    } catch (error) {
        console.error('Fehler beim Erstellen des Spiels:', error);
    }
});