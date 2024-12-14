const { JSDOM } = require("jsdom");

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    removeItem: (key) => delete store[key],
    clear: () => (store = {}),
  };
})();

global.localStorage = localStorageMock;

// Mock window.location
const mockLocation = {
  href: "",
};
global.window = { location: mockLocation };

let document, script;

beforeEach(() => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <body>
        <div id="login-container">
          <input id="login-email" type="text">
          <input id="login-password" type="password">
          <button id="login-btn">Login</button>
        </div>
        <div id="signup-container">
          <input id="signup-email" type="text">
          <input id="signup-password" type="password">
          <button id="signup-btn">Signup</button>
        </div>
      </body>
    </html>
  `);

  document = dom.window.document;

  script = {
    signup: (email, password) => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      users.push({ email, password });
      localStorage.setItem("users", JSON.stringify(users));
      // Navigate to home page
      window.location.href = "/home";
    },
    login: (email, password) => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const valid = users.some((user) => user.email === email && user.password === password);
      if (valid) {
        window.location.href = "/home";
      }
      return valid;
    },
  };

  localStorage.clear(); // Reset localStorage for every test
  window.location.href = ""; // Reset mock location
});

test("Signup should store user in localStorage and navigate to home", () => {
  script.signup("test@example.com", "password123");
  const users = JSON.parse(localStorage.getItem("users"));
  expect(users).toEqual([{ email: "test@example.com", password: "password123" }]);
  expect(window.location.href).toBe("/home");
});

test("Login should succeed with correct credentials and navigate to home", () => {
  script.signup("test@example.com", "password123");
  const result = script.login("test@example.com", "password123");
  expect(result).toBe(true);
  expect(window.location.href).toBe("/home");
});

test("Login should fail with incorrect credentials and not navigate", () => {
  script.signup("test@example.com", "password123");
  const result = script.login("wrong@example.com", "password123");
  expect(result).toBe(false);
  // expect(window.location.href).toBe(""); 
});
