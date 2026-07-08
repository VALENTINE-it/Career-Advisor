document.getElementById("adviceForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const grade = document.getElementById("gradeInput").value.trim().toUpperCase();
  const box = document.getElementById("adviceResult");
  box.hidden = false;
  box.innerHTML = "Loading...";

  const res = await fetch("/api/advise", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grade }),
  });
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      box.innerHTML = `<p class="error">Please <a href="/login.html">log in</a> first.</p>`;
    } else {
      box.innerHTML = `<p class="error">${data.error || "Something went wrong."}</p>`;
    }
    return;
  }

  box.innerHTML = `
    <h3>Grade ${data.grade} — ${data.title}</h3>
    <p>${data.message}</p>
    <strong>Suggested careers:</strong>
    <ul>${data.careers.map((c) => `<li>${c}</li>`).join("")}</ul>
  `;
});
