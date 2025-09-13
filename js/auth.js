export function login(email, password) {
  localStorage.setItem("authToken", "true");
  return true;
}

export function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "index.html";
}

export function isAuthenticated() {
  return localStorage.getItem("authToken") === "true";
}

if (!isAuthenticated() && !window.location.href.includes("index.html")) {
  window.location.href = "index.html";
}
