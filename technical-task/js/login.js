import { login, isAuthenticated } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  if (isAuthenticated()) {
    window.location.href = "dashboard.html";
    return;
  }

  const form = document.getElementById("login-form");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    emailError.textContent = "";
    passwordError.textContent = "";

    if (!/\S+@\S+\.\S+/.test(email)) {
      emailError.textContent = "Invalid email address.";
      return;
    }

    if (password.length < 6) {
      passwordError.textContent = "Password must be at least 6 characters.";
      return;
    }

    login(email, password);
    window.location.href = "dashboard.html";
  });
});
