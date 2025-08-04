# 🤖 KI-Manager ist kein Ponyhof

Ein interaktives Browser-Spiel zum Lernen von Künstlicher Intelligenz mit **101 umfassenden Quiz-Fragen**.

## 🎮 Spielbeschreibung

"KI-Manager ist kein Ponyhof" ist ein unterhaltsames Lernspiel, das Sie durch die faszinierende Welt der Künstlichen Intelligenz führt. Als Manager eines KI-Unternehmens müssen Sie Fragen beantworten, NPCs helfen und Ihr Wissen über moderne KI-Technologien unter Beweis stellen.

### ✨ Features

- **101 fachlich geprüfte KI-Fragen** in 6 Themenbereichen
- **Interaktive NPCs** mit thematischen Sprüchen
- **Responsive 16:9-Layout** ohne Scrolling-Probleme
- **Inventar- und Shop-System** für Belohnungen
- **Level- und Achievements-System**
- **Sound-Effekte** für immersive Spielerfahrung

## 📚 Fragenthemen

### 🔹 Grundlagen der Künstlichen Intelligenz (18 Fragen)
- Was ist KI? Definition und Abgrenzung
- Starke vs. schwache KI
- Turing-Test und Intelligenzkonzepte
- Algorithmus-Grundlagen
- Geschichte der KI-Forschung

### 🔹 Machine Learning (20 Fragen)  
- Überwachtes vs. unüberwachtes Lernen
- Trainingsdaten und Overfitting
- Klassifikation und Regression
- Ensemble-Verfahren
- Bewertungsmetriken

### 🔹 Deep Learning und Neuronale Netze (15 Fragen)
- Grundlagen neuronaler Netze
- Convolutional Neural Networks (CNNs)
- Recurrent Neural Networks (RNNs)
- Aktivierungsfunktionen
- Backpropagation und Training

### 🔹 KI-Anwendungen und Praxis (18 Fragen)
- Natural Language Processing
- Computer Vision
- Chatbots und virtuelle Assistenten
- Autonomes Fahren
- KI in Medizin und Finanzwesen

### 🔹 Ethik und Herausforderungen (15 Fragen)
- Bias und Fairness in KI-Systemen
- Explainable AI (XAI)
- Datenschutz und Privatsphäre
- Gesellschaftliche Auswirkungen
- AI Governance

### 🔹 Zukunft und Trends (15 Fragen)
- Generative KI und Large Language Models
- Quantencomputing für KI
- Edge AI und Federated Learning
- Artificial General Intelligence (AGI)
- AI for Good Initiativen

## 🎯 Fragentypen

- **66 Single-Choice Fragen**: Eine korrekte Antwort
- **35 Multiple-Choice Fragen**: Mehrere korrekte Antworten
- Alle Fragen mit **detaillierten Erklärungen**
- **Thematische NPC-Sprüche** für jede Kategorie

## 🚀 Installation & Start

### Voraussetzungen
- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)
- Lokaler Webserver (optional, aber empfohlen)

### Einfacher Start
1. Repository herunterladen/klonen
2. `index.html` in einem Webbrowser öffnen
3. Spiel starten und Spaß haben!

### Mit lokalem Server (empfohlen)
```bash
# Mit Python
python -m http.server 8000

# Mit Node.js
npx serve .

# Mit PHP
php -S localhost:8000
```
Dann `http://localhost:8000` im Browser öffnen.

## 🎮 Spielanleitung

1. **Start**: Klicken Sie auf "Spiel starten" im Titelbildschirm
2. **NPCs**: Klicken Sie auf die Charaktere im Büro, um Fragen zu erhalten
3. **Fragen**: Wählen Sie die richtige(n) Antwort(en) und bestätigen Sie
4. **Belohnungen**: Sammeln Sie Punkte und kaufen Sie Items im Shop
5. **Fortschritt**: Steigen Sie auf und sammeln Sie Achievements

## 🛠️ Technische Details

### Dateistruktur
```
├── index.html          # Haupt-HTML-Datei
├── script.js           # Kernspiel-Logik (1400+ Zeilen)
├── style.css           # Responsive Styling
├── ki_fragen_komplett.json  # 101 KI-Fragen
├── shop.js             # Shop-System
├── inventory.js        # Inventar-Management
├── level.js            # Level- und XP-System
├── achievement.js      # Achievement-System
├── savegame.js         # Speicher-Funktionen
├── settings.js         # Spiel-Einstellungen
├── title.js            # Titelbildschirm
├── room.js             # Raum-Management
├── pony.js             # Spezial-Features
└── fusion.js           # Item-Fusion
```

### Systemanforderungen
- **Browser**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **JavaScript**: ES6+ Unterstützung erforderlich
- **Speicher**: ~5MB für Spieldaten
- **Auflösung**: Optimiert für 16:9 (1920x1080, 1366x768, etc.)

## ⚡ Performance-Optimierungen

- **Lazy Loading** für Fragen und Assets
- **Caching** für wiederverwendbare Komponenten
- **Responsive Design** ohne Scrolling
- **Optimierte Animationen** für flüssiges Gameplay

## 🔄 Spielfortschritt

- **Automatisches Speichern** im localStorage
- **Fortschrittsverfolgung** über alle Kategorien
- **Achievement-System** für Langzeitmotivation
- **Level-System** mit Belohnungen

## 🤝 Mitwirken

Dieses Projekt ist Open Source! Beiträge sind willkommen:

1. Fork des Repositories
2. Feature-Branch erstellen (`git checkout -b feature/new-questions`)
3. Änderungen committen (`git commit -m 'Add new AI questions'`)
4. Branch pushen (`git push origin feature/new-questions`)
5. Pull Request erstellen

### Fragen hinzufügen
Neue Fragen können in `ki_fragen_komplett.json` hinzugefügt werden. Format:
```json
{
  "id": 102,
  "question": "Ihre Frage hier?",
  "type": "single_choice",
  "options": {
    "A": "Option A",
    "B": "Option B", 
    "C": "Option C",
    "D": "Option D"
  },
  "correct_answers": ["A"],
  "category": "Kategorie",
  "explanation": "Erklärung der Antwort"
}
```

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe `LICENSE` Datei für Details.

## 🙏 Danksagungen

- Entwickelt mit Unterstützung von Claude AI
- Quiz-Fragen basieren auf aktueller KI-Forschung
- Community-Feedback für Spielverbesserungen
- Open-Source-Bibliotheken für Web-Technologien

## 📞 Support

Bei Fragen, Problemen oder Verbesserungsvorschlägen:
- GitHub Issues verwenden
- Detaillierte Fehlerbeschreibungen hilfreich
- Screenshots bei visuellen Problemen

---

**Viel Spaß beim Lernen über Künstliche Intelligenz! 🤖📚**

*"KI ist kein Ponyhof - aber Lernen kann Spaß machen!"*