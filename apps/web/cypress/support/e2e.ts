import "./commands";

Cypress.on("uncaught:exception", (err, runnable) => {
  console.log("Uncaught exception:", err.message);
  return false;
});
