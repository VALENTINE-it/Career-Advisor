const chatbot = document.getElementById("chatbot");
const chatToggle = document.getElementById("chatToggle");
const chatClose = document.getElementById("chatClose");
const input = document.getElementById("userInput");
const chatbox = document.getElementById("chatbox");

let hasGreeted = false;

function openChat() {
  chatbot.classList.add("open");
  chatToggle.setAttribute("aria-expanded", "true");
  if (!hasGreeted) {
    addMessage('Ask me about a career — try "engineering" or "medicine".', "bot");
    hasGreeted = true;
  }
  input.focus();
}

function closeChat() {
  chatbot.classList.remove("open");
  chatToggle.setAttribute("aria-expanded", "false");
}

chatToggle.addEventListener("click", openChat);
chatClose.addEventListener("click", closeChat);

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter" && input.value.trim() !== "") {
    const userText = input.value.trim();
    addMessage(userText, "user");

    const reply = getBotReply(userText);
    addMessage(reply, "bot");

    input.value = "";
  }
});

function addMessage(message, sender) {
  const div = document.createElement("div");
  div.className = `chat-msg ${sender}`;
  div.innerText = message;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function getBotReply(text) {
  text = text.toLowerCase();

  if (text.includes("engineering")) {
    return "You need strong Math and Science.";
  } else if (text.includes("medicine")) {
    return "Focus on Biology and Chemistry.";
  } else if (text.includes("Ufala")) {
    return "Emanuel.";
  }
}
