// Signup Function
function signup(email, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful!");
  }
  
  // Login Function
  function login(email, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((user) => user.email === email && user.password === password);
    if (user) {
      alert("Login successful!");
      // Redirect to home page (if needed)
      window.location.href = "home.html";
    } else {
      alert("Invalid email or password.");
    }
  }
  
  // Attach Event Listeners
  document.getElementById("signup-btn").addEventListener("click", () => {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    signup(email, password);
  });
  
  document.getElementById("login-btn").addEventListener("click", () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    login(email, password);
  });
  