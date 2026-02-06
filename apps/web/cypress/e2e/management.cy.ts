describe("Library Management Flow", () => {
  const mockToken = "fake-admin-token";

  beforeEach(() => {
    cy.intercept("GET", "**/api/penulis", {
      statusCode: 200,
      body: [
        {
          id: 1,
          nama: "Tere Liye",
          bio: "Penulis dengan karya yang laris keras",
          bukuList: [],
        },
      ],
    }).as("getPenulis");

    cy.intercept("GET", "**/api/buku", {
      statusCode: 200,
      body: [
        {
          id: 1,
          judul: "Hujan",
          isbn: "618172010",
          tahunTerbit: 2016,
          penulisId: 1,
          penulis: { nama: "Tere Liye" },
        },
      ],
    }).as("getBuku");
  });

  const visitWithAuth = (url: string) => {
    cy.visit(url, {
      onBeforeLoad: (win) => {
        win.localStorage.setItem("token", mockToken);
      },
    });
  };

  describe("Dashboard", () => {
    it("should display statistics correctly", () => {
      visitWithAuth("/dashboard");
      cy.wait(["@getPenulis", "@getBuku"]);

      cy.contains("Overview");
      cy.get("#penulisCount").should("contain", "1");
      cy.get("#bukuCount").should("contain", "1");
      cy.contains("Tere Liye");
      cy.contains("Hujan");
    });

    it("should handle logout", () => {
      visitWithAuth("/dashboard");
      cy.get("button").contains("Keluar").click({ force: true });
      cy.url().should("eq", Cypress.config().baseUrl + "/");
      cy.window()
        .its("localStorage")
        .invoke("getItem", "token")
        .should("be.null");
    });
  });

  describe("Penulis Management", () => {
    it("should allow adding a new author", () => {
      cy.intercept("POST", "**/api/penulis", {
        statusCode: 201,
        body: { id: 2, nama: "Andrea Hirata", bio: "Penulis Laskar Pelangi" },
      }).as("createPenulis");

      cy.intercept("GET", "**/api/penulis", {
        statusCode: 200,
        body: [
          {
            id: 1,
            nama: "Tere Liye",
            bio: "Penulis dengan karya yang laris keras",
            bukuList: [],
          },
          {
            id: 2,
            nama: "Andrea Hirata",
            bio: "Penulis Laskar Pelangi",
            bukuList: [],
          },
        ],
      }).as("getPenulisUpdated");

      visitWithAuth("/penulis");
      cy.contains("Tambah Penulis").click({ force: true });

      cy.get("#penulisModal").should("be.visible");
      cy.get("#penulisNama").type("Andrea Hirata");
      cy.get("#penulisBio").type("Penulis Laskar Pelangi");
      cy.get('#penulisForm button[type="submit"]').click({ force: true });

      cy.wait("@createPenulis");
      cy.wait("@getPenulisUpdated");
      cy.contains("Andrea Hirata").should("be.visible");
    });
  });

  describe("Buku Management", () => {
    it("should allow adding a new book", () => {
      cy.intercept("POST", "**/api/buku", {
        statusCode: 201,
        body: {
          id: 2,
          judul: "Laskar Pelangi",
          isbn: "987654",
          tahunTerbit: 2005,
          penulisId: 2,
        },
      }).as("createBuku");

      cy.intercept("GET", "**/api/buku", {
        statusCode: 200,
        body: [
          {
            id: 1,
            judul: "Hujan",
            isbn: "618172010",
            tahunTerbit: 2016,
            penulisId: 1,
            penulis: { nama: "Tere Liye" },
          },
          {
            id: 2,
            judul: "Laskar Pelangi",
            isbn: "987654",
            tahunTerbit: 2005,
            penulisId: 2,
            penulis: { nama: "Andrea Hirata" },
          },
        ],
      }).as("getBukuUpdated");

      visitWithAuth("/buku");
      cy.contains("Tambah Buku").click({ force: true });

      cy.wait("@getPenulis");

      cy.get("#bukuModal").should("be.visible");
      cy.get("#bukuJudul").type("Laskar Pelangi");
      cy.get("#bukuIsbn").type("987654");
      cy.get("#bukuTahun").type("2005");

      cy.get("#bukuPenulis option").should("have.length.gt", 1);
      cy.get("#bukuPenulis").select("1");

      cy.get('#bukuForm button[type="submit"]').click({ force: true });

      cy.wait("@createBuku");
      cy.wait("@getBukuUpdated");
      cy.contains("Laskar Pelangi").should("be.visible");
    });
  });
});
