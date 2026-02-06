describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("should display login page correctly", () => {
    cy.visit("/");
    cy.contains("Welcome Back");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('button[type="submit"]').contains("Masuk");
  });

  it("should navigate to register page", () => {
    cy.visit("/");
    cy.contains("Daftar sekarang").click();
    cy.url().should("include", "/register");
    cy.contains("Create Account");
  });

  it("should handle login error", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 401,
      body: { message: "Invalid credentials" },
    }).as("loginRequest");

    cy.visit("/");
    cy.get('input[name="email"]').type("wrong@example.com");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");
    cy.get("#error-message")
      .should("be.visible")
      .and("contain", "Invalid credentials");
  });

  it("should login successfully and redirect to dashboard", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: { access_token: "fake-jwt-token" },
    }).as("loginRequest");

    cy.intercept("GET", "**/penulis", { body: [] }).as("getPenulis");
    cy.intercept("GET", "**/buku", { body: [] }).as("getBuku");

    cy.visit("/");
    cy.get('input[name="email"]').type("user@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");
    cy.url().should("include", "/dashboard");
    cy.window()
      .its("localStorage")
      .invoke("getItem", "token")
      .should("eq", "fake-jwt-token");
  });
});
