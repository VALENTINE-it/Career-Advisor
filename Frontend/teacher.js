Auth.requireRole("teacher");
document.getElementById("userName").textContent = Auth.name();
document.getElementById("logoutBtn").addEventListener("click", () => Auth.logout());

const studentsWrap = document.getElementById("studentsWrap");

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "—";
}

async function loadStudents() {
  try {
    const res = await fetch(`${API_BASE}/teacher/students`, {
      headers: Auth.authHeaders(),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Could not load students");

    if (data.students.length === 0) {
      studentsWrap.innerHTML = '<p class="empty-state">No students have registered yet.</p>';
      return;
    }

    const rows = data.students
      .map(
        (s) => `
        <tr>
          <td>${s.name}</td>
          <td>${s.email}</td>
          <td>${s.math ?? "—"}</td>
          <td>${s.english ?? "—"}</td>
          <td>${s.science ?? "—"}</td>
          <td>${s.career_suggestion ?? "No submission yet"}</td>
          <td>${formatDate(s.created_at)}</td>
        </tr>`
      )
      .join("");

    studentsWrap.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Math</th><th>English</th>
            <th>Science</th><th>Suggestion</th><th>Last submitted</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  } catch (err) {
    studentsWrap.innerHTML = `<p class="empty-state">${err.message}</p>`;
  }
}

loadStudents();
