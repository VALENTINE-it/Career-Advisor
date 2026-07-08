(async function () {
  try {
    const res = await fetch("/api/me");
    const { user } = await res.json();
    const badge = document.getElementById("userBadge");
    const logoutBtn = document.getElementById("logoutBtn");
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const loginHint = document.getElementById("loginHint");
    const adviceForm = document.getElementById("adviceForm");

    if (user) {
      if (badge) { badge.hidden = false; badge.textContent = `Hi, ${user.name}`; }
      if (logoutBtn) {
        logoutBtn.hidden = false;
        logoutBtn.onclick = async () => {
          await fetch("/api/logout", { method: "POST" });
          location.reload();
        };
      }
      if (loginLink) loginLink.hidden = true;
      if (registerLink) registerLink.hidden = true;
    } else {
      if (loginHint && adviceForm) {
        loginHint.hidden = false;
      }
    }
  } catch (e) { /* no-op */ }
})();
