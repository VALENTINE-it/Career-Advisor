(async function () {
  try {
    const res = await fetch("/api/me");
    const { user } = await res.json();
    const userProfile = document.getElementById("userProfile");
    const userAvatar = document.getElementById("userAvatar");
    const userBadge = document.getElementById("userBadge");
    const logoutBtn = document.getElementById("logoutBtn");
    const authLinks = document.getElementById("authLinks");
    const loginHint = document.getElementById("loginHint");

    if (user) {
      if (userProfile) {
        userProfile.hidden = false;
        userProfile.style.display = "flex";
      }
      if (userBadge) {
        userBadge.textContent = user.name;
      }
      if (userAvatar) {
        userAvatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : "S";
      }
      if (logoutBtn) {
        logoutBtn.hidden = false;
        logoutBtn.style.display = "inline-flex";
        logoutBtn.onclick = async () => {
          await fetch("/api/logout", { method: "POST" });
          location.reload();
        };
      }
      if (authLinks) {
        authLinks.style.display = "none";
      }
      if (loginHint) {
        loginHint.style.display = "none";
      }
    } else {
      if (userProfile) {
        userProfile.style.display = "none";
      }
      if (logoutBtn) {
        logoutBtn.style.display = "none";
      }
      if (authLinks) {
        authLinks.style.display = "flex";
      }
      if (loginHint) {
        loginHint.style.display = "block";
      }
    }
  } catch (e) {
    console.error("Auth initialization failed:", e);
  }
})();
