// Shared auth helpers used across pages.
// The token/name/role are kept in localStorage after login or registration.

const API_BASE = "http://localhost:5000/api";

const Auth = {
  save(session) {
    localStorage.setItem("token", session.token);
    localStorage.setItem("name", session.name);
    localStorage.setItem("role", session.role);
  },
  token() {
    return localStorage.getItem("token");
  },
  name() {
    return localStorage.getItem("name");
  },
  role() {
    return localStorage.getItem("role");
  },
  isLoggedIn() {
    return Boolean(this.token());
  },
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    window.location.href = "login.html";
  },
  // Call at the top of a protected page. Redirects to login if there's no
  // session, or to the correct dashboard if the role doesn't match.
  requireRole(role) {
    if (!this.isLoggedIn()) {
      window.location.href = "login.html";
      return;
    }
    if (this.role() !== role) {
      window.location.href = this.role() === "teacher" ? "teacher.html" : "student.html";
    }
  },
  authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token()}`,
    };
  },
};
