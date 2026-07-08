// Rule-based (non-AI) chatbot. Matches keywords against scripted advisor replies.
const botRules = [
  {
    keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"],
    reply: "Hello! I'm your career advisor. Tell me your grade or what you're curious about — careers, universities, subjects, or study tips.",
  },
  {
    keywords: ["grade a", "grade-a", "got a", "scored a"],
    reply: "Excellent! With a grade A you can pursue competitive courses like Medicine, Engineering, Law, Actuarial Science or Architecture. Consider scholarship options too.",
  },
  {
    keywords: ["grade b"],
    reply: "A grade B is very strong. Look into Computer Science, Nursing, Pharmacy, Economics, or Education. Pick based on the subjects you enjoy most.",
  },
  {
    keywords: ["grade c"],
    reply: "With a grade C, both degree and diploma paths are open: IT, Business Administration, Journalism, Teaching, or Accounting are solid picks.",
  },
  {
    keywords: ["grade d"],
    reply: "Grade D suits diploma & certificate courses — Hospitality, Sales & Marketing, Social Work, or Community Development can lead to great careers.",
  },
  {
    keywords: ["grade e"],
    reply: "Jaribu biashara.",
  },
  {
    keywords: ["career", "what should i do", "which career", "job", "profession"],
    reply: "Tell me your overall grade (A–E) and one subject you love. I'll match you to careers that fit both.",
  },
  {
    keywords: ["university", "college", "campus", "school choice"],
    reply: "When picking a university: check the course accreditation, the campus's strengths in your field, tuition fees, and graduate employment rates.",
  },
  {
    keywords: ["stress", "worried", "anxious", "scared", "depressed", "sad"],
    reply: "It's okay to feel this way — grades don't define your future. Talk to a trusted teacher or counselor, take breaks, and remember there are many pathways to success.",
  },
  {
    keywords: ["interview", "cv", "resume"],
    reply: "For interviews: research the company, practice common questions, dress neatly, arrive early, and prepare 2–3 questions to ask them. Keep your CV to one page.",
  },
  {
    keywords: ["scholarship", "bursary", "funding", "fees"],
    reply: "Look up scholarships from your government (HELB-type loans), universities themselves, and NGOs. Apply early — most deadlines are months before school starts.",
  },
  {
    keywords: ["math", "mathematics"],
    reply: "Strong math opens Engineering, Actuarial Science, Data Science, Finance, and Architecture. Practice past papers consistently.",
  },
  {
    keywords: ["biology", "chemistry", "science"],
    reply: "Sciences lead to Medicine, Nursing, Pharmacy, Biotechnology, Agriculture, and Environmental Science.",
  },
  {
    keywords: ["arts", "history", "literature", "language"],
    reply: "Humanities fit Law, Journalism, Teaching, Public Relations, International Relations, and Content Creation.",
  },
  {
    keywords: ["thank", "thanks", "thx"],
    reply: "You're welcome! Good luck — come back anytime you need advice.",
  },
  {
    keywords: ["bye", "goodbye", "see you"],
    reply: "Goodbye! Wishing you the best on your career journey.",
  },
];

const fallback =
  "I'm not sure I follow. Try asking about a grade (e.g. 'grade B'), a career, university choice, interviews, or stress.";

function botReply(text) {
  const t = text.toLowerCase();
  for (const rule of botRules) {
    if (rule.keywords.some((k) => t.includes(k))) return rule.reply;
  }
  return fallback;
}

const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

function addMsg(who, text) {
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  div.innerHTML = `<div class="bubble"></div>`;
  div.querySelector(".bubble").textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

addMsg("bot", "Hi! I'm your career advisor. Ask me anything about careers, grades, universities, or studying.");

chatForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  addMsg("user", text);
  chatInput.value = "";
  setTimeout(() => addMsg("bot", botReply(text)), 350);
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const msg = chip.dataset.msg;
    addMsg("user", msg);
    setTimeout(() => addMsg("bot", botReply(msg)), 350);
  });
});
