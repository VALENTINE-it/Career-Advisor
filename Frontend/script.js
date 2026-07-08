Auth.requireRole("student");
document.getElementById("userName").textContent = Auth.name();
document.getElementById("logoutBtn").addEventListener("click", () => Auth.logout());

const form = document.getElementById("gradeForm");
const submitBtn = document.getElementById("submitBtn");
const formError = document.getElementById("formError");
const resultSection = document.getElementById("result");
const resultCareer = document.getElementById("resultCareer");
const historyWrap = document.getElementById("historyWrap");

function showError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

function readGrade(id) {
  return Number(document.getElementById(id).value);
}

function formatDate(value) {
  return new Date(value).toLocaleString();
}

async function loadHistory() {
  try {
    const res = await fetch(`${API_BASE}/career/history`, {
      headers: Auth.authHeaders(),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Could not load history");

    if (data.history.length === 0) {
      historyWrap.innerHTML = '<p class="empty-state">No submissions yet. Try the form above.</p>';
      return;
    }

    const rows = data.history
      .map(
        (h) => `
        <tr>
          <td>${formatDate(h.created_at)}</td>
          <td>${h.math}</td>
          <td>${h.english}</td>
          <td>${h.science}</td>
          <td>${h.career_suggestion}</td>
        </tr>`
      )
      .join("");

    historyWrap.innerHTML = `
      <table>
        <thead>
          <tr><th>Date</th><th>Math</th><th>English</th><th>Science</th><th>Suggestion</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  } catch (err) {
    historyWrap.innerHTML = `<p class="empty-state">${err.message}</p>`;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.hidden = true;
  resultSection.hidden = true;

  const data = {
    math: readGrade("math"),
    english: readGrade("english"),
    science: readGrade("science"),
  };

  const outOfRange = Object.values(data).some(
    (grade) => Number.isNaN(grade) || grade < 0 || grade > 100
  );

  if (outOfRange) {
    showError("Enter each grade as a number between 0 and 100.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Calculating…";

  try {
    const res = await fetch(`${API_BASE}/career`, {
      method: "POST",
      headers: Auth.authHeaders(),
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || "Could not get a recommendation");

    resultCareer.textContent = result.career;
    resultSection.hidden = false;
    loadHistory();
  } catch (err) {
    showError(err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Get my recommendation";
  }
});

loadHistory();
