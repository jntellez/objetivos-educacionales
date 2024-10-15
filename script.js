const contentSection = document.getElementById("content");

// Función para cargar datos del JSON
async function loadData() {
  const response = await fetch("data.json"); // Ruta correcta a tu archivo JSON
  const data = await response.json();
  return data.objectives;
}

// Función para renderizar contenido basado en la ruta
async function renderContent() {
  const hash = window.location.hash.substring(1); // Eliminar el "#" del hash
  const objectives = await loadData();

  if (!hash) {
    // Si no hay hash, muestra la lista de objetivos
    contentSection.innerHTML = objectives
      .map(
        (obj) => `
            <div class="objective" onclick="toggleSummary(event, ${obj.id})">
                <div class="objective-header">
                    <h2 class="objective-title">${obj.id}. ${obj.title}</h2>
                    <button class="details-button" onclick="redirectToDetails(event, ${obj.id})">➡️</button>
                </div>
                <p class="objective-summary" id="summary-${obj.id}" style="display: none;">${obj.summary}</p>
            </div>
        `
      )
      .join("");
  } else {
    // Si hay un hash, muestra los detalles del objetivo correspondiente
    const objective = objectives.find((obj) => obj.id == hash);
    if (objective) {
      contentSection.innerHTML = `
                <h2>${objective.title}</h2>
                <p>${objective.details}</p>
                <div class="quiz">
                    <h3>${objective.quiz.question}</h3>
                    ${objective.quiz.options
                      .map(
                        (option, index) => `
                        <label>
                            <input type="radio" name="quiz-option" value="${index}"> ${option.text}
                        </label>
                      `
                      )
                      .join("")}
                    <button onclick="validateQuiz(${hash}, ${objective.quiz.options
        .map((opt) => opt.isCorrect)
        .indexOf(true)})">Validar respuesta</button>
                    <p id="quiz-result-${hash}" style="display: none;"></p>
                </div>
                <a href="#" onclick="window.history.back()">Volver a la lista</a>
            `;
    } else {
      contentSection.innerHTML = `<p>Objetivo no encontrado.</p>`;
    }
  }
}

// Función para validar el resultado del quiz
function validateQuiz(objectiveId, correctAnswerIndex) {
  const selectedOption = document.querySelector(
    `input[name="quiz-option"]:checked`
  );
  const resultElement = document.getElementById(`quiz-result-${objectiveId}`);

  if (!selectedOption) {
    resultElement.innerText = "Por favor, selecciona una respuesta.";
    resultElement.style.display = "block";
    return;
  }

  const selectedAnswerIndex = parseInt(selectedOption.value);
  if (selectedAnswerIndex === correctAnswerIndex) {
    resultElement.innerText = "¡Respuesta correcta!";
  } else {
    resultElement.innerText = "Respuesta incorrecta. Inténtalo de nuevo.";
  }
  resultElement.style.display = "block";
}

// Función para redirigir a la página de detalles
function redirectToDetails(event, id) {
  event.stopPropagation(); // Evita que se expanda el resumen
  window.location.hash = id; // Cambia el hash de la URL para mostrar el objetivo
}

// Función para alternar la visibilidad del resumen
function toggleSummary(event, id) {
  const summary = document.getElementById(`summary-${id}`);
  summary.style.display = summary.style.display === "none" ? "block" : "none";
}

// Manejar los cambios de hash en la URL
window.addEventListener("hashchange", renderContent);

// Cargar el contenido inicial
renderContent();
