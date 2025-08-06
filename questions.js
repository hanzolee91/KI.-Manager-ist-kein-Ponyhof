// Backup-Fragen für das KI-Manager Spiel
// Diese werden verwendet, falls result.json nicht geladen werden kann
window.backupQuestions = [
  {
    "id": 1,
    "type": "multiple_choice",
    "question": "Welche der folgenden Aussagen beschreibt die OECD-Definition von Künstlicher Intelligenz? (1+)",
    "options": [
      "Die Fähigkeit einer Maschine, menschliche Fähigkeiten wie logisches Denken, Lernen, Planen und Kreativität zu imitieren.",
      "Ein System, das autonom arbeitet und keine menschliche Kontrolle benötigt.",
      "Eine Technologie, die Maschinen erlaubt, aus Erfahrungen zu lernen.",
      "KI-Systeme können ihre Umwelt wahrnehmen und mit dieser interagieren, um bestimmte Ziele zu erreichen."
    ],
    "correct_answers": ["A", "D"]
  },
  {
    "id": 2,
    "type": "multiple_choice",
    "question": "Was versteht man unter \"Machine Learning\" (ML)? (1+)",
    "options": [
      "Eine Methode, die es Maschinen erlaubt, ohne menschliche Anleitung zu lernen.",
      "Das Trainieren eines Computers, um große Datenmengen zu analysieren und Muster zu erkennen.",
      "Ein System, das ausschließlich auf vorgegebenen Regeln basiert.",
      "Ein KI-Teilbereich, der es ermöglicht, sich an neue Daten anzupassen und die Leistung zu verbessern."
    ],
    "correct_answers": ["A", "B", "D"]
  },
  {
    "id": 3,
    "type": "single_choice",
    "question": "Was ist ChatGPT? (1+)",
    "options": [
      "Ein KI-Modell, das zur Textgenerierung auf Basis von menschlichen Eingaben verwendet wird.",
      "Eine App zur Textbearbeitung ohne KI-Funktionalität.",
      "Ein rein regelbasiertes System zur Erstellung von Texten.",
      "Eine KI, die ausschließlich für Kundensupport-Chatbots entwickelt wurde."
    ],
    "correct_answers": ["A"]
  },
  {
    "id": 4,
    "type": "single_choice",
    "question": "Was versteht man unter \"Natural Language Processing\" (NLP)? (1+)",
    "options": [
      "Eine Methode, um natürliche Sprache zu verstehen und zu generieren.",
      "Eine Technologie, die verwendet wird, um Bilder zu generieren.",
      "Eine Technik zur Vorhersage von Börsendaten.",
      "Eine Strategie zur Optimierung von neuronalen Netzwerken."
    ],
    "correct_answers": ["A"]
  },
  {
    "id": 5,
    "type": "multiple_choice",
    "question": "Welche Eigenschaften zeichnen eine Künstliche Intelligenz aus? (1+)",
    "options": [
      "Anpassungsfähigkeit",
      "Starrheit und Unveränderlichkeit",
      "Interaktivität",
      "Kontextbewusstsein und Kommunikationsfähigkeit"
    ],
    "correct_answers": ["A", "C", "D"]
  }
];

console.log('✅ Backup-Fragen geladen:', window.backupQuestions.length, 'Fragen verfügbar');