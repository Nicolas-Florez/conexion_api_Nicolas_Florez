const input = document.getElementById("user-input");
const chatText = document.getElementById("text_chat");
const form = document.getElementById("chat-form");

let inactivityAlertTimer;
let inactivityResetTimer;

function resetInactivityTimers() {
  clearTimeout(inactivityAlertTimer);
  clearTimeout(inactivityResetTimer);


  inactivityAlertTimer = setTimeout(() => {
    chatText.innerHTML += `
      <div class="message bot">
        <div class="bubble bot-bubble">
          <span><em>¿Sigues ahí? Han pasado 2 minutos sin actividad.</em></span>
        </div>
      </div>
    `;
    chatText.scrollTop = chatText.scrollHeight;
  }, 2 * 60 * 1000);

 
  inactivityResetTimer = setTimeout(() => {
    chatText.innerHTML += `
      <div class="message bot">
        <div class="bubble bot-bubble">
          <span><em>Sesión finalizada por inactividad. Chat limpiado automáticamente.</em></span>
        </div>
      </div>
    `;
    setTimeout(() => {
      chatText.innerHTML = "";
    }, 3000);
  }, 5 * 60 * 1000);
}

resetInactivityTimers();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  resetInactivityTimers();

  const question = input.value.trim();
  if (!question) return;


  chatText.innerHTML += `
    <div class="message user">
      <div class="bubble user-bubble">
        <span>${question}</span>
      </div>
    </div>
  `;
  input.value = "";
  chatText.scrollTop = chatText.scrollHeight;

  // Escribiendo...
  const typingId = `typing-${Date.now()}`;
  chatText.innerHTML += `
    <div class="message bot" id="${typingId}">
      <div class="bubble bot-bubble typing">
        Escribiendo<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
      </div>
    </div>
  `;
  chatText.scrollTop = chatText.scrollHeight;

  try {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta: question }) 
    });

    const data = await response.json();
    const typingDiv = document.getElementById(typingId);

    typingDiv.innerHTML = `
      <div class="bubble bot-bubble">
        <span>${data.respuesta}</span>
      </div>
    `;
  } catch (error) {
    const typingDiv = document.getElementById(typingId);
    typingDiv.innerHTML = `
      <div class="bubble bot-bubble">
        <span><strong>Error:</strong> No se pudo conectar al servidor.</span>
      </div>
    `;
  }

  chatText.scrollTop = chatText.scrollHeight;
});

input.addEventListener("keydown", resetInactivityTimers);
chatText.addEventListener("scroll", resetInactivityTimers);
