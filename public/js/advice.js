document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("adviceForm");
  const gradeInput = document.getElementById("gradeInput");
  const box = document.getElementById("adviceResult");
  const gradeCards = document.querySelectorAll(".grade-btn-card");

  // Handle visual grade card clicks
  gradeCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected class from other cards
      gradeCards.forEach(c => c.classList.remove('selected'));
      // Add selected class to this card
      card.classList.add('selected');
      
      const grade = card.dataset.grade;
      if (gradeInput) {
        gradeInput.value = grade;
      }
      
      // Auto-submit form
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    });
  });

  // Handle form submissions
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!gradeInput || !box) return;

    const grade = gradeInput.value.trim().toUpperCase();
    
    // Highlight matching visual card if selected text-wise
    gradeCards.forEach(c => {
      if (c.dataset.grade === grade) {
        c.classList.add('selected');
      } else {
        c.classList.remove('selected');
      }
    });

    box.style.display = "block";
    box.innerHTML = `
      <div style="text-align: center; padding: 20px 0; color: var(--text-muted);">
        <p style="font-weight: 500;">Analyzing your eligibility...</p>
      </div>
    `;

    try {
      const res = await fetch("/api/advise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          box.innerHTML = `
            <div style="padding: 12px; background: #fee2e2; border-left: 4px solid var(--danger); border-radius: var(--radius-sm); color: var(--danger); font-size: 0.92rem; font-weight: 600;">
              Please <a href="/login.html" style="text-decoration: underline; color: var(--danger);">log in</a> first to fetch grade recommendations.
            </div>
          `;
          // Highlight login prompt
          const loginHint = document.getElementById("loginHint");
          if (loginHint) {
            loginHint.style.display = "block";
            loginHint.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          box.innerHTML = `
            <div style="padding: 12px; background: #fee2e2; border-left: 4px solid var(--danger); border-radius: var(--radius-sm); color: var(--danger); font-size: 0.92rem; font-weight: 600;">
              ${data.error || "Something went wrong."}
            </div>
          `;
        }
        return;
      }

      // Render modern layout matching standard
      box.innerHTML = `
        <div class="result-header">
          <div class="result-badge">${data.grade}</div>
          <div class="result-title-desc">
            <h4>${data.title}</h4>
            <p>Recommended Academic Level</p>
          </div>
        </div>
        <div class="result-body">
          <p>${data.message}</p>
          <h5 style="font-family: var(--font-heading); font-size: 0.9rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 12px;">Suggested Career Paths:</h5>
          <div class="result-careers-list">
            ${data.careers.map((c) => `<div class="career-item">${c}</div>`).join("")}
          </div>
        </div>
      `;
      
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (err) {
      box.innerHTML = `
        <div style="padding: 12px; background: #fee2e2; border-left: 4px solid var(--danger); border-radius: var(--radius-sm); color: var(--danger); font-size: 0.92rem; font-weight: 600;">
          Connection failed. Please try again.
        </div>
      `;
    }
  });
});
