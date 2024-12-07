const texts = {
    easy: [
      "Dies ist ein kurzer Text.",
      "Hallo Welt.",
      "Wie geht es dir?",
      "Abtippen macht Spaß."
    ],
    medium: [
      "Programmieren ist eine großartige Fähigkeit.",
      "Die Sonne scheint heute sehr hell.",
      "Abtippen kann anstrengend sein, oder?",
      "Ich hoffe, dir gefällt dieses Spiel."
    ],
    hard: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Ein langer und schwieriger Text ist immer eine Herausforderung.",
      "Zahlreiche Zeilen und viele Wörter erfordern viel Konzentration.",
      "Das Ziel ist, den Text ohne Fehler und möglichst schnell abzutippen."
    ]
  };
  
  let startTime, selectedText, errorCount = 0, totalErrors = 0;
  
  const startArea = document.getElementById('startArea');
  const difficulty = document.getElementById('difficulty');
  const startButton = document.getElementById('startButton');
  const gameArea = document.getElementById('gameArea');
  const textToType = document.getElementById('textToType');
  const userInput = document.getElementById('userInput');
  const results = document.getElementById('results');
  const errorsSpan = document.getElementById('errors');
  const timeTakenSpan = document.getElementById('timeTaken');
  const resultsChart = document.getElementById('resultsChart').getContext('2d');
  const restartButton = document.getElementById('restartButton');
  
  function startGame() {
    const selectedDifficulty = difficulty.value;
    const availableTexts = texts[selectedDifficulty];
    selectedText = availableTexts[Math.floor(Math.random() * availableTexts.length)];
    textToType.textContent = selectedText;
    userInput.value = "";
    userInput.removeAttribute('readonly');
    userInput.focus();
    startTime = new Date();
    errorCount = 0;
    totalErrors = 0;
  
    startArea.classList.add("hidden");
    gameArea.classList.remove("hidden");
    results.classList.add("hidden");
  }
  
  function handleInput(event) {
    if (event.key.length > 1) return; // Ignoriert Sondertasten wie Shift, Enter, Backspace
    const typed = userInput.value + event.key; // Neue Eingabe hinzufügen
    let displayText = "";
  
    for (let i = 0; i < selectedText.length; i++) {
      if (i < typed.length) {
        if (typed[i] === selectedText[i]) {
          displayText += `<span style="color: green;">${selectedText[i]}</span>`;
        } else {
          displayText += `<span style="color: red;">${selectedText[i]}</span>`;
          if (!textToType.children[i] || textToType.children[i].style.color !== "red") {
            totalErrors++; // Fehler zählen, aber nicht zurücknehmen
          }
        }
      } else {
        displayText += selectedText[i];
      }
    }
    textToType.innerHTML = displayText;
  
    if (typed === selectedText) {
      endGame();
    } else if (typed.length >= selectedText.length) {
      endGame();
    } else {
      userInput.value = typed; // Kein Löschen erlaubt
    }
    event.preventDefault(); // Verhindert Löschen
  }
  
  function endGame() {
    const endTime = new Date();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
    userInput.setAttribute('readonly', true);
    errorsSpan.textContent = totalErrors;
    timeTakenSpan.textContent = timeTaken;
    results.classList.remove("hidden");
  
    new Chart(resultsChart, {
      type: 'bar',
      data: {
        labels: ['Fehler', 'Zeit (Sekunden)'],
        datasets: [{
          label: 'Ergebnisse',
          data: [totalErrors, timeTaken],
          backgroundColor: ['red', 'blue']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  function restartGame() {
    startArea.classList.remove("hidden");
    gameArea.classList.add("hidden");
    results.classList.add("hidden");
  }
  
  startButton.addEventListener("click", startGame);
  userInput.addEventListener("keydown", handleInput);
  restartButton.addEventListener("click", restartGame);
  